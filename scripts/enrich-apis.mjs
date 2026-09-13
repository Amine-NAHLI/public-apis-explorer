import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../src/data/apis.json');
const AI_ENDPOINT = process.env.AI_ENDPOINT || 'http://127.0.0.1:8080/v1/chat/completions';
const MODEL_NAME = process.env.MODEL_NAME || 'gemma3';

const BATCH_SIZE_AI = 20; // On envoie 20 par 20 à l'IA pour ne pas faire exploser sa mémoire/casser le JSON
const PAUSE_EVERY = 100;  // On fait une pause tous les 100 pour demander à l'utilisateur

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

// Read existing data
let apis = [];
try {
  apis = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
} catch (e) {
  console.error("❌ Erreur : Impossible de lire apis.json");
  process.exit(1);
}

// Function to call AI with a batch of APIs
async function generateDescriptionsBatch(apiBatch) {
  const simplifiedBatch = apiBatch.map(api => ({
    name: api.name,
    category: api.category,
    description: api.description
  }));

  const prompt = `You are a technical writer for a developer directory.
I will give you a JSON array of ${apiBatch.length} APIs. 
For EACH API, write a highly professional, detailed 2-sentence description explaining exactly what it does, what data it returns, and a use case.

Input APIs:
${JSON.stringify(simplifiedBatch, null, 2)}

IMPORTANT INSTRUCTIONS:
1. You MUST return ONLY a valid JSON array.
2. The JSON array must contain exactly ${apiBatch.length} objects.
3. Each object must have exactly two keys: "name" (exactly as provided) and "detailedDescription".
4. Do NOT include markdown blocks like \`\`\`json. Just output the raw JSON array.`;

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2
      })
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Nettoyage au cas où l'IA ajoute des balises markdown ```json ... ```
    content = content.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();

    const parsedResponse = JSON.parse(content);
    return parsedResponse;
  } catch (err) {
    console.error(`\n❌ Erreur de génération/parsing pour ce lot:`, err.message);
    return null;
  }
}

async function run() {
  console.log(`\n🤖 IA: ${MODEL_NAME} | Endpoint: ${AI_ENDPOINT}`);
  console.log(`🚀 Démarrage du traitement par lot (Batch) pour ${apis.length} APIs...`);
  
  // Filtrer uniquement celles qui n'ont pas encore de description détaillée
  const pendingApis = apis.filter(api => !api.detailedDescription);
  console.log(`📊 Il reste ${pendingApis.length} APIs à traiter.\n`);

  if (pendingApis.length === 0) {
    console.log(`✅ Tout est déjà traité !`);
    process.exit(0);
  }

  let sessionProcessedCount = 0;

  for (let i = 0; i < pendingApis.length; i += BATCH_SIZE_AI) {
    // PAUSE TOUS LES 100
    if (sessionProcessedCount > 0 && sessionProcessedCount % PAUSE_EVERY === 0) {
      fs.writeFileSync(jsonPath, JSON.stringify(apis, null, 2));
      console.log(`\n💾 Sauvegarde effectuée ! Progression : ${apis.length - pendingApis.length + sessionProcessedCount} / ${apis.length}`);
      await askQuestion(`\n🛑 PAUSE (${sessionProcessedCount} APIs traitées durant cette session). Appuie sur ENTRÉE pour continuer les 100 suivantes...`);
    }

    const batch = pendingApis.slice(i, i + BATCH_SIZE_AI);
    console.log(`⏳ Envoi d'un lot de ${batch.length} APIs à l'IA... (${i + 1} à ${Math.min(i + BATCH_SIZE_AI, pendingApis.length)} sur ${pendingApis.length})`);
    
    const results = await generateDescriptionsBatch(batch);
    
    if (results && Array.isArray(results)) {
      // Fusionner les résultats avec la base de données principale
      for (const res of results) {
        const apiIndex = apis.findIndex(a => a.name === res.name && !a.detailedDescription);
        if (apiIndex !== -1) {
          apis[apiIndex].detailedDescription = res.detailedDescription;
        }
      }
      sessionProcessedCount += batch.length;
      console.log(`✅ Lot réussi ! (+${batch.length})`);
    } else {
      console.log(`⚠️ Échec de ce lot, on s'arrête pour éviter de polluer les données.`);
      break; 
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(apis, null, 2));
  console.log(`\n✅ Fin de l'exécution. Sauvegarde finale effectuée.`);
  process.exit(0);
}

run();
