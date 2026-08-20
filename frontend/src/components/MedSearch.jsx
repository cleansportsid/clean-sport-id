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
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans relative">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t.backToHome}
        </Link>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-6">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">{t.medHeading}</h2>
          <p className="text-slate-500 mb-6">{t.medSubheading}</p>
          
          <form onSubmit={handleSearch} className="relative flex items-center mb-6">
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
              autoFocus
            />
          </form>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 self-center mr-2">Filtrer par :</span>
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
                    ? 'bg-blue-600 text-white shadow-blue-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3">
                <AlertCircle className="text-red-500 w-7 h-7" />
                <h3 className="text-2xl font-bold text-slate-800">Résultats ({filteredProhibited.length})</h3>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {filteredProhibited.map(med => {
                  const statusType = getStatusStyle(med.Status);
                  
                  let borderClass = 'border-red-100 border-l-4 border-l-red-500 hover:border-red-300';
                  let badgeClass = 'bg-red-50 text-red-700 border-red-100';

                  if (statusType === 'green') {
                    borderClass = 'border-emerald-100 border-l-4 border-l-emerald-500 hover:border-emerald-300';
                    badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                  } else if (statusType === 'yellow') {
                    borderClass = 'border-amber-100 border-l-4 border-l-amber-500 hover:border-amber-300';
                    badgeClass = 'bg-amber-50 text-amber-700 border-amber-100';
                  }

                  return (
                    <div 
                      key={med._id} 
                      onClick={() => setSelectedMed(med)}
                      className={`bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition duration-200 flex flex-col cursor-pointer ${borderClass}`}
                    >
                      <div className="flex-grow">
                          <h4 className="font-bold text-xl text-slate-800 mb-1">{med.Nom}</h4>
                          <div className="text-slate-500 text-sm mb-4 space-y-1">
                              <p>DCI: <span className="font-medium text-slate-700">{med.Dci || med.DCI}</span></p>
                              <p>Dose: <span className="font-medium text-slate-700">{med.Dose}</span></p>
                              <p>Voie: <span className="font-medium text-slate-700">{med.Voie}</span></p>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${badgeClass}`}>
                              Status: {med.Status}
                          </span>
                      </div>
                      <p className="text-xs text-blue-600 font-semibold mt-4 text-right">Cliquer pour voir les détails &rarr;</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filteredAuthorized.length > 0 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3">
                <CheckCircle2 className="text-emerald-500 w-7 h-7" />
                <h3 className="text-2xl font-bold text-slate-800">Autorisés ({filteredAuthorized.length})</h3>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {filteredAuthorized.map(med => (
                  <div 
                    key={med._id} 
                    onClick={() => setSelectedMed(med)}
                    className="bg-white p-6 rounded-2xl border border-emerald-100 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition duration-200 flex flex-col cursor-pointer hover:border-emerald-300"
                  >
                    <div className="flex-grow">
                        <h4 className="font-bold text-xl text-slate-800 mb-1">{med.Nom}</h4>
                        <div className="text-slate-500 text-sm mb-4 space-y-1">
                            <p>DCI: <span className="font-medium text-slate-700">{med.DCI || med.Dci}</span></p>
                            <p>Dose: <span className="font-medium text-slate-700">{med.Dose}</span></p>
                            <p>Forme: <span className="font-medium text-slate-700">{med.Forme}</span></p>
                        </div>
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {med.Status}
                        </span>
                    </div>
                    <p className="text-xs text-blue-600 font-semibold mt-4 text-right">Cliquer pour voir les détails &rarr;</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!loading && hasSearched && query && filteredAuthorized.length === 0 && filteredProhibited.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-lg">Aucun résultat ne correspond à ce filtre pour <span className="font-bold text-slate-700">"{query}"</span>.</p>
            </div>
          )}
        </div>
      </div>

      {selectedMed && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedMed(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {(() => {
              const statusType = getStatusStyle(selectedMed.Status);
              let modalBadgeClass = 'bg-red-50 text-red-700 border-red-200';
              if (statusType === 'green') modalBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              if (statusType === 'yellow') modalBadgeClass = 'bg-amber-50 text-amber-700 border-amber-200';

              return (
                <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold mb-4 border ${modalBadgeClass}`}>
                  {selectedMed.Status}
                </span>
              );
            })()}

            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{selectedMed.Nom}</h3>
            
            <div className="space-y-3 text-slate-600 text-sm mb-6 border-b border-slate-100 pb-6">
              <p><span className="font-semibold text-slate-800">DCI :</span> {selectedMed.Dci || selectedMed.DCI || 'Non renseigné'}</p>
              <p><span className="font-semibold text-slate-800">Dose :</span> {selectedMed.Dose || 'Non renseigné'}</p>
              <p><span className="font-semibold text-slate-800">Voie :</span> {selectedMed.Voie || 'Non renseigné'}</p>
              <p><span className="font-semibold text-slate-800">Forme :</span> {selectedMed.Forme || 'Non renseigné'}</p>
              {selectedMed.Classification && (
                <p><span className="font-semibold text-slate-800">Classification :</span> {selectedMed.Classification}</p>
              )}
            </div>

            {(selectedMed.Information_complementaire || selectedMed.Notes || selectedMed["specification perticuliere "] || selectedMed["specification perticuliere"]) && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-1">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Détails & Précisions</span>
                </div>
                {selectedMed.Information_complementaire && (
                  <p className="text-slate-600"><strong className="text-slate-800">Info :</strong> {selectedMed.Information_complementaire}</p>
                )}
                {selectedMed.Notes && (
                  <p className="text-slate-600"><strong className="text-slate-800">Notes :</strong> {selectedMed.Notes}</p>
                )}
                {(selectedMed["specification perticuliere "] || selectedMed["specification perticuliere"]) && (
                  <p className="text-slate-600"><strong className="text-slate-800">Spécification particulière :</strong> {selectedMed["specification perticuliere "] || selectedMed["specification perticuliere"]}</p>
                )}
              </div>
            )}

            <button 
              onClick={() => setSelectedMed(null)}
              className="w-full mt-8 py-3 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}