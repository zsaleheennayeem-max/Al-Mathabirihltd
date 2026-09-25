import React, { useState } from 'react';
import { useData } from '../context/DataContext.tsx';
import {
  Users,
  CheckCircle2,
  Calendar,
  Building,
  HardHat,
  ArrowRight,
  ArrowLeft,
  Send,
  AlertCircle,
} from 'lucide-react';

export const RequestManpowerPage: React.FC = () => {
  const { services, workforceCategories, getFormOptions } = useData();

  const durationOptions = getFormOptions('duration');
  const experienceOptions = getFormOptions('experience');
  const contactMethodOptions = getFormOptions('contact_method');

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    service: services[0]?.title || 'Industrial & Heavy Civil Construction Manpower',
    manpowerCategory: workforceCategories[0]?.title || 'Certified Welders & Structural Fabricators',
    workerCount: 10,
    startDate: '',
    duration: durationOptions[0]?.value || '6 - 12 Months',
    skills: '',
    experience: experienceOptions[1]?.value || '3 - 5 Years Experience',
    reqAccommodation: true,
    reqTransport: true,
    reqFood: true,
    otherReqs: '',
    preferredContact: contactMethodOptions[0]?.value || 'email',
  });

  // In-UI validation states (no window.alert, visible inline errors)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    requestNumber?: string;
  } | null>(null);

  const updateFormField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (validationWarning) {
      setValidationWarning(null);
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company / contractor name is required.';
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person or project coordinator is required.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Official corporate email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid corporate email (e.g. t.alghamdi@contractor.com.sa).';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Direct telephone or mobile number is required.';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Deployment country is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setValidationWarning('Please fill in all mandatory fields highlighted in red below to proceed.');
      // Auto-focus on the first field with an error
      const firstField = Object.keys(newErrors)[0];
      const el = document.getElementById(`field-${firstField}`);
      if (el) {
        el.focus();
      }
      return false;
    }

    setValidationWarning(null);
    return true;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.workerCount || Number(formData.workerCount) < 1) {
      newErrors.workerCount = 'Required headcount must be at least 1 specialist.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setValidationWarning('Please check the requirements highlighted in red below.');
      return false;
    }

    setValidationWarning(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep1()) {
      setStep(1);
      return;
    }
    if (!validateStep2()) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch('/api/public/manpower-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitResult({
          success: true,
          message: data.message,
          requestNumber: data.requestNumber,
        });
      } else {
        setSubmitResult({
          success: false,
          message: data.error || 'Failed to submit manpower requisition.',
        });
      }
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: 'Network error. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Enterprise Requisition Desk
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Request Workforce Deployment
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Specify your headcount, trade qualifications, and operational parameters. Our technical
          staffing coordinators will formulate a customized mobilization plan and wage rate tariff.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
        <div
          className={`p-3 rounded-lg border text-xs sm:text-sm font-semibold transition-colors ${
            step >= 1
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          1. Company Details
        </div>
        <div
          className={`p-3 rounded-lg border text-xs sm:text-sm font-semibold transition-colors ${
            step >= 2
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          2. Workforce Scope
        </div>
        <div
          className={`p-3 rounded-lg border text-xs sm:text-sm font-semibold transition-colors ${
            step >= 3
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          3. Camp & Logistics
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
        {submitResult?.success ? (
          <div className="p-8 sm:p-12 text-center space-y-5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-emerald-950">
              Requisition Registered
            </h2>
            <p className="text-sm sm:text-base text-emerald-800 leading-relaxed max-w-xl mx-auto">
              {submitResult.message}
            </p>
            <div className="p-4 bg-white border border-emerald-300 rounded-lg inline-block text-sm font-mono text-emerald-950 font-bold">
              Requisition Dossier ID: {submitResult.requestNumber}
            </div>
            <p className="text-xs text-emerald-700 max-w-lg mx-auto">
              Our mobilization logistics director will contact you via {formData.preferredContact} to verify trade specifications and submit commercial rates.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitResult(null);
                  setStep(1);
                }}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
              >
                Submit Additional Requisition
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {submitResult && !submitResult.success && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-sm text-rose-800">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{submitResult.message}</span>
              </div>
            )}

            {/* STEP 1: Company Profile */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    Step 1: Client & Project Organization
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Fields marked with <span className="text-rose-600 font-bold">*</span> are required
                  </span>
                </div>

                {validationWarning && (
                  <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl border-y border-r border-amber-200 flex items-start gap-3 text-sm text-amber-950 shadow-xs animate-in fade-in duration-200">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-amber-900">Required Information Incomplete</div>
                      <p className="text-xs text-amber-800 mt-0.5">{validationWarning}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Company / Contractor Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="field-companyName"
                      type="text"
                      placeholder="e.g. Saudi Aramco, SABIC, Nesma & Partners"
                      value={formData.companyName}
                      onChange={(e) => updateFormField('companyName', e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm rounded-lg transition-all focus:outline-none ${
                        errors.companyName
                          ? 'bg-rose-50/40 border-2 border-rose-500 text-slate-900 focus:ring-2 focus:ring-rose-400/50'
                          : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-600'
                      }`}
                    />
                    {errors.companyName && (
                      <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1.5 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.companyName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Project Coordinator / Contact Person <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="field-contactPerson"
                      type="text"
                      placeholder="e.g. Eng. Tariq Al-Ghamdi (Procurement Lead)"
                      value={formData.contactPerson}
                      onChange={(e) => updateFormField('contactPerson', e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm rounded-lg transition-all focus:outline-none ${
                        errors.contactPerson
                          ? 'bg-rose-50/40 border-2 border-rose-500 text-slate-900 focus:ring-2 focus:ring-rose-400/50'
                          : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-600'
                      }`}
                    />
                    {errors.contactPerson && (
                      <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1.5 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.contactPerson}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Official Email <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="field-email"
                      type="email"
                      placeholder="e.g. t.alghamdi@contractor.com.sa"
                      value={formData.email}
                      onChange={(e) => updateFormField('email', e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm rounded-lg transition-all focus:outline-none ${
                        errors.email
                          ? 'bg-rose-50/40 border-2 border-rose-500 text-slate-900 focus:ring-2 focus:ring-rose-400/50'
                          : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-600'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1.5 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Direct Telephone / Mobile <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="field-phone"
                      type="tel"
                      placeholder="e.g. +966 50 123 4567"
                      value={formData.phone}
                      onChange={(e) => updateFormField('phone', e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm rounded-lg transition-all focus:outline-none ${
                        errors.phone
                          ? 'bg-rose-50/40 border-2 border-rose-500 text-slate-900 focus:ring-2 focus:ring-rose-400/50'
                          : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-600'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1.5 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Deployment Country <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="field-country"
                      type="text"
                      placeholder="e.g. Saudi Arabia (KSA)"
                      value={formData.country}
                      onChange={(e) => updateFormField('country', e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm rounded-lg transition-all focus:outline-none ${
                        errors.country
                          ? 'bg-rose-50/40 border-2 border-rose-500 text-slate-900 focus:ring-2 focus:ring-rose-400/50'
                          : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-600'
                      }`}
                    />
                    {errors.country && (
                      <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1.5 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.country}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Project Site / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Yanbu Industrial City, Jubail, NEOM, Ras Tanura, Riyadh"
                      value={formData.city}
                      onChange={(e) => updateFormField('city', e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) {
                        setStep(2);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }
                    }}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-lg inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Proceed to Workforce Scope</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Workforce Requirements */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    Step 2: Technical Workforce Specifications
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Configure headcount, duration, and trade qualifications
                  </span>
                </div>

                {validationWarning && (
                  <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl border-y border-r border-amber-200 flex items-start gap-3 text-sm text-amber-950 shadow-xs animate-in fade-in duration-200">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-amber-900">Specification Incomplete</div>
                      <p className="text-xs text-amber-800 mt-0.5">{validationWarning}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Solution Domain *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => updateFormField('service', e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Primary Trade Category *
                    </label>
                    <select
                      value={formData.manpowerCategory}
                      onChange={(e) => updateFormField('manpowerCategory', e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {workforceCategories.map((w) => (
                        <option key={w.id} value={w.title}>
                          {w.title}
                        </option>
                      ))}
                      <option value="Multi-Discipline Turnkey Crew">Multi-Discipline Turnkey Crew</option>
                      <option value="Other Custom Trade Discipline">Other Custom Trade Discipline</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Required Headcount <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="field-workerCount"
                      type="number"
                      min={1}
                      max={2000}
                      value={formData.workerCount}
                      onChange={(e) => updateFormField('workerCount', Number(e.target.value))}
                      className={`w-full px-4 py-2.5 text-sm rounded-lg transition-all focus:outline-none font-semibold ${
                        errors.workerCount
                          ? 'bg-rose-50/40 border-2 border-rose-500 text-slate-900 focus:ring-2 focus:ring-rose-400/50'
                          : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-600'
                      }`}
                    />
                    {errors.workerCount && (
                      <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1.5 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.workerCount}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Estimated Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateFormField('startDate', e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Contract Duration
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => updateFormField('duration', e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {durationOptions.length > 0 ? (
                        durationOptions.map((opt) => (
                          <option key={opt.id} value={opt.value}>
                            {opt.label}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="1 - 3 Months (Shutdown / Turnaround)">1 - 3 Months (Shutdown / Turnaround)</option>
                          <option value="3 - 6 Months">3 - 6 Months</option>
                          <option value="6 - 12 Months">6 - 12 Months</option>
                          <option value="12+ Months (Long-Term Framework)">12+ Months (Long-Term Framework)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Minimum Experience Requirement
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => updateFormField('experience', e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {experienceOptions.length > 0 ? (
                        experienceOptions.map((opt) => (
                          <option key={opt.id} value={opt.value}>
                            {opt.label}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="1 - 3 Years Experience">1 - 3 Years (Junior / Semi-Skilled)</option>
                          <option value="3 - 5 Years Experience">3 - 5 Years (Certified Skilled Trades)</option>
                          <option value="5 - 10 Years Experience">5 - 10 Years (Senior Specialist / Lead)</option>
                          <option value="10+ Years Experience">10+ Years (Supervisory & Executive)</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Key Technical Credentials / Codes Needed
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6G TIG ASME IX, Saudi Aramco Approved Welder, Heavy Crane Operator 100T+, BOSIET Offshore"
                      value={formData.skills}
                      onChange={(e) => updateFormField('skills', e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep2()) {
                        setStep(3);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }
                    }}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-lg inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Proceed to Camp & Logistics</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Camp, Logistics & Submission */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="font-display text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Step 3: Camp Welfare, Transit & Commercial Coordination
                </h3>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Ancillary Logistics Provided by EquipWorkforce:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="flex items-center gap-3 p-3.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={formData.reqAccommodation}
                        onChange={(e) => setFormData({ ...formData, reqAccommodation: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-xs font-medium text-slate-800">Worker Accommodation</span>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={formData.reqTransport}
                        onChange={(e) => setFormData({ ...formData, reqTransport: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-xs font-medium text-slate-800">Daily Site Transit Bus</span>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={formData.reqFood}
                        onChange={(e) => setFormData({ ...formData, reqFood: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-xs font-medium text-slate-800">Catering / Camp Meals</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Preferred Mode of Commercial Communication
                  </label>
                  <select
                    value={formData.preferredContact}
                    onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {contactMethodOptions.length > 0 ? (
                      contactMethodOptions.map((opt) => (
                        <option key={opt.id} value={opt.value}>
                          {opt.label}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="email">Official Corporate Email with PDF Tariff</option>
                        <option value="phone">Direct Call from Regional Mobilization Director</option>
                        <option value="whatsapp">Encrypted WhatsApp Procurement Chat</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Additional Site Notes or Tender References
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Include tender deadlines, shift rota requirements (e.g. 10hr shifts, 6 days/week), client site induction rules..."
                    value={formData.otherReqs}
                    onChange={(e) => setFormData({ ...formData, otherReqs: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow-md transition-all inline-flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Formulating Requisition...</span>
                    ) : (
                      <>
                        <span>Submit Manpower Requisition</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
