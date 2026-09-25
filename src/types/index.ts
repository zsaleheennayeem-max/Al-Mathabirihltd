export interface SiteSettings {
  id: number;
  companyName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl?: string;
  companyProfilePdfUrl?: string;
  companyProfilePdfName?: string;
  businessHours: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  logoUrl: string;
  darkLogoUrl: string;
  footerLogoUrl: string;
  faviconUrl: string;
  defaultSeoTitle: string;
  defaultSeoDesc: string;
  defaultOgImage: string;
  analyticsId: string;
  // Hero & First Banner Fields
  heroKicker?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroBannerImage?: string;
  heroBannerOpacity?: number;
  heroPrimaryCtaText?: string;
  heroPrimaryCtaLink?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaLink?: string;
  heroStat1Value?: string;
  heroStat1Label?: string;
  heroStat2Value?: string;
  heroStat2Label?: string;
  heroStat3Value?: string;
  heroStat3Label?: string;
  heroStat4Value?: string;
  heroStat4Label?: string;
  // Footer Editable Fields
  footerBio?: string;
  footerComplianceBadges?: string;
  footerCopyrightText?: string;
  footerQuickLinksTitle?: string;
  footerIndustriesTitle?: string;
  footerContactTitle?: string;
  updatedAt?: string;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  featuredImage: string;
  icon: string;
  benefits: string; // JSON string or array
  industries: string; // JSON string or array
  seoTitle?: string;
  seoDesc?: string;
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkforceCategory {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  skills: string; // JSON string or array
  experienceInfo?: string;
  relatedIndustries: string; // JSON string or array
  isFeatured: boolean;
  displayOrder: number;
  seoTitle?: string;
  seoDesc?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Industry {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  stats?: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioProject {
  id: number;
  title: string;
  slug: string;
  client: string;
  industry: string;
  location: string;
  year: string;
  description: string;
  featuredImage: string;
  gallery: string; // JSON string
  servicesProvided: string; // JSON string
  workforceCategories: string; // JSON string
  status: string;
  isFeatured: boolean;
  seoTitle?: string;
  seoDesc?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  category: string;
  tags: string; // JSON string
  seoTitle?: string;
  seoDesc?: string;
  canonicalUrl?: string;
  status: 'draft' | 'published' | 'scheduled';
  isFeatured: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: number;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  avatar?: string;
  quote: string;
  rating: number;
  projectTitle?: string;
  isFeatured: boolean;
  displayOrder: number;
  createdAt?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt?: string;
}

export interface ContactSubmission {
  id: number;
  submissionId: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  subject?: string;
  inquiryType: string;
  message: string;
  status: 'new' | 'read' | 'in_progress' | 'resolved' | 'archived';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ManpowerRequest {
  id: number;
  requestNumber: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  city?: string;
  service: string;
  manpowerCategory: string;
  workerCount: number;
  startDate?: string;
  duration?: string;
  skills?: string;
  experience?: string;
  reqAccommodation: boolean;
  reqTransport: boolean;
  reqFood: boolean;
  otherReqs?: string;
  preferredContact: string;
  status: 'new' | 'reviewing' | 'contacted' | 'quotation_sent' | 'approved' | 'completed' | 'rejected' | 'archived';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FormOption {
  id: number;
  formType: string;
  fieldName: string;
  label: string;
  value: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  altText?: string;
  title?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: number;
  userEmail: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalContactMessages: number;
  newContactMessages: number;
  totalManpowerRequests: number;
  newManpowerRequests: number;
  totalServices: number;
  totalBlogPosts: number;
  totalPortfolioProjects: number;
  recentContacts: ContactSubmission[];
  recentRequests: ManpowerRequest[];
}
