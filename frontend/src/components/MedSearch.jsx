import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';

export default function MedSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ authorized: [], prohibited: [] });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Utilisation d'un ref pour gérer le debounce (le délai)
  const debounceTimeout = useRef(null);

  // Fonction pour lancer la recherche
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ authorized: [], prohibited: [] });
      setHasSearched(false);
      return;
    }
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/search/medications?q=${searchQuery}`);
      setResults(res.data);
    } catch (error) {
      console.error("Erreur de recherche", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect se déclenche à chaque fois que "query" change (à chaque lettre tapée)
  useEffect(() => {
    // On efface le timer précédent s'il y en a un
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // On crée un nouveau timer de 300ms
    debounceTimeout.current = setTimeout(() => {
      performSearch(query);
    }, 300); // Attend 300ms après la dernière frappe avant de chercher

    // Fonction de nettoyage (cleanup)
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]); // Dépendance : on surveille "query"

  // On garde le handleSearch pour la soumission classique du formulaire (touche Entrée)
  const handleSearch = (e) => {
    e.preventDefault();
    // La recherche se fait déjà via le useEffect, on empêche juste le rechargement de la page
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour à l'accueil
        </Link>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-10">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Base de données Médicaments</h2>
          <p className="text-slate-500 mb-8">Recherchez un médicament par son nom commercial ou sa DCI.</p>
          
          <form onSubmit={handleSearch} className="relative flex items-center">
            {loading ? (
                <Loader2 className="absolute left-4 text-blue-500 w-6 h-6 animate-spin" />
            ) : (
                <Search className="absolute left-4 text-slate-400 w-6 h-6" />
            )}
            
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: Paracétamol, Salbutamol..." 
              className="w-full pl-14 pr-4 py-4 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none text-slate-700 font-medium text-lg"
              autoFocus // Met le curseur automatiquement dans le champ
            />
            {/* J'ai supprimé le bouton "Rechercher" car il n'est plus nécessaire */}
          </form>
        </div>

        <div className="space-y-10">
          {/* Section Interdits */}
          {results.prohibited.length > 0 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3">
                <AlertCircle className="text-red-500 w-7 h-7" />
                <h3 className="text-2xl font-bold text-slate-800">Interdits ({results.prohibited.length})</h3>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {results.prohibited.map(med => (
                  <div key={med._id} className="bg-white p-6 rounded-2xl border border-red-100 border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition duration-200 flex flex-col">
                    <div className="flex-grow">
                        <h4 className="font-bold text-xl text-slate-800 mb-1">{med.Nom}</h4>
                        <div className="text-slate-500 text-sm mb-4 space-y-1">
                            <p>DCI: <span className="font-medium text-slate-700">{med.Dci}</span></p>
                            <p>Dose: <span className="font-medium text-slate-700">{med.Dose}</span></p>
                            <p>Voie: <span className="font-medium text-slate-700">{med.Voie}</span></p>
                            <p>Forme: <span className="font-medium text-slate-700">{med.Forme}</span></p>
                        </div>
                        <div className="inline-flex flex-wrap gap-2 items-center mb-4">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                            Status: {med.Status}
                        </span>
                        {med.Classification && (
                            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-100">
                                {med.Classification}
                            </span>
                        )}
                        </div>

                        {/* Affichage conditionnel des informations supplémentaires */}
                        {(med.Information_complementaire || med.Notes || med["specification perticuliere"]) && (
                            <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 space-y-2">
                                <div className="flex items-center gap-2 mb-2 text-slate-800 font-semibold">
                                    <Info className="w-4 h-4 text-blue-500" />
                                    <span>Informations Importantes</span>
                                </div>
                                
                                {med.Information_complementaire && (
                                    <p><span className="font-semibold text-slate-900">Info. complémentaire : </span>{med.Information_complementaire}</p>
                                )}
                                {med.Notes && (
                                    <p><span className="font-semibold text-slate-900">Notes : </span>{med.Notes}</p>
                                )}
                                {med["specification perticuliere"] && (
                                    <p><span className="font-semibold text-slate-900">Spécification particulière : </span>{med["specification perticuliere"]}</p>
                                )}
                            </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section Autorisés */}
          {results.authorized.length > 0 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3">
                <CheckCircle2 className="text-emerald-500 w-7 h-7" />
                <h3 className="text-2xl font-bold text-slate-800">Autorisés ({results.authorized.length})</h3>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {results.authorized.map(med => (
                  <div key={med._id} className="bg-white p-6 rounded-2xl border border-emerald-100 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition duration-200 flex flex-col">
                    <div className="flex-grow">
                        <h4 className="font-bold text-xl text-slate-800 mb-1">{med.Nom}</h4>
                        <div className="text-slate-500 text-sm mb-4 space-y-1">
                            <p>DCI: <span className="font-medium text-slate-700">{med.DCI}</span></p>
                            <p>Dose: <span className="font-medium text-slate-700">{med.Dose}</span></p>
                            <p>Forme: <span className="font-medium text-slate-700">{med.Forme}</span></p>
                        </div>
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {med.Status}
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!loading && hasSearched && query && results.authorized.length === 0 && results.prohibited.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-lg">Aucun résultat trouvé pour <span className="font-bold text-slate-700">"{query}"</span>.</p>
              <p className="text-slate-400 mt-2 text-sm">Vérifiez l'orthographe ou essayez un autre terme.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}