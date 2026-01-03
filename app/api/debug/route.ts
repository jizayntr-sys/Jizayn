import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    databaseUrlConfigured: !!process.env.DATABASE_URL,
    databaseUrlLength: process.env.DATABASE_URL?.length || 0,
  };

  try {
    // Basit bir Prisma sorgusu dene
    const reviewCount = await prisma.productReview.count();
    checks.prismaConnection = 'SUCCESS';
    checks.reviewCount = reviewCount;
  } catch (error) {
    checks.prismaConnection = 'FAILED';
    checks.prismaError = error instanceof Error ? error.message : 'Unknown error';
    checks.prismaErrorStack = error instanceof Error ? error.stack : null;
  }

  try {
    // Raw query dene
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    checks.rawQueryConnection = 'SUCCESS';
    checks.rawQueryResult = result;
  } catch (error) {
    checks.rawQueryConnection = 'FAILED';
    checks.rawQueryError = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json(checks, { 
    status: checks.prismaConnection === 'SUCCESS' ? 200 : 500 
  });
}
