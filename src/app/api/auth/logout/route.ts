import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

async function doLogout(req: Request) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/", req.url));
}

export async function POST(req: Request) {
  return doLogout(req);
}

export async function GET(req: Request) {
  return doLogout(req);
}
