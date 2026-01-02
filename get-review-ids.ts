import 'dotenv/config';
import { prisma } from './lib/prisma';

async function getReviewIds() {
  const reviews = await prisma.productReview.findMany({
    select: {
      id: true,
      author: true,
    }
  });
  
  console.log('Tam Yorum ID\'leri:');
  reviews.forEach(r => {
    console.log(`${r.author}: ${r.id}`);
    console.log(`URL: http://localhost:3000/tr/admin/reviews/${r.id}\n`);
  });
  
  await prisma.$disconnect();
}

getReviewIds().catch(console.error);
