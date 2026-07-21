import { NextResponse } from "next/server";
import { createAdminSession, verifyAdminPassword } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const valid = await verifyAdminPassword(body.password);

    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    await createAdminSession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
