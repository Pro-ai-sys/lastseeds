const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const voornamen = [
  "Jan",
  "Anna",
  "Piet",
  "Marie",
  "Kees",
  "Sanne",
  "Bram",
  "Fleur",
  "Tom",
  "Eva",
  "Sem",
  "Nora",
  "Finn",
  "Lotte",
  "Daan",
  "Julia",
  "Milan",
  "Roos",
  "Lars",
  "Iris",
];
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

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("Bezig met gebruikers aanmaken...");
  const hashedPassword = await bcrypt.hash("test1234", 10);
  const users = [];

  for (let i = 1; i <= 80; i++) {
    const naam = randomFrom(voornamen);
    const username = `${naam.toLowerCase()}${i}`;
    const email = `${username}@test.lastseeds.nl`;

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        username,
        password: hashedPassword,
        role: "user",
      },
    });
    users.push(user);
  }
  console.log(`${users.length} gebruikers klaar.`);

  console.log("Soorten ophalen...");
  const allSpecies = await prisma.seedSpecies.findMany();
  if (allSpecies.length === 0) {
    console.log("Geen soorten gevonden — run eerst seed-species.js!");
    return;
  }

  console.log("Bezig met listings aanmaken...");
  for (let i = 1; i <= 80; i++) {
    const species = randomFrom(allSpecies);
    const owner = randomFrom(users);
    const listingType = randomFrom(listingTypes);
    const isHeirloom = Math.random() > 0.15; // meeste heirloom
    const quantity = randomInt(1, 50);
    const originCountry = randomFrom(landen);
    const plantingMonth = randomFrom(maanden);

    const listing = await prisma.seedListing.create({
      data: {
        title: `${species.name} #${i}`,
        description: `Zaden van ${species.name}, zorgvuldig bewaard en getest op kiemkracht. Ideaal voor de moestuin of tuin.`,
        quantity,
        isHeirloom,
        listingType,
        price:
          listingType === "sale"
            ? parseFloat((Math.random() * 8 + 1).toFixed(2))
            : null,
        originCountry,
        plantingMonth,
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
  }

  console.log("80 listings aangemaakt, verspreid over alle categorieën.");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
