const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categorie = await prisma.seedCategory.upsert({
    where: { name: 'Granen' },
    update: {},
    create: { name: 'Granen', description: 'Granen en pseudogranen voor eigen teelt' },
  });

  const soorten = ['Quinoa', 'Boekweit', 'Amarant', 'Haver', 'Gerst', 'Spelt'];

  for (const naam of soorten) {
    await prisma.seedSpecies.upsert({
      where: { name_categoryId: { name: naam, categoryId: categorie.id } },
      update: {},
      create: { name: naam, categoryId: categorie.id },
    });
  }

  console.log('Categorie "Granen" toegevoegd!');
}

main().catch((e) => console.error(e)).finally(() => prisma.$disconnect());