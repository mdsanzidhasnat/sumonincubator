import React from 'react';
import { Truck, Zap, Headphones, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { trustBadges } from '../data/trustBadges';

interface TrustBadgesProps {
  lang: Language;
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({ lang }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Truck':
        return <Truck className="w-5 h-5 text-bismillah-primaryGreen" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-bismillah-accentYellow" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-bismillah-primaryGreen" />;
      case 'RotateCcw':
        return <RotateCcw className="w-5 h-5 text-bismillah-primaryGreen" />;
      default:
        return <Truck className="w-5 h-5 text-bismillah-primaryGreen" />;
    }
  };

  return (
    <section className="w-full py-6 bg-white border-b border-bismillah-borderLight">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {trustBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-row items-center justify-center space-x-3 py-2"
            >
              {getIcon(badge.icon)}
              <div className="min-w-0 text-center sm:text-left">
                <h4 className="text-sm font-semibold text-slate-900 font-bangla">
                  {lang === 'bn' ? badge.titleBn : badge.title}
                </h4>
                <p className="text-[11px] text-bismillah-textMuted font-medium leading-tight mt-0.5">
                  {lang === 'bn' ? badge.subtitleBn : badge.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
