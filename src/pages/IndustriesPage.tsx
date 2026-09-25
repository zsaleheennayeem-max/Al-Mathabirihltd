import React from 'react';
import { useData } from '../context/DataContext.tsx';
import { ArrowRight, Building2, Flame, HardHat, Truck, Briefcase } from 'lucide-react';

interface IndustriesPageProps {
  onNavigate: (path: string) => void;
}

export const IndustriesPage: React.FC<IndustriesPageProps> = ({ onNavigate }) => {
  const { industries } = useData();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-blue-600" />;
      case 'HardHat':
        return <HardHat className="w-5 h-5 text-blue-600" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-blue-600" />;
      default:
        return <Building2 className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Industrial Sectors
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Industries We Power Worldwide
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Each industrial sector presents unique regulatory hurdles, specialized trade requirements,
          and zero-tolerance safety environments. Our vertical-specific teams deliver tailor-made
          staffing solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {industries.map((ind) => (
          <div
            key={ind.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="h-56 relative overflow-hidden bg-slate-100">
                <img
                  src={ind.image || '/src/assets/images/service_industrial_construction_1790187524192.jpg'}
                  alt={ind.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                  {getIcon(ind.icon)}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  {ind.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {ind.description}
                </p>

                {ind.stats && (
                  <div className="p-3 bg-blue-50/70 border border-blue-100/80 rounded-lg text-xs font-semibold text-blue-900">
                    {ind.stats}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 mt-6 flex items-center justify-between">
              <button
                onClick={() => onNavigate(`/industries/${ind.slug}`)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                <span>Industry Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('/request-manpower')}
                className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Request Sector Crew
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
