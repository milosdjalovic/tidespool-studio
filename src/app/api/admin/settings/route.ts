import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { mergeContent, mergeTheme } from "@/lib/default-content";
import { getSiteContent, getSiteData, getSiteTheme, getStorageStatus, updateSiteSettings } from "@/lib/storage";
import { z } from "zod";

export const runtime = "nodejs";

const imageUrlSchema = z.string().min(1).max(500);

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
    backgroundImage: imageUrlSchema,
  }),
  about: z.object({
    label: z.string().min(1).max(40),
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(1000),
    imageUrl: imageUrlSchema,
    highlights: z.array(highlightSchema).min(4).max(4),
  }),
  services: z.object({
    label: z.string().min(1).max(40),
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(300),
    items: z.array(serviceItemSchema).min(3).max(3),
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
    steps: z.array(processStepSchema).min(4).max(4),
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

function formatValidationError(error: z.ZodError): string {
  const issue = error.issues[0];
  if (!issue) {
    return "Invalid settings data";
  }

  const field = issue.path.length ? issue.path.join(".") : "settings";
  return `${field}: ${issue.message}`;
}

async function safeStorageStatus() {
  try {
    return await getStorageStatus();
  } catch (error) {
    return {
      environment: "vercel" as const,
      backend: "memory-only" as const,
      persistent: false,
      blobEnvConfigured: hasBlobEnvConfiguredFallback(),
      blobConnectionOk: false,
      hasStoredData: false,
      blobPath: "tidespool/site-data.json",
      message:
        error instanceof Error
          ? `Storage check failed: ${error.message}`
          : "Storage check failed.",
    };
  }
}

function hasBlobEnvConfiguredFallback(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      process.env.VERCEL_OIDC_TOKEN,
  );
}

export async function GET() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [content, theme, data, storage] = await Promise.all([
    getSiteContent(),
    getSiteTheme(),
    getSiteData(),
    safeStorageStatus(),
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
    const raw = (await request.json()) as {
      content?: Parameters<typeof mergeContent>[0];
      theme?: Parameters<typeof mergeTheme>[0];
    };

    const payload = settingsSchema.parse({
      content: raw.content ? mergeContent(raw.content) : undefined,
      theme: raw.theme ? mergeTheme(raw.theme) : undefined,
    });

    const result = await updateSiteSettings(payload);

    const [content, theme, storage] = await Promise.all([
      getSiteContent(),
      getSiteTheme(),
      safeStorageStatus(),
    ]);

    return NextResponse.json({
      content,
      theme,
      storage,
      ...result,
      warning: result.persisted
        ? undefined
        : result.saveError ||
          "Saved in memory only. Connect Vercel Blob storage and redeploy for permanent saves.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: formatValidationError(error) }, { status: 400 });
    }

    console.error("Settings save failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message
            ? error.message
            : "Unable to save settings",
      },
      { status: 500 },
    );
  }
}
