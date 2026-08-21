import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, TriangleAlert, Info, Loader2, X } from 'lucide-react';
import { translations } from '../translations';

export default function AmaSearch({ currentLang = 'fr' }) {
  const t = translations[currentLang];
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const debounceTimeout = useRef(null);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setLoading(true); setHasSearched(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/search/ama?q=${searchQuery}`);
      setResults(res.data);
    } catch (error) {
      console.error("Erreur de recherche", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => { performSearch(query); }, 300);
    return () => { if (debounceTimeout.current) clearTimeout(debounceTimeout.current); };
  }, [query]);

  const handleSearch = (e) => { e.preventDefault(); };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-12 font-sans relative transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t.backToHome}
        </Link>
        
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 mb-10 transition-colors">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">{t.amaHeading}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">{t.amaSubheading}</p>
          
          <form onSubmit={handleSearch} className="relative flex items-center">
            {loading ? (
                <Loader2 className="absolute left-4 text-purple-500 w-6 h-6 animate-spin" />
            ) : (
                <Search className="absolute left-4 text-slate-400 dark:text-slate-500 w-6 h-6" />
            )}
            <input 
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une substance (DCI)..." 
              className="w-full pl-14 pr-4 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-slate-700 dark:text-slate-200 font-medium text-lg transition-colors"
              autoFocus
            />
          </form>
        </div>

        <div className="grid gap-5 animate-fade-in-up">
          {results.map(sub => (
            <div 
              key={sub._id} onClick={() => setSelectedSubstance(sub)}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-purple-100 dark:border-slate-700 border-l-4 border-l-purple-500 dark:border-l-purple-500 shadow-sm hover:shadow-md transition duration-200 cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-2xl text-purple-900 dark:text-purple-300 mb-2">{sub.DCI}</h4>
                  <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="text-slate-700 dark:text-slate-300 text-sm font-medium bg-purple-50 dark:bg-purple-900/30 px-3 py-1.5 rounded-full border border-purple-100 dark:border-purple-800/50">
                        Catégorie : {sub.Categorie}
                      </span>
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/50">
                        Status : {sub.Status}
                      </span>
                  </div>
                </div>
                <TriangleAlert className="text-purple-400 dark:text-purple-500 w-8 h-8 flex-shrink-0 ml-4 mt-1" />
              </div>
              
              {sub.Notes && (
                <div className="mt-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 space-y-1 transition-colors">
                    <div className="flex items-center gap-2 mb-1 text-slate-800 dark:text-slate-200 font-semibold">
                        <Info className="w-4 h-4 text-purple-500" />
                        <span>Notes de l'Agence Mondiale Antidopage</span>
                    </div>
                    <p className="line-clamp-2 text-slate-600 dark:text-slate-400">{sub.Notes}</p>
                </div>
              )}
              <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-4 text-right">Cliquer pour voir les détails &rarr;</p>
            </div>
          ))}
          
          {!loading && hasSearched && query && results.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
              <p className="text-slate-500 dark:text-slate-400 text-lg">Aucune substance trouvée pour <span className="font-bold text-slate-700 dark:text-slate-200">"{query}"</span>.</p>
              <p className="text-slate-400 dark:text-slate-500 mt-2 text-sm">Vérifiez l'orthographe ou essayez un autre terme.</p>
            </div>
          )}
        </div>
      </div>

      {selectedSubstance && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 dark:border-slate-700 relative max-h-[90vh] overflow-y-auto transition-colors">
            <button 
              onClick={() => setSelectedSubstance(null)}
              className="absolute top-6 right-6 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-2 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50">
              {selectedSubstance.Status}
            </span>

            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">{selectedSubstance.DCI}</h3>
            
            <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm mb-6 border-b border-slate-100 dark:border-slate-700 pb-6">
              <p><span className="font-semibold text-slate-800 dark:text-slate-200">Catégorie :</span> {selectedSubstance.Categorie || 'Non renseignée'}</p>
            </div>

            {selectedSubstance.Notes && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm space-y-2">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold mb-1">
                  <Info className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Notes de l'Agence Mondiale Antidopage</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{selectedSubstance.Notes}</p>
              </div>
            )}

            <button 
              onClick={() => setSelectedSubstance(null)}
              className="w-full mt-8 py-3 bg-purple-900 dark:bg-purple-800 text-white font-semibold rounded-2xl hover:bg-purple-800 dark:hover:bg-purple-700 transition shadow-lg shadow-purple-900/10"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}