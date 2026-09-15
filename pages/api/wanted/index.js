import { prisma } from "@/lib/prisma";
import { getUserFromReq } from "@/lib/auth";

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Niet ingelogd" });

  if (req.method === "GET") {
    const wanted = await prisma.wantedListing.findMany({
      where: { userId: user.userId },
      include: { species: { include: { category: true } } },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ wanted });
  }

  if (req.method === "POST") {
    const { speciesId, description } = req.body;
    if (!speciesId)
      return res.status(400).json({ error: "Soort is verplicht" });

    const wanted = await prisma.wantedListing.create({
      data: { userId: user.userId, speciesId, description },
    });

    return res.status(201).json({ wanted });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await prisma.wantedListing.deleteMany({
      where: { id, userId: user.userId },
    });
    return res.status(200).json({ message: "Verwijderd" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
