const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Bloemen categorie
  const bloemenCategorie = await prisma.seedCategory.upsert({
    where: { name: 'Bloemen' },
    update: {},
    create: { name: 'Bloemen', description: 'Eenjarige, tweejarige en vaste bloeiende planten' },
  });

  const bloemSoorten = [
    'Afrikaantjes', 'Cosmos', 'Geranium', 'Klaproos', 'Korenbloem', 'Leeuwenbek',
    'Lathyrus', 'Oost-Indische kers', 'Petunia', 'Schildzaad', 'Zinnia',
    'Chrysant', 'Judaspenning', 'Lupine', 'Madelief', 'Margriet', 'Muurbloem',
    'Stokroos', 'Vergeet-mij-niet', 'Vingerhoedskruid', 'Violen',
    'Akelei', 'Cactus', 'Dahlia', 'Gerbera', 'Gipskruid', 'Kogeldistel',
    'Phlox', 'Ridderspoor', 'Echinacea', 'Salvia', 'Zonnebloem',
    'Aster', 'Anjer', 'Calendula', 'Verbena',
  ];

  for (const naam of bloemSoorten) {
    await prisma.seedSpecies.upsert({
      where: { name_categoryId: { name: naam, categoryId: bloemenCategorie.id } },
      update: {},
      create: { name: naam, categoryId: bloemenCategorie.id },
    });
  }

  // Aanvullingen op bestaande categorieën
  const aanvullingen = {
    'Peulvruchten': ['Kouseband'],
    'Kruiden': ['Kattengras', 'Borage', 'Citroengras', 'Dragon', 'Dropplant', 'Kamille', 'Snijselderij', 'Stevia'],
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

  console.log('Bloemen en aanvullingen toegevoegd!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());