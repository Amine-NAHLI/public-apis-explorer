import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../src/data/apis.json');
// URL pour OpenAI
const AI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const MODEL_NAME = process.env.MODEL_NAME || 'gpt-4o-mini';
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  console.error("❌ Erreur : La variable d'environnement OPENAI_API_KEY est manquante.");
  process.exit(1);
}

const BATCH_SIZE_TOTAL = 20; 
const CONCURRENT_REQUESTS = 4; 

let apis = [];
try {
  const data = fs.readFileSync(jsonPath, 'utf-8');
  apis = JSON.parse(data);
} catch (err) {
  console.error("❌ Impossible de lire apis.json.");
  process.exit(1);
}

const pendingApis = apis.filter(api => !api.description_fr || !api.detailedDescription_fr);

console.log(`🚀 Démarrage de la traduction de ${pendingApis.length} APIs avec ${MODEL_NAME}...`);
console.log(`👉 Traitement par lots de ${BATCH_SIZE_TOTAL} avec ${CONCURRENT_REQUESTS} requêtes simultanées.\n`);

async function generateTranslationsSubBatch(subBatch) {
  if (subBatch.length === 0) return [];

  const simplifiedBatch = subBatch.map(api => ({
    name: api.name,
    description: api.description,
    detailedDescription: api.detailedDescription
  }));

  const prompt = `You are an expert bilingual technical translator (English to French). I will give you a list of APIs. For each API, translate the "description" and "detailedDescription" into French.

IMPORTANT FORMATTING RULE:
- Preserve the exact formatting of the detailedDescription (markdown bullet points, bold text).
- Do not add any conversational text.

Input APIs:
${JSON.stringify(simplifiedBatch, null, 2)}

Return ONLY a JSON object containing an array named "apis". Each object in the array must have "name", "description_fr", and "detailedDescription_fr".
Example format:
{
  "apis": [
    { 
      "name": "API Name", 
      "description_fr": "Courte description en français...", 
      "detailedDescription_fr": "- **But :** ...\n- **Fonctionnalités :** ..." 
    }
  ]
}
Do not add any conversational text or markdown code blocks around the JSON.`;

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
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
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
  if (pendingApis.length === 0) {
    console.log("✅ Toutes les APIs sont déjà traduites !");
    return;
  }

  for (let i = 0; i < pendingApis.length; i += BATCH_SIZE_TOTAL) {
    const batch = pendingApis.slice(i, i + BATCH_SIZE_TOTAL);
    console.log(`⏳ Envoi d'un lot de ${batch.length} APIs réparti sur ${CONCURRENT_REQUESTS} threads simultanés...`);
    
    const subBatchSize = Math.ceil(batch.length / CONCURRENT_REQUESTS);
    const promises = [];
    
    for (let j = 0; j < CONCURRENT_REQUESTS; j++) {
      const subBatch = batch.slice(j * subBatchSize, (j + 1) * subBatchSize);
      if (subBatch.length > 0) {
        promises.push(
          generateTranslationsSubBatch(subBatch).then(res => {
            console.log(`  ➔ [Progression] Thread ${j + 1} terminé !`);
            return res;
          })
        );
      }
    }
    
    const resultsArrays = await Promise.all(promises);
    const newDescriptions = resultsArrays.flat();

    let successCount = 0;
    for (const translated of newDescriptions) {
      const apiIndex = apis.findIndex(a => a.name === translated.name);
      if (apiIndex !== -1 && translated.description_fr && translated.detailedDescription_fr) {
        apis[apiIndex].description_fr = translated.description_fr;
        apis[apiIndex].detailedDescription_fr = translated.detailedDescription_fr;
        successCount++;
      }
    }

    console.log(`✅ Lot terminé ! (${successCount}/${batch.length} traductions ajoutées avec succès)`);
    
    // Save every batch
    fs.writeFileSync(jsonPath, JSON.stringify(apis, null, 2));
    
    if (i + BATCH_SIZE_TOTAL < pendingApis.length) {
      console.log(`\n💾 Sauvegarde automatique effectuée ! Progression : ${i + BATCH_SIZE_TOTAL} / ${pendingApis.length}`);
    }
  }

  console.log(`\n✅ Fin de l'exécution. Traduction terminée et sauvegardée.`);
}

run();
