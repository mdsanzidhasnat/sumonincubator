"use client";

import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { CONTACT_LINKS } from '../lib/contactLinks';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

export const FloatingContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const messengerHref = `https://m.me/${CONTACT_LINKS.messengerPageId}`;
  const whatsappHref = `https://wa.me/${CONTACT_LINKS.whatsappNumber}`;
  const phoneHref = `tel:${CONTACT_LINKS.phoneNumber}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-bismillah-primaryGreen hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all border-2 border-white relative z-10"
        title={isOpen ? 'Close contact options' : 'Open contact options'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      <div
        className={`absolute bottom-16 right-0 flex flex-col gap-3 transition-all duration-300 ease-in-out transform ${isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}
        }
      >
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all border-2 border-white"
          title="Chat on WhatsApp"
          onClick={(e) => e.stopPropagation()}
        >
          <WhatsApp className="w-6 h-6 fill-white" />
        </a>

        <a
          href={messengerHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#0084FF] hover:bg-[#0074E0] text-white shadow-lg flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all border-2 border-white"
          title="Message on Facebook Messenger"
          onClick={(e) => e.stopPropagation()}
        >
          <MessageCircle className="w-6 h-6 fill-white" />
        </a>

        <a
          href={phoneHref}
          className="w-12 h-12 rounded-full bg-bismillah-primaryGreen hover:bg-emerald-700 text-white shadow-lg flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all border-2 border-white"
          title="Call us"
          onClick={(e) => e.stopPropagation()}
        >
          <Phone className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};