import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { useContactSettings } from '../context/ContactSettingsContext';

export const FloatingContactButtons: React.FC = () => {
  const { phone, phoneDisplay, messengerPageId, messengerPageUrl } = useContactSettings();

  const messengerHref = messengerPageId
    ? `https://m.me/${messengerPageId}`
    : messengerPageUrl || '';

  return (
    <div className="fixed bottom-[6.5rem] right-6 z-40 flex flex-col items-end gap-2">
      {messengerHref && (
        <a
          href={messengerHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full bg-[#0084ff] hover:bg-[#0074e0] text-white shadow-xl flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all border-2 border-white"
          title="Message us on Messenger"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
        </a>
      )}

      <a
        href={`tel:${phone}`}
        className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all border-2 border-white"
        title={`Call ${phoneDisplay}`}
      >
        <Phone className="w-5 h-5 fill-white" />
      </a>
    </div>
  );
};
