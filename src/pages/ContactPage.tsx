import React, { useState } from 'react';
import { useData } from '../context/DataContext.tsx';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileDown,
  Building,
  Navigation,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, getFormOptions } = useData();
  const inquiryOptions = getFormOptions('inquiry_type');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    inquiryType: inquiryOptions[0]?.value || 'workforce_deployment',
    subject: '',
    message: '',
  });

  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    submissionId?: string;
  } | null>(null);

  const validate = () => {
    const errors: { name?: string; email?: string; phone?: string; message?: string } = {};
    const missing: string[] = [];

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
      missing.push('Full Name');
    }

    if (!formData.email.trim()) {
      errors.email = 'Corporate email address is required';
      missing.push('Corporate Email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid corporate email format (e.g. name@company.com)';
      missing.push('Valid Corporate Email');
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Contact Phone / WhatsApp is required for mobilization dispatch';
      missing.push('Contact Phone / WhatsApp');
    } else if (formData.phone.trim().length < 7) {
      errors.phone = 'Please provide a valid phone number with country code (e.g. +966 50 123 4567)';
      missing.push('Valid Phone Number');
    }

    if (!formData.message.trim()) {
      errors.message = 'Please specify requirements, trade specialties, or deployment timeline';
      missing.push('Detailed Scope / Requirements');
    }

    setFieldErrors(errors);

    if (missing.length > 0) {
      setValidationWarning(
        `Please complete the mandatory fields before submitting: ${missing.join(', ')}.`
      );
      return false;
    }

    setValidationWarning(null);
    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (validationWarning) {
      setValidationWarning(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      const firstInvalid = document.querySelector('[data-has-error="true"]') as HTMLElement;
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitResult({
          success: true,
          message: data.message,
          submissionId: data.submissionId,
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          country: '',
          inquiryType: inquiryOptions[0]?.value || 'workforce_deployment',
          subject: '',
          message: '',
        });
        setFieldErrors({});
        setValidationWarning(null);
      } else {
        setSubmitResult({
          success: false,
          message: data.error || 'Failed to transmit message. Please review the form and retry.',
        });
      }
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: 'Network connection issue. Please check your internet and retry.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeGoogleMapsUrl =
    settings?.googleMapsUrl ||
    `https://maps.google.com/?q=${encodeURIComponent(
      settings?.address || '100 Bishopsgate London'
    )}`;

  const activeGoogleMapsEmbedUrl =
    settings?.googleMapsEmbedUrl ||
    `https://maps.google.com/maps?q=${encodeURIComponent(
      settings?.address || '100 Bishopsgate London'
    )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Direct Communications
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Connect with Our Mobilization Directorate
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Whether you require emergency shutdown crew mobilization, international tender bidding
          collaboration, or a master services agreement, our operations desks are available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
          {submitResult?.success ? (
            <div className="p-8 text-center space-y-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="font-display text-2xl font-bold text-emerald-950">
                Inquiry Successfully Logged
              </h2>
              <p className="text-sm text-emerald-800 leading-relaxed">
                {submitResult.message}
              </p>
              <div className="inline-block p-3 bg-white border border-emerald-300 rounded-lg text-xs font-mono text-emerald-900">
                Reference Code: <strong>{submitResult.submissionId}</strong>
              </div>
              <p className="text-xs text-emerald-700 pt-2">
                A confirmation has been sent to our corporate dispatch team. A dedicated deployment manager will reply within 4 business hours.
              </p>
              <button
                onClick={() => setSubmitResult(null)}
                className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Validation Warning Alert Banner */}
              {validationWarning && (
                <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl flex items-start gap-3 text-sm text-rose-900 shadow-sm animate-in fade-in-50">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-rose-950 text-xs uppercase tracking-wider">
                      Required Information Incomplete
                    </div>
                    <div className="text-xs leading-relaxed text-rose-800">
                      {validationWarning}
                    </div>
                  </div>
                </div>
              )}

              {submitResult && !submitResult.success && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-sm text-rose-800">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{submitResult.message}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div data-has-error={Boolean(fieldErrors.name)}>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eng. Tariq Al-Ghamdi"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-2.5 text-sm rounded-lg transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                      fieldErrors.name
                        ? 'border-2 border-rose-400 bg-rose-50/20 focus:ring-rose-400 focus:border-rose-500'
                        : 'bg-slate-50 border border-slate-300 focus:ring-blue-600 focus:border-transparent'
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.name}</p>
                  )}
                </div>

                <div data-has-error={Boolean(fieldErrors.email)}>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Corporate Email <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. t.alghamdi@contractor.com.sa"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-2.5 text-sm rounded-lg transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                      fieldErrors.email
                        ? 'border-2 border-rose-400 bg-rose-50/20 focus:ring-rose-400 focus:border-rose-500'
                        : 'bg-slate-50 border border-slate-300 focus:ring-blue-600 focus:border-transparent'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div data-has-error={Boolean(fieldErrors.phone)}>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Contact Phone / WhatsApp <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +966 50 123 4567 or +966 53 414 7351"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-2.5 text-sm rounded-lg transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                      fieldErrors.phone
                        ? 'border-2 border-rose-400 bg-rose-50/20 focus:ring-rose-400 focus:border-rose-500'
                        : 'bg-slate-50 border border-slate-300 focus:ring-blue-600 focus:border-transparent'
                    }`}
                  />
                  {fieldErrors.phone ? (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.phone}</p>
                  ) : (
                    <p className="mt-1 text-[11px] text-slate-500">
                      Include country code (Saudi Arabia: +966, UAE: +971, UK: +44)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Project / Operating Country
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Saudi Arabia (KSA), Jubail / Yanbu"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Nature of Inquiry <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    {inquiryOptions.length > 0 ? (
                      inquiryOptions.map((opt) => (
                        <option key={opt.id} value={opt.value}>
                          {opt.label}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="workforce_deployment">Workforce Deployment Inquiry</option>
                        <option value="headhunting">Technical & Executive Headhunting</option>
                        <option value="tender_bidding">Tender & Contract Bidding</option>
                        <option value="general">General Corporate Inquiries</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Subject Heading
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Structural Welder Crew Supply for Jubail Shutdown"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div data-has-error={Boolean(fieldErrors.message)}>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Detailed Scope / Requirements <span className="text-rose-500 font-bold">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Please specify estimated headcount, project location (e.g. Yanbu Industrial City, Jubail, NEOM, Ras Tanura), expected start date, and any trade certifications required..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className={`w-full px-4 py-2.5 text-sm rounded-lg transition-colors focus:bg-white focus:outline-none focus:ring-2 leading-relaxed ${
                    fieldErrors.message
                      ? 'border-2 border-rose-400 bg-rose-50/20 focus:ring-rose-400 focus:border-rose-500'
                      : 'bg-slate-50 border border-slate-300 focus:ring-blue-600 focus:border-transparent'
                  }`}
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isSubmitting ? (
                  <span>Transmitting Requisition...</span>
                ) : (
                  <>
                    <span>Submit Official Inquiry</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Contact Details, Map Link & Company Profile Download */}
        <div className="lg:col-span-5 space-y-8">
          {/* Main Headquarters Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-7 sm:p-8 space-y-6 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-400" />
                <span>Global Operations Center</span>
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded">
                24/7 Desk
              </span>
            </div>

            <div className="space-y-5 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Address</div>
                  <div className="text-white font-medium text-sm leading-snug">
                    {settings?.address || '100 Bishopsgate, Level 24, London EC2N 4AG, United Kingdom'}
                  </div>
                  {activeGoogleMapsUrl && (
                    <a
                      href={activeGoogleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 pt-0.5 font-semibold group"
                    >
                      <Navigation className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Direct Phone</div>
                  <a
                    href={`tel:${settings?.phone || '+442079460920'}`}
                    className="text-white font-medium hover:text-blue-400 transition-colors mt-0.5 block"
                  >
                    {settings?.phone || '+44 20 7946 0920'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Corporate Email</div>
                  <a
                    href={`mailto:${settings?.email || 'contact@equipworkforce.com'}`}
                    className="text-white font-medium hover:text-blue-400 transition-colors mt-0.5 block"
                  >
                    {settings?.email || 'contact@equipworkforce.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Operating Hours</div>
                  <div className="text-slate-300 mt-0.5 text-xs leading-relaxed">
                    {settings?.businessHours || 'Monday - Friday: 08:00 - 18:00 GMT (24/7 Critical Deployment)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map Preview Box */}
            <div className="pt-2">
              <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 relative">
                <iframe
                  title="Google Maps Location"
                  src={activeGoogleMapsEmbedUrl}
                  className="w-full h-full border-0 filter contrast-105"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute bottom-2 right-2">
                  <a
                    href={activeGoogleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900/90 hover:bg-blue-600 backdrop-blur-xs rounded shadow border border-white/20 flex items-center gap-1 transition-colors"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Company Profile PDF Download Card */}
          {settings?.companyProfilePdfUrl && (
            <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-6 space-y-3 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileDown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Download Corporate Capability Profile
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Get our complete credentials, trade testing accreditations, deployment timelines, and service catalogs in printable PDF format.
                  </p>
                </div>
              </div>
              <div className="pt-1">
                <a
                  href={settings.companyProfilePdfUrl}
                  download={settings.companyProfilePdfName || 'EquipWorkforce_Company_Profile.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download Profile PDF ({settings.companyProfilePdfName || 'EquipWorkforce.pdf'})</span>
                </a>
              </div>
            </div>
          )}

          {/* SLA Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-display text-base font-bold text-slate-900">
              Commercial SLA Commitments
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Response to technical staffing requests within 4 operational hours</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Formal wage rate & compliance tariff delivered within 24 hours</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Confidentiality guaranteed under signed mutual NDA upon request</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
