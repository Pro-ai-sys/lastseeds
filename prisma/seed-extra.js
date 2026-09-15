const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const aanvullingen = {
    'Overig': ['Asperges', 'Rabarber', 'Artisjok'],
  };

  for (const [categorieNaam, soorten] of Object.entries(aanvullingen)) {
    const categorie = await prisma.seedCategory.findUnique({ where: { name: categorieNaam } });
    if (!categorie) {
      console.log(`Categorie "${categorieNaam}" niet gevonden, overslaan.`);
      continue;
    }
    for (const naam of soorten) {
      await prisma.seedSpecies.upsert({
        where: { name_categoryId: { name: naam, categoryId: categorie.id } },
        update: {},
        create: { name: naam, categoryId: categorie.id },
      });
    }
  }

  console.log('Extra soorten toegevoegd!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());