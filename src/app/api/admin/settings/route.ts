import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteContent, getSiteData, getSiteTheme, getStorageStatus, updateSiteSettings } from "@/lib/storage";
import { z } from "zod";

const highlightSchema = z.object({
  label: z.string().min(1).max(60),
  value: z.string().min(1).max(120),
});

const serviceItemSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(300),
});

const processStepSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(300),
});

const contentSchema = z.object({
  general: z.object({
    siteName: z.string().min(1).max(80),
  }),
  hero: z.object({
    eyebrow: z.string().min(1).max(80),
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(500),
    primaryButton: z.string().min(1).max(40),
    secondaryButton: z.string().min(1).max(40),
    backgroundImage: z.string().url(),
  }),
  about: z.object({
    label: z.string().min(1).max(40),
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(1000),
    imageUrl: z.string().min(1).max(500),
    highlights: z.array(highlightSchema).length(4),
  }),
  services: z.object({
    label: z.string().min(1).max(40),
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(300),
    items: z.array(serviceItemSchema).length(3),
  }),
  portfolio: z.object({
    label: z.string().min(1).max(40),
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(300),
  }),
  contact: z.object({
    label: z.string().min(1).max(40),
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(300),
    email: z.string().email(),
    phone: z.string().min(3).max(30),
    location: z.string().min(1).max(120),
  }),
  process: z.object({
    label: z.string().min(1).max(40),
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(300),
    steps: z.array(processStepSchema).length(4),
  }),
  footer: z.object({
    description: z.string().min(1).max(200),
  }),
});

const themeSchema = z.object({
  background: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  surface: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  surfaceWarm: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  backgroundDark: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  foreground: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  foregroundLight: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  muted: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accentWarm: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

const settingsSchema = z.object({
  content: contentSchema.optional(),
  theme: themeSchema.optional(),
});

export async function GET() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [content, theme, data, storage] = await Promise.all([
    getSiteContent(),
    getSiteTheme(),
    getSiteData(),
    getStorageStatus(),
  ]);

  return NextResponse.json({
    content,
    theme,
    messages: data.messages,
    storage,
    storageConfigured: storage.persistent,
  });
}

export async function PUT(request: Request) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = settingsSchema.parse(await request.json());
    const result = await updateSiteSettings(payload);

    const [content, theme, storage] = await Promise.all([
      getSiteContent(),
      getSiteTheme(),
      getStorageStatus(),
    ]);

    return NextResponse.json({ content, theme, storage, ...result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Invalid settings data" },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Unable to save settings" }, { status: 500 });
  }
}
