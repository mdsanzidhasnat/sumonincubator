import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { Language } from '../types';

export interface SearchableOption {
  id: string;
  name: string;
  nameBn: string;
}

interface SearchableSelectProps {
  value: string | null;
  onChange: (id: string) => void;
  options: SearchableOption[];
  label?: string;
  placeholder?: string;
  lang: Language;
  disabled?: boolean;
  error?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder,
  lang,
  disabled = false,
  error = false,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const selected = options.find((o) => o.id === value) ?? null;

  const filtered = query.trim()
    ? options.filter((o) =>
        o.name.toLowerCase().includes(query.toLowerCase()) ||
        o.nameBn.includes(query)
      )
    : options;

  const displayName = (o: SearchableOption) => (lang === 'bn' ? o.nameBn : o.name);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 bg-white border rounded-sharp px-3 py-2.5 text-sm outline-none transition-colors ${
          disabled
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
            : error
            ? 'border-rose-400 focus:border-rose-500'
            : 'border-slate-300 hover:border-bismillah-primaryGreen focus:border-bismillah-primaryGreen'
        }`}
      >
        <span className={`truncate ${selected ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
          {selected ? displayName(selected) : (placeholder ?? (lang === 'bn' ? 'সিলেক্ট করুন' : 'Select'))}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1.5 bg-white rounded-sharp shadow-xl border border-bismillah-borderLight overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 px-3 border-b border-bismillah-borderLight bg-slate-50">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === 'bn' ? 'অনুসন্ধান করুন...' : 'Search...'}
              className="w-full bg-transparent py-2.5 text-sm text-slate-800 outline-none placeholder-slate-400"
            />
          </div>
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-50">
            {filtered.length === 0 && (
              <p className="p-4 text-center text-xs text-slate-400">
                {lang === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No results found'}
              </p>
            )}
            {filtered.map((o) => {
              const isSelected = o.id === value;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    onChange(o.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm text-left cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-bismillah-primaryGreen/5 text-bismillah-primaryGreen font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{displayName(o)}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
