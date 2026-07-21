import { get, head, list, put } from "@vercel/blob";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { getEmptySiteData, getSeedPortfolio, mergeContent, mergeTheme } from "./seed";
import type { ContactMessage, PortfolioItem, SiteContent, SiteData, SiteTheme } from "./types";

const BLOB_PATH = "tidespool/site-data.json";
const BLOB_ACCESS = "private" as const;
const LOCAL_DATA_PATH = path.join(process.cwd(), "data", "site-data.json");

let memoryCache: SiteData | null = null;

function getBlobClientOptions(): { token?: string; storeId?: string } {
  // On Vercel, prefer OIDC auth (automatic). Passing BLOB_READ_WRITE_TOKEN in
  // options skips OIDC and can break writes when the token is stale or mismatched.
  if (isRunningOnVercel()) {
    const storeId = process.env.BLOB_STORE_ID?.trim();
    return storeId ? { storeId } : {};
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  return token ? { token } : {};
}

function getBlobEnvHints() {
  return {
    onVercel: isRunningOnVercel(),
    hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()),
    hasBlobStoreId: Boolean(process.env.BLOB_STORE_ID?.trim()),
    hasOidcToken: Boolean(process.env.VERCEL_OIDC_TOKEN?.trim()),
  };
}

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

function isRunningOnVercel(): boolean {
  return Boolean(process.env.VERCEL);
}

/** Vercel Blob can auth via OIDC (BLOB_STORE_ID) or BLOB_READ_WRITE_TOKEN */
function hasBlobEnvConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      process.env.VERCEL_OIDC_TOKEN,
  );
}

function isBlobNotFoundError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return message.includes("not found") || message.includes("does not exist");
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
  if (!isRunningOnVercel() && !hasBlobEnvConfigured()) {
    return null;
  }

  try {
    const result = await get(BLOB_PATH, {
      access: BLOB_ACCESS,
      useCache: false,
      ...getBlobClientOptions(),
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return null;
    }

    const raw = await new Response(result.stream).text();
    return normalizeSiteData(JSON.parse(raw) as SiteData);
  } catch (error) {
    if (isBlobNotFoundError(error)) {
      return null;
    }
    return null;
  }
}

async function blobStoreExists(): Promise<boolean> {
  try {
    await head(BLOB_PATH, getBlobClientOptions());
    return true;
  } catch (error) {
    if (isBlobNotFoundError(error)) {
      return false;
    }
    return false;
  }
}

async function testBlobConnection(): Promise<{ ok: boolean; error?: string }> {
  if (!isRunningOnVercel()) {
    return { ok: true };
  }

  try {
    await list({ prefix: "tidespool/", limit: 1, ...getBlobClientOptions() });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to connect to Vercel Blob",
    };
  }
}

async function testBlobWrite(): Promise<{ ok: boolean; error?: string }> {
  if (!isRunningOnVercel()) {
    return { ok: true };
  }

  try {
    await put(`${BLOB_PATH}.write-test`, JSON.stringify({ ok: true, at: Date.now() }), {
      access: BLOB_ACCESS,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      ...getBlobClientOptions(),
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to write to Vercel Blob",
    };
  }
}

async function writeBlobData(data: SiteData): Promise<{ ok: boolean; error?: string }> {
  if (!isRunningOnVercel() && !hasBlobEnvConfigured()) {
    return { ok: false, error: "Blob storage is not configured." };
  }

  try {
    await put(BLOB_PATH, JSON.stringify(data), {
      access: BLOB_ACCESS,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      ...getBlobClientOptions(),
    });

    memoryCache = data;
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to write to Vercel Blob",
    };
  }
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

  if (isRunningOnVercel()) {
    memoryCache = getEmptySiteData();
    return memoryCache;
  }

  const localData = await readLocalData();
  memoryCache = localData;
  return localData;
}

export async function saveSiteData(data: SiteData): Promise<{ persisted: boolean; saveError?: string }> {
  const normalized = normalizeSiteData(data);
  memoryCache = normalized;

  if (isRunningOnVercel()) {
    const result = await writeBlobData(normalized);
    return { persisted: result.ok, saveError: result.error };
  }

  await writeLocalData(normalized);
  return { persisted: true };
}

export async function getStorageStatus() {
  const onVercel = isRunningOnVercel();
  const blobEnvConfigured = hasBlobEnvConfigured();
  const envHints = getBlobEnvHints();
  const connection = onVercel ? await testBlobConnection() : { ok: true };
  const writeAccess = onVercel && connection.ok ? await testBlobWrite() : connection;
  const hasStoredData = onVercel && connection.ok ? await blobStoreExists() : !onVercel;

  if (onVercel) {
    const persistent = writeAccess.ok;

    return {
      environment: "vercel" as const,
      backend: persistent ? ("vercel-blob" as const) : ("memory-only" as const),
      persistent,
      blobEnvConfigured,
      blobConnectionOk: connection.ok,
      blobWriteOk: writeAccess.ok,
      hasStoredData,
      blobPath: BLOB_PATH,
      envHints,
      connectionError: writeAccess.error || connection.error,
      message: persistent
        ? hasStoredData
          ? "Connected to Vercel Blob. Your saved CMS data is stored permanently."
          : "Blob is connected. Save something in the admin panel once to create the storage file."
        : writeAccess.error
          ? `Blob write failed: ${writeAccess.error}`
          : connection.error
            ? `Blob connection failed: ${connection.error}`
            : !envHints.hasBlobStoreId && !envHints.hasBlobToken
              ? "Blob not linked to this project. In Vercel open your project → Storage → Connect Blob → Redeploy."
              : "Blob env vars found but writes failed. Reconnect Blob to this project, then redeploy.",
    };
  }

  return {
    environment: "local" as const,
    backend: "local-file" as const,
    persistent: true,
    blobEnvConfigured,
    blobConnectionOk: true,
    blobWriteOk: true,
    hasStoredData: true,
    blobPath: LOCAL_DATA_PATH,
    envHints,
    message: "Local development uses data/site-data.json on your computer.",
  };
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
}): Promise<{ persisted: boolean; saveError?: string }> {
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
