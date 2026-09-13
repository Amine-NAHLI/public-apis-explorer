import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AI_ENDPOINT = process.env.AI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
const MODEL_NAME = process.env.MODEL_NAME || 'gpt-4o-mini';
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  console.error("❌ Erreur : La variable d'environnement OPENAI_API_KEY est manquante.");
  process.exit(1);
}

async function runTest() {
  console.log(`🧪 Lancement du test avec l'IA Locale...`);
  console.log(`Endpoint: ${AI_ENDPOINT}`);
  console.log(`Modèle: ${MODEL_NAME}`);
  console.log(`-----------------------------------\n`);

  // Un exemple d'API pour le test
  const api = {
    name: "Axolotl",
    category: "Animals",
    description: "Collection of axolotl pictures and facts",
    link: "https://theaxolotlapi.netlify.app/"
  };

  const prompt = `You are a technical writer for a developer directory.
Write a detailed 2-3 sentence description for the API named "${api.name}".
Category: ${api.category}
Short description: ${api.description}
Link: ${api.link}

Explain exactly what this API does, what kind of data it returns, and a potential use case. Keep it highly professional and concise.
IMPORTANT: Return ONLY the final description text. Do NOT include any conversational filler (like "Here is the description..."), markdown titles, or API names at the beginning. Just the raw description paragraph.`;

  console.log(`Envoi de la requête à ${MODEL_NAME}... (Patiente quelques secondes)\n`);

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
        temperature: 0.3
      })
    });

    if (!response.ok) {
      console.error(`❌ Erreur de l'API (${response.status}):`, await response.text());
      return;
    }

    const data = await response.json();
    const result = data.choices[0].message.content.trim();
    
    console.log(`✅ Réponse reçue de Gemma 3 :\n`);
    console.log(`===================================`);
    console.log(result);
    console.log(`===================================\n`);
    console.log(`Si cette réponse te convient, tu peux maintenant lancer le script principal !`);

  } catch (err) {
    console.error(`❌ Impossible de contacter l'IA locale:`, err.message);
    console.log(`Vérifie que ton serveur llama.cpp tourne bien et que l'URL est correcte.`);
  }
}

runTest();
