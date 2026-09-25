import React from 'react';
import { useData } from '../context/DataContext.tsx';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  HardHat,
  Flame,
  Truck,
  Building2,
  Briefcase,
  Award,
  Globe2,
  Clock,
  FileCheck,
  FileDown,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const {
    settings,
    services,
    workforceCategories,
    industries,
    portfolio,
    testimonials,
    blogPosts,
  } = useData();

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'HardHat':
        return <HardHat className="w-6 h-6" />;
      case 'Flame':
        return <Flame className="w-6 h-6" />;
      case 'Truck':
        return <Truck className="w-6 h-6" />;
      case 'Building2':
        return <Building2 className="w-6 h-6" />;
      default:
        return <Briefcase className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex flex-col justify-center bg-slate-950 text-white overflow-hidden">
        {/* Background Image with Dynamic Opacity and Balanced Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              settings?.heroBannerImage ||
              settings?.defaultOgImage ||
              '/src/assets/images/hero_workforce_logistics_1790187512878.jpg'
            }
            alt="International Workforce and Heavy Engineering Operations"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-opacity duration-300"
            style={{
              opacity: (Number(settings?.heroBannerOpacity) || 65) / 100,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-4xl lg:max-w-5xl space-y-6">
            {/* Kicker Pill Badge with Glowing Pulse */}
            <div>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-600/25 text-blue-300 border border-blue-500/30 shadow-2xs backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>{settings?.heroKicker || 'Accredited Workforce Supplier · ISO 9001 & ISO 45001'}</span>
              </div>
            </div>

            <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              {settings?.heroTitle || 'International Technical Manpower & Industrial Staffing Solutions'}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl font-normal">
              {settings?.heroSubtitle ||
                'Supplying turnkey, trade-tested, and certified workforce squads for civil mega-projects, oil & gas turnarounds, automated maritime ports, and critical infrastructure worldwide.'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={() => onNavigate(settings?.heroPrimaryCtaLink || '/request-manpower')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all whitespace-nowrap cursor-pointer active:scale-98"
              >
                <span>{settings?.heroPrimaryCtaText || 'Request Manpower Quotation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate(settings?.heroSecondaryCtaLink || '/services')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg backdrop-blur-sm transition-all whitespace-nowrap cursor-pointer shadow-sm active:scale-98"
              >
                <span>{settings?.heroSecondaryCtaText || 'Explore Services'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              {settings?.companyProfilePdfUrl && (
                <a
                  href={settings.companyProfilePdfUrl}
                  download={settings.companyProfilePdfName || 'EquipWorkforce_Company_Profile.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-600 hover:border-slate-500 rounded-lg backdrop-blur-sm transition-all whitespace-nowrap cursor-pointer shadow-sm group active:scale-98"
                >
                  <FileDown className="w-4 h-4 text-blue-400 group-hover:translate-y-0.5 transition-transform" />
                  <span>Download Profile (PDF)</span>
                </a>
              )}
            </div>

            {/* Quick Proof Metrics adjacent to Hero (Styled matching Admin Preview Cards) */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-left max-w-4xl">
              <div className="bg-slate-900/70 backdrop-blur-xs p-3.5 sm:p-4 rounded-xl border border-slate-800/90 hover:border-slate-700 transition-colors shadow-2xs">
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-blue-400 tabular-nums">
                  {settings?.heroStat1Value || '18,500+'}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                  {settings?.heroStat1Label || 'Specialists Deployed'}
                </div>
              </div>
              <div className="bg-slate-900/70 backdrop-blur-xs p-3.5 sm:p-4 rounded-xl border border-slate-800/90 hover:border-slate-700 transition-colors shadow-2xs">
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-blue-400 tabular-nums">
                  {settings?.heroStat2Value || '99.4%'}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                  {settings?.heroStat2Label || 'Trade Exam Pass Rate'}
                </div>
              </div>
              <div className="bg-slate-900/70 backdrop-blur-xs p-3.5 sm:p-4 rounded-xl border border-slate-800/90 hover:border-slate-700 transition-colors shadow-2xs">
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-blue-400 tabular-nums">
                  {settings?.heroStat3Value || '48-Hour'}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                  {settings?.heroStat3Label || 'Rapid Mobilization'}
                </div>
              </div>
              <div className="bg-slate-900/70 backdrop-blur-xs p-3.5 sm:p-4 rounded-xl border border-slate-800/90 hover:border-slate-700 transition-colors shadow-2xs">
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-blue-400 tabular-nums">
                  {settings?.heroStat4Value || '24/7'}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                  {settings?.heroStat4Label || 'Operations Desk'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORPORATE TRUST & COMPLIANCE BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-2 space-y-2">
              <ShieldCheck className="w-7 h-7 text-blue-600 mx-auto" />
              <div className="text-sm font-bold text-slate-900">Certified Trade Testing</div>
              <div className="text-xs text-slate-500">Accredited international test centers</div>
            </div>
            <div className="p-2 space-y-2 pt-6 md:pt-2">
              <Award className="w-7 h-7 text-blue-600 mx-auto" />
              <div className="text-sm font-bold text-slate-900">Zero-Harm HSE Standards</div>
              <div className="text-xs text-slate-500">NEBOSH & OSHA compliant teams</div>
            </div>
            <div className="p-2 space-y-2 pt-6 md:pt-2">
              <Globe2 className="w-7 h-7 text-blue-600 mx-auto" />
              <div className="text-sm font-bold text-slate-900">Bilateral Labor Quotas</div>
              <div className="text-xs text-slate-500">Full consular and visa sovereignty</div>
            </div>
            <div className="p-2 space-y-2 pt-6 md:pt-2">
              <Users className="w-7 h-7 text-blue-600 mx-auto" />
              <div className="text-sm font-bold text-slate-900">End-to-End Camp Welfare</div>
              <div className="text-xs text-slate-500">Air-conditioned transit & nutrition</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Specialized Solutions
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Workforce Services Engineered for Scale
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/services')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors self-start md:self-auto"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.slice(0, 4).map((service, index) => {
            let benefitsList: string[] = [];
            try {
              benefitsList = typeof service.benefits === 'string' ? JSON.parse(service.benefits) : (service.benefits || []);
            } catch (e) {
              benefitsList = [];
            }

            return (
              <div
                key={service.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
              >
                <div className="h-56 relative overflow-hidden bg-slate-100">
                  <img
                    src={service.featuredImage || (service as any).image || '/src/assets/images/service_industrial_construction_1790187524192.jpg'}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 p-2.5 bg-slate-900/90 text-white rounded-lg backdrop-blur-sm">
                    {getIconComponent(service.icon)}
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="text-xs text-slate-400 font-mono">0{index + 1}.</div>
                    <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  {benefitsList.length > 0 && (
                    <ul className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                      {benefitsList.slice(0, 3).map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => onNavigate(`/services/${service.slug}`)}
                      className="text-xs font-semibold text-slate-900 hover:text-blue-600 inline-flex items-center gap-1"
                    >
                      <span>Read Specifications</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigate('/request-manpower')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                      Requisition
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. WORKFORCE CATEGORIES SHOWCASE */}
      <section className="bg-slate-900 text-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-4">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Trade Competency Directory
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Vetted Workforce Across All Skill Tiers
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every candidate deployed by EquipWorkforce completes biometric health screening,
              trade competence tests, and host-nation safety inductions prior to site mobilization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workforceCategories.map((cat) => {
              let skillsList: string[] = [];
              try {
                skillsList = typeof cat.skills === 'string' ? JSON.parse(cat.skills) : (cat.skills || []);
              } catch (e) {
                skillsList = [];
              }

              return (
                <div
                  key={cat.id}
                  className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-6 flex flex-col justify-between hover:border-blue-500/50 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="h-36 rounded-lg overflow-hidden bg-slate-950">
                      <img
                        src={cat.image || (cat as any).featuredImage || '/src/assets/images/service_technical_logistics_1790187537100.jpg'}
                        alt={cat.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-display text-base font-bold text-white">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {cat.description}
                    </p>

                    {skillsList.length > 0 && (
                      <div className="pt-2 border-t border-slate-700/60">
                        <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Core Competencies
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {skillsList.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => onNavigate(`/workforce/${cat.slug}`)}
                      className="w-full py-2 text-center text-xs font-semibold text-slate-200 bg-slate-700/70 hover:bg-slate-700 hover:text-white rounded-lg transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <span>Category Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. HOW OUR PROCESS WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Operational Excellence
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            Precision 4-Stage Mobilization Process
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Eliminating candidate mismatch, compliance risk, and deployment delays with verified
            trade testing and transparent status reporting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 relative">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-display font-bold flex items-center justify-center text-base">
              01
            </div>
            <h3 className="font-display text-base font-bold text-slate-900">Requisition & Vetting</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We review your project bill of quantities, trade qualifications, and site compliance
              specifications to filter our verified talent pool.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 relative">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-display font-bold flex items-center justify-center text-base">
              02
            </div>
            <h3 className="font-display text-base font-bold text-slate-900">Trade Testing & Medical</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Candidates complete physical coupon welding tests, equipment simulations, and GAMCA /
              biometric medical examinations.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 relative">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-display font-bold flex items-center justify-center text-base">
              03
            </div>
            <h3 className="font-display text-base font-bold text-slate-900">Visas & Flights</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our consular logistics unit executes fast-track block visas, bilateral immigration
              approvals, and chartered or commercial transit.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 relative">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-display font-bold flex items-center justify-center text-base">
              04
            </div>
            <h3 className="font-display text-base font-bold text-slate-900">Site Induction & Care</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              On-site welfare officers manage accommodation, catering, PPE distribution, and tool-box
              safety compliance 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FEATURED CASE STUDIES / PORTFOLIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Proven Track Record
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              International Mega-Project Deployments
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/portfolio')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors self-start md:self-auto"
          >
            <span>All Case Studies</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolio.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className="h-52 relative overflow-hidden bg-slate-100">
                <img
                  src={proj.featuredImage || '/src/assets/images/service_industrial_construction_1790187524192.jpg'}
                  alt={proj.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-slate-900/90 text-white text-[11px] font-medium px-2.5 py-1 rounded backdrop-blur-sm">
                  {proj.location} · {proj.year}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-blue-600 font-semibold">{proj.industry}</div>
                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Client: {proj.client}</span>
                  <button
                    onClick={() => onNavigate(`/portfolio/${proj.slug}`)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="bg-slate-100 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Client Testimonials
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Trusted by Leading Global Contractors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-slate-200/80 rounded-xl p-8 shadow-sm space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {'★'.repeat(t.rating)}
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-1">
                  <div className="text-sm font-bold text-slate-900">{t.clientName}</div>
                  <div className="text-xs text-slate-500">
                    {t.clientRole}, <span className="font-medium text-slate-700">{t.clientCompany}</span>
                  </div>
                  {t.projectTitle && (
                    <div className="text-[11px] text-blue-600 font-semibold pt-1">
                      Project: {t.projectTitle}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LATEST INDUSTRY INSIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Market Intelligence
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Global Workforce Trends & Compliance
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/blog')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors self-start md:self-auto"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.slice(0, 2).map((post) => (
            <div
              key={post.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col sm:flex-row"
            >
              <div className="sm:w-1/2 h-56 sm:h-auto relative overflow-hidden bg-slate-100">
                <img
                  src={post.featuredImage || '/src/assets/images/about_global_workforce_1790187561296.jpg'}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="sm:w-1/2 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-blue-600">{post.category}</div>
                  <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{post.author}</span>
                  <button
                    onClick={() => onNavigate(`/blog/${post.slug}`)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    <span>Read Analysis</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FINAL REQUISITION CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 rounded-2xl p-8 sm:p-14 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4 text-center lg:text-left">
            <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
              Ready to Mobilize?
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Secure Accredited Technical Manpower for Your Next Project
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed font-normal">
              Speak directly with our technical mobilization directors. Receive a structured
              deployment timeline, wage schedule, and compliance prospectus within 24 hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <button
              onClick={() => onNavigate('/request-manpower')}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-blue-900 bg-white hover:bg-slate-100 rounded-lg shadow-md transition-colors text-center whitespace-nowrap"
            >
              Submit Manpower Requisition
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400 rounded-lg transition-colors text-center whitespace-nowrap"
            >
              Contact Operations Desk
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
