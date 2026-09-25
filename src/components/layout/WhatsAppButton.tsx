import React from 'react';
import { useData } from '../../context/DataContext.tsx';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useData();

  if (!settings?.whatsapp) return null;

  const cleanNumber = settings.whatsapp.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(
    `Hello ${settings.companyName || 'EquipWorkforce'}, I am inquiring regarding manpower supply and workforce staffing solutions.`
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <aside aria-label="WhatsApp quick contact">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-semibold tracking-wide pr-1 hidden sm:inline-block">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  );
};
