import React from 'react';
import { useData } from '../context/DataContext.tsx';
import { ArrowRight, CheckCircle2, Shield, Wrench } from 'lucide-react';

interface WorkforcePageProps {
  onNavigate: (path: string) => void;
}

export const WorkforcePage: React.FC<WorkforcePageProps> = ({ onNavigate }) => {
  const { workforceCategories } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Trade Competency & Skills
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Workforce & Trade Categories
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Every category represents verified, trade-tested personnel holding recognized
          credentials. Our vetting process eliminates project delays by ensuring all deployed
          tradesmen are productive on day one.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {workforceCategories.map((cat) => {
          let skills: string[] = [];
          try {
            skills = typeof cat.skills === 'string' ? JSON.parse(cat.skills) : (cat.skills || []);
          } catch (e) {
            skills = [];
          }

          let related: string[] = [];
          try {
            related = typeof cat.relatedIndustries === 'string' ? JSON.parse(cat.relatedIndustries) : (cat.relatedIndustries || []);
          } catch (e) {
            related = [];
          }

          return (
            <div
              key={cat.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="h-56 relative overflow-hidden bg-slate-100">
                  <img
                    src={cat.image || '/src/assets/images/service_technical_logistics_1790187537100.jpg'}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <h2 className="font-display text-2xl font-bold text-slate-900">
                    {cat.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>

                  {cat.experienceInfo && (
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700">
                      <span className="font-semibold text-slate-900">Experience Profile: </span>
                      {cat.experienceInfo}
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                        Verified Competencies
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 mt-6 flex items-center justify-between">
                <button
                  onClick={() => onNavigate(`/workforce/${cat.slug}`)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                >
                  <span>Full Trade Standards</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('/request-manpower')}
                  className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Requisition Personnel
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
