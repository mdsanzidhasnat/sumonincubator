import React from 'react';
import { X, Play, Eye, Clock, Youtube } from 'lucide-react';
import { Language } from '../types';
import { videoTutorials } from '../data/videos';

interface VideosModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const VideosModal: React.FC<VideosModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500 fill-red-500" />
            <h3 className="text-base font-extrabold">
              {lang === 'bn' ? 'সুমন ভিডিও টিউটোরিয়াল গ্যালারি' : 'Sumon Incubator Video Guides'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videoTutorials.map((vid) => (
              <div
                key={vid.id}
                className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all group cursor-pointer"
                onClick={() =>
                  window.open(`https://youtube.com/results?search_query=Sumon+Incubator+${encodeURIComponent(vid.title)}`, '_blank')
                }
              >
                <div className="relative aspect-video bg-slate-800 overflow-hidden">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    {vid.duration}
                  </span>
                </div>

                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-700">
                    {lang === 'bn' ? vid.titleBn : vid.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {vid.views}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
