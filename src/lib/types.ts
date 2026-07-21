export type PortfolioCategory = "promotional" | "event" | "photography";
export type PortfolioMediaType = "video" | "photo";

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: PortfolioMediaType;
  category: PortfolioCategory;
  mediaUrl: string;
  thumbnailUrl?: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface HighlightItem {
  label: string;
  value: string;
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface SiteContent {
  general: {
    siteName: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    backgroundImage: string;
  };
  about: {
    label: string;
    title: string;
    description: string;
    imageUrl: string;
    highlights: HighlightItem[];
  };
  services: {
    label: string;
    title: string;
    description: string;
    items: ServiceItem[];
  };
  portfolio: {
    label: string;
    title: string;
    description: string;
  };
  process: {
    label: string;
    title: string;
    description: string;
    steps: ProcessStep[];
  };
  contact: {
    label: string;
    title: string;
    description: string;
    email: string;
    phone: string;
    location: string;
  };
  footer: {
    description: string;
  };
}

export interface SiteTheme {
  background: string;
  surface: string;
  surfaceWarm: string;
  backgroundDark: string;
  foreground: string;
  foregroundLight: string;
  muted: string;
  accentWarm: string;
}

export interface SiteData {
  portfolio: PortfolioItem[];
  messages: ContactMessage[];
  content: SiteContent;
  theme: SiteTheme;
}

export interface SiteSettings {
  content: SiteContent;
  theme: SiteTheme;
}
