import { prisma } from "@/lib/prisma";
import { getUserFromReq } from "@/lib/auth";

export default async function handler(req, res) {
  const { sellerId } = req.query;

  if (req.method === "GET") {
    const reviews = await prisma.review.findMany({
      where: { sellerId },
      include: { reviewer: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
    });

    const avgRating = reviews.length
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
      select: { createdAt: true },
    });

    let badge = null;
    if (reviews.length >= 20 && avgRating >= 4.5) badge = "Topverkoper";
    else if (reviews.length >= 5 && avgRating >= 4)
      badge = "Betrouwbare verkoper";
    else if (reviews.length >= 1) badge = "Actieve verkoper";

    return res.status(200).json({
      reviews,
      avgRating,
      count: reviews.length,
      memberSince: seller?.createdAt,
      badge,
    });
  }

  if (req.method === "POST") {
    const user = getUserFromReq(req);
    if (!user) return res.status(401).json({ error: "Niet ingelogd" });

    if (user.userId === sellerId) {
      return res
        .status(400)
        .json({ error: "Je kunt jezelf geen review geven" });
    }

    const hasTrade = await prisma.tradeRequest.findFirst({
      where: {
        status: "accepted",
        senderId: user.userId,
        listing: { ownerId: sellerId },
      },
    });

    if (!hasTrade) {
      return res.status(403).json({
        error:
          "Je kunt alleen een review achterlaten na een geaccepteerde ruil met deze verkoper",
      });
    }

    const { rating, comment, photoUrl } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating moet tussen 1 en 5 zijn" });
    }

    try {
      const review = await prisma.review.upsert({
        where: { sellerId_reviewerId: { sellerId, reviewerId: user.userId } },
        update: { rating: parseInt(rating), comment, photoUrl },
        create: {
          sellerId,
          reviewerId: user.userId,
          rating: parseInt(rating),
          comment,
          photoUrl,
        },
      });
      return res.status(201).json({ review });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Er ging iets mis" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
