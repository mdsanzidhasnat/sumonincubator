import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Product, Language } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareProducts: Product[];
  onRemoveCompare: (id: string) => void;
  onAddToCart: (p: Product) => void;
  lang: Language;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  compareProducts,
  onRemoveCompare,
  onAddToCart,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="p-3 sm:p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <h3 className="text-sm sm:text-base font-extrabold">
            {lang === 'bn' ? 'প্রোডাক্ট তুলনা তালিকা' : 'Product Comparison'} ({compareProducts.length})
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY TABLE */}
        <div className="flex-1 overflow-x-auto p-3 sm:p-6">
          {compareProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-bold text-sm">
              {lang === 'bn'
                ? 'তুলনা করার জন্য কোনো প্রোডাক্ট নির্বাচন করা হয়নি।'
                : 'No products selected for comparison.'}
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[400px] sm:min-w-[500px] lg:min-w-[600px] text-[11px] sm:text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-2 sm:p-3 bg-slate-50 font-extrabold text-slate-700 w-1/5 text-[11px] sm:text-xs">
                    {lang === 'bn' ? 'বৈশিষ্ট্য' : 'Feature'}
                  </th>
                  {compareProducts.map((p) => (
                    <th key={p.id} className="p-2 sm:p-3 text-center align-top relative">
                      <button
                        onClick={() => onRemoveCompare(p.id)}
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <img
                        src={p.image}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl object-cover mx-auto bg-slate-100 border border-slate-200"
                      />
                      <h4 className="font-bold text-slate-900 mt-1 sm:mt-2 line-clamp-2 text-[11px] sm:text-xs leading-tight">
                        {lang === 'bn' ? p.titleBn : p.title}
                      </h4>
                      <p className="text-brand-700 font-extrabold text-xs sm:text-sm mt-0.5 sm:mt-1">
                        ৳ {p.price.toLocaleString()}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                <tr>
                  <td className="p-2 sm:p-3 font-bold bg-slate-50 text-[11px] sm:text-xs">{lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-2 sm:p-3 text-center text-[11px] sm:text-xs">{lang === 'bn' ? p.categoryBn : p.category}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 sm:p-3 font-bold bg-slate-50 text-[11px] sm:text-xs">{lang === 'bn' ? 'ক্ষমতা' : 'Capacity'}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-2 sm:p-3 text-center text-[11px] sm:text-xs">{p.specs.capacity || '-'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 sm:p-3 font-bold bg-slate-50 text-[11px] sm:text-xs">{lang === 'bn' ? 'পাওয়ার সাপ্লাই' : 'Power'}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-2 sm:p-3 text-center text-[11px] sm:text-xs">{p.specs.power || '-'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 sm:p-3 font-bold bg-slate-50 text-[11px] sm:text-xs">{lang === 'bn' ? 'কন্ট্রোলার' : 'Controller'}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-2 sm:p-3 text-center text-[11px] sm:text-xs">{p.specs.controller || '-'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 sm:p-3 font-bold bg-slate-50 text-[11px] sm:text-xs">{lang === 'bn' ? 'ওয়ারেন্টি' : 'Warranty'}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-2 sm:p-3 text-center font-bold text-brand-700 text-[11px] sm:text-xs">{p.specs.warranty || '-'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 sm:p-3 font-bold bg-slate-50 text-[11px] sm:text-xs">{lang === 'bn' ? 'অ্যাকশন' : 'Action'}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-2 sm:p-3 text-center">
                      <button
                        onClick={() => {
                          onAddToCart(p);
                          onClose();
                        }}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl inline-flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden xs:inline">{lang === 'bn' ? 'কার্টে রাখুন' : 'Add'}</span>
                        <span className="xs:hidden">{lang === 'bn' ? 'কার্ট' : 'Add'}</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
