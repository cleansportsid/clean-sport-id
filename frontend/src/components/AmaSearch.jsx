import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, TriangleAlert, Info, Loader2, X } from 'lucide-react';

export default function AmaSearch() {
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
    
    setLoading(true);
    setHasSearched(true);
    
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
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans relative">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-800 transition mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour à l'accueil
        </Link>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-10">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Substances Interdites AMA</h2>
          <p className="text-slate-500 mb-8">Vérifiez si une substance figure sur la liste de l'Agence Mondiale Antidopage.</p>
          
          <form onSubmit={handleSearch} className="relative flex items-center">
            {loading ? (
                <Loader2 className="absolute left-4 text-purple-500 w-6 h-6 animate-spin" />
            ) : (
                <Search className="absolute left-4 text-slate-400 w-6 h-6" />
            )}
            
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une substance (DCI)..." 
              className="w-full pl-14 pr-4 py-4 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition outline-none text-slate-700 font-medium text-lg"
              autoFocus
            />
          </form>
        </div>

        <div className="grid gap-5 animate-fade-in-up">
          {results.map(sub => (
            <div 
              key={sub._id} 
              onClick={() => setSelectedSubstance(sub)}
              className="bg-white p-6 rounded-2xl border border-purple-100 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition duration-200 cursor-pointer hover:border-purple-300 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-2xl text-purple-900 mb-2">{sub.DCI}</h4>
                  
                  <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="text-slate-700 text-sm font-medium bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">
                        Catégorie : {sub.Categorie}
                      </span>
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                        Status : {sub.Status}
                      </span>
                  </div>
                </div>
                <TriangleAlert className="text-purple-400 w-8 h-8 flex-shrink-0 ml-4 mt-1" />
              </div>
              
              {sub.Notes && (
                <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 space-y-1">
                    <div className="flex items-center gap-2 mb-1 text-slate-800 font-semibold">
                        <Info className="w-4 h-4 text-purple-500" />
                        <span>Notes de l'Agence Mondiale Antidopage</span>
                    </div>
                    <p className="line-clamp-2 text-slate-600">{sub.Notes}</p>
                </div>
              )}
              <p className="text-xs text-purple-600 font-semibold mt-4 text-right">Cliquer pour voir les détails &rarr;</p>
            </div>
          ))}
          
          {!loading && hasSearched && query && results.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-lg">Aucune substance trouvée pour <span className="font-bold text-slate-700">"{query}"</span>.</p>
              <p className="text-slate-400 mt-2 text-sm">Vérifiez l'orthographe ou essayez un autre terme.</p>
            </div>
          )}
        </div>
      </div>

      {selectedSubstance && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedSubstance(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-4 bg-red-50 text-red-700 border border-red-200">
              {selectedSubstance.Status}
            </span>

            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{selectedSubstance.DCI}</h3>
            
            <div className="space-y-3 text-slate-600 text-sm mb-6 border-b border-slate-100 pb-6">
              <p><span className="font-semibold text-slate-800">Catégorie :</span> {selectedSubstance.Categorie || 'Non renseignée'}</p>
            </div>

            {selectedSubstance.Notes && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-1">
                  <Info className="w-4 h-4 text-purple-600" />
                  <span>Notes de l'Agence Mondiale Antidopage</span>
                </div>
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{selectedSubstance.Notes}</p>
              </div>
            )}

            <button 
              onClick={() => setSelectedSubstance(null)}
              className="w-full mt-8 py-3 bg-purple-900 text-white font-semibold rounded-2xl hover:bg-purple-800 transition shadow-lg shadow-purple-900/10"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}