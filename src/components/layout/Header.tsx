import React, { useState } from 'react';
import { useData } from '../../context/DataContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { ArrowUpRight, Menu, X, ShieldCheck, FileDown } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { settings } = useData();
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Services', path: '/services' },
    { label: 'Workforce', path: '/workforce' },
    { label: 'Industries', path: '/industries' },
    { label: 'Case Studies', path: '/portfolio' },
    { label: 'About', path: '/about' },
    { label: 'Insights', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  const brandName = settings?.companyName || 'EquipWorkforce';

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name.slice(0, 2) || 'EW').toUpperCase();
  };

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Brand Logo & Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 text-left group"
          >
            {settings?.logoUrl ? (
              <div className="flex items-center gap-2.5">
                <img
                  src={settings.logoUrl}
                  alt={brandName}
                  className="h-10 sm:h-12 w-auto max-w-[180px] sm:max-w-[220px] object-contain rounded-md"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                    const fallback = document.getElementById('header-logo-fallback');
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div
                  id="header-logo-fallback"
                  style={{ display: 'none' }}
                  className="w-10 h-10 rounded-lg bg-slate-900 items-center justify-center text-white font-bold text-lg tracking-tight group-hover:bg-blue-600 transition-colors"
                >
                  {getInitials(brandName)}
                </div>
                <span className="font-display text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors hidden sm:inline-block">
                  {brandName}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-lg tracking-tight group-hover:bg-blue-600 transition-colors">
                  {getInitials(brandName)}
                </div>
                <span className="font-display text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  {brandName}
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Zone 2: Navigation links with rich hover animation */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 relative whitespace-nowrap group ${
                  isActive
                    ? 'text-blue-600 font-semibold bg-blue-50/80 shadow-2xs'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/90 active:scale-95'
                }`}
              >
                <span className="relative z-10 transition-colors duration-200">{link.label}</span>
                <span
                  className={`absolute bottom-1 left-3 right-3 h-0.5 bg-blue-600 rounded-full transition-all duration-300 origin-center ${
                    isActive
                      ? 'scale-x-100 opacity-100'
                      : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Visitor Company Profile PDF Download Button */}
          {settings?.companyProfilePdfUrl && (
            <a
              href={settings.companyProfilePdfUrl}
              download={settings.companyProfilePdfName || 'EquipWorkforce_Company_Profile.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              title="Download Official Company Profile (PDF)"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 rounded-lg transition-all shadow-2xs whitespace-nowrap group"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-600 group-hover:translate-y-0.5 transition-transform" />
              <span className="hidden xl:inline">Company Profile</span>
              <span className="xl:hidden">Profile</span>
              <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold bg-blue-100 text-blue-700 rounded">
                PDF
              </span>
            </a>
          )}

          {isAdmin ? (
            <button
              onClick={() => handleNavClick('/admin')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              CMS Admin
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('/admin/login')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-2 transition-colors whitespace-nowrap"
            >
              Client / Admin
            </button>
          )}

          <button
            onClick={() => handleNavClick('/request-manpower')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg shadow-sm transition-all whitespace-nowrap hover:shadow"
          >
            <span>Request Manpower</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => handleNavClick('/request-manpower')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md whitespace-nowrap sm:hidden"
          >
            Requisition
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-md focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className="block w-full text-left px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('/request-manpower')}
              className="w-full py-3 text-center text-sm font-semibold text-white bg-blue-600 rounded-lg shadow"
            >
              Request Manpower
            </button>
            {settings?.companyProfilePdfUrl && (
              <a
                href={settings.companyProfilePdfUrl}
                download={settings.companyProfilePdfName || 'EquipWorkforce_Company_Profile.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <FileDown className="w-4 h-4 text-blue-600" />
                <span>Download Company Profile (PDF)</span>
              </a>
            )}
            <button
              onClick={() => handleNavClick('/admin')}
              className="w-full py-2.5 text-center text-sm font-medium text-slate-600 bg-slate-100 rounded-lg"
            >
              {isAdmin ? 'Admin Console' : 'Sign in to Portal'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
