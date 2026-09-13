import apisData from '../data/apis.json';

export interface ApiEntry {
  name: string;
  link: string;
  description: string;
  detailedDescription?: string;
  description_fr?: string;
  detailedDescription_fr?: string;
  auth: string;
  https: string;
  cors: string;
  category: string;
};

// Assert type
const allApis: ApiEntry[] = apisData as ApiEntry[];

export function getAllApis(): ApiEntry[] {
  return allApis;
}

export function getCategories(): string[] {
  const categories = new Set(allApis.map(api => api.category));
  return Array.from(categories).sort();
}

export function searchApis(query: string, categoryFilter: string, authFilter: string, corsFilter: string, httpsFilter: string): ApiEntry[] {
  return allApis.filter(api => {
    // Text search
    const q = query.toLowerCase();
    const matchesQuery = query === '' || 
      api.name.toLowerCase().includes(q) || 
      api.description.toLowerCase().includes(q) ||
      (api.category && api.category.toLowerCase().includes(q)) ||
      (api.detailedDescription && api.detailedDescription.toLowerCase().includes(q)) ||
      (api.description_fr && api.description_fr.toLowerCase().includes(q)) ||
      (api.detailedDescription_fr && api.detailedDescription_fr.toLowerCase().includes(q));

    // Filters
    const matchesCategory = categoryFilter === '' || categoryFilter === 'All' || api.category === categoryFilter;
    const matchesAuth = authFilter === '' || authFilter === 'All' || (authFilter === 'No' ? api.auth.toLowerCase() === 'no' : api.auth.toLowerCase() !== 'no');
    const matchesCors = corsFilter === '' || corsFilter === 'All' || api.cors.toLowerCase() === corsFilter.toLowerCase();
    const matchesHttps = httpsFilter === '' || httpsFilter === 'All' || api.https.toLowerCase() === httpsFilter.toLowerCase();

    return matchesQuery && matchesCategory && matchesAuth && matchesCors && matchesHttps;
  });
}
