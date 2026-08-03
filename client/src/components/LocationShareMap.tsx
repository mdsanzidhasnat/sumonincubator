import React, { useState } from 'react';
import { MapPin, Loader2, X, AlertCircle, ExternalLink } from 'lucide-react';
import { Language } from '../types';

export interface SharedLocation {
  lat: number;
  lng: number;
}

interface LocationShareMapProps {
  lang: Language;
  value: SharedLocation | null;
  onChange: (loc: SharedLocation | null) => void;
}

export const LocationShareMap: React.FC<LocationShareMapProps> = ({ lang, value, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setError(lang === 'bn' ? 'আপনার ব্রাউজার লোকেশন সাপোর্ট করে না।' : 'Your browser does not support location sharing.');
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError(lang === 'bn' ? 'লোকেশন অনুমতি অস্বীকার করা হয়েছে। ব্রাউজার সেটিংস থেকে অনুমতি দিন।' : 'Location permission denied. Please allow access in your browser settings.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError(lang === 'bn' ? 'লোকেশন পাওয়া যাচ্ছে না। আবার চেষ্টা করুন।' : 'Location unavailable. Please try again.');
        } else {
          setError(lang === 'bn' ? 'লোকেশন পেতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Failed to get your location. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const removeLocation = () => {
    onChange(null);
    setError(null);
  };

  const mapSrc = value
    ? `https://maps.google.com/maps?q=${value.lat},${value.lng}&z=15&output=embed`
    : '';

  return (
    <div className="space-y-2">
      {!value ? (
        <button
          type="button"
          onClick={shareLocation}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-bismillah-primaryGreen/5 border border-dashed border-bismillah-primaryGreen text-bismillah-primaryGreen hover:bg-bismillah-primaryGreen/10 font-bold text-sm px-4 py-3 rounded-sharp cursor-pointer transition-colors disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          <span>{lang === 'bn' ? 'আমার লোকেশন শেয়ার করুন' : 'Share My Location'}</span>
        </button>
      ) : (
        <div className="rounded-sharp border border-bismillah-borderLight overflow-hidden">
          <div className="relative">
            <iframe
              title={lang === 'bn' ? 'লোকেশন ম্যাপ' : 'Location Map'}
              src={mapSrc}
              className="w-full h-56 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <button
              type="button"
              onClick={removeLocation}
              className="absolute top-2 right-2 bg-white border border-bismillah-borderLight shadow-md text-slate-600 hover:text-rose-600 p-1.5 rounded-sharp cursor-pointer transition-colors"
              title={lang === 'bn' ? 'লোকেশন মুছুন' : 'Remove location'}
              aria-label={lang === 'bn' ? 'লোকেশন মুছুন' : 'Remove location'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 text-xs">
            <span className="text-slate-600 font-mono font-semibold">
              {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
            </span>
            <a
              href={`https://maps.google.com/?q=${value.lat},${value.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-bismillah-primaryGreen font-bold hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{lang === 'bn' ? 'মানচিত্রে খুলুন' : 'Open in Maps'}</span>
            </a>
          </div>
        </div>
      )}

      {error && (
        <p className="flex items-start gap-1.5 text-xs text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-sharp p-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
