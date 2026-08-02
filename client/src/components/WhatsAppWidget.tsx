import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Language } from '../types';
import { useContactSettings } from '../context/ContactSettingsContext';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

interface WhatsAppWidgetProps {
  lang: Language;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const { whatsappNumber, whatsappDefaultMessage } = useContactSettings();

  const handleSend = () => {
    const text = encodeURIComponent(msg || whatsappDefaultMessage);
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          <div className="bg-emerald-600 p-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WhatsAppIcon className="w-4 h-4" />
              <span className="text-xs font-bold">
                {lang === 'bn' ? 'সুমন কাস্টমার কেয়ার' : 'Sumon Customer Support'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:opacity-80 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 bg-slate-50 space-y-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 shadow-xs">
              <p className="font-bold text-emerald-700">আসসালামু আলাইকুম! 👋</p>
              <p className="mt-1 text-slate-600">
                {lang === 'bn'
                  ? 'ইনকিউবেটর, আইপিএস বা অর্ডার সংক্রান্ত যেকোনো তথ্যের জন্য সরাসরি হোয়াটসঅ্যাপে মেসেজ দিন।'
                  : 'How can we help you today with egg incubators or IPS setups?'}
              </p>
            </div>

            <textarea
              rows={2}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder={lang === 'bn' ? 'আপনার প্রশ্ন লিখুন...' : 'Type your question...'}
              className="w-full bg-white border border-slate-300 rounded-xl p-2 outline-none text-slate-800 focus:border-emerald-600"
            />

            <button
              onClick={handleSend}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট করুন' : 'Start WhatsApp Chat'}</span>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all border-2 border-white"
        title="Live WhatsApp Support"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </button>
    </div>
  );
};
