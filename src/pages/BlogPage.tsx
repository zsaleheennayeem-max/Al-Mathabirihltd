import React, { useState } from 'react';
import { useData } from '../context/DataContext.tsx';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (path: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const { blogPosts } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(blogPosts.map((b) => b.category)))];

  const filtered = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter((b) => b.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Industry Insights & Compliance
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Workforce Intelligence & Global Mobility
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Deep technical analysis on cross-border visa regulations, offshore safety standards,
          heavy engineering labor productivity, and contractor compliance strategies.
        </p>

        {/* Category Filters */}
        <div className="pt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
          >
            <div>
              <div className="h-60 relative overflow-hidden bg-slate-100">
                <img
                  src={post.featuredImage || '/src/assets/images/about_global_workforce_1790187561296.jpg'}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-sm">
                  {post.category}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{post.author}</span>
                  </div>
                </div>

                <h2 className="font-display text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
              <button
                onClick={() => onNavigate(`/blog/${post.slug}`)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
