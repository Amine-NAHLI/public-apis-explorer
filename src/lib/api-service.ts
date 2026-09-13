import apisData from '../data/apis.json';

export interface ApiEntry {
  name: string;
  link: string;
  description: string;
  detailedDescription?: string;
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
    const matchesQuery = query === '' || 
      api.name.toLowerCase().includes(query.toLowerCase()) || 
      api.description.toLowerCase().includes(query.toLowerCase());

    // Filters
    const matchesCategory = categoryFilter === '' || categoryFilter === 'All' || api.category === categoryFilter;
    const matchesAuth = authFilter === '' || authFilter === 'All' || (authFilter === 'No' ? api.auth.toLowerCase() === 'no' : api.auth.toLowerCase() !== 'no');
    const matchesCors = corsFilter === '' || corsFilter === 'All' || api.cors.toLowerCase() === corsFilter.toLowerCase();
    const matchesHttps = httpsFilter === '' || httpsFilter === 'All' || api.https.toLowerCase() === httpsFilter.toLowerCase();

    return matchesQuery && matchesCategory && matchesAuth && matchesCors && matchesHttps;
  });
}
