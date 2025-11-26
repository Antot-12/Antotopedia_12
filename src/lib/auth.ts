import { cookies as nextCookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "session";
const ALG = "HS256";

function getSecret() {
  const s = process.env.AUTH_SECRET || "";
  return new TextEncoder().encode(s);
}

export type SessionUser = {
  username: string;
  role: "admin";
};

export async function signSession(payload: SessionUser) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as SessionUser;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const c = await nextCookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const payload = await verifySession(token);
    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const c = await nextCookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSessionCookie() {
  const c = await nextCookies();
  c.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export async function verifyCredentials(username: string, password: string) {
  const envUser = process.env.ADMIN_USERNAME || "";
  const hash = process.env.ADMIN_HASH || "";
  const plain = process.env.ADMIN_PASSWORD || "";
  const devUser = "Kurwa_redaktor";
  const devPass = "Kurwa_12";

  if (envUser && username !== envUser) return null;

  if (hash) {
    const ok = await bcrypt.compare(password, hash);
    if (ok) return { username: envUser || username, role: "admin" as const };
  }

  if (plain && password === plain) {
    return { username: envUser || username, role: "admin" as const };
  }

  if (process.env.NODE_ENV !== "production" && !envUser && !hash && !plain) {
    if (username === devUser && password === devPass) {
      return { username, role: "admin" as const };
    }
  }

  return null;
}

