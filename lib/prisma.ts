import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Prisma Client'ı singleton pattern ile oluştur
// Next.js development'ta hot reload ile her seferinde yeni instance oluşmasını önler
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Production'da her fonksiyon çağrısında yeni pool oluşturulmaması için cache
const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString,
  max: 1, // Vercel serverless için düşük tutuyoruz
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.pool = pool;
}

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

