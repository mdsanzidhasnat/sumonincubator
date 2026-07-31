import React from 'react';
import { Truck, CreditCard, Headphones, ShieldCheck, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { trustBadges } from '../data/trustBadges';

interface TrustBadgesProps {
  lang: Language;
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({ lang }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Truck':
        return <Truck className="w-6 h-6" />;
      case 'CreditCard':
        return <CreditCard className="w-6 h-6" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6" />;
      case 'RotateCcw':
        return <RotateCcw className="w-6 h-6" />;
      default:
        return <ShieldCheck className="w-6 h-6" />;
    }
  };

  return (
    <section className="py-8 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {trustBadges.map((badge) => (
            <div
              key={badge.id}
              className="bg-slate-50/80 hover:bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-brand-500/40 hover:shadow-md transition-all duration-200 flex items-center gap-3.5 group cursor-default"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${badge.colorBg} group-hover:scale-110 transition-transform`}
              >
                {getIcon(badge.icon)}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-900 group-hover:text-brand-700 transition-colors">
                  {lang === 'bn' ? badge.titleBn : badge.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5 truncate">
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
