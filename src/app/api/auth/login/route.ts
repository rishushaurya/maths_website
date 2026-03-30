import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@brahmagupta.club";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default-dev-secret-change-me");

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Check credentials
    if (email !== ADMIN_EMAIL) {
      // Deliberate delay to prevent timing attacks
      await new Promise((r) => setTimeout(r, 1000));
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check credentials securely. No hardcoded default passwords allowed in production.
    let isValid = false;
    const adminPasswordPlain = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD;

    if (ADMIN_PASSWORD_HASH && ADMIN_PASSWORD_HASH !== "$2a$12$placeholder_hash_here") {
      isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    } else if (adminPasswordPlain) {
      isValid = password === adminPasswordPlain;
    } else {
      // If neither hash nor plain text password is provided, lock down the system in production
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "System lock: ADMIN_PASSWORD environment variable is not set." }, { status: 403 });
      }
      // For local dev only
      isValid = password === "admin123";
    }

    if (!isValid) {
      await new Promise((r) => setTimeout(r, 1000));
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create JWT token
    const token = await new SignJWT({ email, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(JWT_SECRET);

    // Set httpOnly cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60, // 8 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
