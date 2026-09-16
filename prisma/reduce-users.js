const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const allUsers = await prisma.user.findMany({
    where: { role: "user" },
    orderBy: { createdAt: "asc" },
  });

  if (allUsers.length <= 20) {
    console.log(
      `Er zijn al maar ${allUsers.length} gebruikers, niets te doen.`
    );
    return;
  }

  const keepUsers = allUsers.slice(0, 20);
  const removeUsers = allUsers.slice(20);
  const keepIds = keepUsers.map((u) => u.id);
  const removeIds = removeUsers.map((u) => u.id);

  console.log(
    `${keepUsers.length} gebruikers behouden, ${removeUsers.length} worden verwijderd (na herverdeling van hun listings).`
  );

  // 1. Herverdeel listings van te verwijderen gebruikers naar de 20 overgebleven gebruikers
  const listingsToReassign = await prisma.seedListing.findMany({
    where: { ownerId: { in: removeIds } },
  });

  for (const listing of listingsToReassign) {
    await prisma.seedListing.update({
      where: { id: listing.id },
      data: { ownerId: randomFrom(keepIds) },
    });
  }
  console.log(
    `${listingsToReassign.length} listings herverdeeld over de 20 overgebleven gebruikers.`
  );

  // 2. Herverdeel moederplanten
  await prisma.motherPlant.updateMany({
    where: { userId: { in: removeIds } },
    data: {}, // placeholder, we doen het per record hieronder ivm randomFrom
  });
  const motherPlants = await prisma.motherPlant.findMany({
    where: { userId: { in: removeIds } },
  });
  for (const mp of motherPlants) {
    await prisma.motherPlant.update({
      where: { id: mp.id },
      data: { userId: randomFrom(keepIds) },
    });
  }

  // 3. Herverdeel wanted-listings
  const wanted = await prisma.wantedListing.findMany({
    where: { userId: { in: removeIds } },
  });
  for (const w of wanted) {
    await prisma.wantedListing.update({
      where: { id: w.id },
      data: { userId: randomFrom(keepIds) },
    });
  }

  // 4. Verwijder gekoppelde gegevens die niet zinvol herverdeeld kunnen worden
  await prisma.message.deleteMany({
    where: {
      OR: [{ senderId: { in: removeIds } }, { receiverId: { in: removeIds } }],
    },
  });
  await prisma.tradeRequest.deleteMany({
    where: {
      OR: [{ senderId: { in: removeIds } }, { receiverId: { in: removeIds } }],
    },
  });
  await prisma.favorite.deleteMany({ where: { userId: { in: removeIds } } });
  await prisma.review.deleteMany({
    where: {
      OR: [{ sellerId: { in: removeIds } }, { reviewerId: { in: removeIds } }],
    },
  });
  await prisma.auctionBid.deleteMany({
    where: { bidderId: { in: removeIds } },
  });
  await prisma.report.deleteMany({ where: { reporterId: { in: removeIds } } });
  await prisma.passwordResetToken.deleteMany({
    where: { userId: { in: removeIds } },
  });
  await prisma.emailVerificationToken.deleteMany({
    where: { userId: { in: removeIds } },
  });
  console.log(
    "Gekoppelde berichten/ruilverzoeken/favorieten/reviews/biedingen/meldingen van te verwijderen gebruikers opgeruimd."
  );

  // 5. Verwijder de overtollige gebruikers zelf
  const result = await prisma.user.deleteMany({
    where: { id: { in: removeIds } },
  });
  console.log(`${result.count} gebruikers verwijderd.`);

  console.log("Klaar! 20 gebruikers over, elk met meerdere listings.");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
