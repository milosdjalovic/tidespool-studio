import { NextResponse } from "next/server";
import { deleteContactMessage, getSiteData, markMessageRead } from "@/lib/storage";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const data = await getSiteData();
  const exists = data.messages.some((message) => message.id === id);

  if (!exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = await markMessageRead(id);
  return NextResponse.json({ success: true, ...result });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const data = await getSiteData();
  const exists = data.messages.some((message) => message.id === id);

  if (!exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = await deleteContactMessage(id);
  return NextResponse.json({ success: true, ...result });
}
