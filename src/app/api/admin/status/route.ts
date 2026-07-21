import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteData } from "@/lib/storage";

export async function GET() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getSiteData();
  return NextResponse.json({
    messages: data.messages,
    storageConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN) || !process.env.VERCEL,
  });
}
