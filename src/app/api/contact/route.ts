import { NextResponse } from "next/server";
import { addContactMessage } from "@/lib/storage";
import { z } from "zod";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().max(30).optional().or(z.literal("")),
  service: z.string().max(60).optional().or(z.literal("")),
  message: z.string().min(10).max(2000),
});

export async function POST(request: Request) {
  try {
    const payload = contactSchema.parse(await request.json());
    const result = await addContactMessage({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || undefined,
      service: payload.service || undefined,
      message: payload.message,
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Invalid form data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to send message" }, { status: 500 });
  }
}
