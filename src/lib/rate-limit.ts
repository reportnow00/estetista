import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Bucket = {
  count: number;
  resetAt: number;
};

declare global {
  var __pfaRateLimitStore: Map<string, Bucket> | undefined;
}

const store = global.__pfaRateLimitStore || new Map<string, Bucket>();

if (!global.__pfaRateLimitStore) {
  global.__pfaRateLimitStore = store;
}

let didWarnMemoryFallback = false;

export async function getClientIp() {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return realIp || "unknown";
}

function enforceMemoryRateLimit({
  key,
  limit,
  windowMs
}: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs
    });
    return;
  }

  if (existing.count >= limit) {
    throw new Error("RATE_LIMITED");
  }

  existing.count += 1;
  store.set(key, existing);
}

function isRetryableRateLimitError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2002" || error.code === "P2034")
  );
}

function shouldFallbackToMemory(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2021" || error.code === "P2022")
  );
}

async function enforceDatabaseRateLimit({
  key,
  limit,
  windowMs
}: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await prisma.$transaction(
        async (tx) => {
          await tx.rateLimitBucket.deleteMany({
            where: {
              key,
              resetAt: {
                lte: now
              }
            }
          });

          const existing = await tx.rateLimitBucket.findUnique({
            where: { key },
            select: { count: true }
          });

          if (!existing) {
            await tx.rateLimitBucket.create({
              data: {
                key,
                count: 1,
                resetAt
              }
            });
            return;
          }

          if (existing.count >= limit) {
            throw new Error("RATE_LIMITED");
          }

          await tx.rateLimitBucket.update({
            where: { key },
            data: {
              count: {
                increment: 1
              }
            }
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable
        }
      );
      return;
    } catch (error) {
      if (error instanceof Error && error.message === "RATE_LIMITED") {
        throw error;
      }

      if (isRetryableRateLimitError(error) && attempt < 2) {
        continue;
      }

      throw error;
    }
  }
}

export async function enforceRateLimit({
  action,
  identifier,
  limit,
  windowMs
}: {
  action: string;
  identifier?: string;
  limit: number;
  windowMs: number;
}) {
  const ip = await getClientIp();
  const normalizedIdentifier = identifier?.trim().toLowerCase() || "anonymous";
  const key = `${action}:${ip}:${normalizedIdentifier}`;

  try {
    await enforceDatabaseRateLimit({
      key,
      limit,
      windowMs
    });
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMITED") {
      throw error;
    }

    if (!shouldFallbackToMemory(error)) {
      throw error;
    }

    if (!didWarnMemoryFallback) {
      didWarnMemoryFallback = true;
      console.warn("[rate-limit] RateLimitBucket non disponibile, uso fallback in-memory temporaneo");
    }

    enforceMemoryRateLimit({
      key,
      limit,
      windowMs
    });
  }
}
