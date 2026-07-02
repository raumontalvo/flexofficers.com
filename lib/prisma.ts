import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });

/** Bump when schema models change to invalidate stale dev/prod clients. */
const PRISMA_CLIENT_VERSION = "security-leads-v1";

type PrismaGlobal = typeof globalThis & {
  prisma?: PrismaClient;
  prismaClientVersion?: string;
};

const globalForPrisma = globalThis as PrismaGlobal;

function createPrismaClient() {
  return new PrismaClient({
    adapter,
  });
}

function getPrismaClient() {
  const cachedVersion = globalForPrisma.prismaClientVersion;
  const cachedClient = globalForPrisma.prisma;

  if (cachedClient && cachedVersion === PRISMA_CLIENT_VERSION) {
    return cachedClient;
  }

  if (cachedClient && cachedVersion !== PRISMA_CLIENT_VERSION) {
    void cachedClient.$disconnect();
  }

  const client = createPrismaClient();

  globalForPrisma.prisma = client;
  globalForPrisma.prismaClientVersion = PRISMA_CLIENT_VERSION;

  return client;
}

export const prisma = getPrismaClient();
