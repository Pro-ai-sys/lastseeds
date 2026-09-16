const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categorie = await prisma.seedCategory.findFirst({
    where: { name: "Cannabis" },
    include: { species: true },
  });

  if (!categorie) {
    console.log('Categorie "Cannabis" niet gevonden, niets te doen.');
    return;
  }

  const speciesIds = categorie.species.map((s) => s.id);
  console.log(`Categorie gevonden met ${speciesIds.length} soorten.`);

  if (speciesIds.length > 0) {
    // Vind eerst alle listings onder deze soorten
    const listings = await prisma.seedListing.findMany({
      where: { speciesId: { in: speciesIds } },
    });
    const listingIds = listings.map((l) => l.id);
    console.log(`${listingIds.length} listings gevonden onder Cannabis.`);

    if (listingIds.length > 0) {
      // Ruim alle gekoppelde data van deze listings op
      await prisma.photo.deleteMany({
        where: { listingId: { in: listingIds } },
      });
      await prisma.favorite.deleteMany({
        where: { listingId: { in: listingIds } },
      });
      await prisma.tradeRequest.deleteMany({
        where: { listingId: { in: listingIds } },
      });

      const auctions = await prisma.auction.findMany({
        where: { listingId: { in: listingIds } },
      });
      const auctionIds = auctions.map((a) => a.id);
      if (auctionIds.length > 0) {
        await prisma.auctionBid.deleteMany({
          where: { auctionId: { in: auctionIds } },
        });
        await prisma.auction.deleteMany({ where: { id: { in: auctionIds } } });
      }

      await prisma.payment.deleteMany({
        where: { listingId: { in: listingIds } },
      });

      // Verwijder de listings zelf
      await prisma.seedListing.deleteMany({
        where: { id: { in: listingIds } },
      });
      console.log(
        `${listingIds.length} listings en gekoppelde data verwijderd.`
      );
    }

    // Verwijder wanted-listings die naar deze soorten verwijzen
    await prisma.wantedListing.deleteMany({
      where: { speciesId: { in: speciesIds } },
    });

    // Verwijder de soorten zelf
    await prisma.seedSpecies.deleteMany({ where: { id: { in: speciesIds } } });
    console.log(`${speciesIds.length} soorten verwijderd.`);
  }

  // Verwijder de categorie zelf
  await prisma.seedCategory.delete({ where: { id: categorie.id } });
  console.log('Categorie "Cannabis" volledig verwijderd.');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
