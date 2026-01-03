import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKumiko() {
  const locales = await prisma.productLocale.findMany({
    where: {
      slug: { contains: 'kumiko' }
    },
    include: {
      images: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  console.log(JSON.stringify(locales, null, 2));
  await prisma.$disconnect();
}

checkKumiko().catch(console.error);
