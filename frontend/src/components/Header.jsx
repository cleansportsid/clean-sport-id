import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { translations } from '../translations';

export default function Header({ hasAccepted, onTriggerWarning, onResetHome, currentLang, setCurrentLang }) {
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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link to="/" onClick={(e) => handleNavClick(e, '/')} className="flex items-center gap-3 no-underline">
          <img src="/icon.png" alt="Logo Mobile" className="block sm:hidden h-10 object-contain" />
          <img src="/favicon.png" alt="Logo Desktop" className="hidden sm:block h-14 object-contain" />
        </Link>
        <nav className="flex items-center gap-3 md:gap-6">
          <Link to="/" onClick={(e) => handleNavClick(e, '/')} className="text-xs md:text-sm font-semibold text-slate-600 hover:text-[#00bcd4] transition">{t.home}</Link>
          <Link to="/medications" onClick={(e) => handleNavClick(e, '/medications')} className="text-xs md:text-sm font-semibold text-slate-600 hover:text-[#00bcd4] transition">{t.medications}</Link>
          <Link to="/ama" onClick={(e) => handleNavClick(e, '/ama')} className="text-xs md:text-sm font-semibold text-slate-600 hover:text-[#00bcd4] transition">{t.ama}</Link>
          
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Globe className="w-4 h-4 text-slate-500 ml-1 hidden sm:block" />
            <select 
              value={currentLang} 
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent text-xs md:text-sm font-semibold text-slate-700 outline-none cursor-pointer px-1 py-0.5"
            >
              <option value="fr">FR</option>
              <option value="en">EN</option>
              <option value="ar">AR</option>
            </select>
          </div>
        </nav>
      </div>
    </header>
  );
}