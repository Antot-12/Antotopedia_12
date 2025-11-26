import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const locale = String(body?.locale || "").toLowerCase();
    const ok = locales.includes(locale as any);
    const l = ok ? locale : defaultLocale;
    const res = NextResponse.json({ ok: true, locale: l });
    res.cookies.set("lang", l, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return res;
}
