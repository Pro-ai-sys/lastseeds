const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const beschrijvingen = {
  "Brahma (kip)":
    "Rustige, imposante hoenderrras met bevederde poten. Goede legkip en uitstekende moeder.",
  "Wyandotte (kip)":
    "Sierlijk, kouderesistent ras met prachtige verentekening. Betrouwbare legger.",
  "Nederlandse Sabelpoot (kip)":
    "Klein, oer-Nederlands ras met karakteristieke sabelvormige veren aan de poten.",
  "Barnevelder (kip)":
    "Bekend Nederlands ras, legt donkerbruine eieren. Rustig en geschikt voor beginners.",
  "Drents Heideschaap":
    "Zeldzaam, hardy heideschaap, ideaal voor natuurbeheer en begrazing.",
  "Kempisch Heideschaap":
    "Klein, robuust schaap, goed aangepast aan schrale grond.",
  "Nederlandse Landgeit":
    "Traditioneel Nederlands geitenras, goede melkgeit met rustig karakter.",
  "Fries Roodbont (rund)":
    "Oud Nederlands melkveeras, sterk en goed aangepast aan drassige weiden.",
  "Lakenvelder (rund)":
    "Zeldzaam Nederlands ras met kenmerkende witte 'laken' over de rug.",
};

const landen = ["Nederland", "België", "Duitsland"];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const categorie = await prisma.seedCategory.findFirst({
    where: { name: "Heritage Vee" },
    include: { species: true },
  });

  if (!categorie || categorie.species.length === 0) {
    console.log(
      'Categorie "Heritage Vee" niet gevonden. Run eerst seed-livestock.js!'
    );
    return;
  }

  const users = await prisma.user.findMany({ where: { role: "user" } });
  if (users.length === 0) {
    console.log("Geen testgebruikers gevonden.");
    return;
  }

  const aantal = 15;

  for (let i = 1; i <= aantal; i++) {
    const species = randomFrom(categorie.species);
    const owner = randomFrom(users);
    const isKip = species.name.includes("kip");
    const listingType = Math.random() > 0.7 ? "trade" : "sale";

    const listing = await prisma.seedListing.create({
      data: {
        title: `${species.name} #${i}`,
        description:
          beschrijvingen[species.name] ||
          `Mooi exemplaar van het ras ${species.name}. Ophalen bij de boerderij.`,
        quantity: isKip ? randomInt(1, 6) : randomInt(1, 3),
        quantityUnit: "stuks",
        isHeirloom: true,
        listingType,
        price:
          listingType === "sale"
            ? parseFloat((Math.random() * 150 + 25).toFixed(2))
            : null,
        originCountry: randomFrom(landen),
        ownerId: owner.id,
        speciesId: species.id,
      },
    });

    // Placeholder-foto
    await prisma.photo.create({
      data: {
        listingId: listing.id,
        url: `https://picsum.photos/seed/livestock-${listing.id}/800/800`,
        order: 0,
      },
    });
  }

  console.log(
    `${aantal} Heritage Vee-listings toegevoegd, verdeeld over bestaande gebruikers.`
  );
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
