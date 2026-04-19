import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireSecretEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { isStaticExport } from "@/lib/runtime";

const COOKIE_NAME = "pfa_session";

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
};

function getSecret() {
  const value = requireSecretEnv("SESSION_SECRET");
  return new TextEncoder().encode(value);
}

export async function createSession(payload: SessionPayload) {
  if (isStaticExport()) return;

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function destroySession() {
  if (isStaticExport()) return;

  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession() {
  if (isStaticExport()) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const result = await jwtVerify<SessionPayload>(token, getSecret());
    return result.payload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  if (isStaticExport()) return null;

  const session = await getSession();
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      enrollments: {
        include: {
          course: true
        }
      }
    }
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}
