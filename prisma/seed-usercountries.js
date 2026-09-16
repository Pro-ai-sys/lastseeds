const { PrismaClient } = require("@prisma/client");
const { geocodePostalCode } = require("../lib/geocode");
const prisma = new PrismaClient();

const countryData = [
  {
    name: "Nederland",
    cities: ["Amsterdam", "Rotterdam", "Utrecht", "Eindhoven", "Groningen"],
    postalPrefix: () => `${1000 + Math.floor(Math.random() * 8999)} AB`,
  },
  {
    name: "België",
    cities: ["Antwerpen", "Gent", "Brussel", "Brugge"],
    postalPrefix: () => `${1000 + Math.floor(Math.random() * 8999)}`,
  },
  {
    name: "Duitsland",
    cities: ["Berlijn", "München", "Hamburg", "Keulen"],
    postalPrefix: () => `${10000 + Math.floor(Math.random() * 89999)}`,
  },
  {
    name: "Frankrijk",
    cities: ["Parijs", "Lyon", "Marseille", "Toulouse"],
    postalPrefix: () => `${10000 + Math.floor(Math.random() * 89999)}`,
  },
  {
    name: "Spanje",
    cities: ["Madrid", "Barcelona", "Valencia", "Sevilla"],
    postalPrefix: () => `${10000 + Math.floor(Math.random() * 89999)}`,
  },
  {
    name: "Italië",
    cities: ["Rome", "Milaan", "Napels", "Turijn"],
    postalPrefix: () => `${10000 + Math.floor(Math.random() * 89999)}`,
  },
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const users = await prisma.user.findMany({
    where: { role: "user", country: null },
  });

  console.log(
    `${users.length} gebruikers zonder land gevonden. Bezig met aanvullen...`
  );

  let updated = 0;

  for (const user of users) {
    const country = randomFrom(countryData);
    const city = randomFrom(country.cities);
    const postalCode = country.postalPrefix();

    let coords = null;
    try {
      coords = await geocodePostalCode(postalCode, `${city}, ${country.name}`);
      // Nominatim-limiet: max 1 verzoek per seconde
      await new Promise((resolve) => setTimeout(resolve, 1100));
    } catch (error) {
      console.error(`Geocoding mislukt voor ${user.username}:`, error.message);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        country: country.name,
        city,
        postalCode,
        ...(coords && {
          latitude: coords.latitude,
          longitude: coords.longitude,
        }),
      },
    });

    updated++;
    if (updated % 10 === 0)
      console.log(`${updated}/${users.length} verwerkt...`);
  }

  console.log(
    `Klaar! ${updated} gebruikers aangevuld met land, stad, postcode en coördinaten.`
  );
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
