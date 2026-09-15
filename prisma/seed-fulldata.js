const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const landen = [
  "Nederland",
  "België",
  "Duitsland",
  "Frankrijk",
  "Italië",
  "Spanje",
  "Polen",
  "Zweden",
  "Portugal",
  "Oostenrijk",
];
const maanden = [
  "Januari",
  "Februari",
  "Maart",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Augustus",
  "September",
  "Oktober",
  "November",
  "December",
];
const listingTypes = ["sale", "auction", "trade"];
const quantityUnits = ["zaadjes", "gram"];
const geschiedenissen = [
  "3 generaties open-pollinated op dezelfde grond",
  "Doorgegeven van opa op vader op zoon",
  "Zelf geselecteerd sinds 2018",
  "Origineel ras uit familiemoestuin",
  "Jarenlang bewaard in de familie",
  null,
  null, // soms geen geschiedenis
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const allSpecies = await prisma.seedSpecies.findMany({
    include: { category: true },
  });
  const users = await prisma.user.findMany({ where: { role: "user" } });

  if (allSpecies.length === 0 || users.length === 0) {
    console.log(
      "Geen soorten of gebruikers gevonden. Run eerst seed-species.js en seed-testdata.js!"
    );
    return;
  }

  const aantal = 60;

  for (let i = 1; i <= aantal; i++) {
    const species = randomFrom(allSpecies);
    const owner = randomFrom(users);
    const listingType = randomFrom(listingTypes);
    const isHeirloom = Math.random() > 0.15;
    const quantity = randomInt(5, 100);
    const quantityUnit = randomFrom(quantityUnits);
    const hasHistory = Math.random() > 0.4;

    const listing = await prisma.seedListing.create({
      data: {
        title: `${species.name} #${i}`,
        description: `Mooie ${species.name.toLowerCase()}-zaden, zorgvuldig geoogst en getest op kiemkracht. Ideaal voor de moestuin of tuin.`,
        quantity,
        quantityUnit,
        isHeirloom,
        listingType,
        price:
          listingType === "sale"
            ? parseFloat((Math.random() * 8 + 0.5).toFixed(2))
            : null,
        originCountry: randomFrom(landen),
        plantingMonth: randomFrom(maanden),
        seedHistory: hasHistory ? randomFrom(geschiedenissen) : null,
        parentPlantYear: hasHistory ? randomInt(2015, 2024) : null,
        ownerId: owner.id,
        speciesId: species.id,
      },
    });

    if (listingType === "auction") {
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + randomInt(3, 14));

      await prisma.auction.create({
        data: {
          listingId: listing.id,
          startPrice: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
          endsAt,
        },
      });
    }

    // Placeholder-foto's (1-3 per listing)
    const numPhotos = randomInt(1, 3);
    for (let p = 0; p < numPhotos; p++) {
      await prisma.photo.create({
        data: {
          listingId: listing.id,
          url: `https://picsum.photos/seed/${listing.id}-${p}/800/800`,
          order: p,
        },
      });
    }
  }

  console.log(
    `${aantal} volledig ingevulde listings toegevoegd, met foto's, verspreid over alle categorieën.`
  );
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
