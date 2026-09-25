import React from 'react';
import { useData } from '../../context/DataContext.tsx';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
  Shield,
  CheckCircle2,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, services, industries } = useData();

  const handleNav = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              {settings?.footerLogoUrl || settings?.logoUrl ? (
                <img
                  src={settings.footerLogoUrl || settings.logoUrl}
                  alt={settings?.companyName || 'Brand Logo'}
                  className="h-10 w-auto max-w-[180px] object-contain rounded bg-white/5 p-1 border border-white/10"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                    const fallback = document.getElementById('footer-logo-fallback');
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                id="footer-logo-fallback"
                style={{ display: settings?.footerLogoUrl || settings?.logoUrl ? 'none' : 'flex' }}
                className="w-9 h-9 rounded-lg bg-blue-600 items-center justify-center text-white font-bold text-lg"
              >
                {settings?.companyName
                  ? settings.companyName
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((w: string) => w[0])
                      .join('')
                      .toUpperCase()
                  : 'EW'}
              </div>
              <span className="font-display text-xl font-bold text-white tracking-tight">
                {settings?.companyName || 'EquipWorkforce Global'}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              {settings?.footerBio ||
                settings?.description ||
                'International manpower supply and technical staffing solutions for mega-scale industrial, engineering, and offshore construction projects.'}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Shield className="w-4 h-4 text-blue-400" />
                {settings?.footerComplianceBadges || 'ISO 9001:2015 & ISO 45001 Certified · Zero-Harm HSE Standards'}
              </span>
            </div>

            {settings?.companyProfilePdfUrl && (
              <div className="pt-1">
                <a
                  href={settings.companyProfilePdfUrl}
                  download={settings.companyProfilePdfName || 'EquipWorkforce_Company_Profile.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-blue-600/90 border border-slate-700 hover:border-blue-500 rounded-lg transition-all group shadow-xs"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                  <span>Download Company Profile (PDF)</span>
                </a>
              </div>
            )}
          </div>

          {/* Column 2: Core Solutions */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              {settings?.footerQuickLinksTitle || 'Workforce Solutions'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <button
                    onClick={() => handleNav(`/services/${service.slug}`)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleNav('/services')}
                  className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 text-xs font-semibold pt-1"
                >
                  <span>All Solutions</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Industries */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              {settings?.footerIndustriesTitle || 'Industries Served'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {industries.slice(0, 5).map((ind) => (
                <li key={ind.id}>
                  <button
                    onClick={() => handleNav(`/industries/${ind.slug}`)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {ind.title}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleNav('/industries')}
                  className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 text-xs font-semibold pt-1"
                >
                  <span>Explore Sectors</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Operations */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              {settings?.footerContactTitle || 'Operational Contacts'}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-slate-300">
                  {settings?.address || '100 Bishopsgate, Level 24, London EC2N 4AG'}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`tel:${settings?.phone || '+442079460920'}`}
                  className="hover:text-white transition-colors text-xs text-slate-300"
                >
                  {settings?.phone || '+44 20 7946 0920'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`mailto:${settings?.email || 'contact@equipworkforce.com'}`}
                  className="hover:text-white transition-colors text-xs text-slate-300"
                >
                  {settings?.email || 'contact@equipworkforce.com'}
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-400 leading-relaxed">
                  {settings?.businessHours || 'Mon - Fri: 08:00 - 18:00 GMT'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Legal */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{settings?.footerCopyrightText || `© ${new Date().getFullYear()} ${settings?.companyName || 'EquipWorkforce Solutions'}. All rights reserved.`}</p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav('/privacy-policy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNav('/terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms of Engagement
            </button>
            <button
              onClick={() => handleNav('/admin/login')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
