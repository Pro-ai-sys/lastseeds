const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categorie = await prisma.seedCategory.upsert({
    where: { name: 'Kamerplanten' },
    update: {},
    create: { name: 'Kamerplanten', description: 'Zaden voor planten binnenshuis' },
  });

  const soorten = [
    'Vetplant',
    'Vlijtig Liesje',
    'Basilicum (pot)',
    'Cactus',
    'Aloë Vera',
    'Monstera',
    'Palm',
  ];

  for (const naam of soorten) {
    await prisma.seedSpecies.upsert({
      where: { name_categoryId: { name: naam, categoryId: categorie.id } },
      update: {},
      create: { name: naam, categoryId: categorie.id },
    });
  }

  console.log('Categorie "Kamerplanten" toegevoegd!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());