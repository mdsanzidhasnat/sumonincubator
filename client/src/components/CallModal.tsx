import React, { useEffect, useState } from 'react';
import { X, Phone, Check, Copy, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { useContactSettings } from '../context/ContactSettingsContext';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

interface CallModalProps {
  open: boolean;
  lang: Language;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ open, lang, onClose }) => {
  const { phone, phoneDisplay, whatsappNumber, whatsappDefaultMessage, messengerPageId } =
    useContactSettings();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable; ignore.
    }
  };

  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappDefaultMessage,
  )}`;
  const messengerHref = messengerPageId
    ? `https://m.me/${messengerPageId}`
    : undefined;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg w-full max-w-sm shadow-2xl border border-bismillah-borderLight overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-bismillah-primaryGreen p-5 text-white">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/15 hover:bg-white/25 text-white p-1.5 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <Phone className="w-6 h-6 fill-white" />
          </div>
          <h3 className="text-lg font-black tracking-tight">
            {lang === 'bn' ? 'সরাসরি কল করুন' : 'Call Us Directly'}
          </h3>
          <p className="text-sm font-medium text-emerald-100">
            {lang === 'bn'
              ? 'আমাদের হটলাইনে কথা বলুন'
              : 'Talk to our team on the hotline'}
          </p>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-3">
          <div className="bg-slate-50 rounded-lg border border-bismillah-borderLight p-4 text-center">
            <p className="text-[11px] font-bold text-bismillah-textMuted uppercase tracking-wider mb-1">
              {lang === 'bn' ? 'হটলাইন নম্বর' : 'Hotline Number'}
            </p>
            <p className="text-2xl font-black text-bismillah-bgDark tracking-tight">{phoneDisplay}</p>
          </div>

          <a
            href={`tel:${phone}`}
            className="w-full bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>{lang === 'bn' ? 'এখনই কল করুন' : 'Call Now'}</span>
          </a>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={copyNumber}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-lg flex flex-col items-center gap-1 cursor-pointer transition-colors text-[10px]"
            >
              {copied ? (
                <Check className="w-5 h-5 text-bismillah-primaryGreen" />
              ) : (
                <Copy className="w-5 h-5 text-bismillah-textMuted" />
              )}
              <span>{copied ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : lang === 'bn' ? 'কপি' : 'Copy'}</span>
            </button>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-100 hover:bg-emerald-200 text-bismillah-primaryGreen font-bold py-2.5 rounded-lg flex flex-col items-center gap-1 cursor-pointer transition-colors text-[10px]"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>

            {messengerHref ? (
              <a
                href={messengerHref}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-50 hover:bg-blue-100 text-[#0084ff] font-bold py-2.5 rounded-lg flex flex-col items-center gap-1 cursor-pointer transition-colors text-[10px]"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Messenger</span>
              </a>
            ) : (
              <div className="bg-slate-50 text-slate-300 font-bold py-2.5 rounded-lg flex flex-col items-center gap-1 text-[10px]">
                <MessageCircle className="w-5 h-5" />
                <span>Messenger</span>
              </div>
            )}
          </div>

          <p className="text-[10px] text-bismillah-textMuted font-medium text-center pt-1">
            {lang === 'bn'
              ? 'ডেস্কটপে কল বাটনে ক্লিক করলে ব্রাউজার একটি নিশ্চিতকরণ দেখাতে পারে — এটি সুরক্ষার জন্য।'
              : 'On desktop your browser may ask once to allow calls — this is a security step.'}
          </p>
        </div>
      </div>
    </div>
  );
};
