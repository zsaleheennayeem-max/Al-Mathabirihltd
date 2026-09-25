import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext.tsx';
import {
  Database,
  Mail,
  Server,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

export const PreviewSetupBanner: React.FC = () => {
  const { previewMode, dbConnected } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoadingStatus(true);
      const res = await fetch('/api/system/status');
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
      }
    } catch (e) {
      console.error('Failed to load system status:', e);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // If database is connected and not in preview mode, don't show the warning banner
  if (dbConnected && !previewMode) {
    return null;
  }

  return (
    <>
      {/* Top Banner (or collapsed pill if dismissed) */}
      {!bannerDismissed ? (
        <aside
          aria-label="Preview and environment status notice"
          className="bg-amber-500/10 border-b border-amber-500/20 text-slate-800 text-xs py-2 px-4 sticky top-0 z-50 backdrop-blur-md"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-left">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider">
                <Info className="w-3 h-3" />
                AI Studio Preview
              </span>
              <p className="text-slate-700 text-xs">
                Running in preview mode with fallback data. Production credentials (
                <code className="text-[11px] bg-amber-100/80 px-1 py-0.2 rounded font-mono text-amber-900">
                  DATABASE_URL
                </code>
                ,{' '}
                <code className="text-[11px] bg-amber-100/80 px-1 py-0.2 rounded font-mono text-amber-900">
                  SMTP_*
                </code>
                ) are not required for previewing the frontend.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  fetchStatus();
                  setModalOpen(true);
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-white border border-amber-300 hover:bg-amber-50 text-slate-800 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Server className="w-3.5 h-3.5 text-amber-600" />
                <span>Environment Setup & Status</span>
              </button>
              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                title="Minimize banner"
                aria-label="Minimize preview notice"
                className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      ) : (
        /* Floating mini badge when banner is minimized */
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="fixed bottom-4 left-4 z-40 bg-slate-900/90 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-lg border border-slate-700 backdrop-blur-md flex items-center gap-1.5 hover:bg-slate-800 transition-all hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Preview Mode (Setup Guide)</span>
        </button>
      )}

      {/* Setup Guide & Status Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="env-status-modal-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h2
                      id="env-status-modal-title"
                      className="font-display text-lg font-bold text-slate-900"
                    >
                      Environment & Integration Setup
                    </h2>
                    <p className="text-xs text-slate-500">
                      Live status of production integrations and preview fallback modes.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Preview Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Database Status */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-xs text-slate-900">
                    <Database className="w-4 h-4 text-blue-600" />
                    <span>PostgreSQL Database</span>
                  </div>
                  {systemStatus?.database?.connected ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <AlertTriangle className="w-3 h-3" /> Preview Data
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {systemStatus?.database?.connected
                    ? 'Connected to live PostgreSQL database. All operations and changes persist.'
                    : 'Running in preview mode with fallback seed data. All public pages, services, categories, and case studies are fully previewable.'}
                </p>
              </div>

              {/* SMTP Status */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-xs text-slate-900">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>SMTP Email Delivery</span>
                  </div>
                  {systemStatus?.smtp?.configured ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Configured
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      <Info className="w-3 h-3" /> Preview Logger
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {systemStatus?.smtp?.configured
                    ? `Live mailer active via ${systemStatus.smtp.host}.`
                    : 'Preview mode: Requisitions and contact inquiries log notification payloads to server logs without crashing.'}
                </p>
              </div>
            </div>

            {/* Production Configuration Guide */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Production Environment Variables (.env)
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `# Database Configuration (Hostinger VPS, Docker, or Cloud SQL)\nDATABASE_URL="postgresql://postgres:your_password@localhost:5432/equipworkforce?schema=public"\n\n# SMTP Email Delivery\nSMTP_HOST="smtp.hostinger.com"\nSMTP_PORT=587\nSMTP_USER="notifications@yourdomain.com"\nSMTP_PASSWORD="your_smtp_password"\nSMTP_FROM="EquipWorkforce <notifications@yourdomain.com>"`,
                      'all-env'
                    )
                  }
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {copiedKey === 'all-env' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto space-y-2 border border-slate-800">
                <div className="text-slate-400"># 1. PostgreSQL Database (Optional for Preview, Required for Prod)</div>
                <div>DATABASE_URL=&quot;postgresql://user:pass@host:5432/dbname?schema=public&quot;</div>
                <div className="text-slate-500"># Or discrete params: SQL_HOST, SQL_USER, SQL_PASSWORD, SQL_DB_NAME</div>
                <div className="pt-2 text-slate-400"># 2. SMTP Mailer (Optional for Preview, Required for Prod)</div>
                <div>SMTP_HOST=&quot;smtp.hostinger.com&quot;</div>
                <div>SMTP_PORT=587</div>
                <div>SMTP_USER=&quot;notifications@yourdomain.com&quot;</div>
                <div>SMTP_PASSWORD=&quot;your_smtp_password&quot;</div>
                <div>SMTP_FROM=&quot;EquipWorkforce &lt;notifications@yourdomain.com&gt;&quot;</div>
              </div>
            </div>

            {/* Recheck & Close actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={fetchStatus}
                disabled={loadingStatus}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
                <span>Recheck Connection</span>
              </button>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
              >
                Close & Continue Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
