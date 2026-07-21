import { NextResponse } from "next/server";
import { deletePortfolioItem, getPortfolioItem, upsertPortfolioItem } from "@/lib/storage";
import { z } from "zod";
import type { PortfolioCategory, PortfolioMediaType } from "@/lib/types";

const portfolioSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
  type: z.enum(["video", "photo"] satisfies PortfolioMediaType[]),
  category: z.enum(["promotional", "event", "photography"] satisfies PortfolioCategory[]),
  mediaUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const item = await getPortfolioItem(id);

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const existing = await getPortfolioItem(id);

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const payload = portfolioSchema.parse(await request.json());
    const item = {
      ...existing,
      ...payload,
      id,
      thumbnailUrl: payload.thumbnailUrl || undefined,
    };

    const result = await upsertPortfolioItem(item);
    return NextResponse.json({ item, ...result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to update item" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const existing = await getPortfolioItem(id);

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = await deletePortfolioItem(id);
  return NextResponse.json({ success: true, ...result });
}
