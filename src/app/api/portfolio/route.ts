import { NextResponse } from "next/server";
import { getPortfolioItems, upsertPortfolioItem } from "@/lib/storage";
import { z } from "zod";
import type { PortfolioCategory, PortfolioMediaType } from "@/lib/types";

export const runtime = "nodejs";

const portfolioSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
  type: z.enum(["video", "photo"] satisfies PortfolioMediaType[]),
  category: z.enum(["promotional", "event", "photography"] satisfies PortfolioCategory[]),
  mediaUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export async function GET() {
  const items = await getPortfolioItems();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const payload = portfolioSchema.parse(await request.json());
    const item = {
      id: payload.id || crypto.randomUUID(),
      title: payload.title,
      description: payload.description,
      type: payload.type,
      category: payload.category,
      mediaUrl: payload.mediaUrl,
      thumbnailUrl: payload.thumbnailUrl || undefined,
      featured: payload.featured,
      order: payload.order,
      createdAt: new Date().toISOString(),
    };

    const result = await upsertPortfolioItem(item);
    return NextResponse.json({ item, ...result }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to create item" }, { status: 500 });
  }
}
