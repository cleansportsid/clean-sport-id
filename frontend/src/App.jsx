import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import MedSearch from './components/MedSearch';
import AmaSearch from './components/AmaSearch';
import { AlertTriangle, ShieldCheck, ShieldX, Info, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

// Composant Header réutilisable (Responsive avec menu/logo adapté)
function Header({ hasAccepted, onTriggerWarning, onResetHome }) {
  const handleNavClick = (e, path) => {
    if (path === '/') {
      e.preventDefault();
      onResetHome();
      return;
    }
    if (!hasAccepted) {
      e.preventDefault();
      onTriggerWarning(path);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link to="/" onClick={(e) => handleNavClick(e, '/')} className="flex items-center gap-3 no-underline">
          <img src="/favicon.png" alt="Clean Sport ID Logo" className="h-10 md:h-14 object-contain" />
        </Link>
        <nav className="flex items-center gap-3 md:gap-6">
          <Link to="/" onClick={(e) => handleNavClick(e, '/')} className="text-xs md:text-sm font-semibold text-slate-600 hover:text-[#00bcd4] transition">Accueil</Link>
          <Link to="/medications" onClick={(e) => handleNavClick(e, '/medications')} className="text-xs md:text-sm font-semibold text-slate-600 hover:text-[#00bcd4] transition">Médicaments</Link>
          <Link to="/ama" onClick={(e) => handleNavClick(e, '/ama')} className="text-xs md:text-sm font-semibold text-slate-600 hover:text-[#00bcd4] transition">Substances AMA</Link>
        </nav>
      </div>
    </header>
  );
}

// Composant Footer réutilisable en BLANC
function Footer({ hasAccepted, onTriggerWarning, onResetHome }) {
  const handleNavClick = (e, path) => {
    if (path === '/') {
      e.preventDefault();
      onResetHome();
      return;
    }
    if (!hasAccepted) {
      e.preventDefault();
      onTriggerWarning(path);
    }
  };

  return (
    <footer className="bg-white text-slate-600 pt-12 md:pt-16 pb-8 border-t border-slate-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-12">
        <div>
          <div className="mb-4">
            <Link to="/" onClick={(e) => handleNavClick(e, '/')}>
              <img src="/favicon.png" alt="Clean Sport ID Logo" className="h-12 md:h-14 object-contain" />
            </Link>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Clean Sport ID est un outil de référence innovant conçu pour accompagner les sportifs, les professionnels de santé et les structures sportives dans la vérification de la conformité des traitements vis-à-vis des réglementations antidopage.
          </p>
        </div>

        <div>
          <h3 className="text-slate-900 font-bold text-base mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" onClick={(e) => handleNavClick(e, '/')} className="hover:text-[#00bcd4] transition">Accueil</Link></li>
            <li><Link to="/medications" onClick={(e) => handleNavClick(e, '/medications')} className="hover:text-[#00bcd4] transition">Recherche Médicaments</Link></li>
            <li><Link to="/ama" onClick={(e) => handleNavClick(e, '/ama')} className="hover:text-[#00bcd4] transition">Recherche Substances AMA</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-slate-900 font-bold text-base mb-4">Contactez-nous</h3>
          <ul className="space-y-3 text-sm text-slate-500">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#00bcd4] flex-shrink-0" />
              <span>contact@cleansportid.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#00bcd4] flex-shrink-0" />
              <span>+213 (0) 500 00 00 00</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#00bcd4] flex-shrink-0" />
              <span>Algérie</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 border-t border-slate-100 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} Clean Sport ID. Tous droits réservés.</p>
        <p className="flex items-center gap-1">
          Développé pour un sport propre et transparent.
        </p>
      </div>
    </footer>
  );
}

function Home({ showWarning, setShowWarning, accepted, setAccepted, refused, setRefused, pendingRoute, setPendingRoute }) {
  const navigate = useNavigate();

  if (refused) {
    return (
      <div className="flex-grow bg-slate-50 flex flex-col items-center justify-center p-4 md:p-6">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm max-w-md text-center border border-red-100 border-t-8 border-t-red-500">
          <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Accès restreint</h2>
          <p className="text-slate-600 mb-8 text-sm md:text-base">Vous devez accepter les conditions d'utilisation pour accéder aux bases de données de Clean Sport ID.</p>
          <button onClick={() => { setRefused(false); setPendingRoute(null); }} className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-200 transition font-medium w-full">
            Retourner à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (showWarning && !accepted) {
    return (
      <div className="flex-grow bg-slate-50 flex items-center justify-center p-4 md:p-6 py-12">
        <div className="bg-white p-6 md:p-12 rounded-3xl shadow-xl max-w-2xl text-center border border-slate-100">
          <img src="/favicon.png" alt="Clean Sport ID Logo" className="h-16 md:h-20 mx-auto mb-6 object-contain" />
          
          <div className="bg-amber-50 text-amber-800 p-4 rounded-xl mb-6 flex items-start gap-4 text-left border border-amber-200">
            <AlertTriangle className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-base md:text-lg mb-1">Avertissement Légal Important</h2>
              <p className="text-xs md:text-sm opacity-90 leading-relaxed">
                Cette application est fournie à titre informatif uniquement. Les informations présentées sont basées sur des sources publiques et peuvent ne pas être exhaustives ou à jour. Elle ne remplace en aucun cas les recommandations officielles des autorités compétentes en matière de lutte contre le dopage.
              </p>
            </div>
          </div>
          
          <p className="text-slate-600 mb-8 text-xs md:text-base leading-relaxed text-justify px-2">
            L'utilisateur est seul responsable de la vérification des informations auprès des organismes officiels avant toute utilisation d'un médicament. Les développeurs de cette application déclinent toute responsabilité en cas d'erreur, d'omission ou d'utilisation inappropriée des informations fournies.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => { setShowWarning(false); setRefused(true); }} className="px-6 md:px-8 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition w-full sm:w-auto text-sm md:text-base">
              Je refuse
            </button>
            <button 
              onClick={() => { 
                setAccepted(true); 
                setShowWarning(false); 
                if (pendingRoute) {
                  navigate(pendingRoute);
                  setPendingRoute(null);
                }
              }} 
              style={{ backgroundColor: '#00bcd4' }}
              className="px-6 md:px-8 py-3 text-white font-bold rounded-xl hover:opacity-90 transition shadow-md w-full sm:w-auto text-sm md:text-base"
            >
              J'ai compris et j'accepte
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Écran principal : Adaptatif mobile (texte plein écran) et desktop (biseauté)
  if (!accepted) {
    return (
      <div className="flex-grow bg-slate-50 flex items-center justify-between overflow-hidden my-auto">
        <div className="w-full lg:max-w-xl px-6 md:px-16 py-12 z-10 text-center lg:text-left">
          <span className="text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block" style={{ backgroundColor: 'rgba(0, 188, 212, 0.1)', color: '#00bcd4' }}>
            Lutte contre le dopage
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Garantissez un sport propre, transparent et sécurisé.
          </h1>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-8">
            Bienvenue sur <span className="font-semibold text-slate-800">Clean Sport ID</span>, votre plateforme de confiance pour croiser et vérifier instantanément les substances médicamenteuses avec les directives et listes officielles de l'Agence Mondiale Antidopage (AMA).
          </p>
          
          <button 
            onClick={() => setShowWarning(true)}
            style={{ backgroundColor: '#0f172a' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00bcd4'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base md:text-lg group cursor-pointer"
          >
            <span>Commencer la recherche</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Masqué sur mobile, affiché en biseauté sur les écrans larges */}
        <div className="hidden lg:block w-[55%] self-stretch relative">
          <img 
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop" 
            alt="Sport et santé" 
            className="absolute inset-0 w-full h-full object-cover shadow-2xl"
            style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
          />
        </div>
      </div>
    );
  }

  // Écran de sélection des bases de données (Responsive grid)
  return (
    <div className="flex-grow bg-slate-50 flex flex-col items-center justify-center p-4 md:p-6 py-16">
      <div className="text-center mb-8 md:mb-12 max-w-2xl px-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3">Bases de données disponibles</h1>
        <p className="text-slate-500 text-sm md:text-base">
          Choisissez la base de données que vous souhaitez consulter ci-dessous.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-3xl px-4">
        <Link 
          to="/medications" 
          className="flex-1 bg-white p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-200 flex flex-col items-center transition-all duration-300 group no-underline"
        >
          <div 
            className="p-4 md:p-5 rounded-2xl mb-4 md:mb-6 transition-colors duration-300"
            style={{ backgroundColor: 'rgba(0, 188, 212, 0.1)' }}
          >
            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 transition-colors" style={{ color: '#00bcd4' }} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 group-hover:text-[#00bcd4] transition-colors">Médicaments</h2>
          <p className="text-slate-500 text-center text-xs md:text-sm">Rechercher parmi les médicaments autorisés et interdits en Algérie.</p>
        </Link>
        
        <Link 
          to="/ama" 
          className="flex-1 bg-white p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-200 flex flex-col items-center transition-all duration-300 group no-underline"
        >
          <div 
            className="p-4 md:p-5 rounded-2xl mb-4 md:mb-6 transition-colors duration-300"
            style={{ backgroundColor: 'rgba(0, 188, 212, 0.1)' }}
          >
            <Info className="w-8 h-8 md:w-10 md:h-10 transition-colors" style={{ color: '#00bcd4' }} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 group-hover:text-[#00bcd4] transition-colors">Substances AMA</h2>
          <p className="text-slate-500 text-center text-xs md:text-sm">Vérifier la liste mondiale des substances interdites de l'AMA.</p>
        </Link>
      </div>
    </div>
  );
}

function App() {
  const [showWarning, setShowWarning] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [refused, setRefused] = useState(false);
  const [pendingRoute, setPendingRoute] = useState(null);
  const navigate = useNavigate();

  const handleTriggerWarning = (route = null) => {
    setPendingRoute(route);
    setShowWarning(true);
  };

  const handleResetHome = () => {
    setAccepted(false);
    setShowWarning(false);
    setRefused(false);
    setPendingRoute(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header hasAccepted={accepted} onTriggerWarning={handleTriggerWarning} onResetHome={handleResetHome} />
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home showWarning={showWarning} setShowWarning={setShowWarning} accepted={accepted} setAccepted={setAccepted} refused={refused} setRefused={setRefused} pendingRoute={pendingRoute} setPendingRoute={setPendingRoute} />} />
          <Route path="/medications" element={accepted ? <MedSearch /> : <Home showWarning={true} setShowWarning={setShowWarning} accepted={accepted} setAccepted={setAccepted} refused={refused} setRefused={setRefused} pendingRoute="/medications" setPendingRoute={setPendingRoute} />} />
          <Route path="/ama" element={accepted ? <AmaSearch /> : <Home showWarning={true} setShowWarning={setShowWarning} accepted={accepted} setAccepted={setAccepted} refused={refused} setRefused={setRefused} pendingRoute="/ama" setPendingRoute={setPendingRoute} />} />
        </Routes>
      </main>
      <Footer hasAccepted={accepted} onTriggerWarning={handleTriggerWarning} onResetHome={handleResetHome} />
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
