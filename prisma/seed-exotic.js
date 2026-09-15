const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categorie = await prisma.seedCategory.upsert({
    where: { name: "Exotische groenten" },
    update: {
      description: "Groenten uit Azië, Zuid-Amerika en het Caribisch gebied",
    },
    create: {
      name: "Exotische groenten",
      description: "Groenten uit Azië, Zuid-Amerika en het Caribisch gebied",
    },
  });

  const soorten = [
    "Okra",
    "Bittermeloen",
    "Chayote",
    "Taro",
    "Yuca (Cassave)",
    "Malanga",
    "Boniato",
    "Thaise basilicum",
    "Vietnamese koriander",
    "Bladmosterd (Aziatisch)",
    "Callaloo",
    "Scotch Bonnet peper",
    "Habanero peper",
    "Rocoto peper",
    "Ají Amarillo peper",
  ];

  for (const naam of soorten) {
    await prisma.seedSpecies.upsert({
      where: { name_categoryId: { name: naam, categoryId: categorie.id } },
      update: {},
      create: { name: naam, categoryId: categorie.id },
    });
  }

  console.log('Categorie "Exotische groenten" toegevoegd!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
