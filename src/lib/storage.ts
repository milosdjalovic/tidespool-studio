import { head, put } from "@vercel/blob";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { getEmptySiteData, getSeedPortfolio, mergeContent, mergeTheme } from "./seed";
import type { ContactMessage, PortfolioItem, SiteContent, SiteData, SiteTheme } from "./types";

const BLOB_PATH = "tidespool/site-data.json";
const LOCAL_DATA_PATH = path.join(process.cwd(), "data", "site-data.json");

let memoryCache: SiteData | null = null;

function sortPortfolio(items: PortfolioItem[]): PortfolioItem[] {
  return [...items].sort((a, b) => a.order - b.order || b.createdAt.localeCompare(a.createdAt));
}

function normalizeSiteData(data: Partial<SiteData> | null | undefined): SiteData {
  const seed = getEmptySiteData();
  return {
    portfolio: sortPortfolio(data?.portfolio?.length ? data.portfolio : seed.portfolio),
    messages: data?.messages ?? [],
    content: mergeContent(data?.content),
    theme: mergeTheme(data?.theme),
  };
}

async function readLocalData(): Promise<SiteData> {
  try {
    const raw = await readFile(LOCAL_DATA_PATH, "utf-8");
    return normalizeSiteData(JSON.parse(raw) as SiteData);
  } catch {
    return getEmptySiteData();
  }
}

async function writeLocalData(data: SiteData): Promise<void> {
  await mkdir(path.dirname(LOCAL_DATA_PATH), { recursive: true });
  await writeFile(LOCAL_DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
  memoryCache = data;
}

async function readBlobData(): Promise<SiteData | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return null;
  }

  try {
    const blobMeta = await head(BLOB_PATH);
    const response = await fetch(blobMeta.url, { cache: "no-store" });

    if (!response.ok) {
      return null;
    }

    return normalizeSiteData((await response.json()) as SiteData);
  } catch {
    return null;
  }
}

async function writeBlobData(data: SiteData): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return false;
  }

  await put(BLOB_PATH, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });

  memoryCache = data;
  return true;
}

export async function getSiteData(): Promise<SiteData> {
  if (memoryCache) {
    return memoryCache;
  }

  const blobData = await readBlobData();
  if (blobData) {
    memoryCache = blobData;
    return blobData;
  }

  if (process.env.VERCEL) {
    memoryCache = getEmptySiteData();
    return memoryCache;
  }

  const localData = await readLocalData();
  memoryCache = localData;
  return localData;
}

export async function saveSiteData(data: SiteData): Promise<{ persisted: boolean }> {
  const normalized = normalizeSiteData(data);

  if (process.env.VERCEL) {
    const persisted = await writeBlobData(normalized);
    if (!persisted) {
      memoryCache = normalized;
      return { persisted: false };
    }
    return { persisted: true };
  }

  await writeLocalData(normalized);
  return { persisted: true };
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const data = await getSiteData();
  return data.portfolio;
}

export async function getSiteContent(): Promise<SiteContent> {
  const data = await getSiteData();
  return data.content;
}

export async function getSiteTheme(): Promise<SiteTheme> {
  const data = await getSiteData();
  return data.theme;
}

export async function updateSiteSettings(settings: {
  content?: SiteContent;
  theme?: SiteTheme;
}): Promise<{ persisted: boolean }> {
  const data = await getSiteData();

  if (settings.content) {
    data.content = mergeContent(settings.content);
  }

  if (settings.theme) {
    data.theme = mergeTheme(settings.theme);
  }

  return saveSiteData(data);
}

export async function getPortfolioItem(id: string): Promise<PortfolioItem | undefined> {
  const items = await getPortfolioItems();
  return items.find((item) => item.id === id);
}

export async function upsertPortfolioItem(item: PortfolioItem): Promise<{ persisted: boolean }> {
  const data = await getSiteData();
  const index = data.portfolio.findIndex((entry) => entry.id === item.id);

  if (index >= 0) {
    data.portfolio[index] = item;
  } else {
    data.portfolio.push(item);
  }

  data.portfolio = sortPortfolio(data.portfolio);
  return saveSiteData(data);
}

export async function deletePortfolioItem(id: string): Promise<{ persisted: boolean }> {
  const data = await getSiteData();
  data.portfolio = data.portfolio.filter((item) => item.id !== id);
  return saveSiteData(data);
}

export async function addContactMessage(
  message: Omit<ContactMessage, "id" | "createdAt" | "read">,
): Promise<{ persisted: boolean }> {
  const data = await getSiteData();
  const entry: ContactMessage = {
    ...message,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    read: false,
  };

  data.messages.unshift(entry);
  return saveSiteData(data);
}

export async function markMessageRead(id: string): Promise<{ persisted: boolean }> {
  const data = await getSiteData();
  data.messages = data.messages.map((message) =>
    message.id === id ? { ...message, read: true } : message,
  );
  return saveSiteData(data);
}

export async function deleteContactMessage(id: string): Promise<{ persisted: boolean }> {
  const data = await getSiteData();
  data.messages = data.messages.filter((message) => message.id !== id);
  return saveSiteData(data);
}

export function resetSeedPortfolio(): PortfolioItem[] {
  return getSeedPortfolio();
}
