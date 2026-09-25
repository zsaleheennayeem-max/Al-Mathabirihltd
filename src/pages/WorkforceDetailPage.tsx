import React from 'react';
import { useData } from '../context/DataContext.tsx';
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, Wrench } from 'lucide-react';

interface WorkforceDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const WorkforceDetailPage: React.FC<WorkforceDetailPageProps> = ({ slug, onNavigate }) => {
  const { getWorkforceBySlug } = useData();
  const category = getWorkforceBySlug(slug);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Category Not Found</h1>
        <button
          onClick={() => onNavigate('/workforce')}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
        >
          Return to Workforce Directory
        </button>
      </div>
    );
  }

  let skills: string[] = [];
  try {
    skills = typeof category.skills === 'string' ? JSON.parse(category.skills) : (category.skills || []);
  } catch (e) {
    skills = [];
  }

  let related: string[] = [];
  try {
    related = typeof category.relatedIndustries === 'string' ? JSON.parse(category.relatedIndustries) : (category.relatedIndustries || []);
  } catch (e) {
    related = [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      <button
        onClick={() => onNavigate('/workforce')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Workforce Categories</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Verified Trade Qualification
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            {category.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {category.description}
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('/request-manpower')}
              className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
            >
              <span>Requisition {category.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-6 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Inquire Trade Assessment Process
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md bg-slate-100">
          <img
            src={category.image || '/src/assets/images/service_technical_logistics_1790187537100.jpg'}
            alt={category.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-slate-200">
        <div className="lg:col-span-8 space-y-8">
          {category.experienceInfo && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Trade Qualification & Experience Benchmark
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {category.experienceInfo}
              </p>
            </div>
          )}

          {skills.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Standard Verified Competencies
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((skill, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-sm font-medium text-slate-800">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Mobilization Protocols
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Testing Method:</span>
                <span className="font-semibold text-slate-900">Physical Coupon & Mock Lift</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Safety Passports:</span>
                <span className="font-semibold text-slate-900">OSHA / IOSH / NEBOSH</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Minimum Lead Time:</span>
                <span className="font-semibold text-slate-900">14 Business Days</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/request-manpower')}
              className="w-full py-3 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-colors"
            >
              Request Requisition Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
