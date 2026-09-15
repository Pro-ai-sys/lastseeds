const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categories = ["Groenten", "Bloemen", "Kruiden", "Fruit", "Overig"];
  for (const name of categories) {
    await prisma.seedCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Categorieën toegevoegd");
}

main().finally(() => prisma.$disconnect());
