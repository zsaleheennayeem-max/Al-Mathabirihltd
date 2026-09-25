import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { ShieldCheck, LogIn, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onNavigateHome }) => {
  const { loginWithGoogle, loginDemoAdmin, loading } = useAuth();
  const { settings } = useData();
  const [error, setError] = useState<string | null>(null);

  const brandName = settings?.companyName || 'EquipWorkforce';

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication encountered an issue.');
    }
  };

  const handleDemoLogin = () => {
    loginDemoAdmin();
    onSuccess();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-lg space-y-8">
        <div className="text-center space-y-3">
          {settings?.logoUrl ? (
            <div className="flex justify-center mb-2">
              <img
                src={settings.logoUrl}
                alt={brandName}
                className="h-16 w-auto max-w-[220px] object-contain"
              />
            </div>
          ) : (
            <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center mx-auto text-xl font-bold font-display shadow">
              {brandName ? brandName.slice(0, 2).toUpperCase() : 'EW'}
            </div>
          )}
          <h1 className="font-display text-2xl font-extrabold text-slate-900">
            {brandName} Console
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Operations, Content Management & Requisition Portal.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 leading-relaxed">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-sm flex items-center justify-center gap-3 transition-colors disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Sign in with Authorized Google Account</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider">
              Or instant evaluation
            </span>
          </div>

          <button
            onClick={handleDemoLogin}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow flex items-center justify-center gap-2 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Enter Admin Dashboard (One-Click)</span>
          </button>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
