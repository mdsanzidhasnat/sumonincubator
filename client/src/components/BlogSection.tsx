import React, { useState } from 'react';
import { BookOpen, Calendar, ArrowRight, User, X, Clock } from 'lucide-react';
import { BlogPost, Language } from '../types';
import { blogPosts } from '../data/blogs';
import { SectionHeaderBlock } from './SectionHeaderBlock';

interface BlogSectionProps {
  lang: Language;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ lang }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section id="blog-section" className="py-12 bg-white border-t border-bismillah-borderLight">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* HEADER */}
        <SectionHeaderBlock
          title={lang === 'bn' ? 'আমাদের ব্লগ ও ইনকিউবেটর টিপস' : 'OUR BLOG'}
          subtitle={
            lang === 'bn'
              ? 'ডিম হ্যাচিং, XM-18 কন্ট্রোলার সেটিং ও আইপিএস ব্যাটারি পরিচর্যার টিপস'
              : 'Expert articles on egg incubation, thermostat calibration & battery care'
          }
        >
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-bismillah-primaryGreen uppercase tracking-widest bg-emerald-100/60 px-3 py-1 rounded-sharp">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'জ্ঞান ও গাইড' : 'Knowledge & Guides'}</span>
          </div>
        </SectionHeaderBlock>

        {/* BLOG CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white hover:bg-slate-50 rounded-sharp border border-bismillah-borderLight hover:border-bismillah-primaryGreen transition-colors duration-300 flex flex-col overflow-hidden"
            >
              {/* IMAGE */}
              <div className="relative h-48 overflow-hidden bg-slate-200">
                <img
                  src={post.image}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-bismillah-primaryGreen text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-sm">
                  {lang === 'bn' ? post.categoryBn : post.category}
                </span>
              </div>

              {/* BODY */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-[11px] text-bismillah-textMuted font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-bismillah-primaryGreen transition-colors line-clamp-2 leading-snug">
                    {lang === 'bn' ? post.titleBn : post.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {lang === 'bn' ? post.excerptBn : post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-bismillah-borderLight flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {post.author}
                  </span>

                  <button
                    onClick={() => setSelectedPost(post)}
                    className="text-xs font-black text-bismillah-primaryGreen hover:text-emerald-800 flex items-center gap-1 cursor-pointer group-hover:translate-x-1 transition-transform"
                  >
                    <span>{lang === 'bn' ? 'পড়ুন' : 'Read More'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* READ BLOG MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-bismillah-borderLight animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-56 bg-slate-100">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-sm cursor-pointer shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-sm">
                {lang === 'bn' ? selectedPost.categoryBn : selectedPost.category}
              </span>

              <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                {lang === 'bn' ? selectedPost.titleBn : selectedPost.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                <span>By {selectedPost.author}</span>
                <span>•</span>
                <span>{selectedPost.date}</span>
              </div>

              <div className="space-y-3 text-sm text-slate-700 leading-relaxed pt-3 border-t border-bismillah-borderLight">
                {(selectedPost.contentBn || [selectedPost.excerptBn]).map(
                  (paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  )
                )}
              </div>

              <div className="pt-4 border-t border-bismillah-borderLight flex justify-end">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="bg-bismillah-bgDark text-white font-bold text-xs px-5 py-2.5 rounded-sm cursor-pointer"
                >
                  {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
