import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteData, getStorageStatus } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [data, storage] = await Promise.all([getSiteData(), getStorageStatus()]);

  return NextResponse.json({
    messages: data.messages,
    storage,
    storageConfigured: storage.persistent,
  });
}
