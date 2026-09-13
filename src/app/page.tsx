'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ExternalLink, Shield, Check, Globe, Moon, Sun, Heart, Code2, Copy, X, Sparkles, Tag, Key, Lock, ChevronRight, HelpCircle, Dices, ArrowDownAZ, ArrowUpZA, FileText, Play, TerminalSquare, RefreshCw, Download } from 'lucide-react';
import { getAllApis, getCategories, searchApis, ApiEntry } from '@/lib/api-service';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

function HealthBadge({ apiLink, appLanguage }: { apiLink: string; appLanguage: string }) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const badgeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let controller: AbortController | null = null;
    let observer: IntersectionObserver;

    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && status === 'checking') {
        controller = new AbortController();
        fetch(apiLink, { method: 'GET', signal: controller.signal })
          .then(res => setStatus(res.ok ? 'online' : 'offline'))
          .catch(() => setStatus('offline'));
        
        // Disconnect after first check
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (badgeRef.current) observer.observe(badgeRef.current);
    
    return () => {
      observer.disconnect();
      if (controller) controller.abort();
    };
  }, [apiLink, status]);

  if (status === 'checking') {
    return (
      <span ref={badgeRef} className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-medium rounded flex items-center gap-1.5" title={appLanguage === 'fr' ? 'Vérification du statut...' : 'Checking status...'}>
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse"></span>
        Check
      </span>
    );
  }

  return (
    <span className={`px-2 py-1 text-[10px] font-medium rounded flex items-center gap-1.5 ${status === 'online' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
      {status === 'online' ? 'Online' : 'Offline'}
    </span>
  );
}

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [auth, setAuth] = useState('All');
  const [cors, setCors] = useState('All');
  const [https, setHttps] = useState('All');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [appLanguage, setAppLanguage] = useState<'en' | 'fr'>('en');
  
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [selectedApi, setSelectedApi] = useState<ApiEntry | null>(null);
  const [modalMode, setModalMode] = useState<'details' | 'snippet' | 'test'>('details');
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  const [visibleCount, setVisibleCount] = useState(24);
  const [snippetLanguage, setSnippetLanguage] = useState<'javascript' | 'python' | 'curl' | 'nodejs' | 'go'>('javascript');
  const [testResult, setTestResult] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const t = {
    directory: appLanguage === 'fr' ? 'Annuaire' : 'Directory',
    favorites: appLanguage === 'fr' ? 'Favoris' : 'Favorites',
    indexed: appLanguage === 'fr' ? '1 742 APIs Indexées & Vérifiées' : '1,742 APIs Indexed & Verified',
    titleMain: appLanguage === 'fr' ? "L'annuaire" : 'The definitive',
    titleSub: appLanguage === 'fr' ? "API définitif." : 'API directory.',
    desc: appLanguage === 'fr' ? "Intégrez les meilleures APIs publiques à vos projets. Zéro friction, recherche instantanée et spécifications unifiées." : "Integrate the best public APIs into your next project. Zero friction, instant search, and unified specifications.",
    search: appLanguage === 'fr' ? "Rechercher des intégrations, catégories ou mots-clés..." : "Search integrations, categories, or keywords...",
    random: appLanguage === 'fr' ? "Une API au hasard" : "Surprise me with a random API",
    allCat: appLanguage === 'fr' ? "Toutes les catégories" : "All Categories",
    authAny: appLanguage === 'fr' ? "Auth : Toutes" : "Auth: Any",
    authNo: appLanguage === 'fr' ? "Sans Auth" : "No Auth",
    authYes: appLanguage === 'fr' ? "Auth Requise" : "Auth Required",
    httpsAny: appLanguage === 'fr' ? "HTTPS : Peu importe" : "HTTPS: Any",
    httpsYes: appLanguage === 'fr' ? "HTTPS Uniquement" : "HTTPS Only",
    httpsNo: appLanguage === 'fr' ? "Sans HTTPS" : "No HTTPS",
    corsAny: appLanguage === 'fr' ? "CORS : Peu importe" : "CORS: Any",
    corsYes: appLanguage === 'fr' ? "CORS : Oui" : "CORS Yes",
    corsNo: appLanguage === 'fr' ? "CORS : Non" : "CORS No",
    corsUnknown: appLanguage === 'fr' ? "CORS : Inconnu" : "CORS Unknown",
    results: appLanguage === 'fr' ? "résultats" : "results",
    free: appLanguage === 'fr' ? "Gratuit" : "Free",
    details: appLanguage === 'fr' ? "Détails" : "Details",
    snippet: appLanguage === 'fr' ? "Code" : "Snippet",
    integrate: appLanguage === 'fr' ? "Intégrer" : "Integrate",
    copy: appLanguage === 'fr' ? "Copier" : "Copy to clipboard"
  };

  const itemsPerPage = 24;
  const categories = useMemo(() => ['All', ...getCategories()], []);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('api-bookmarks');
    if (saved) setBookmarks(new Set(JSON.parse(saved)));

    // Deep linking: read from URL on mount
    const params = new URLSearchParams(window.location.search);
    const apiName = params.get('api');
    if (apiName) {
      const all = getAllApis();
      const found = all.find(a => a.name === apiName);
      if (found) setSelectedApi(found);
    }
  }, []);

  // Deep linking: update URL on modal open/close
  useEffect(() => {
    if (mounted) {
      if (selectedApi) {
        window.history.pushState(null, '', `?api=${encodeURIComponent(selectedApi.name)}`);
      } else {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  }, [selectedApi, mounted]);

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
    return filteredApis.slice(0, visibleCount);
  }, [filteredApis, visibleCount]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleCount < filteredApis.length) {
        setVisibleCount(prev => prev + 24);
      }
    }, { threshold: 0.1 });

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredApis.length]);

  const resetFilters = () => {
    setQuery('');
    setCategory('All');
    setAuth('All');
    setCors('All');
    setHttps('All');
    setSortOrder('none');
    setShowBookmarksOnly(false);
    setVisibleCount(24);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => setVisibleCount(24), [query, category, auth, cors, https, sortOrder, showBookmarksOnly]);

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

  const handleTestApi = async () => {
    if (!selectedApi) return;
    setIsTesting(true);
    setTestResult(appLanguage === 'fr' ? 'Envoi de la requête...' : 'Sending request...');
    try {
      const response = await fetch(selectedApi.link);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      setTestResult(typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
    } catch (err: any) {
      setTestResult(`Error: ${err.message}\n\n${appLanguage === 'fr' ? 'Cela peut être dû à une restriction CORS du navigateur ou au fait que l\'API est hors ligne.' : 'This might be due to browser CORS restrictions or the API being offline.'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const exportFavorites = (format: 'json' | 'md') => {
    const favoriteApis = getAllApis().filter(api => bookmarks.has(api.name));
    if (favoriteApis.length === 0) return;

    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'json') {
      content = JSON.stringify(favoriteApis, null, 2);
      filename = 'favorites.json';
      mimeType = 'application/json';
    } else {
      content = `# My Favorite APIs\n\n`;
      favoriteApis.forEach(api => {
        content += `### [${api.name}](${api.link})\n`;
        content += `- **Description**: ${api.description}\n`;
        content += `- **Category**: ${api.category}\n`;
        content += `- **Auth**: ${api.auth}\n\n`;
      });
      filename = 'favorites.md';
      mimeType = 'text/markdown';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-black text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-300">
      
      {/* Submit API Banner */}
      <div className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black text-[13px] font-medium py-2 px-4 flex flex-wrap justify-center items-center gap-2 text-center relative z-50">
        <span>{appLanguage === 'fr' ? 'Vous souhaitez ajouter une API ? Contactez le développeur :' : 'Want to submit an API? Contact the developer:'}</span>
        <a href="https://www.linkedin.com/in/amine-nahli-48b2a734b/" target="_blank" rel="noreferrer" className="underline font-bold hover:text-neutral-300 dark:hover:text-neutral-700 transition-colors">LinkedIn</a>
        <span>•</span>
        <a href="mailto:nahli-ami@upf.ac.ma" className="underline font-bold hover:text-neutral-300 dark:hover:text-neutral-700 transition-colors">Email</a>
      </div>

      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>

      <header className="sticky top-0 z-50 bg-[#FAFAFA]/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetFilters}>
            <div className="w-6 h-6 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-[4px]">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight">Public APIs</span>
            <span className="mx-2 text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-[14px] text-neutral-500 font-medium">Explorer</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6">
            <div className="flex gap-6 items-center">
              <button 
                onClick={() => { setShowBookmarksOnly(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`text-[13px] font-medium transition-colors ${!showBookmarksOnly ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
              >
                {t.directory}
              </button>
              <button 
                onClick={() => { setShowBookmarksOnly(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors ${showBookmarksOnly ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
              >
                <Heart className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-current text-red-500' : ''}`} /> {t.favorites}
              </button>
              
              {/* Export Menu */}
              {bookmarks.size > 0 && (
                <div className="relative">
                  <button 
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                  <AnimatePresence>
                    {showExportMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 py-1 w-32 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl z-50 flex flex-col"
                      >
                        <button onClick={() => exportFavorites('json')} className="px-4 py-2 text-[12px] text-left text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] hover:text-neutral-900 dark:hover:text-white transition-colors">Format JSON</button>
                        <button onClick={() => exportFavorites('md')} className="px-4 py-2 text-[12px] text-left text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] hover:text-neutral-900 dark:hover:text-white transition-colors">Format Markdown</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setAppLanguage(appLanguage === 'en' ? 'fr' : 'en')} className="flex items-center justify-center w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[12px] font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
              {appLanguage.toUpperCase()}
            </button>
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

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-neutral-900 dark:text-white mb-6 leading-tight">
            {t.titleMain} <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500">
              {t.titleSub}
            </span>
          </h1>
          <p className="text-[17px] text-neutral-500 dark:text-neutral-400 max-w-2xl text-balance">
            {t.desc}
          </p>
        </motion.div>

        {/* Search & Random Bar */}
        <div className="max-w-4xl mx-auto mb-12 flex items-center gap-3">
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder={t.search}
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
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRandomApi}
            title={t.random}
            className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors shadow-sm"
          >
            <Dices className="h-6 w-6" />
          </motion.button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 mb-8 border-b border-neutral-200 dark:border-neutral-900">
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
            <select className="appearance-none bg-white dark:bg-[#0a0a0a] text-neutral-700 dark:text-neutral-300 text-[13px] font-medium px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 focus:outline-none hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer min-w-[120px]" value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c === 'All' ? t.allCat : c}</option>)}
            </select>
            
            <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-800 mx-1"></div>

            <select className="appearance-none bg-white dark:bg-[#0a0a0a] text-neutral-700 dark:text-neutral-300 text-[13px] font-medium px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 focus:outline-none hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer" value={auth} onChange={e => setAuth(e.target.value)}>
              <option value="All">{t.authAny}</option>
              <option value="No">{t.authNo}</option>
              <option value="Yes">{t.authYes}</option>
            </select>

            <select className="appearance-none bg-white dark:bg-[#0a0a0a] text-neutral-700 dark:text-neutral-300 text-[13px] font-medium px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 focus:outline-none hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer" value={https} onChange={e => setHttps(e.target.value)}>
              <option value="All">{t.httpsAny}</option>
              <option value="Yes">{t.httpsYes}</option>
              <option value="No">{t.httpsNo}</option>
            </select>

            <select className="appearance-none bg-white dark:bg-[#0a0a0a] text-neutral-700 dark:text-neutral-300 text-[13px] font-medium px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 focus:outline-none hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer" value={cors} onChange={e => setCors(e.target.value)}>
              <option value="All">{t.corsAny}</option>
              <option value="Yes">{t.corsYes}</option>
              <option value="No">{t.corsNo}</option>
              <option value="Unknown">{t.corsUnknown}</option>
            </select>

            <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-800 mx-1"></div>

            <div className="flex items-center gap-1 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-[#0a0a0a] p-0.5">
              <button onClick={() => setSortOrder('none')} className={`px-2 py-1 text-[12px] font-medium rounded-sm transition-colors ${sortOrder === 'none' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'}`}>Default</button>
              <button onClick={() => setSortOrder('asc')} className={`px-2 py-1 text-[12px] font-medium rounded-sm transition-colors flex items-center gap-1 ${sortOrder === 'asc' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'}`}><ArrowDownAZ className="w-3.5 h-3.5"/> A-Z</button>
              <button onClick={() => setSortOrder('desc')} className={`px-2 py-1 text-[12px] font-medium rounded-sm transition-colors flex items-center gap-1 ${sortOrder === 'desc' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'}`}><ArrowUpZA className="w-3.5 h-3.5"/> Z-A</button>
            </div>
          </div>
          
          <div className="flex items-center text-[13px] text-neutral-500 dark:text-neutral-500 font-medium whitespace-nowrap">
            {filteredApis.length} {t.results}
          </div>
        </div>

        {/* API Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <AnimatePresence mode="popLayout">
            {paginatedApis.map((api, idx) => {
              const isBookmarked = bookmarks.has(api.name);
              return (
              <motion.div 
                key={api.name}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4, transition: { duration: 0.2, delay: 0 } }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group flex flex-col bg-white dark:bg-[#0a0a0a] rounded-xl p-5 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors relative"
              >
                
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

                {/* Tags */}
                <div className="flex gap-2 mb-4">
                  {api.auth && api.auth.toLowerCase() === 'no' ? (
                    <span className="px-2 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-medium rounded">Free</span>
                  ) : (
                    <span className="px-2 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-medium rounded flex items-center gap-1"><Key className="w-3 h-3"/> Auth</span>
                  )}
                  <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px] font-medium rounded">
                    {api.https.toLowerCase() === 'yes' ? 'HTTPS' : 'HTTP'}
                  </span>
                  {api.cors.toLowerCase() === 'yes' && <HealthBadge apiLink={api.link} appLanguage={appLanguage} />}
                </div>

                <p className="text-[14px] text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-6 h-[42px] leading-relaxed">
                  {appLanguage === 'fr' && (api as any).description_fr ? (api as any).description_fr : api.description}
                </p>
                
                <div className="flex items-center gap-2 mt-auto">
                  {api.auth.toLowerCase() === 'no' ? (
                    <span className="inline-flex items-center px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-[11px] font-medium border border-neutral-200 dark:border-neutral-800">
                      {t.free}
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
                    onClick={() => { setSelectedApi(api); setModalMode('details'); }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-[12px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    <FileText className="w-3.5 h-3.5" /> {t.details}
                  </button>
                  <button
                    onClick={() => { setSelectedApi(api); setModalMode('snippet'); }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-black text-[12px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Code2 className="w-3.5 h-3.5" /> {t.snippet}
                  </button>
                </div>
              </motion.div>
            )})}
          </AnimatePresence>
        </motion.div>
        
        {/* Infinite Scroll Trigger */}
        {visibleCount < filteredApis.length && (
          <div ref={loadMoreRef} className="flex justify-center items-center h-24 mb-12">
            <div className="flex items-center gap-2 text-neutral-500">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-[14px] font-medium">{appLanguage === 'fr' ? 'Chargement...' : 'Loading more...'}</span>
            </div>
          </div>
        )}
      </main>

      {/* Advanced Snippet Modal */}
      <AnimatePresence>
        {selectedApi && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm" 
            onClick={() => setSelectedApi(null)}
          >
            <motion.div 
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              className="bg-white dark:bg-[#0a0a0a] rounded-xl max-w-2xl w-full shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-[#FAFAFA] dark:bg-[#0a0a0a]">
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                  <h3 className="text-[16px] font-semibold text-neutral-900 dark:text-white flex items-center gap-2 whitespace-nowrap">
                    {selectedApi.name}
                  </h3>
                  <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700 shrink-0"></div>
                  <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-lg shrink-0">
                    <button onClick={() => setModalMode('details')} className={`px-3 py-1 text-[12px] font-medium rounded-md transition-colors ${modalMode === 'details' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}>{t.details}</button>
                    <button onClick={() => setModalMode('snippet')} className={`px-3 py-1 text-[12px] font-medium rounded-md transition-colors ${modalMode === 'snippet' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}>{t.snippet}</button>
                    {selectedApi.cors.toLowerCase() === 'yes' && (
                      <button onClick={() => setModalMode('test')} className={`px-3 py-1 text-[12px] font-medium rounded-md transition-colors ${modalMode === 'test' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'} flex items-center gap-1`}>
                        <Play className="w-3 h-3" /> {appLanguage === 'fr' ? 'Test Live' : 'Live Test'}
                      </button>
                    )}
                  </div>
                </div>
                <button onClick={() => setSelectedApi(null)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0 ml-4"><X className="w-4 h-4"/></button>
              </div>

              {/* Detailed Description */}
              {modalMode === 'details' && (
                <div className="px-6 py-6 bg-white dark:bg-[#0a0a0a] max-h-[70vh] overflow-y-auto">
                  <div className="text-[14px] text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-none mb-8">
                    <ReactMarkdown
                      components={{
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold text-neutral-900 dark:text-neutral-200" {...props} />,
                        a: ({node, ...props}) => <a className="text-blue-500 hover:underline" target="_blank" rel="noreferrer" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />
                      }}
                    >
                      {appLanguage === 'fr' && (selectedApi as any).detailedDescription_fr 
                        ? (selectedApi as any).detailedDescription_fr 
                        : (selectedApi.detailedDescription || selectedApi.description)}
                    </ReactMarkdown>
                  </div>
                  
                  {/* Similar APIs Section */}
                  <div>
                    <h4 className="text-[14px] font-semibold text-neutral-900 dark:text-white mb-3">
                      {appLanguage === 'fr' ? 'APIs similaires' : 'Similar APIs'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {getAllApis()
                        .filter(a => a.category === selectedApi.category && a.name !== selectedApi.name)
                        .slice(0, 3)
                        .map(similarApi => (
                          <div 
                            key={similarApi.name} 
                            onClick={() => setSelectedApi(similarApi)}
                            className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer transition-colors bg-[#FAFAFA] dark:bg-[#111]"
                          >
                            <div className="text-[13px] font-semibold text-neutral-900 dark:text-white mb-1">{similarApi.name}</div>
                            <div className="text-[11px] text-neutral-500 line-clamp-2">
                              {appLanguage === 'fr' && (similarApi as any).description_fr ? (similarApi as any).description_fr : similarApi.description}
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            
              {/* Language Tabs & Snippet */}
              {modalMode === 'snippet' && (
                <div>
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

                  <div className="p-6 bg-white dark:bg-[#050505] max-h-[70vh] overflow-y-auto">
                    <div className="relative group">
                      <pre className="bg-[#111] text-neutral-300 p-5 rounded-lg text-[13px] font-mono overflow-x-auto border border-neutral-800">
                        <code>{generateSnippet(selectedApi, snippetLanguage)}</code>
                      </pre>
                      <button onClick={() => copySnippet(selectedApi)} className="absolute top-3 right-3 p-2 bg-neutral-800 rounded-md text-neutral-400 hover:text-white transition-colors shadow-sm" title={t.copy}>
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Test Playground */}
              {modalMode === 'test' && (
                <div className="p-6 bg-[#FAFAFA] dark:bg-[#050505] max-h-[70vh] overflow-y-auto flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-[13px] text-neutral-500">
                      GET <span className="font-mono text-neutral-900 dark:text-neutral-300 px-2 py-1 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-md select-all">{selectedApi.link}</span>
                    </div>
                    <button 
                      onClick={handleTestApi}
                      disabled={isTesting}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 shrink-0"
                    >
                      {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      {appLanguage === 'fr' ? 'Exécuter' : 'Run Request'}
                    </button>
                  </div>
                  
                  <div className="relative flex-1 min-h-[200px]">
                    <div className="absolute inset-0 bg-[#111] rounded-lg border border-neutral-800 overflow-hidden flex flex-col">
                      <div className="flex items-center px-4 py-2 bg-[#1a1a1a] border-b border-neutral-800 text-[12px] font-medium text-neutral-400 gap-2">
                        <TerminalSquare className="w-4 h-4" /> Response Output
                      </div>
                      <div className="p-4 overflow-auto flex-1">
                        {testResult ? (
                          <pre className="text-[13px] font-mono text-green-400 whitespace-pre-wrap break-all">
                            {testResult}
                          </pre>
                        ) : (
                          <div className="text-[13px] text-neutral-600 font-mono italic">
                            {appLanguage === 'fr' ? '// Cliquez sur "Exécuter" pour voir le résultat...' : '// Click "Run Request" to see the output...'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm" onClick={() => setShowHelpModal(false)}>
          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl max-w-xl w-full p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[16px] font-semibold text-neutral-900 dark:text-white">{appLanguage === 'fr' ? 'Documentation des Filtres' : 'Filter Documentation'}</h3>
              <button onClick={() => setShowHelpModal(false)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="space-y-6 text-[14px] text-neutral-600 dark:text-neutral-400">
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-200 mb-1 flex items-center gap-2"><Search className="w-4 h-4"/> {appLanguage === 'fr' ? 'Barre de Recherche' : 'Search Bar'}</h4>
                <p>{appLanguage === 'fr' ? 'Analyse les noms et descriptions des APIs pour une correspondance précise des mots-clés.' : 'Scans through API names and descriptions for precise keyword matching.'}</p>
              </div>
              <div className="h-px bg-neutral-200 dark:bg-neutral-800"></div>
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-200 mb-1 flex items-center gap-2"><Key className="w-4 h-4"/> {appLanguage === 'fr' ? 'Authentification' : 'Authentication'}</h4>
                <p>{appLanguage === 'fr' ? 'Filtrez par APIs nécessitant une clé d\'API/OAuth par rapport aux APIs entièrement libres.' : 'Filter by APIs that require API keys/OAuth versus fully free and open APIs.'}</p>
              </div>
              <div className="h-px bg-neutral-200 dark:bg-neutral-800"></div>
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-200 mb-1 flex items-center gap-2"><Lock className="w-4 h-4"/> HTTPS</h4>
                <p>{appLanguage === 'fr' ? 'Filtrez les APIs prenant en charge les connexions chiffrées sécurisées (recommandé pour la production).' : 'Filter APIs that support secure encrypted connections (recommended for production).'}</p>
              </div>
              <div className="h-px bg-neutral-200 dark:bg-neutral-800"></div>
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-200 mb-1 flex items-center gap-2"><Globe className="w-4 h-4"/> CORS</h4>
                <p>{appLanguage === 'fr' ? 'Partage des ressources entre origines multiples. Important si vous avez l\'intention d\'appeler l\'API directement depuis un navigateur (frontend).' : 'Cross-Origin Resource Sharing. Important if you intend to fetch the API directly from a browser frontend.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
