import React from 'react';
import { useData } from '../context/DataContext.tsx';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Shield,
  FileCheck,
  Award,
} from 'lucide-react';

interface ServiceDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug, onNavigate }) => {
  const { getServiceBySlug } = useData();
  const service = getServiceBySlug(slug);

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Workforce Solution Not Found</h1>
        <p className="text-sm text-slate-600">The requested service specification could not be located.</p>
        <button
          onClick={() => onNavigate('/services')}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
        >
          Return to Solutions Directory
        </button>
      </div>
    );
  }

  let benefits: string[] = [];
  try {
    benefits = typeof service.benefits === 'string' ? JSON.parse(service.benefits) : (service.benefits || []);
  } catch (e) {
    benefits = [];
  }

  let industries: string[] = [];
  try {
    industries = typeof service.industries === 'string' ? JSON.parse(service.industries) : (service.industries || []);
  } catch (e) {
    industries = [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/services')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Solutions</span>
      </button>

      {/* Main Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Enterprise Workforce Specification
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            {service.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {service.shortDesc}
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('/request-manpower')}
              className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
            >
              <span>Requisition Crew for This Solution</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-6 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Speak with Technical Coordinator
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md bg-slate-100">
          <img
            src={service.featuredImage || (service as any).image || '/src/assets/images/service_industrial_construction_1790187524192.jpg'}
            alt={service.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Deep Specification Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-slate-200">
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Operational Scope & Capabilities
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
              {service.fullDesc}
            </p>
          </div>

          {benefits.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Key Performance & Compliance Guarantees
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((b, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white border border-slate-200 rounded-xl flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 leading-relaxed font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Deployment Parameters
            </h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Mobilization Window:</span>
                <span className="font-semibold text-slate-900">14 – 21 Days</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Accreditation:</span>
                <span className="font-semibold text-slate-900">ISO 9001 / ISO 45001</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Replacement Guarantee:</span>
                <span className="font-semibold text-slate-900">100% within 72 hrs</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Medical Standards:</span>
                <span className="font-semibold text-slate-900">GAMCA / Offshore Fit</span>
              </div>
            </div>

            {industries.length > 0 && (
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-900 mb-2">Primary Sectors:</div>
                <div className="flex flex-wrap gap-1.5">
                  {industries.map((ind, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => onNavigate('/request-manpower')}
              className="w-full py-3 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-colors"
            >
              Initiate Manpower Requisition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
