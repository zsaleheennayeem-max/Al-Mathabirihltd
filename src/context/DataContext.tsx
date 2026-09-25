import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  SiteSettings,
  Service,
  WorkforceCategory,
  Industry,
  PortfolioProject,
  BlogPost,
  Testimonial,
  FAQ,
  FormOption,
} from '../types/index.ts';
import {
  fallbackSettings,
  fallbackServices,
  fallbackWorkforceCategories,
  fallbackIndustries,
  fallbackPortfolio,
  fallbackBlogPosts,
  fallbackTestimonials,
  fallbackFaqs,
  fallbackFormOptions,
} from '../data/fallbackData.ts';

interface DataContextType {
  settings: SiteSettings | null;
  services: Service[];
  workforceCategories: WorkforceCategory[];
  industries: Industry[];
  portfolio: PortfolioProject[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  formOptions: FormOption[];
  loading: boolean;
  error: string | null;
  previewMode: boolean;
  dbConnected: boolean;
  refreshData: () => Promise<void>;
  getServiceBySlug: (slug: string) => Service | undefined;
  getWorkforceBySlug: (slug: string) => WorkforceCategory | undefined;
  getIndustryBySlug: (slug: string) => Industry | undefined;
  getPortfolioBySlug: (slug: string) => PortfolioProject | undefined;
  getBlogPostBySlug: (slug: string) => BlogPost | undefined;
  getFormOptions: (fieldName: string) => FormOption[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(fallbackSettings as any);
  const [services, setServices] = useState<Service[]>(fallbackServices as any);
  const [workforceCategories, setWorkforceCategories] = useState<WorkforceCategory[]>(fallbackWorkforceCategories as any);
  const [industries, setIndustries] = useState<Industry[]>(fallbackIndustries as any);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>(fallbackPortfolio as any);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(fallbackBlogPosts as any);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials as any);
  const [faqs, setFaqs] = useState<FAQ[]>(fallbackFaqs as any);
  const [formOptions, setFormOptions] = useState<FormOption[]>(fallbackFormOptions as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);

  const applyFavicon = (faviconUrl?: string) => {
    if (typeof document !== 'undefined' && faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/public/initial-data');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings || (fallbackSettings as any));
        applyFavicon(data.settings?.faviconUrl);
        setServices(data.services?.length ? data.services : (fallbackServices as any));
        setWorkforceCategories(data.workforceCategories?.length ? data.workforceCategories : (fallbackWorkforceCategories as any));
        setIndustries(data.industries?.length ? data.industries : (fallbackIndustries as any));
        setPortfolio(data.portfolio?.length ? data.portfolio : (fallbackPortfolio as any));
        setBlogPosts(data.blogPosts?.length ? data.blogPosts : (fallbackBlogPosts as any));
        setTestimonials(data.testimonials?.length ? data.testimonials : (fallbackTestimonials as any));
        setFaqs(data.faqs?.length ? data.faqs : (fallbackFaqs as any));
        setFormOptions(data.formOptions?.length ? data.formOptions : (fallbackFormOptions as any));
        setPreviewMode(Boolean(data.previewMode));
        setDbConnected(Boolean(data.dbConnected));
        setError(null);
      } else {
        // Fallback gracefully without throwing or crashing
        console.warn('API returned non-200. Serving fallback preview data.');
        setSettings(fallbackSettings as any);
        setServices(fallbackServices as any);
        setWorkforceCategories(fallbackWorkforceCategories as any);
        setIndustries(fallbackIndustries as any);
        setPortfolio(fallbackPortfolio as any);
        setBlogPosts(fallbackBlogPosts as any);
        setTestimonials(fallbackTestimonials as any);
        setFaqs(fallbackFaqs as any);
        setFormOptions(fallbackFormOptions as any);
        setPreviewMode(true);
        setDbConnected(false);
      }
    } catch (err: any) {
      console.warn('Data fetch error, using resilient preview fallback:', err);
      // Even if fetch fails completely, provide fallback data so the preview is intact
      setSettings(fallbackSettings as any);
      setServices(fallbackServices as any);
      setWorkforceCategories(fallbackWorkforceCategories as any);
      setIndustries(fallbackIndustries as any);
      setPortfolio(fallbackPortfolio as any);
      setBlogPosts(fallbackBlogPosts as any);
      setTestimonials(fallbackTestimonials as any);
      setFaqs(fallbackFaqs as any);
      setFormOptions(fallbackFormOptions as any);
      setPreviewMode(true);
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getServiceBySlug = (slug: string) => services.find((s) => s.slug === slug);
  const getWorkforceBySlug = (slug: string) => workforceCategories.find((w) => w.slug === slug);
  const getIndustryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
  const getPortfolioBySlug = (slug: string) => portfolio.find((p) => p.slug === slug);
  const getBlogPostBySlug = (slug: string) => blogPosts.find((b) => b.slug === slug);
  const getFormOptions = (key: string) =>
    formOptions
      .filter(
        (opt) =>
          (opt.fieldName === key ||
            opt.formType === key ||
            opt.fieldName.toLowerCase() === key.toLowerCase()) &&
          opt.isActive
      )
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <DataContext.Provider
      value={{
        settings,
        services,
        workforceCategories,
        industries,
        portfolio,
        blogPosts,
        testimonials,
        faqs,
        formOptions,
        loading,
        error,
        previewMode,
        dbConnected,
        refreshData: fetchData,
        getServiceBySlug,
        getWorkforceBySlug,
        getIndustryBySlug,
        getPortfolioBySlug,
        getBlogPostBySlug,
        getFormOptions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
