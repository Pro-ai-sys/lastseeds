const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const aanvullingen = {
    Bladgewassen: ["Bindsla", "Bleekselderij", "Chinese kool", "IJskruid"],
    Koolgewassen: ["Kalettes"],
  };

  for (const [categorieNaam, soorten] of Object.entries(aanvullingen)) {
    const categorie = await prisma.seedCategory.findUnique({
      where: { name: categorieNaam },
    });
    if (!categorie) continue;
    for (const naam of soorten) {
      await prisma.seedSpecies.upsert({
        where: { name_categoryId: { name: naam, categoryId: categorie.id } },
        update: {},
        create: { name: naam, categoryId: categorie.id },
      });
    }
  }

  console.log("Aanvullingen toegevoegd!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
