import React, { useState } from 'react';
import { useData } from '../context/DataContext.tsx';
import {
  ShieldCheck,
  Award,
  Globe2,
  Users,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  FileDown,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings, faqs } = useData();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="space-y-20 sm:space-y-28 py-16 sm:py-24">
      {/* 1. Header & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              About EquipWorkforce Global
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
              Precision Engineering & Accredited Technical Manpower
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Founded to eliminate the chronic risks of contractor staffing delays, candidate competency
              shortfalls, and complex cross-border visa compliance, EquipWorkforce serves as the trusted
              manpower delivery partner for tier-1 EPC contractors worldwide.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              With accredited testing academies in 4 international talent hubs and mobilization offices in
              London, Dubai, and Singapore, we deliver certified workforce squads with end-to-end camp
              logistics, medical clearances, and zero-compromise safety standards.
            </p>
          </div>

          <div className="lg:col-span-5 h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg bg-slate-100">
            <img
              src="/src/assets/images/about_global_workforce_1790187561296.jpg"
              alt="EquipWorkforce Global Team and Training Academy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. Pillars of Excellence */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Our Operational Pillars
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              The EquipWorkforce Quality Standard
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-8 space-y-4">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
              <h3 className="font-display text-xl font-bold text-white">
                Zero-Harm HSE Culture
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prior to mobilization, every technician completes mandatory behavioral safety inductions,
                hazard identification workshops, and stop-work authority training certified under NEBOSH
                and OSHA curricula.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-8 space-y-4">
              <Award className="w-8 h-8 text-blue-400" />
              <h3 className="font-display text-xl font-bold text-white">
                Empirical Trade Testing
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We never rely on resumes alone. 100% of tradesmen perform hands-on tests at our accredited
                technical centers—including x-ray weld testing, hydraulic pressure calibration, and heavy
                machinery simulation.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-8 space-y-4">
              <Users className="w-8 h-8 text-blue-400" />
              <h3 className="font-display text-xl font-bold text-white">
                Ethical Worker Welfare
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We strictly uphold the Dhaka Principles on Migration: zero recruitment fees charged to
                workers, guaranteed direct payroll, climate-controlled accommodations, and round-the-clock
                bilingual welfare officers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Accreditations & Certifications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Accreditations & Compliance
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            Globally Recognized Quality Systems
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-center space-y-2">
            <div className="text-lg font-bold text-slate-900 font-display">ISO 9001:2015</div>
            <div className="text-xs text-slate-500">Quality Management Systems</div>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-center space-y-2">
            <div className="text-lg font-bold text-slate-900 font-display">ISO 45001:2018</div>
            <div className="text-xs text-slate-500">Occupational Health & Safety</div>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-center space-y-2">
            <div className="text-lg font-bold text-slate-900 font-display">NEBOSH & OSHA</div>
            <div className="text-xs text-slate-500">Accredited Safety Syllabi</div>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-center space-y-2">
            <div className="text-lg font-bold text-slate-900 font-display">OPITO / BOSIET</div>
            <div className="text-xs text-slate-500">Offshore Marine Safety Standards</div>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Contractor Inquiries
          </div>
          <h2 className="font-display text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((faq) => (
            <div key={faq.id} className="py-5">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-center justify-between text-left text-base font-semibold text-slate-900 hover:text-blue-600 transition-colors"
              >
                <span>{faq.question}</span>
                {openFaq === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === faq.id && (
                <p className="mt-3 text-sm text-slate-600 leading-relaxed animate-in fade-in duration-200">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Requisition CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-2xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="font-display text-2xl font-bold text-white">
              Partner with EquipWorkforce on Your Next Build
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Request a confidential capability presentation, download our ISO accreditations, or submit a requisition.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {settings?.companyProfilePdfUrl && (
              <a
                href={settings.companyProfilePdfUrl}
                download={settings.companyProfilePdfName || 'EquipWorkforce_Company_Profile.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2"
              >
                <FileDown className="w-4 h-4 text-blue-400" />
                <span>Company Profile (PDF)</span>
              </a>
            )}
            <button
              onClick={() => onNavigate('/request-manpower')}
              className="px-6 py-3 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg whitespace-nowrap transition-colors shadow-sm"
            >
              Submit Requisition
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
