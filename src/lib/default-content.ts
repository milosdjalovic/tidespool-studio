import type { SiteContent, SiteTheme } from "./types";

export const defaultTheme: SiteTheme = {
  background: "#f8f6f2",
  surface: "#ffffff",
  surfaceWarm: "#f0ebe3",
  backgroundDark: "#111110",
  foreground: "#1c1b19",
  foregroundLight: "#f8f6f2",
  muted: "#6f6a63",
  accentWarm: "#9a7b56",
};

export const defaultContent: SiteContent = {
  general: {
    siteName: "TideSpool Studios",
  },
  hero: {
    eyebrow: "Video & Photography Studio",
    title: "Visual stories that move people",
    description:
      "TideSpool Studios partners with brands and creators to produce cinematic video and photography with clarity, emotion, and purpose.",
    primaryButton: "View our work",
    secondaryButton: "Request a quote",
    backgroundImage:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=2400&q=80",
  },
  about: {
    label: "About Us",
    title: "A studio built on storytelling",
    description:
      "TideSpool Studios is more than just a video and photography business; we are a team of passionate creatives dedicated to bringing your vision to life. With a focus on storytelling, we work closely with clients to create impactful visual content that resonates with their audience.",
    imageUrl: "/images/about-camera.jpg",
    highlights: [
      { label: "Approach", value: "Collaborative, client-first direction" },
      { label: "Craft", value: "Cinematic quality in every deliverable" },
      { label: "Services", value: "Film, photography, and event coverage" },
      { label: "Availability", value: "Local projects and destination shoots" },
    ],
  },
  services: {
    label: "Services",
    title: "What we create for clients",
    description: "Three core offerings, each tailored to your goals, audience, and brand.",
    items: [
      {
        title: "Promotional Videos",
        description:
          "Brand films, product launches, and campaign content designed to capture attention and drive action.",
      },
      {
        title: "Event Coverage",
        description:
          "From corporate gatherings to live experiences, we document the energy and key moments that matter.",
      },
      {
        title: "Custom Photography",
        description:
          "Portrait, editorial, and commercial photography tailored to your brand voice and visual identity.",
      },
    ],
  },
  portfolio: {
    label: "Portfolio",
    title: "Selected work",
    description: "Browse recent video and photography projects. Click any piece to view it in full.",
  },
  process: {
    label: "Process",
    title: "How we work together",
    description: "A clear, collaborative path from first conversation to final delivery.",
    steps: [
      {
        title: "Discovery",
        description:
          "We learn your goals, audience, and creative direction to define the story we need to tell.",
      },
      {
        title: "Pre-Production",
        description:
          "Shot lists, locations, styling, and timelines are mapped out for a smooth production day.",
      },
      {
        title: "Production",
        description:
          "Our team captures video and photography with cinematic quality and attention to detail.",
      },
      {
        title: "Delivery",
        description:
          "Final edits, color, and exports optimized for web, social, presentations, and campaigns.",
      },
    ],
  },
  contact: {
    label: "Contact",
    title: "Start your project",
    description:
      "Tell us about your idea and we'll follow up with availability, timeline, and next steps.",
    email: "Stefan@tidespool.studio",
    phone: "760-333-7844",
    location: "Available for local and destination projects",
  },
  footer: {
    description: "Cinematic video and photography for brands, events, and creators.",
  },
};

export function mergeContent(content?: Partial<SiteContent> | null): SiteContent {
  if (!content) {
    return structuredClone(defaultContent);
  }

  const merged: SiteContent = {
    general: { ...defaultContent.general, ...content.general },
    hero: { ...defaultContent.hero, ...content.hero },
    about: {
      ...defaultContent.about,
      ...content.about,
      highlights: content.about?.highlights?.length
        ? content.about.highlights
        : defaultContent.about.highlights,
    },
    services: {
      ...defaultContent.services,
      ...content.services,
      items: content.services?.items?.length
        ? content.services.items
        : defaultContent.services.items,
    },
    portfolio: { ...defaultContent.portfolio, ...content.portfolio },
    process: {
      ...defaultContent.process,
      ...content.process,
      steps: content.process?.steps?.length
        ? content.process.steps
        : defaultContent.process.steps,
    },
    contact: { ...defaultContent.contact, ...content.contact },
    footer: { ...defaultContent.footer, ...content.footer },
  };

  merged.about.highlights = padArray(merged.about.highlights, defaultContent.about.highlights, 4);
  merged.services.items = padArray(merged.services.items, defaultContent.services.items, 3);
  merged.process.steps = padArray(merged.process.steps, defaultContent.process.steps, 4);

  return merged;
}

function padArray<T>(items: T[], fallback: T[], length: number): T[] {
  const padded = [...items];

  while (padded.length < length) {
    padded.push(fallback[padded.length] ?? fallback[fallback.length - 1]);
  }

  return padded.slice(0, length);
}

export function mergeTheme(theme?: Partial<SiteTheme> | null): SiteTheme {
  return { ...defaultTheme, ...theme };
}
