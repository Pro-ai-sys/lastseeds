const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const landen = ['Nederland', 'België', 'Duitsland', 'Frankrijk', 'Italië', 'Spanje', 'Polen', 'Zweden'];
const maanden = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September'];
const listingTypes = ['sale', 'auction', 'trade'];
const quantityUnits = ['zaadjes', 'gram'];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const bloemenCategorie = await prisma.seedCategory.findUnique({
    where: { name: 'Bloemen' },
    include: { species: true },
  });

  if (!bloemenCategorie || bloemenCategorie.species.length === 0) {
    console.log('Geen Bloemen-categorie of soorten gevonden. Run eerst seed-flowers.js!');
    return;
  }

  const users = await prisma.user.findMany({ where: { role: 'user' } });
  if (users.length === 0) {
    console.log('Geen testgebruikers gevonden.');
    return;
  }

  const aantalListings = 30;

  for (let i = 1; i <= aantalListings; i++) {
    const species = randomFrom(bloemenCategorie.species);
    const owner = randomFrom(users);
    const listingType = randomFrom(listingTypes);
    const isHeirloom = Math.random() > 0.15;
    const quantity = randomInt(5, 100);
    const quantityUnit = randomFrom(quantityUnits);

    const listing = await prisma.seedListing.create({
      data: {
        title: `${species.name} zaden #${i}`,
        description: `Mooie ${species.name.toLowerCase()}-zaden, zorgvuldig geoogst en bewaard. Ideaal voor een kleurrijke tuin of border.`,
        quantity,
        quantityUnit,
        isHeirloom,
        listingType,
        price: listingType === 'sale' ? parseFloat((Math.random() * 4 + 0.5).toFixed(2)) : null,
        originCountry: randomFrom(landen),
        plantingMonth: randomFrom(maanden),
        ownerId: owner.id,
        speciesId: species.id,
      },
    });

    if (listingType === 'auction') {
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + randomInt(3, 14));

      await prisma.auction.create({
        data: {
          listingId: listing.id,
          startPrice: parseFloat((Math.random() * 3 + 0.3).toFixed(2)),
          endsAt,
        },
      });
    }

    // Ook een placeholder-foto toevoegen
    await prisma.photo.create({
      data: {
        listingId: listing.id,
        url: `https://picsum.photos/seed/flower-${listing.id}/800/800`,
        order: 0,
      },
    });
  }

  console.log(`${aantalListings} bloemen-listings toegevoegd met foto's.`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());