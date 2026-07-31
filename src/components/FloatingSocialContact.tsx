import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/8801700000000';
const MESSENGER_URL = 'https://m.me/sumonincubator';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 448 512" fill="currentColor" className={className} aria-hidden="true">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

const MessengerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 448 512" fill="currentColor" className={className} aria-hidden="true">
    <path d="M224 32C100.6 32 0 126.6 0 245.4c0 62.7 30.4 120.1 78.3 157.1 1.5 1.2 2.6 2.9 3 4.8 1.5 6.5 5.5 23.5 7.3 30.1.8 2.9 1.6 5.8 2.6 8.6 1.6 4.7 8.7 5.5 11.5 1.3 7.1-10.9 14.9-21.8 22.3-32.4.7-1.1 1.5-2.2 2.4-3.1.3-.3.6-.5 1-.7 3.1-2.1 6.4-4.1 9.6-6.1 5.9-3.6 12-6.8 18.1-9.8 3.4-1.7 7.1-3.2 10.7-4.6.2-.1.4-.2.7-.2 17.4 11.2 37.6 18 59 18 62.7 0 113.6-52.9 113.6-118.2 0-31.9-14.3-61.6-37.5-82.3 6.3-7.3 11.3-15.3 15-24.2 1.7-4.1.1-8.8-3.8-10.5-4.9-2.1-10.4-3.4-16.3-3.4h-.8c-1.3 0-2.6.1-3.9.3-1.3.1-2.5.2-3.8.3-2.9.2-5.8.5-8.6.9-3.5.5-6.9 1.1-10.3 1.9-1.9.4-3.7.9-5.6 1.4-1.5.4-3 .9-4.5 1.4-1.7.6-3.4 1.2-5.1 1.9-1.2.5-2.4 1-3.6 1.6-.3.1-.6.3-.9.4-12.9-19.9-34.7-33.2-59.4-33.2-18.8 0-36.7 7.3-50.4 20.5-10.7 10.4-17.8 23.9-20.7 38.6-1 5.3-1.1 10.7-.3 16.1-1.1 2.2-2.3 4.4-3.7 6.5-3.4 5.1-7.2 9.9-11.4 14.5-3.1 3.4-6.4 6.6-9.8 9.7-5.4 4.9-11.1 9.4-17.1 13.5-1.8 1.2-3.7 2.4-5.6 3.5-.2.1-.4.3-.5.5-4.8 3.4-7.2 9.1-6 14.7 1.2 5.5 5 10.2 10.1 12.2-.4 1.4-.8 2.9-1.1 4.3-.2 1-.3 2-.3 3 0 .1 0 .3 0 .4 0 6.1 4.9 11.1 11 11.1 4.8 0 8.9-3.1 10.5-7.4.1-.3.2-.5.2-.8.6-2.3 1.2-4.7 1.8-7 .5-2 .9-4 1.2-6 .3-1.6.6-3.2.8-4.9.2-1.4.3-2.8.4-4.2.1-.9.1-1.8.1-2.8 0-.4 0-.8 0-1.2.2-.6.4-1.2.7-1.8.9-1.8 2-3.5 3.4-5 1.5-1.7 3.1-3.2 4.9-4.5 3.6-2.7 7.5-4.8 11.6-6.3.9-.3 1.8-.6 2.7-.9 1.5-.4 3-.8 4.6-1.1.2-.1.4-.1.6-.1 4.7 4.8 10.8 8.4 17.7 10 8.1 1.9 16.7 1.6 24.9-.8.5-.2 1.1-.4 1.6-.7.3-.1.7-.3 1-.5.4-.2.7-.3 1.1-.5.5-.2 1-.5 1.5-.7.4-.2.9-.4 1.3-.6.6-.3 1.1-.6 1.7-.8.4-.2.8-.4 1.2-.6.5-.2 1-.4 1.5-.7.3-.1.6-.3.9-.4.5-.2 1-.5 1.5-.7.3-.1.6-.3.9-.4.5-.2 1-.4 1.5-.7.6-.2 1.2-.5 1.8-.7.3-.1.6-.3.9-.4 2-1 4.1-1.9 6.2-2.6 4.1-1.5 8.4-2.4 12.7-2.9 8.6-.8 17.2 1 24.4 5.7 6.7 4.4 12 10.6 15.7 17.5 4.7 8.8 7.3 18.9 7.3 29.2.1 57.1-43.6 104.2-98.9 104.2-21.6 0-41.4-6.8-58.3-18.4-3.1 1.7-6.3 3.3-9.5 4.8-1 .5-2.1.9-3.1 1.4-.4.2-.8.3-1.2.5-4.4 1.9-8.9 3.5-13.5 4.9-.6.2-1.1.3-1.7.5-2.8.8-5.6 1.5-8.5 2.1-.6.1-1.2.3-1.8.4-3.7.7-7.4 1.2-11.2 1.5-.6.1-1.2.1-1.8.2-1.5.1-2.9.2-4.4.2-.2 0-.4 0-.6 0-16.1 0-31.5-2.9-45.9-8.4-.9-.3-1.8-.7-2.7-1.1-.3-.1-.6-.3-.9-.4-.2-.1-.4-.2-.6-.3-41.2 17.9-86.8 12.5-123.9-11.2C45.1 338.8 30 307.2 30 272.6 30 137.8 117.4 32 224 32z" />
  </svg>
);

export const FloatingSocialContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 transition-opacity duration-300 ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={() => openLink(MESSENGER_URL)}
        aria-label="Chat on Messenger"
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        className={`w-12 h-12 rounded-full bg-[#0084FF] hover:bg-[#0070e0] text-white shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto delay-0'
            : 'opacity-0 translate-y-4 scale-50 pointer-events-none delay-100'
        }`}
      >
        <MessengerIcon className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => openLink(WHATSAPP_URL)}
        aria-label="Chat on WhatsApp"
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        className={`w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto delay-100'
            : 'opacity-0 translate-y-4 scale-50 pointer-events-none delay-0'
        }`}
      >
        <WhatsAppIcon className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close contact options' : 'Open contact options'}
        aria-expanded={isOpen}
        className="w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-xl flex items-center justify-center cursor-pointer pointer-events-auto transition-all duration-300 ease-out hover:scale-110 active:scale-95 border-2 border-white"
      >
        <span
          className={`transition-transform duration-300 ease-out ${
            isOpen ? 'rotate-90 scale-110' : 'rotate-0'
          }`}
        >
          {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
        </span>
      </button>
    </div>
  );
};
