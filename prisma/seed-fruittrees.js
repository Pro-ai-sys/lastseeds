const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categorie = await prisma.seedCategory.upsert({
    where: { name: "Fruitbomen" },
    update: {},
    create: {
      name: "Fruitbomen",
      description: "Zaden en pitten van fruitbomen",
    },
  });

  const soorten = [
    "Appel",
    "Peer",
    "Kers",
    "Pruim",
    "Perzik",
    "Abrikoos",
    "Vijg",
    "Walnoot",
    "Hazelnoot",
    "Kastanje",
    "Mispel",
    "Kweepeer",
  ];

  for (const naam of soorten) {
    await prisma.seedSpecies.upsert({
      where: { name_categoryId: { name: naam, categoryId: categorie.id } },
      update: {},
      create: { name: naam, categoryId: categorie.id },
    });
  }

  console.log('Categorie "Fruitbomen" met soorten toegevoegd!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
