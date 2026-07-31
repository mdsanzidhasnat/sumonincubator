import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotFoundPage: React.FC = () => {
  const { lang } = useApp();

  return (
    <div className="py-20 bg-slate-50 min-h-full flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center space-y-6">
        <div className="text-8xl font-black text-slate-200">404</div>
        <h1 className="text-2xl font-black text-slate-900">
          {lang === 'bn' ? 'পেজ পাওয়া যায়নি' : 'Page Not Found'}
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          {lang === 'bn'
            ? 'আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই বা সরানো হয়েছে।'
            : 'The page you are looking for does not exist or has been moved.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>{lang === 'bn' ? 'হোম পেজ' : 'Home Page'}</span>
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-brand-500 text-slate-800 font-bold text-sm px-5 py-3 rounded-xl transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>{lang === 'bn' ? 'শপ দেখুন' : 'Browse Shop'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
