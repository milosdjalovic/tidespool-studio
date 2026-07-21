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

export interface SiteData {
  portfolio: PortfolioItem[];
  messages: ContactMessage[];
}
