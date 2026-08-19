import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MedSearch from './components/MedSearch';
import AmaSearch from './components/AmaSearch';
import { AlertTriangle, ShieldCheck, ShieldX, Info } from 'lucide-react';

function Home() {
  const [accepted, setAccepted] = useState(false);
  const [refused, setRefused] = useState(false);

  // Écran "Refusé"
  if (refused) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md text-center border border-red-100 border-t-8 border-t-red-500">
          <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Accès restreint</h2>
          <p className="text-slate-600 mb-8">Vous devez accepter les conditions d'utilisation pour accéder aux bases de données de Clean Sport ID.</p>
          <button onClick={() => setRefused(false)} className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-200 transition font-medium w-full">
            Retourner à l'avertissement
          </button>
        </div>
      </div>
    );
  }

  // Écran "Avertissement Légal"
  if (!accepted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-2xl text-center border border-slate-100">
          {/* Insertion de ton logo */}
          <img src="/favicon.png" alt="Clean Sport ID Logo" className="h-24 mx-auto mb-8 object-contain" />
          
          <div className="bg-amber-50 text-amber-800 p-4 rounded-xl mb-8 flex items-start gap-4 text-left border border-amber-200">
            <AlertTriangle className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-lg mb-1">Avertissement Légal Important</h2>
              <p className="text-sm opacity-90 leading-relaxed">
                Cette application est fournie à titre informatif uniquement. Les informations présentées sont basées sur des sources publiques et peuvent ne pas être exhaustives ou à jour. Elle ne remplace en aucun cas les recommandations officielles des autorités compétentes en matière de lutte contre le dopage.
              </p>
            </div>
          </div>
          
          <p className="text-slate-600 mb-10 text-sm md:text-base leading-relaxed text-justify px-4">
            L'utilisateur est seul responsable de la vérification des informations auprès des organismes officiels avant toute utilisation d'un médicament. Les développeurs de cette application déclinent toute responsabilité en cas d'erreur, d'omission ou d'utilisation inappropriée des informations fournies.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setRefused(true)} className="px-8 py-3.5 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition w-full sm:w-auto">
              Je refuse
            </button>
            <button onClick={() => setAccepted(true)} className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg w-full sm:w-auto">
              J'ai compris et j'accepte
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Écran principal (Menu)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      
      {/* En-tête avec Logo et Message de bienvenue */}
      <div className="text-center mb-12 max-w-2xl">
        <img src="/favicon.png" alt="Clean Sport ID Logo" className="h-28 mx-auto mb-6 object-contain" />
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Bienvenue sur Clean Sport ID</h1>
        <p className="text-lg text-slate-500">
          Votre outil de référence pour vérifier la conformité antidopage. Choisissez la base de données que vous souhaitez consulter ci-dessous.
        </p>
      </div>
      
      {/* Cartes de navigation */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-3xl">
        <Link to="/medications" className="flex-1 bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-200 flex flex-col items-center transition-all duration-300 group no-underline">
          <div className="bg-blue-50 p-5 rounded-2xl mb-6 group-hover:bg-blue-600 transition-colors duration-300">
            <ShieldCheck className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Médicaments</h2>
          <p className="text-slate-500 text-center text-sm">Rechercher parmi les médicaments autorisés et interdits en Algérie.</p>
        </Link>
        
        <Link to="/ama" className="flex-1 bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-200 flex flex-col items-center transition-all duration-300 group no-underline">
          <div className="bg-purple-50 p-5 rounded-2xl mb-6 group-hover:bg-purple-600 transition-colors duration-300">
            <Info className="w-10 h-10 text-purple-600 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Substances AMA</h2>
          <p className="text-slate-500 text-center text-sm">Vérifier la liste mondiale des substances interdites de l'AMA.</p>
        </Link>
      </div>

    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medications" element={<MedSearch />} />
        <Route path="/ama" element={<AmaSearch />} />
      </Routes>
    </Router>
  );
}

export default App;