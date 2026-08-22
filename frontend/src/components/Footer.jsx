import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { translations } from '../translations';
import axios from 'axios';

export default function Footer({ hasAccepted, onTriggerWarning, onResetHome, currentLang, isDarkMode }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const t = translations[currentLang];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;

    setSending(true);
    setError(false);
    setSuccess(false);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/contact`, { 
        firstName, lastName, role, specialty, subject, email, message 
      });
      setSuccess(true);
      setFirstName(''); setLastName(''); setRole(''); setSpecialty('');
      setSubject(''); setEmail(''); setMessage('');
    } catch (err) {
      console.error("Erreur d'envoi du message", err);
      setError(true);
    } finally {
      setSending(false);
    }
  };

  const showSpecialty = ['Médecin', 'Pharmacien', 'Professionnel de santé'].includes(role);
  const showSport = ['Coach', 'Athlète'].includes(role);

  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 pt-12 md:pt-16 pb-8 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors duration-300" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-12">
        <div>
          <div className="mb-4">
            <Link to="/" onClick={(e) => handleNavClick(e, '/')}>
              {/* Logo Mobile */}
              <img src="/icon.png" alt="Logo Mobile" className="block sm:hidden h-12 object-contain" />
              
              {/* Logo Desktop : bascule selon le mode sombre / lumineux */}
              <img 
                src={isDarkMode ? "/logosombre.png" : "/favicon.png"} 
                alt="Logo Desktop" 
                className="hidden sm:block h-14 object-contain" 
              />
            </Link>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.footerDesc}
          </p>
        </div>

        <div>
          <h3 className="text-slate-900 dark:text-white font-bold text-base mb-4">{t.footerNav}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" onClick={(e) => handleNavClick(e, '/')} className="hover:text-[#00bcd4] dark:hover:text-[#00bcd4] transition">{t.home}</Link></li>
            <li><Link to="/medications" onClick={(e) => handleNavClick(e, '/medications')} className="hover:text-[#00bcd4] dark:hover:text-[#00bcd4] transition">{t.medications}</Link></li>
            <li><Link to="/ama" onClick={(e) => handleNavClick(e, '/ama')} className="hover:text-[#00bcd4] dark:hover:text-[#00bcd4] transition">{t.ama}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-slate-900 dark:text-white font-bold text-base mb-4">{t.footerContactTitle || "Contact / Signalement"}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                placeholder="Nom*" required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#00bcd4]/20 focus:border-[#00bcd4] outline-none text-slate-700 dark:text-slate-200 transition-colors"
              />
              <input 
                type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prénom*" required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#00bcd4]/20 focus:border-[#00bcd4] outline-none text-slate-700 dark:text-slate-200 transition-colors"
              />
            </div>

            <select
              value={role}
              onChange={(e) => { setRole(e.target.value); setSpecialty(''); }}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#00bcd4]/20 focus:border-[#00bcd4] outline-none text-slate-700 dark:text-slate-200 transition-colors"
            >
              <option value="" disabled>Sélectionnez votre profil*</option>
              <option value="Médecin">Médecin</option>
              <option value="Pharmacien">Pharmacien</option>
              <option value="Coach">Coach</option>
              <option value="Athlète">Athlète</option>
              <option value="Professionnel de santé">Professionnel de santé</option>
              <option value="Parent">Parent</option>
            </select>

            {showSpecialty && (
              <input 
                type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Votre spécialité (ex: Biologiste, Cardiologue...)*" required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#00bcd4]/20 focus:border-[#00bcd4] outline-none text-slate-700 dark:text-slate-200 transition-colors animate-fade-in"
              />
            )}

            {showSport && (
              <input 
                type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Sport pratiqué / encadré*" required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#00bcd4]/20 focus:border-[#00bcd4] outline-none text-slate-700 dark:text-slate-200 transition-colors animate-fade-in"
              />
            )}

            <input 
              type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
              placeholder="Objet du message*" required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#00bcd4]/20 focus:border-[#00bcd4] outline-none text-slate-700 dark:text-slate-200 transition-colors"
            />

            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder={t.footerEmailPlaceholder || "Votre e-mail*"} required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#00bcd4]/20 focus:border-[#00bcd4] outline-none text-slate-700 dark:text-slate-200 transition-colors"
            />
            
            <textarea 
              value={message} onChange={(e) => setMessage(e.target.value)}
              placeholder={t.footerPlaceholder || "Votre message ou anomalie..."} rows="3" required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#00bcd4]/20 focus:border-[#00bcd4] outline-none text-slate-700 dark:text-slate-200 resize-none transition-colors"
            />
            
            <button 
              type="submit" disabled={sending} style={{ backgroundColor: '#0f172a' }}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white rounded-xl hover:bg-[#00bcd4] dark:bg-slate-800 dark:hover:bg-[#00bcd4] transition shadow-sm cursor-pointer"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{t.footerSend || "Envoyer"}</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {success && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium text-center flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {t.footerSuccess || "Message envoyé avec succès !"}
              </p>
            )}
            {error && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium text-center">{t.footerError || "Erreur lors de l'envoi."}</p>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} Clean Sport ID. {t.rights}</p>
        <p className="flex items-center gap-1">
          {t.devText}
        </p>
      </div>
    </footer>
  );
}