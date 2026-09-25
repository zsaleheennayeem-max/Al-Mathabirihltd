import React, { useState } from 'react';
import { useData } from '../context/DataContext.tsx';
import { ArrowRight, MapPin, Calendar, Building2, CheckCircle2 } from 'lucide-react';

interface PortfolioPageProps {
  onNavigate: (path: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onNavigate }) => {
  const { portfolio } = useData();
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const industryList = ['All', ...Array.from(new Set(portfolio.map((p) => p.industry)))];

  const filtered = selectedIndustry === 'All'
    ? portfolio
    : portfolio.filter((p) => p.industry === selectedIndustry);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Case Studies & Past Deployments
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Delivering Scale Across the Globe
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          From multi-billion dollar LNG processing terminals to automated deepwater port expansions,
          explore our verifiable deployment track record across complex engineering scopes.
        </p>

        {/* Filter buttons */}
        <div className="pt-4 flex flex-wrap gap-2">
          {industryList.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedIndustry === ind
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
          >
            <div>
              <div className="h-56 relative overflow-hidden bg-slate-100">
                <img
                  src={proj.featuredImage || (proj as any).image || '/src/assets/images/service_industrial_construction_1790187524192.jpg'}
                  alt={proj.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-sm">
                  {proj.status}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-blue-600">{proj.industry}</div>
                  <h2 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {proj.title}
                  </h2>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Client: {proj.client}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{proj.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{proj.year}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {proj.description}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
              <button
                onClick={() => onNavigate(`/portfolio/${proj.slug}`)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                <span>Read Full Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
