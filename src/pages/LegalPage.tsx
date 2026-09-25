import React from 'react';
import { useData } from '../context/DataContext.tsx';

interface LegalPageProps {
  type: 'privacy' | 'terms';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const { settings } = useData();
  const company = settings?.companyName || 'EquipWorkforce Global';

  if (type === 'privacy') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
          Privacy & Data Protection Policy
        </h1>
        <p className="text-xs text-slate-500">Effective Date: January 1, 2026 · GDPR & International Compliance</p>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 space-y-6">
          <p>
            {company} is committed to protecting the privacy and confidentiality of corporate clients,
            contractors, and workforce candidates. This policy outlines our collection, storage, and processing
            of information submitted via our enterprise website and client requisition portal.
          </p>

          <h2 className="text-lg font-bold text-slate-900 font-display">1. Information We Collect</h2>
          <p>
            We collect personal and corporate data provided voluntarily during communication, including:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Contractor corporate identity, commercial registration, and procurement officer contact details.</li>
            <li>Workforce candidate CVs, biometric medical fitness certifications, trade tickets, and passports.</li>
            <li>Project scopes, staffing bills of quantities, and site logistics parameters.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 font-display">2. Consular and Visa Processing</h2>
          <p>
            Workforce candidate personal data is transmitted securely to recognized government embassies,
            labor ministries, and GAMCA-approved clinics strictly for the issuance of legal work visas and
            bilateral labor compliance.
          </p>

          <h2 className="text-lg font-bold text-slate-900 font-display">3. Security & Cloud Safeguards</h2>
          <p>
            All submitted data is stored within encrypted relational databases protected by ISO 27001
            certified cloud infrastructure. We do not sell or monetize personal or commercial client data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8">
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
        Terms of Engagement & Service Framework
      </h1>
      <p className="text-xs text-slate-500">Last Revised: January 2026</p>

      <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 space-y-6">
        <p>
          These Terms of Engagement govern the requisition, trade testing, deployment, and on-site administration
          of technical workforce squads mobilized by {company}.
        </p>

        <h2 className="text-lg font-bold text-slate-900 font-display">1. Competency Warranty & 72-Hour Guarantee</h2>
        <p>
          Every deployed technician is verified against client trade testing requirements. If any deployed
          operative fails site induction or fails to meet certified trade competencies within the initial
          14-day warranty period, {company} guarantees a vetted replacement within 72 hours without mobilization charge.
        </p>

        <h2 className="text-lg font-bold text-slate-900 font-display">2. Zero-Harm HSE Protocols</h2>
        <p>
          Clients and site host contractors agree to maintain certified working conditions compliant with
          international standards (OSHA/NEBOSH). Deployed personnel retain full Stop-Work Authority in the
          event of imminent danger or unmitigated safety violations.
        </p>

        <h2 className="text-lg font-bold text-slate-900 font-display">3. Ethical Recruitment Compliance</h2>
        <p>
          In accordance with international ILO standards and the Dhaka Principles, no worker deployed by
          {company} has paid any recruitment fee, deposit, or placement charge.
        </p>
      </div>
    </div>
  );
};
