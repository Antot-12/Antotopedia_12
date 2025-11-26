import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ["warn", "error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export async function withDbRetry<T>(
    fn: (p: PrismaClient) => Promise<T>,
    retries = 2
): Promise<T> {
    const transient = new Set(["P1001", "P1008", "P1009", "P1017", "P2024"]);
    let last: any;
    for (let i = 0; i <= retries; i++) {
        try {
            return await fn(prisma);
        } catch (e: any) {
            last = e;
            if (!e?.code || !transient.has(e.code) || i === retries) throw e;
            await new Promise((r) => setTimeout(r, 200 * (i + 1)));
        }
    }
    throw last;
}

export default prisma;
