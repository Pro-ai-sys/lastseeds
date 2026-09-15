const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categorie = await prisma.seedCategory.upsert({
    where: { name: "Cannabis" },
    update: {
      description:
        "Cannabiszaden (genetisch materiaal). Let op: wetgeving rond bezit, verkoop en teelt verschilt per land — koper is zelf verantwoordelijk voor naleving van lokale wetgeving.",
    },
    create: {
      name: "Cannabis",
      description:
        "Cannabiszaden (genetisch materiaal). Let op: wetgeving rond bezit, verkoop en teelt verschilt per land — koper is zelf verantwoordelijk voor naleving van lokale wetgeving.",
    },
  });

  const soorten = ["Sativa", "Indica", "Hybride", "Autoflower", "CBD-rijk"];

  for (const naam of soorten) {
    await prisma.seedSpecies.upsert({
      where: { name_categoryId: { name: naam, categoryId: categorie.id } },
      update: {},
      create: { name: naam, categoryId: categorie.id },
    });
  }

  console.log('Categorie "Cannabis" met soorten toegevoegd!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
