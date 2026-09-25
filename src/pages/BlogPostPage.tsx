import React from 'react';
import { useData } from '../context/DataContext.tsx';
import { ArrowLeft, ArrowRight, User, Calendar, Tag, Share2 } from 'lucide-react';

interface BlogPostPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigate }) => {
  const { getBlogPostBySlug, blogPosts } = useData();
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Article Not Found</h1>
        <button
          onClick={() => onNavigate('/blog')}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
        >
          Return to Insights
        </button>
      </div>
    );
  }

  let tagsList: string[] = [];
  try {
    tagsList = typeof post.tags === 'string' ? JSON.parse(post.tags) : (post.tags || []);
  } catch (e) {
    tagsList = [];
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <button
        onClick={() => onNavigate('/blog')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Insights</span>
      </button>

      {/* Title & Metadata */}
      <div className="space-y-4">
        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          {post.category}
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <User className="w-4 h-4 text-slate-400" />
            <span>{post.author}</span>
          </div>
          <span>·</span>
          <span>5 min technical read</span>
        </div>
      </div>

      {/* Featured Banner Image */}
      <div className="h-80 sm:h-96 rounded-2xl overflow-hidden shadow-sm bg-slate-100">
        <img
          src={post.featuredImage || '/src/assets/images/about_global_workforce_1790187561296.jpg'}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body */}
      <div className="prose prose-slate max-w-none space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
        <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed italic border-l-4 border-blue-600 pl-4 py-1">
          {post.excerpt}
        </div>
        <div className="whitespace-pre-line">
          {post.content}
        </div>
      </div>

      {/* Tags */}
      {tagsList.length > 0 && (
        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-slate-400 mr-1" />
          {tagsList.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Requisition Banner */}
      <div className="mt-12 bg-slate-900 text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold text-white">Need Technical Manpower?</h3>
          <p className="text-xs text-slate-400">
            Submit a formal requisition and receive an international deployment plan.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/request-manpower')}
          className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg whitespace-nowrap"
        >
          Request Proposal
        </button>
      </div>
    </article>
  );
};
