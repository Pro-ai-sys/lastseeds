import { prisma } from "@/lib/prisma";
import { sendAuctionWonEmail } from "@/lib/mail";

export default async function handler(req, res) {
  // Beveiliging: alleen Vercel's cron-systeem mag dit aanroepen
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Niet geautoriseerd" });
  }

  const expiredAuctions = await prisma.auction.findMany({
    where: {
      endsAt: { lt: new Date() },
      winnerNotifiedAt: null,
    },
    include: {
      listing: true,
      bids: { orderBy: { amount: "desc" }, take: 1, include: { bidder: true } },
    },
  });

  let notified = 0;

  for (const auction of expiredAuctions) {
    const winningBid = auction.bids[0];
    if (winningBid?.bidder?.email) {
      try {
        await sendAuctionWonEmail(
          winningBid.bidder.email,
          auction.listing.title,
          auction.id
        );
        notified++;
      } catch (error) {
        console.error(`Mail mislukt voor veiling ${auction.id}:`, error);
      }
    }

    await prisma.auction.update({
      where: { id: auction.id },
      data: { winnerNotifiedAt: new Date(), status: "closed" },
    });
  }

  return res
    .status(200)
    .json({
      message: `${notified} winnaars gemaild, ${expiredAuctions.length} veilingen verwerkt.`,
    });
}
