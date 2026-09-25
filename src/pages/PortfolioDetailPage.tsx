import React from 'react';
import { useData } from '../context/DataContext.tsx';
import { ArrowLeft, ArrowRight, MapPin, Calendar, Building2, CheckCircle2 } from 'lucide-react';

interface PortfolioDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const PortfolioDetailPage: React.FC<PortfolioDetailPageProps> = ({ slug, onNavigate }) => {
  const { getPortfolioBySlug } = useData();
  const proj = getPortfolioBySlug(slug);

  if (!proj) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Project Not Found</h1>
        <button
          onClick={() => onNavigate('/portfolio')}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
        >
          Return to Case Studies
        </button>
      </div>
    );
  }

  let servicesList: string[] = [];
  try {
    servicesList = typeof proj.servicesProvided === 'string' ? JSON.parse(proj.servicesProvided) : (proj.servicesProvided || []);
  } catch (e) {
    servicesList = [];
  }

  let categoriesList: string[] = [];
  try {
    categoriesList = typeof proj.workforceCategories === 'string' ? JSON.parse(proj.workforceCategories) : (proj.workforceCategories || []);
  } catch (e) {
    categoriesList = [];
  }

  let galleryList: string[] = [];
  try {
    if (Array.isArray(proj.gallery)) {
      galleryList = proj.gallery;
    } else if (typeof proj.gallery === 'string') {
      const trimmed = proj.gallery.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        galleryList = JSON.parse(trimmed);
      } else if (trimmed) {
        galleryList = [trimmed];
      }
    }
  } catch (e) {
    galleryList = proj.gallery ? [String(proj.gallery)] : [];
  }

  // If no additional gallery photos were provided, include the featured image
  if (galleryList.length === 0 && proj.featuredImage) {
    galleryList = [proj.featuredImage];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      <button
        onClick={() => onNavigate('/portfolio')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Case Studies</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            <span>{proj.industry}</span>
            <span>·</span>
            <span className="text-emerald-600 font-bold">{proj.status}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            {proj.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-xs text-slate-600 pt-2">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Client: <strong>{proj.client}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Location: <strong>{proj.location}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Tenure: <strong>{proj.year}</strong></span>
            </div>
          </div>

          <p className="text-base text-slate-600 leading-relaxed pt-2">
            {proj.description}
          </p>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('/request-manpower')}
              className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
            >
              <span>Deploy Similar Workforce Crew</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md bg-slate-100">
          <img
            src={proj.featuredImage || (proj as any).image || '/src/assets/images/service_industrial_construction_1790187524192.jpg'}
            alt={proj.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-slate-200">
        <div className="lg:col-span-8 space-y-8">
          {servicesList.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Services & Deployment Scope
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesList.map((srv, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-sm font-medium text-slate-800">{srv}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {galleryList.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Project Gallery
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {galleryList.map((img, i) => (
                  <div key={i} className="h-52 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={img}
                      alt={`Gallery ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Workforce Tiers Mobilized
            </h3>

            {categoriesList.length > 0 && (
              <div className="space-y-2">
                {categoriesList.map((cat, i) => (
                  <div key={i} className="text-xs bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-700 font-medium">
                    {cat}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => onNavigate('/request-manpower')}
              className="w-full py-3 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-colors"
            >
              Request Custom Project Quotation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
