import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../src/data/apis.json');
// URL pour NVIDIA NIM
const AI_ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL_NAME = process.env.MODEL_NAME || 'meta/llama-3.2-90b-vision-instruct';
const API_KEY = process.env.NVIDIA_API_KEY;

if (!API_KEY) {
  console.error("❌ Erreur : La variable d'environnement NVIDIA_API_KEY est manquante.");
  process.exit(1);
}

const BATCH_SIZE_TOTAL = 20; 
const CONCURRENT_REQUESTS = 4; // L'API NVIDIA est très rapide, on peut lancer 4 requêtes simultanées sans problème

// Read existing data
let apis = [];
try {
  apis = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
} catch (e) {
  console.error("❌ Erreur : Impossible de lire apis.json");
  process.exit(1);
}

// Function to call AI with a SMALL sub-batch
async function generateDescriptionsSubBatch(subBatch) {
  if (subBatch.length === 0) return [];

  const simplifiedBatch = subBatch.map(api => ({
    name: api.name,
    category: api.category,
    description: api.description
  }));

  const prompt = `You are a technical writer for a developer directory.
I will give you a JSON array of ${subBatch.length} APIs. 
For EACH API, write a highly professional, detailed 2-sentence description explaining exactly what it does, what data it returns, and a use case.

Input APIs:
${JSON.stringify(simplifiedBatch, null, 2)}

IMPORTANT INSTRUCTIONS:
1. You MUST return ONLY a valid JSON object with a single key "apis" containing an array of exactly ${subBatch.length} objects.
2. Example output format:
{
  "apis": [
    { "name": "API Name Here", "detailedDescription": "Description here..." }
  ]
}`;

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" } // Force le format JSON strict (Nécessite llama.cpp récent)
      })
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Nettoyage ultra-robuste : on extrait uniquement ce qui ressemble à du JSON
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      content = content.substring(firstBrace, lastBrace + 1);
    }

    const parsedResponse = JSON.parse(content);
    return parsedResponse.apis || [];
  } catch (err) {
    console.error(`\n❌ Erreur de génération/parsing pour un sous-lot:`, err.message);
    return [];
  }
}

async function run() {
  console.log(`\n🤖 IA: ${MODEL_NAME} | Endpoint: ${AI_ENDPOINT}`);
  console.log(`🚀 Démarrage du traitement asynchrone (${CONCURRENT_REQUESTS} slots en parallèle)...`);
  
  const pendingApis = apis.filter(api => !api.detailedDescription);
  console.log(`📊 Il reste ${pendingApis.length} APIs à traiter.\n`);

  if (pendingApis.length === 0) {
    console.log(`✅ Tout est déjà traité !`);
    process.exit(0);
  }

  let sessionProcessedCount = 0;

  for (let i = 0; i < pendingApis.length; i += BATCH_SIZE_TOTAL) {
    // Sauvegarde régulière tous les 100 sans faire de pause
    if (sessionProcessedCount > 0 && sessionProcessedCount % 100 === 0) {
      fs.writeFileSync(jsonPath, JSON.stringify(apis, null, 2));
      console.log(`\n💾 Sauvegarde automatique effectuée ! Progression : ${apis.length - pendingApis.length + sessionProcessedCount} / ${apis.length}`);
    }

    const batch = pendingApis.slice(i, i + BATCH_SIZE_TOTAL);
    console.log(`⏳ Envoi d'un lot de ${batch.length} APIs réparti sur ${CONCURRENT_REQUESTS} threads simultanés...`);
    
    // Diviser le batch (ex: 20) en sous-lots (ex: 4 lots de 5)
    const subBatchSize = Math.ceil(batch.length / CONCURRENT_REQUESTS);
    const promises = [];
    let completedSlots = 0;
    
    for (let j = 0; j < CONCURRENT_REQUESTS; j++) {
      const subBatch = batch.slice(j * subBatchSize, (j + 1) * subBatchSize);
      if (subBatch.length > 0) {
        const promise = generateDescriptionsSubBatch(subBatch)
          .then(res => {
            completedSlots++;
            console.log(`  ➔ [Progression] Thread ${j+1} terminé ! (${completedSlots}/${promises.length} terminés)`);
            return res;
          })
          .catch(err => {
            completedSlots++;
            console.log(`  ➔ [Erreur] Thread ${j+1} a échoué ! (${completedSlots}/${promises.length} terminés)`);
            return [];
          });
        promises.push(promise);
      }
    }

    // Exécuter toutes les requêtes EN MÊME TEMPS
    const subBatchResults = await Promise.all(promises);
    
    // Aplatir les résultats
    const allResults = subBatchResults.flat();

    let successCount = 0;
    if (allResults && allResults.length > 0) {
      for (const res of allResults) {
        const apiIndex = apis.findIndex(a => a.name === res.name && !a.detailedDescription);
        if (apiIndex !== -1 && res.detailedDescription) {
          apis[apiIndex].detailedDescription = res.detailedDescription;
          successCount++;
        }
      }
    }

    sessionProcessedCount += batch.length;
    console.log(`✅ Lot terminé ! (${successCount}/${batch.length} descriptions ajoutées avec succès)`);
  }

  fs.writeFileSync(jsonPath, JSON.stringify(apis, null, 2));
  console.log(`\n✅ Fin de l'exécution. Sauvegarde finale effectuée.`);
  process.exit(0);
}

run();
