import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { Language } from '../types';
import { useContactSettings } from '../context/ContactSettingsContext';
import { CallModal } from './CallModal';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

interface FloatingContactButtonsProps {
  lang: Language;
}

export const FloatingContactButtons: React.FC<FloatingContactButtonsProps> = ({ lang }) => {
  const { phone, phoneDisplay, messengerPageId, messengerPageUrl, whatsappNumber, whatsappDefaultMessage } = useContactSettings();
  const [callOpen, setCallOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const messengerHref = messengerPageId
    ? `https://m.me/${messengerPageId}`
    : messengerPageUrl || '';

  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}${whatsappDefaultMessage ? `?text=${encodeURIComponent(whatsappDefaultMessage)}` : ''}`
    : '';

  const phoneHref = `tel:${phone}`;

  const isMobile = () => window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50" ref={dropdownRef}>
        {/* Main FAB with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-14 h-14 rounded-full bg-bismillah-primaryGreen hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all border-2 border-white relative z-10"
            title={menuOpen ? 'Close contact options' : 'Open contact options'}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {menuOpen && (
            <div
              className="absolute bottom-full right-0 mb-3 w-56 bg-white rounded-sharp shadow-xl border border-bismillah-borderLight p-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
              role="menu"
            >
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm hover:bg-slate-50 transition-colors"
                  title="Chat on WhatsApp"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                    <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <span className="text-sm font-medium text-slate-800">WhatsApp</span>
                </a>
              )}

              {messengerHref && (
                <a
                  href={messengerHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm hover:bg-slate-50 transition-colors"
                  title="Message on Facebook Messenger"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-full bg-[#0084FF]/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#0084FF]" />
                  </div>
                  <span className="text-sm font-medium text-slate-800">Messenger</span>
                </a>
              )}

              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-sm hover:bg-slate-50 transition-colors"
                title={`Call ${phoneDisplay}`}
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <div className="w-10 h-10 rounded-full bg-bismillah-primaryGreen/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-bismillah-primaryGreen" />
                </div>
                <span className="text-sm font-medium text-slate-800">Call</span>
              </a>
            </div>
          )}
        </div>

        {/* Call Modal (existing functionality) */}
        <CallModal open={callOpen} lang={lang} onClose={() => setCallOpen(false)} />
      </div>
    </>
  );
};