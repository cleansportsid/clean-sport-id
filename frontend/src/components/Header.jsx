import { Link } from 'react-router-dom';
import { Globe, Sun, Moon } from 'lucide-react';
import { translations } from '../translations';

export default function Header({ hasAccepted, onTriggerWarning, onResetHome, currentLang, setCurrentLang, isDarkMode, setIsDarkMode }) {
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

  const t = translations[currentLang];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link to="/" onClick={(e) => handleNavClick(e, '/')} className="flex items-center gap-3 no-underline">
          {/* Logo pour Mobile */}
          <img 
            src="/icon.png" 
            alt="Logo Mobile" 
            className="block sm:hidden h-10 object-contain" 
          />
          
          {/* Logo Desktop : passe de favicon.png à logosombre.png selon le mode */}
          <img 
            src={isDarkMode ? "/logosombre.png" : "/favicon.png"} 
            alt="Logo Desktop" 
            className="hidden sm:block h-14 object-contain" 
          />
        </Link>
        <nav className="flex items-center gap-3 md:gap-6">
          <Link to="/" onClick={(e) => handleNavClick(e, '/')} className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#00bcd4] dark:hover:text-[#00bcd4] transition">{t.home}</Link>
          <Link to="/medications" onClick={(e) => handleNavClick(e, '/medications')} className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#00bcd4] dark:hover:text-[#00bcd4] transition">{t.medications}</Link>
          <Link to="/ama" onClick={(e) => handleNavClick(e, '/ama')} className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#00bcd4] dark:hover:text-[#00bcd4] transition">{t.ama}</Link>
          
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
            <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400 ml-1 hidden sm:block" />
            <select 
              value={currentLang} 
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer px-1 py-0.5"
            >
              <option value="fr">FR</option>
              <option value="en">EN</option>
              <option value="ar">AR</option>
            </select>
          </div>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}