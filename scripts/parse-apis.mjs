import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mdPath = path.resolve(__dirname, '../../apis.md');
const outDir = path.resolve(__dirname, '../src/data');
const outPath = path.resolve(outDir, 'apis.json');

const content = fs.readFileSync(mdPath, 'utf-8');
const lines = content.split('\n');

const apis = [];
let currentCategory = '';

for (const line of lines) {
  // Match category headers like "### Animals"
  const catMatch = line.match(/^###\s+(.*)$/);
  if (catMatch) {
    currentCategory = catMatch[1].trim();
    continue;
  }

  // Match API table rows like "| [Name](Link) | Description | Auth | HTTPS | CORS |"
  const rowMatch = line.match(/^\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|/);
  
  if (rowMatch) {
    const apiColumn = rowMatch[1].trim();
    // Skip header rows
    if (apiColumn === 'API' || apiColumn.includes('---')) {
      continue;
    }

    let name = apiColumn;
    let link = '';

    // Extract name and link from markdown link: [Name](URL)
    const linkMatch = apiColumn.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      name = linkMatch[1];
      link = linkMatch[2];
    } else {
      // In case it's an image link like [<img ...>](url) we'll just extract the URL and set name to something else or keep it.
      // Usually the first column is the API name. Wait, some rows have icons.
      // E.g. `| [IPstack](...) | ... |`
    }

    const description = rowMatch[2].trim();
    let auth = rowMatch[3].replace(/`/g, '').trim();
    const https = rowMatch[4].trim();
    const cors = rowMatch[5].trim();
    
    if (auth === '') auth = 'No';

    apis.push({
      name,
      link,
      description,
      auth,
      https,
      cors,
      category: currentCategory
    });
  }
}

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(outPath, JSON.stringify(apis, null, 2));
console.log(`Successfully parsed ${apis.length} APIs and saved to ${outPath}`);
