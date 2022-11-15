import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const sneakersData = Array.apply(null, Array(10)).map((_, i) => ({
  name: `sneakers ${i + 1}`,
  contents: `발이 편한 스니커즈 입니다.`,
  image_url: `https://picsum.photos/id/11${i}/400/300/`,
  category_id: 1,
  price: Math.floor(Math.random() * (100000 - 9900) + 9900),
}));

const shirtData = Array.apply(null, Array(10)).map((_, i) => ({
  name: `shirt ${i + 1}`,
  contents: `예쁜 티셔츠 입니다.`,
  category_id: 2,
  image_url: `https://picsum.photos/id/11${i}/400/300/`,
  price: Math.floor(Math.random() * (40000 - 9900) + 9900),
}));

const pantsData = Array.apply(null, Array(15)).map((_, i) => ({
  name: `pants ${i + 1}`,
  contents: `핏이 좋은 바지입니다.`,
  category_id: 3,
  image_url: `https://picsum.photos/id/11${i}/400/300/`,
  price: Math.floor(Math.random() * (80000 - 9900) + 9900),
}));

const capData = Array.apply(null, Array(15)).map((_, i) => ({
  name: `Cap ${i + 1}`,
  contents: `스타일리쉬한 모자입니다.`,
  category_id: 4,
  image_url: `https://picsum.photos/id/11${i}/400/300/`,
  price: Math.floor(Math.random() * (30000 - 9900) + 9900),
}));

const hoodieData = Array.apply(null, Array(20)).map((_, i) => ({
  name: `hoodie ${i + 1}`,
  contents: `활동성이 좋은 후드입니다.`,
  category_id: 5,
  image_url: `https://picsum.photos/id/10${i}/400/300/`,
  price: Math.floor(Math.random() * (50000 - 9900) + 9900),
}));

const productData = [
  ...sneakersData,
  ...shirtData,
  ...pantsData,
  ...capData,
  ...hoodieData,
];

async function main() {
  const CATEGORIES = ["SNEAKERS", "T-SHIRT", "PANTS", "CAP", "HOODIE"];
  CATEGORIES.forEach(async (c, i) => {
    const product = await prisma.categories.upsert({
      where: {
        id: i + 1,
      },
      update: {
        name: c,
      },
      create: {
        name: c,
      },
    });
  });

  await prisma.products.deleteMany({});

  for (const p of productData) {
    const product = await prisma.products.create({
      data: p,
    });
    console.log(`Created id: ${product.id}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
