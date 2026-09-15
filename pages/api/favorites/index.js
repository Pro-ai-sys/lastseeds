import { prisma } from "@/lib/prisma";
import { getUserFromReq } from "@/lib/auth";

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Niet ingelogd" });

  if (req.method === "GET") {
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.userId },
      include: {
        listing: {
          include: {
            species: { include: { category: true } },
            owner: { select: { username: true } },
            auction: true,
            photos: { orderBy: { order: "asc" } },
          },
        },
      },
    });
    return res.status(200).json({ favorites });
  }

  if (req.method === "POST") {
    const { listingId } = req.body;
    if (!listingId)
      return res.status(400).json({ error: "listingId is verplicht" });

    try {
      const favorite = await prisma.favorite.create({
        data: { userId: user.userId, listingId },
      });
      return res.status(201).json({ favorite });
    } catch (error) {
      return res.status(409).json({ error: "Al favoriet" });
    }
  }

  if (req.method === "DELETE") {
    const { listingId } = req.query;
    await prisma.favorite.deleteMany({
      where: { userId: user.userId, listingId },
    });
    return res.status(200).json({ message: "Verwijderd" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
