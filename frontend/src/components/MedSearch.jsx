import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, AlertCircle, CheckCircle2, Info, Loader2, X } from 'lucide-react';
import { translations } from '../translations';

export default function MedSearch({ currentLang = 'fr' }) {
  const t = translations[currentLang];
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ authorized: [], prohibited: [] });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedMed, setSelectedMed] = useState(null);
  
  const debounceTimeout = useRef(null);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ authorized: [], prohibited: [] });
      setHasSearched(false);
      return;
    }
    setLoading(true); setHasSearched(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/search/medications?q=${searchQuery}`);
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

  const filterList = (list) => {
    if (selectedStatusFilter === 'ALL') return list;
    return list.filter(med => {
      const dbStatus = med.Status?.trim().toUpperCase() || '';
      const filterVal = selectedStatusFilter.toUpperCase();
      if (filterVal === 'AUTORISE_SOUS_CONDITIONS') {
        return dbStatus === 'AUTORISE_SOUS_CONDITIONS' || dbStatus === 'AUTORISE_SOUS_CONDITION';
      }
      return dbStatus === filterVal;
    });
  };

  const filteredAuthorized = filterList(results.authorized);
  const filteredProhibited = filterList(results.prohibited);

  const getStatusStyle = (status) => {
    if (!status) return 'red';
    const clean = status.trim().toUpperCase();
    if (clean === 'AUTORISE' || clean === 'AUTORISÉ') return 'green';
    if (clean === 'AUTORISE_SOUS_CONDITIONS' || clean === 'AUTORISE_SOUS_CONDITION') return 'yellow';
    return 'red';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-12 font-sans relative transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t.backToHome}
        </Link>
        
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 transition-colors">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">{t.medHeading}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{t.medSubheading}</p>
          
          <form onSubmit={handleSearch} className="relative flex items-center mb-6">
            {loading ? (
                <Loader2 className="absolute left-4 text-blue-500 w-6 h-6 animate-spin" />
            ) : (
                <Search className="absolute left-4 text-slate-400 dark:text-slate-500 w-6 h-6" />
            )}
            <input 
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: Paracétamol, Salbutamol..." 
              className="w-full pl-14 pr-4 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-700 dark:text-slate-200 font-medium text-lg transition-colors"
              autoFocus
            />
          </form>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 self-center mr-2">Filtrer par :</span>
            {[
              { label: 'Tous', value: 'ALL' },
              { label: 'Autorisé', value: 'AUTORISE' },
              { label: 'Autorisé sous conditions', value: 'AUTORISE_SOUS_CONDITIONS' },
              { label: 'Interdit permanent', value: 'INTERDIT_PERMANENT' },
              { label: 'Interdit certains sports', value: 'INTERDIT_CERTAINS_SPORTS' },
              { label: 'Interdit compétition', value: 'INTERDIT_COMPETITION' },
              { label: 'Interdit homme seulement', value: 'INTERDIT_HOMME_SEULEMENT' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatusFilter(filter.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                  selectedStatusFilter === filter.value
                    ? 'bg-blue-600 text-white shadow-blue-200 dark:shadow-none'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          {filteredProhibited.length > 0 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">
                <AlertCircle className="text-red-500 w-7 h-7" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Résultats ({filteredProhibited.length})</h3>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {filteredProhibited.map(med => {
                  const statusType = getStatusStyle(med.Status);
                  
                  let borderClass = 'border-red-100 dark:border-slate-700 border-l-4 border-l-red-500 hover:border-red-300 dark:hover:border-red-600';
                  let badgeClass = 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800/50';

                  if (statusType === 'green') {
                    borderClass = 'border-emerald-100 dark:border-slate-700 border-l-4 border-l-emerald-500 hover:border-emerald-300 dark:hover:border-emerald-600';
                    badgeClass = 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50';
                  } else if (statusType === 'yellow') {
                    borderClass = 'border-amber-100 dark:border-slate-700 border-l-4 border-l-amber-500 hover:border-amber-300 dark:hover:border-amber-600';
                    badgeClass = 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800/50';
                  }

                  return (
                    <div 
                      key={med._id} onClick={() => setSelectedMed(med)}
                      className={`bg-white dark:bg-slate-800 p-6 rounded-2xl border shadow-sm hover:shadow-md transition duration-200 flex flex-col cursor-pointer ${borderClass}`}
                    >
                      <div className="flex-grow">
                          <h4 className="font-bold text-xl text-slate-800 dark:text-slate-200 mb-1">{med.Nom}</h4>
                          <div className="text-slate-500 dark:text-slate-400 text-sm mb-4 space-y-1">
                              <p>DCI: <span className="font-medium text-slate-700 dark:text-slate-300">{med.Dci || med.DCI}</span></p>
                              <p>Dose: <span className="font-medium text-slate-700 dark:text-slate-300">{med.Dose}</span></p>
                              <p>Voie: <span className="font-medium text-slate-700 dark:text-slate-300">{med.Voie}</span></p>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${badgeClass}`}>
                              Status: {med.Status}
                          </span>
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-4 text-right">Cliquer pour voir les détails &rarr;</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filteredAuthorized.length > 0 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">
                <CheckCircle2 className="text-emerald-500 w-7 h-7" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Autorisés ({filteredAuthorized.length})</h3>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {filteredAuthorized.map(med => (
                  <div 
                    key={med._id} onClick={() => setSelectedMed(med)}
                    className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-emerald-100 dark:border-slate-700 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition duration-200 flex flex-col cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-600"
                  >
                    <div className="flex-grow">
                        <h4 className="font-bold text-xl text-slate-800 dark:text-slate-200 mb-1">{med.Nom}</h4>
                        <div className="text-slate-500 dark:text-slate-400 text-sm mb-4 space-y-1">
                            <p>DCI: <span className="font-medium text-slate-700 dark:text-slate-300">{med.DCI || med.Dci}</span></p>
                            <p>Dose: <span className="font-medium text-slate-700 dark:text-slate-300">{med.Dose}</span></p>
                            <p>Forme: <span className="font-medium text-slate-700 dark:text-slate-300">{med.Forme}</span></p>
                        </div>
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
                          {med.Status}
                        </span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-4 text-right">Cliquer pour voir les détails &rarr;</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!loading && hasSearched && query && filteredAuthorized.length === 0 && filteredProhibited.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
              <p className="text-slate-500 dark:text-slate-400 text-lg">Aucun résultat ne correspond à ce filtre pour <span className="font-bold text-slate-700 dark:text-slate-200">"{query}"</span>.</p>
            </div>
          )}
        </div>
      </div>

      {selectedMed && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 dark:border-slate-700 relative max-h-[90vh] overflow-y-auto transition-colors">
            <button 
              onClick={() => setSelectedMed(null)}
              className="absolute top-6 right-6 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-2 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {(() => {
              const statusType = getStatusStyle(selectedMed.Status);
              let modalBadgeClass = 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50';
              if (statusType === 'green') modalBadgeClass = 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
              if (statusType === 'yellow') modalBadgeClass = 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';

              return (
                <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold mb-4 border ${modalBadgeClass}`}>
                  {selectedMed.Status}
                </span>
              );
            })()}

            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">{selectedMed.Nom}</h3>
            
            <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm mb-6 border-b border-slate-100 dark:border-slate-700 pb-6">
              <p><span className="font-semibold text-slate-800 dark:text-slate-200">DCI :</span> {selectedMed.Dci || selectedMed.DCI || 'Non renseigné'}</p>
              <p><span className="font-semibold text-slate-800 dark:text-slate-200">Dose :</span> {selectedMed.Dose || 'Non renseigné'}</p>
              <p><span className="font-semibold text-slate-800 dark:text-slate-200">Voie :</span> {selectedMed.Voie || 'Non renseigné'}</p>
              <p><span className="font-semibold text-slate-800 dark:text-slate-200">Forme :</span> {selectedMed.Forme || 'Non renseigné'}</p>
              {selectedMed.Classification && (
                <p><span className="font-semibold text-slate-800 dark:text-slate-200">Classification :</span> {selectedMed.Classification}</p>
              )}
            </div>

            {(selectedMed.Information_complementaire || selectedMed.Notes || selectedMed["specification perticuliere "] || selectedMed["specification perticuliere"]) && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold mb-1">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Détails & Précisions</span>
                </div>
                {selectedMed.Information_complementaire && (
                  <p className="text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">Info :</strong> {selectedMed.Information_complementaire}</p>
                )}
                {selectedMed.Notes && (
                  <p className="text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">Notes :</strong> {selectedMed.Notes}</p>
                )}
                {(selectedMed["specification perticuliere "] || selectedMed["specification perticuliere"]) && (
                  <p className="text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">Spécification particulière :</strong> {selectedMed["specification perticuliere "] || selectedMed["specification perticuliere"]}</p>
                )}
              </div>
            )}

            <button 
              onClick={() => setSelectedMed(null)}
              className="w-full mt-8 py-3 bg-slate-900 dark:bg-slate-700 text-white font-semibold rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-600 transition shadow-lg shadow-slate-900/10"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}