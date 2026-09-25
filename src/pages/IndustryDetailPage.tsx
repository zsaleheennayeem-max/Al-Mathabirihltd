import React from 'react';
import { useData } from '../context/DataContext.tsx';
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface IndustryDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const IndustryDetailPage: React.FC<IndustryDetailPageProps> = ({ slug, onNavigate }) => {
  const { getIndustryBySlug } = useData();
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Industry Not Found</h1>
        <button
          onClick={() => onNavigate('/industries')}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
        >
          Return to Industries
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      <button
        onClick={() => onNavigate('/industries')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Industries</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Sector Competency
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            {industry.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {industry.description}
          </p>

          {industry.stats && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm font-semibold text-blue-900 inline-block">
              {industry.stats}
            </div>
          )}

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('/request-manpower')}
              className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-colors inline-flex items-center gap-2"
            >
              <span>Deploy Crews for this Sector</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md bg-slate-100">
          <img
            src={industry.image || '/src/assets/images/service_industrial_construction_1790187524192.jpg'}
            alt={industry.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
