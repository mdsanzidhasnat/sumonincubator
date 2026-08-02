import React from 'react';
import { X, Trash2, ShoppingBag, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-bismillah-borderLight flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="p-4 bg-bismillah-bgDark text-white flex items-center justify-between">
          <h3 className="text-base font-extrabold">
            {lang === 'bn' ? 'প্রোডাক্ট তুলনা তালিকা' : 'Product Comparison Matrix'} ({compareProducts.length})
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY TABLE */}
        <div className="p-6 overflow-x-auto flex-1">
          {compareProducts.length === 0 ? (
            <div className="text-center py-12 text-bismillah-textMuted font-bold text-sm">
              {lang === 'bn'
                ? 'তুলনা করার জন্য কোনো প্রোডাক্ট নির্বাচন করা হয়নি।'
                : 'No products selected for comparison.'}
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px] text-xs">
              <thead>
                <tr className="border-b border-bismillah-borderLight">
                  <th className="p-3 bg-slate-50 font-extrabold text-slate-700 w-1/4">
                    {lang === 'bn' ? 'বৈশিষ্ট্য' : 'Feature'}
                  </th>
                  {compareProducts.map((p) => (
                    <th key={p.id} className="p-3 text-center align-top relative">
                      <button
                        onClick={() => onRemoveCompare(p.id)}
                        className="absolute top-2 right-2 text-bismillah-textMuted hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <img
                        src={p.image}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-lg object-cover mx-auto bg-slate-100 border border-bismillah-borderLight"
                      />
                      <h4 className="font-bold text-bismillah-bgDark mt-2 line-clamp-2">
                        {lang === 'bn' ? p.titleBn : p.title}
                      </h4>
                      <p className="text-bismillah-primaryGreen font-extrabold text-sm mt-1">
                        ৳ {p.price.toLocaleString()}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-bismillah-borderLight font-medium text-slate-700">
                <tr>
                  <td className="p-3 font-bold bg-slate-50">{lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center">{lang === 'bn' ? p.categoryBn : p.category}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold bg-slate-50">{lang === 'bn' ? 'ক্ষমতা' : 'Capacity'}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center">{p.specs.capacity || '-'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold bg-slate-50">{lang === 'bn' ? 'পাওয়ার সাপ্লাই' : 'Power'}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center">{p.specs.power || '-'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold bg-slate-50">{lang === 'bn' ? 'কন্ট্রোলার' : 'Controller'}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center">{p.specs.controller || '-'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold bg-slate-50">{lang === 'bn' ? 'ওয়ারেন্টি' : 'Warranty'}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center font-bold text-bismillah-primaryGreen">{p.specs.warranty || '-'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold bg-slate-50">{lang === 'bn' ? 'অ্যাকশন' : 'Action'}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center">
                      <button
                        onClick={() => {
                          onAddToCart(p);
                          onClose();
                        }}
                        className="bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'কার্টে রাখুন' : 'Add'}</span>
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
