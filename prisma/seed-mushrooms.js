const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categorie = await prisma.seedCategory.upsert({
    where: { name: "Paddenstoelen" },
    update: {},
    create: {
      name: "Paddenstoelen",
      description: "Sporen en broedsel van eetbare paddenstoelen",
    },
  });

  const soorten = [
    "Champignon",
    "Oesterzwam",
    "Shiitake",
    "Portobello",
    "Kastanjechampignon",
  ];

  for (const naam of soorten) {
    await prisma.seedSpecies.upsert({
      where: { name_categoryId: { name: naam, categoryId: categorie.id } },
      update: {},
      create: { name: naam, categoryId: categorie.id },
    });
  }

  console.log('Categorie "Paddenstoelen" met soorten toegevoegd!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
