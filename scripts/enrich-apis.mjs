import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../src/data/apis.json');

// URL par défaut pour Ollama (http://localhost:11434) ou LM Studio (http://localhost:1234)
const AI_ENDPOINT = process.env.AI_ENDPOINT || 'http://localhost:11434/v1/chat/completions';
const MODEL_NAME = process.env.MODEL_NAME || 'llama3'; // ou 'mistral', 'phi3', etc. selon ce que tu as d'installé

console.log(`🤖 Configuration de l'IA Locale :`);
console.log(`Endpoint: ${AI_ENDPOINT}`);
console.log(`Modèle: ${MODEL_NAME}`);
console.log(`-----------------------------------`);

// Read existing data
let apis = [];
try {
  apis = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
} catch (e) {
  console.error("❌ Erreur : Impossible de lire apis.json");
  process.exit(1);
}

// Function to call OpenAI API
async function generateDetailedDescription(api) {
  const prompt = `You are a technical writer for a developer directory.
Write a detailed 2-3 sentence description for the API named "${api.name}".
Category: ${api.category}
Short description: ${api.description}
Link: ${api.link}

Explain exactly what this API does, what kind of data it returns, and a potential use case. Keep it highly professional and concise.`;

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Pas besoin d'Authorization Bearer pour une IA locale en général
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        // max_tokens: 150 // Optionnel, certaines IA locales gèrent mal ce paramètre
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error for ${api.name}:`, errorText);
      return null;
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error(`Fetch Error for ${api.name}:`, err.message);
    return null;
  }
}

async function run() {
  console.log(`🚀 Démarrage de l'enrichissement pour ${apis.length} APIs...`);
  
  let modifiedCount = 0;
  
  for (let i = 0; i < apis.length; i++) {
    const api = apis[i];
    
    // Skip if already enriched
    if (api.detailedDescription) {
      continue;
    }

    console.log(`⏳ Traitement [${i + 1}/${apis.length}] : ${api.name}...`);
    
    const detailed = await generateDetailedDescription(api);
    if (detailed) {
      apis[i].detailedDescription = detailed;
      modifiedCount++;
    }

    // Save every 10 APIs to avoid losing data in case of crash
    if (modifiedCount > 0 && modifiedCount % 10 === 0) {
      fs.writeFileSync(jsonPath, JSON.stringify(apis, null, 2));
      console.log(`💾 Sauvegarde intermédiaire effectuée (${modifiedCount} ajouts).`);
    }

    // Delay to respect rate limits (1000ms between requests = 1 request per sec)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Final save
  fs.writeFileSync(jsonPath, JSON.stringify(apis, null, 2));
  console.log(`✅ Terminé ! ${modifiedCount} nouvelles descriptions ajoutées.`);
}

run();
