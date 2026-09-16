import { prisma } from "@/lib/prisma";
import { getUserFromReq } from "@/lib/auth";
import { sendOutbidEmail } from "@/lib/mail";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        listing: {
          include: {
            species: { include: { category: true } },
            owner: { select: { username: true } },
            photos: { orderBy: { order: "asc" } },
          },
        },
        bids: {
          orderBy: { amount: "desc" },
          include: { bidder: { select: { username: true } } },
        },
      },
    });

    if (!auction)
      return res.status(404).json({ error: "Veiling niet gevonden" });
    return res.status(200).json({ auction });
  }

  if (req.method === "POST") {
    const user = getUserFromReq(req);
    if (!user) return res.status(401).json({ error: "Niet ingelogd" });

    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Ongeldig bedrag" });
    }

    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        listing: true,
        bids: { orderBy: { amount: "desc" }, take: 1 },
      },
    });

    if (!auction)
      return res.status(404).json({ error: "Veiling niet gevonden" });
    if (auction.status !== "open")
      return res.status(400).json({ error: "Deze veiling is gesloten" });
    if (new Date() > new Date(auction.endsAt))
      return res.status(400).json({ error: "Deze veiling is verlopen" });
    if (auction.listing.ownerId === user.userId)
      return res
        .status(400)
        .json({ error: "Je kunt niet bieden op je eigen veiling" });

    const highestBid = auction.bids[0]?.amount || auction.startPrice;
    if (parseFloat(amount) <= highestBid) {
      return res
        .status(400)
        .json({ error: `Je bod moet hoger zijn dan €${highestBid}` });
    }

    const bid = await prisma.auctionBid.create({
      data: {
        auctionId: id,
        bidderId: user.userId,
        amount: parseFloat(amount),
      },
    });

    // Stuur een e-mail naar de vorige hoogste bieder (als die er is en niet dezelfde persoon is)
    try {
      const previousBid = auction.bids[0];
      if (
        previousBid &&
        previousBid.bidder &&
        previousBid.bidderId !== user.userId
      ) {
        const previousBidder = await prisma.user.findUnique({
          where: { id: previousBid.bidderId },
        });
        if (previousBidder?.email) {
          await sendOutbidEmail(
            previousBidder.email,
            auction.listing.title,
            id
          );
        }
      }
    } catch (mailError) {
      console.error("Mail versturen mislukt:", mailError);
    }

    return res.status(201).json({ bid });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
