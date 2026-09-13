'use client';

import { useState, useMemo } from 'react';
import { Search, ExternalLink, Shield, Check, Globe } from 'lucide-react';
import { getAllApis, getCategories, searchApis, ApiEntry } from '@/lib/api-service';

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [auth, setAuth] = useState('All');
  const [cors, setCors] = useState('All');
  const [https, setHttps] = useState('All');

  const categories = useMemo(() => ['All', ...getCategories()], []);
  
  const filteredApis = useMemo(() => {
    return searchApis(query, category, auth, cors, https);
  }, [query, category, auth, cors, https]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-indigo-600" />
            <h1 className="text-xl font-bold tracking-tight">Public APIs Explorer</h1>
          </div>
          <a href="https://github.com/Amine-NAHLI/public-apis-explorer" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            GitHub
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Discover <span className="text-indigo-600">1700+</span> Free APIs
          </h2>
          <p className="text-lg text-slate-600">
            A collective list of free APIs for use in software and web development. Explore, filter, and build your next great idea.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search APIs by name or description..."
              className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Category</label>
              <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={category} onChange={e => setCategory(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Auth Required</label>
              <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={auth} onChange={e => setAuth(e.target.value)}>
                <option value="All">All</option>
                <option value="No">No Auth</option>
                <option value="Yes">Auth Required</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">HTTPS</label>
              <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={https} onChange={e => setHttps(e.target.value)}>
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">CORS</label>
              <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={cors} onChange={e => setCors(e.target.value)}>
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="text-slate-900 font-bold">{filteredApis.length}</span> APIs
          </p>
        </div>

        {/* API Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredApis.map((api, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col h-full group">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {api.name}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                  {api.category}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-6 flex-grow line-clamp-3">
                {api.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {api.auth.toLowerCase() === 'no' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                    <Check className="w-3 h-3" /> No Auth
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-orange-50 text-orange-700 text-xs font-medium border border-orange-200">
                    <Shield className="w-3 h-3" /> {api.auth}
                  </span>
                )}
                {api.https.toLowerCase() === 'yes' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                    HTTPS
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">
                  CORS: {api.cors}
                </span>
              </div>

              <a 
                href={api.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-indigo-600 transition-colors"
              >
                Visit API <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
          {filteredApis.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              No APIs found matching your criteria.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
