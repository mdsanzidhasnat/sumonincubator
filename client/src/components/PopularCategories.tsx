import React from 'react';
import { categories } from '../data/categories';
import { Language } from '../types';

interface PopularCategoriesProps {
  lang: Language;
}

export const PopularCategories: React.FC<PopularCategoriesProps> = ({ lang }) => {
  const getCategoryInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .substring(0, 2);
  };

  const getCategoryColor = (id: string) => {
    const colors = [
      'bg-bismillah-primaryGreen/10 text-bismillah-primaryGreen',
      'bg-bismillah-accentYellow/10 text-slate-950',
      'bg-rose-50 text-rose-600',
      'bg-emerald-50 text-emerald-600',
      'bg-blue-50 text-blue-600',
      'bg-purple-50 text-purple-600',
    ];
    return colors[id.charCodeAt(0) % colors.length];
  };

  return (
    <section className="py-10 bg-white border-b border-bismillah-borderLight">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-bismillah-bgDark tracking-tight flex items-center justify-center gap-2">
          <span>{lang === 'bn' ? 'জনপ্রিয় বিভাগ' : 'Popular Categories'}</span>
          <span className="text-bismillah-textMuted">•</span>
          <span className="text-bismillah-textMuted">•</span>
        </h2>

        <div className="flex flex-nowrap justify-center gap-6 overflow-x-auto pb-2 no-scrollbar">
          {categories.slice(0, 8).map((category) => (
            <div key={category.id} className="flex flex-col items-center gap-2 min-w-[80px]">
              <div className="w-20 h-20 rounded-full bg-white border-2 border-bismillah-borderLight shadow-sm flex items-center justify-center overflow-hidden hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-full ${getCategoryColor(category.id)} flex items-center justify-center font-bold text-lg`}
                >{getCategoryInitials(lang === 'bn' ? category.nameBn : category.name)}</div>
              </div>
              <span className="text-xs font-semibold text-slate-700 text-center max-w-[80px] truncate">
                {lang === 'bn' ? category.nameBn : category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
