import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });

/** Bump when Officer schema fields change to avoid stale dev client caches. */
const PRISMA_CLIENT_VERSION = "officer-armedStatuses-v1";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaClientVersion: string | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    adapter,
  });
}

export const prisma =
  globalForPrisma.prismaClientVersion === PRISMA_CLIENT_VERSION &&
  globalForPrisma.prisma
    ? globalForPrisma.prisma
    : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  if (
    globalForPrisma.prisma &&
    globalForPrisma.prismaClientVersion !== PRISMA_CLIENT_VERSION
  ) {
    void globalForPrisma.prisma.$disconnect();
  }

  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaClientVersion = PRISMA_CLIENT_VERSION;
}
