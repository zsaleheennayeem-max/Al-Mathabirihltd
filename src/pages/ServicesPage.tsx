import React, { useState } from 'react';
import { useData } from '../context/DataContext.tsx';
import {
  ArrowRight,
  CheckCircle2,
  HardHat,
  Flame,
  Truck,
  Building2,
  Briefcase,
  Search,
} from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { services } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const getIcon = (name: string) => {
    switch (name) {
      case 'HardHat':
        return <HardHat className="w-5 h-5 text-blue-600" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-blue-600" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-blue-600" />;
      default:
        return <Briefcase className="w-5 h-5 text-blue-600" />;
    }
  };

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.shortDesc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
      {/* Header Banner */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Enterprise Workforce Capabilities
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Specialized Manpower Solutions
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          From heavy industrial civil construction to high-consequence offshore oil & gas
          shutdowns, our certified workforce solutions provide the technical velocity,
          compliance rigor, and safety discipline modern contractors demand.
        </p>

        {/* Search bar */}
        <div className="pt-4 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search solutions by discipline or sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredServices.map((service, index) => {
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
            <div
              key={service.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="h-60 relative overflow-hidden bg-slate-100">
                  <img
                    src={service.featuredImage || (service as any).image || '/src/assets/images/service_industrial_construction_1790187524192.jpg'}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                    {getIcon(service.icon)}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div className="text-xs text-slate-400 font-mono">SOLUTION 0{index + 1}</div>
                  <h2 className="font-display text-2xl font-bold text-slate-900">
                    {service.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Key Benefits */}
                  {benefits.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                        Operational Highlights
                      </div>
                      <ul className="space-y-2 text-xs text-slate-600">
                        {benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Related Industries */}
                  {industries.length > 0 && (
                    <div className="pt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">Industries:</span>
                      {industries.map((ind, i) => (
                        <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                          {ind}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 mt-6 flex items-center justify-between">
                <button
                  onClick={() => onNavigate(`/services/${service.slug}`)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                >
                  <span>Detailed Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('/request-manpower')}
                  className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Requisition Crew
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
