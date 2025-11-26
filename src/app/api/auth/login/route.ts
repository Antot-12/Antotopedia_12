import { NextResponse } from "next/server";
import { signSession, setSessionCookie, verifyCredentials } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const username = String(body?.username || "");
  const password = String(body?.password || "");
  const next = typeof body?.next === "string" ? body.next : "/admin";
  const match = await verifyCredentials(username, password);
  if (!match) return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
  const token = await signSession(match);
  await setSessionCookie(token);
  return NextResponse.json({ ok: true, next });
}
