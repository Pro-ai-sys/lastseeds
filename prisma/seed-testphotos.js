const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const listings = await prisma.seedListing.findMany({
    include: { photos: true },
  });

  let count = 0;

  for (const listing of listings) {
    if (listing.photos.length > 0) continue; // al foto's, overslaan

    const numPhotos = randomInt(1, 3);

    const photoData = [];
    for (let i = 0; i < numPhotos; i++) {
      const seed = `${listing.id}-${i}`;
      photoData.push({
        listingId: listing.id,
        url: `https://picsum.photos/seed/${seed}/800/800`,
        order: i,
      });
    }

    await prisma.photo.createMany({ data: photoData });
    count++;
  }

  console.log(`Foto's toegevoegd aan ${count} listings.`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
