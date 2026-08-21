import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MedSearch from './components/MedSearch';
import AmaSearch from './components/AmaSearch';
import Header from './components/Header';
import Footer from './components/Footer';
import { AlertTriangle, ShieldCheck, ShieldX, Info, ArrowRight } from 'lucide-react';
import { translations } from './translations';

function Home({ showWarning, setShowWarning, accepted, setAccepted, refused, setRefused, pendingRoute, setPendingRoute, currentLang }) {
  const navigate = useNavigate();
  const t = translations[currentLang];

  if (refused) {
    return (
      <div className="flex-grow bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 md:p-6 transition-colors duration-300" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-sm max-w-md text-center border border-red-100 dark:border-red-900/50 border-t-8 border-t-red-500 transition-colors duration-300">
          <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">{t.restrictedAccess}</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8 text-sm md:text-base">{t.restrictedText}</p>
          <button onClick={() => { setRefused(false); setPendingRoute(null); }} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition font-medium w-full">
            {t.backHome}
          </button>
        </div>
      </div>
    );
  }

  if (showWarning && !accepted) {
    return (
      <div className="flex-grow bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 md:p-6 py-12 transition-colors duration-300" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="bg-white dark:bg-slate-800 p-6 md:p-12 rounded-3xl shadow-xl max-w-2xl text-center border border-slate-100 dark:border-slate-700 transition-colors duration-300">
          <div className="mx-auto mb-6 flex justify-center">
            <img src="/icon.png" alt="Clean Sport ID Logo Mobile" className="block sm:hidden h-16 md:h-20 object-contain" />
            <img src="/favicon.png" alt="Clean Sport ID Logo Desktop" className="hidden sm:block h-16 md:h-20 object-contain" />
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-4 rounded-xl mb-6 flex items-start gap-4 text-left border border-amber-200 dark:border-amber-700/50 transition-colors">
            <AlertTriangle className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-base md:text-lg mb-1">{t.warningTitle}</h2>
              <p className="text-xs md:text-sm opacity-90 leading-relaxed">
                {t.warningText}
              </p>
            </div>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 mb-8 text-xs md:text-base leading-relaxed text-justify px-2">
            {t.warningDisclaimer}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => { setShowWarning(false); setRefused(true); }} className="px-6 md:px-8 py-3 border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition w-full sm:w-auto text-sm md:text-base">
              {t.refuseBtn}
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
              {t.acceptBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!accepted) {
    return (
      <div className="flex-grow bg-slate-50 dark:bg-slate-900 flex items-center justify-between overflow-hidden my-auto transition-colors duration-300">
        <div className="w-full lg:max-w-xl px-6 md:px-16 py-12 z-10 text-center lg:text-left" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
          <span className="text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block" style={{ backgroundColor: 'rgba(0, 188, 212, 0.1)', color: '#00bcd4' }}>
            {t.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight transition-colors">
            {t.title}
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 transition-colors">
            {t.description}
          </p>
          
          <button 
            onClick={() => setShowWarning(true)}
            style={{ backgroundColor: '#0f172a' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00bcd4'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base md:text-lg group cursor-pointer"
          >
            <span>{t.start}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

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

  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 md:p-6 py-16 transition-colors duration-300" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-center mb-8 md:mb-12 max-w-2xl px-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white mb-3 transition-colors">{t.availableDatabases}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base transition-colors">
          {t.chooseDatabase}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-3xl px-4">
        <a 
          href="/medications" 
          onClick={(e) => { e.preventDefault(); navigate('/medications'); }}
          className="flex-1 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-200 dark:border-slate-700 flex flex-col items-center transition-all duration-300 group no-underline cursor-pointer"
        >
          <div 
            className="p-4 md:p-5 rounded-2xl mb-4 md:mb-6 transition-colors duration-300"
            style={{ backgroundColor: 'rgba(0, 188, 212, 0.1)' }}
          >
            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 transition-colors" style={{ color: '#00bcd4' }} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-[#00bcd4] dark:group-hover:text-[#00bcd4] transition-colors">{t.medTitle}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center text-xs md:text-sm transition-colors">{t.medDesc}</p>
        </a>
        
        <a 
          href="/ama" 
          onClick={(e) => { e.preventDefault(); navigate('/ama'); }}
          className="flex-1 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-200 dark:border-slate-700 flex flex-col items-center transition-all duration-300 group no-underline cursor-pointer"
        >
          <div 
            className="p-4 md:p-5 rounded-2xl mb-4 md:mb-6 transition-colors duration-300"
            style={{ backgroundColor: 'rgba(0, 188, 212, 0.1)' }}
          >
            <Info className="w-8 h-8 md:w-10 md:h-10 transition-colors" style={{ color: '#00bcd4' }} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-[#00bcd4] dark:group-hover:text-[#00bcd4] transition-colors">{t.amaTitle}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center text-xs md:text-sm transition-colors">{t.amaDesc}</p>
        </a>
      </div>
    </div>
  );
}

function App() {
  const [showWarning, setShowWarning] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [refused, setRefused] = useState(false);
  const [pendingRoute, setPendingRoute] = useState(null);
  const [currentLang, setCurrentLang] = useState('fr');
  const navigate = useNavigate();

  // NOUVEAU : État pour le mode sombre persistant
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header 
        hasAccepted={accepted} 
        onTriggerWarning={handleTriggerWarning} 
        onResetHome={handleResetHome} 
        currentLang={currentLang} 
        setCurrentLang={setCurrentLang} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
      />
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home showWarning={showWarning} setShowWarning={setShowWarning} accepted={accepted} setAccepted={setAccepted} refused={refused} setRefused={setRefused} pendingRoute={pendingRoute} setPendingRoute={setPendingRoute} currentLang={currentLang} />} />
          <Route path="/medications" element={accepted ? <MedSearch currentLang={currentLang} /> : <Home showWarning={true} setShowWarning={setShowWarning} accepted={accepted} setAccepted={setAccepted} refused={refused} setRefused={setRefused} pendingRoute="/medications" setPendingRoute={setPendingRoute} currentLang={currentLang} />} />
          <Route path="/ama" element={accepted ? <AmaSearch currentLang={currentLang} /> : <Home showWarning={true} setShowWarning={setShowWarning} accepted={accepted} setAccepted={setAccepted} refused={refused} setRefused={setRefused} pendingRoute="/ama" setPendingRoute={setPendingRoute} currentLang={currentLang} />} />
        </Routes>
      </main>
      <Footer hasAccepted={accepted} onTriggerWarning={handleTriggerWarning} onResetHome={handleResetHome} currentLang={currentLang} />
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