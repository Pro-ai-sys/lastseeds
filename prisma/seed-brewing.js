const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Nieuwe categorie: Brouw- en Stookgewassen
  const brouwCategorie = await prisma.seedCategory.upsert({
    where: { name: "Brouw- en Stookgewassen" },
    update: {
      description: "Gewassen gebruikt voor het brouwen en stoken van dranken",
    },
    create: {
      name: "Brouw- en Stookgewassen",
      description: "Gewassen gebruikt voor het brouwen en stoken van dranken",
    },
  });

  await prisma.seedSpecies.upsert({
    where: { name_categoryId: { name: "Hop", categoryId: brouwCategorie.id } },
    update: { latinName: "Humulus lupulus" },
    create: {
      name: "Hop",
      categoryId: brouwCategorie.id,
      latinName: "Humulus lupulus",
    },
  });

  // Aanvullingen op bestaande categorieën
  const granen = await prisma.seedCategory.findFirst({
    where: { name: "Granen" },
  });
  if (granen) {
    await prisma.seedSpecies.upsert({
      where: { name_categoryId: { name: "Tarwe", categoryId: granen.id } },
      update: { latinName: "Triticum aestivum" },
      create: {
        name: "Tarwe",
        categoryId: granen.id,
        latinName: "Triticum aestivum",
      },
    });
  }

  const wortelKnol = await prisma.seedCategory.findFirst({
    where: { name: "Wortel & Knolgewassen" },
  });
  if (wortelKnol) {
    await prisma.seedSpecies.upsert({
      where: {
        name_categoryId: { name: "Aardappel", categoryId: wortelKnol.id },
      },
      update: { latinName: "Solanum tuberosum" },
      create: {
        name: "Aardappel",
        categoryId: wortelKnol.id,
        latinName: "Solanum tuberosum",
      },
    });
  }

  console.log("Hop, Tarwe en Aardappel toegevoegd!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
