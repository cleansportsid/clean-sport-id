import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { translations } from '../translations';

export default function Footer({ hasAccepted, onTriggerWarning, onResetHome, currentLang }) {
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
    <footer className="bg-white text-slate-600 pt-12 md:pt-16 pb-8 border-t border-slate-200 mt-auto" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-12">
        <div>
          <div className="mb-4">
            <Link to="/" onClick={(e) => handleNavClick(e, '/')}>
              <img src="/icon.png" alt="Logo Mobile" className="block sm:hidden h-12 object-contain" />
              <img src="/favicon.png" alt="Logo Desktop" className="hidden sm:block h-14 object-contain" />
            </Link>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            {t.footerDesc}
          </p>
        </div>

        <div>
          <h3 className="text-slate-900 font-bold text-base mb-4">{t.footerNav}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" onClick={(e) => handleNavClick(e, '/')} className="hover:text-[#00bcd4] transition">{t.home}</Link></li>
            <li><Link to="/medications" onClick={(e) => handleNavClick(e, '/medications')} className="hover:text-[#00bcd4] transition">{t.medications}</Link></li>
            <li><Link to="/ama" onClick={(e) => handleNavClick(e, '/ama')} className="hover:text-[#00bcd4] transition">{t.ama}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-slate-900 font-bold text-base mb-4">{t.footerContact}</h3>
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
              <span>{t.location}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 border-t border-slate-100 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} Clean Sport ID. {t.rights}</p>
        <p className="flex items-center gap-1">
          {t.devText}
        </p>
      </div>
    </footer>
  );
}