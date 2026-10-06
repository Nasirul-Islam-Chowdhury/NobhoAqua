import "server-only";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error("Missing JWT_SECRET environment variable");

const EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const SESSION_COOKIE = "nj_session";

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
}

export function signSession(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET!, { expiresIn: EXPIRES_IN_SECONDS });
}

export function verifySession(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET!) as JwtPayload;
  } catch {
    return null;
  }
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    // Express's res.cookie expects maxAge in milliseconds.
    maxAge: EXPIRES_IN_SECONDS * 1000,
  };
}
