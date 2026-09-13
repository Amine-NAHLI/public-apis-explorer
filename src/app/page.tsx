'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, ExternalLink, Shield, Check, Globe, Moon, Sun, Heart, Code2, Copy, X, Sparkles, Tag, Key, Lock, ChevronRight, HelpCircle, Dices, ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import { getAllApis, getCategories, searchApis, ApiEntry } from '@/lib/api-service';
import { useTheme } from 'next-themes';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [auth, setAuth] = useState('All');
  const [cors, setCors] = useState('All');
  const [https, setHttps] = useState('All');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [selectedApi, setSelectedApi] = useState<ApiEntry | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [page, setPage] = useState(1);
  const [snippetLanguage, setSnippetLanguage] = useState<'javascript' | 'python' | 'curl' | 'nodejs' | 'go'>('javascript');
  
  const itemsPerPage = 24;
  const categories = useMemo(() => ['All', ...getCategories()], []);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('api-bookmarks');
    if (saved) setBookmarks(new Set(JSON.parse(saved)));
  }, []);

  const toggleBookmark = (apiName: string) => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(apiName)) newBookmarks.delete(apiName);
    else newBookmarks.add(apiName);
    setBookmarks(newBookmarks);
    localStorage.setItem('api-bookmarks', JSON.stringify(Array.from(newBookmarks)));
  };

  const filteredApis = useMemo(() => {
    let result = searchApis(query, category, auth, cors, https);
    if (showBookmarksOnly) result = result.filter(api => bookmarks.has(api.name));
    
    // Sort logic
    if (sortOrder === 'asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'desc') {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }
    
    return result;
  }, [query, category, auth, cors, https, showBookmarksOnly, bookmarks, sortOrder]);

  const paginatedApis = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredApis.slice(start, start + itemsPerPage);
  }, [filteredApis, page]);

  const totalPages = Math.ceil(filteredApis.length / itemsPerPage);

  useEffect(() => setPage(1), [query, category, auth, cors, https, sortOrder, showBookmarksOnly]);

  const handleRandomApi = () => {
    if (filteredApis.length === 0) return;
    const randomIdx = Math.floor(Math.random() * filteredApis.length);
    setSelectedApi(filteredApis[randomIdx]);
  };

  const generateSnippet = (api: ApiEntry, lang: string) => {
    switch(lang) {
      case 'curl':
        return `curl -X GET "${api.link}" \\\n  -H "Accept: application/json"`;
      case 'python':
        return `import requests\n\nurl = "${api.link}"\nresponse = requests.get(url)\n\nprint(response.json())`;
      case 'nodejs':
        return `const axios = require('axios');\n\naxios.get('${api.link}')\n  .then(response => {\n    console.log(response.data);\n  })\n  .catch(error => {\n    console.error(error);\n  });`;
      case 'go':
        return `package main\n\nimport (\n\t"fmt"\n\t"io/ioutil"\n\t"net/http"\n)\n\nfunc main() {\n\tres, err := http.Get("${api.link}")\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer res.Body.Close()\n\n\tbody, _ := ioutil.ReadAll(res.Body)\n\tfmt.Println(string(body))\n}`;
      case 'javascript':
      default:
        return `// Fetch data from ${api.name}\nfetch('${api.link}')\n  .then(response => response.json())\n  .then(data => console.log(data));`;
    }
  };

  const copySnippet = (api: ApiEntry) => {
    const snippet = generateSnippet(api, snippetLanguage);
    navigator.clipboard.writeText(snippet);
    alert('Snippet copied to clipboard!');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-black text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-300">
      
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>

      <header className="sticky top-0 z-50 bg-[#FAFAFA]/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-6 h-6 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-[4px]">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight">Public APIs</span>
            <span className="mx-2 text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-[14px] text-neutral-500 font-medium">Explorer</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6">
            <a href="#" className="text-[14px] font-medium text-neutral-900 dark:text-neutral-100">Directory</a>
            <button onClick={() => setShowBookmarksOnly(!showBookmarksOnly)} className={`text-[14px] font-medium transition-colors flex items-center gap-1.5 ${showBookmarksOnly ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'}`}>
              <Heart className={`w-4 h-4 ${showBookmarksOnly ? 'fill-current' : ''}`} /> 
              Favorites {bookmarks.size > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[11px] font-mono">{bookmarks.size}</span>}
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setShowHelpModal(true)} className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <HelpCircle className="w-4 h-4" />
            </button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a href="https://github.com/Amine-NAHLI/public-apis-explorer" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 ml-2 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-[13px] font-medium transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path></svg> Star
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>

        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[13px] font-medium text-neutral-600 dark:text-neutral-300">1,742 APIs Indexed & Verified</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-neutral-900 dark:text-white mb-6 leading-tight">
            The definitive <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500">
              API directory.
            </span>
          </h1>
          <p className="text-[17px] text-neutral-500 dark:text-neutral-400 max-w-2xl text-balance">
            Integrate the best public APIs into your next project. Zero friction, instant search, and unified specifications.
          </p>
        </div>

        {/* Search & Random Bar */}
        <div className="max-w-4xl mx-auto mb-12 flex items-center gap-3">
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search integrations, categories, or keywords..."
              className="block w-full pl-12 pr-12 py-4 bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-300 dark:focus:ring-neutral-700 transition-all text-[15px] shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button 
            onClick={handleRandomApi}
            title="Surprise me with a random API"
            className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors shadow-sm"
          >
            <Dices className="h-6 w-6" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 mb-8 border-b border-neutral-200 dark:border-neutral-900">
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
            <select className="appearance-none bg-white dark:bg-[#0a0a0a] text-neutral-700 dark:text-neutral-300 text-[13px] font-medium px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 focus:outline-none hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer min-w-[120px]" value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
            </select>
            
            <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-800 mx-1"></div>

            <select className="appearance-none bg-white dark:bg-[#0a0a0a] text-neutral-700 dark:text-neutral-300 text-[13px] font-medium px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 focus:outline-none hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer" value={auth} onChange={e => setAuth(e.target.value)}>
              <option value="All">Auth: Any</option>
              <option value="No">No Auth</option>
              <option value="Yes">Requires Auth</option>
            </select>

            <select className="appearance-none bg-white dark:bg-[#0a0a0a] text-neutral-700 dark:text-neutral-300 text-[13px] font-medium px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 focus:outline-none hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer" value={https} onChange={e => setHttps(e.target.value)}>
              <option value="All">HTTPS: Any</option>
              <option value="Yes">HTTPS Only</option>
            </select>

            <select className="appearance-none bg-white dark:bg-[#0a0a0a] text-neutral-700 dark:text-neutral-300 text-[13px] font-medium px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 focus:outline-none hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer" value={cors} onChange={e => setCors(e.target.value)}>
              <option value="All">CORS: Any</option>
              <option value="Yes">CORS Enabled</option>
              <option value="No">No CORS</option>
            </select>

            <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-800 mx-1"></div>

            <div className="flex items-center gap-1 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-[#0a0a0a] p-0.5">
              <button onClick={() => setSortOrder('none')} className={`px-2 py-1 text-[12px] font-medium rounded-sm transition-colors ${sortOrder === 'none' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'}`}>Default</button>
              <button onClick={() => setSortOrder('asc')} className={`px-2 py-1 text-[12px] font-medium rounded-sm transition-colors flex items-center gap-1 ${sortOrder === 'asc' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'}`}><ArrowDownAZ className="w-3.5 h-3.5"/> A-Z</button>
              <button onClick={() => setSortOrder('desc')} className={`px-2 py-1 text-[12px] font-medium rounded-sm transition-colors flex items-center gap-1 ${sortOrder === 'desc' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'}`}><ArrowUpZA className="w-3.5 h-3.5"/> Z-A</button>
            </div>
          </div>
          
          <div className="flex items-center text-[13px] text-neutral-500 dark:text-neutral-500 font-medium whitespace-nowrap">
            {filteredApis.length} results
          </div>
        </div>

        {/* API Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {paginatedApis.map((api, idx) => {
            const isBookmarked = bookmarks.has(api.name);
            return (
            <div key={idx} className="group flex flex-col bg-white dark:bg-[#0a0a0a] rounded-xl p-5 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 relative">
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex flex-col">
                  <a href={api.link} target="_blank" rel="noreferrer" className="text-[16px] font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white transition-colors flex items-center gap-1.5">
                    {api.name}
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                  <span className="text-[13px] text-neutral-500 mt-0.5">{api.category}</span>
                </div>
                <button onClick={() => toggleBookmark(api.name)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                  <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current text-neutral-900 dark:text-white' : ''}`} />
                </button>
              </div>

              <p className="text-[14px] text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-6 h-[42px] leading-relaxed">
                {api.description}
              </p>
              
              <div className="flex items-center gap-2 mt-auto">
                {api.auth.toLowerCase() === 'no' ? (
                  <span className="inline-flex items-center px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-[11px] font-medium border border-neutral-200 dark:border-neutral-800">
                    Free
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-[11px] font-medium border border-neutral-200 dark:border-neutral-800">
                    Auth
                  </span>
                )}
                {api.https.toLowerCase() === 'yes' && (
                  <span className="inline-flex items-center px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-[11px] font-medium border border-neutral-200 dark:border-neutral-800">
                    HTTPS
                  </span>
                )}
                <div className="flex-1"></div>
                <button
                  onClick={() => setSelectedApi(api)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-black text-[12px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Code2 className="w-3.5 h-3.5" /> Snippet
                </button>
              </div>
            </div>
          )})}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 transition-colors">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <span className="text-[14px] font-medium text-neutral-500">
              {page} <span className="text-neutral-300 dark:text-neutral-700">/</span> {totalPages}
            </span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>

      {/* Advanced Snippet Modal */}
      {selectedApi && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm" onClick={() => setSelectedApi(null)}>
          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl max-w-2xl w-full shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-[#FAFAFA] dark:bg-[#0a0a0a]">
              <h3 className="text-[16px] font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-neutral-500" /> Integrate {selectedApi.name}
              </h3>
              <button onClick={() => setSelectedApi(null)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"><X className="w-4 h-4"/></button>
            </div>
            
            {/* Language Tabs */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#050505] px-2 pt-2 gap-1 overflow-x-auto">
              {(['javascript', 'python', 'curl', 'nodejs', 'go'] as const).map(lang => (
                <button 
                  key={lang}
                  onClick={() => setSnippetLanguage(lang)}
                  className={`px-4 py-2 text-[13px] font-medium rounded-t-lg transition-colors border-b-2 ${snippetLanguage === lang ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white bg-neutral-50 dark:bg-[#111]' : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#111]'}`}
                >
                  {lang === 'javascript' ? 'JavaScript (Fetch)' : 
                   lang === 'python' ? 'Python (Requests)' : 
                   lang === 'nodejs' ? 'Node.js (Axios)' : 
                   lang === 'go' ? 'Go' : 'cURL'}
                </button>
              ))}
            </div>

            <div className="p-6 bg-white dark:bg-[#050505]">
              <div className="relative group">
                <pre className="bg-[#111] text-neutral-300 p-5 rounded-lg text-[13px] font-mono overflow-x-auto border border-neutral-800">
                  <code>{generateSnippet(selectedApi, snippetLanguage)}</code>
                </pre>
                <button onClick={() => copySnippet(selectedApi)} className="absolute top-3 right-3 p-2 bg-neutral-800 rounded-md text-neutral-400 hover:text-white transition-colors shadow-sm" title="Copy to clipboard">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm" onClick={() => setShowHelpModal(false)}>
          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl max-w-xl w-full p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[16px] font-semibold text-neutral-900 dark:text-white">Filter Documentation</h3>
              <button onClick={() => setShowHelpModal(false)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="space-y-6 text-[14px] text-neutral-600 dark:text-neutral-400">
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-200 mb-1 flex items-center gap-2"><Search className="w-4 h-4"/> Search Bar</h4>
                <p>Scans through API names and descriptions for precise keyword matching.</p>
              </div>
              <div className="h-px bg-neutral-200 dark:bg-neutral-800"></div>
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-200 mb-1 flex items-center gap-2"><Key className="w-4 h-4"/> Authentication</h4>
                <p>Filter by APIs that require API keys/OAuth versus fully free and open APIs.</p>
              </div>
              <div className="h-px bg-neutral-200 dark:bg-neutral-800"></div>
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-200 mb-1 flex items-center gap-2"><Lock className="w-4 h-4"/> HTTPS</h4>
                <p>Filter APIs that support secure encrypted connections (recommended for production).</p>
              </div>
              <div className="h-px bg-neutral-200 dark:bg-neutral-800"></div>
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-200 mb-1 flex items-center gap-2"><Globe className="w-4 h-4"/> CORS</h4>
                <p>Cross-Origin Resource Sharing. Important if you intend to fetch the API directly from a browser frontend.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
