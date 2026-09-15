import { prisma } from "@/lib/prisma";
import { getUserFromReq } from "@/lib/auth";

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Niet ingelogd" });

  if (req.method === "GET") {
    const motherPlants = await prisma.motherPlant.findMany({
      where: { userId: user.userId },
      include: { species: { include: { category: true } } },
      orderBy: { yearAcquired: "asc" },
    });
    return res.status(200).json({ motherPlants });
  }

  if (req.method === "POST") {
    const { speciesId, yearAcquired, description, photoUrl } = req.body;
    if (!speciesId || !yearAcquired) {
      return res.status(400).json({ error: "Soort en jaar zijn verplicht" });
    }

    const motherPlant = await prisma.motherPlant.create({
      data: {
        userId: user.userId,
        speciesId,
        yearAcquired: parseInt(yearAcquired),
        description,
        photoUrl,
      },
    });

    return res.status(201).json({ motherPlant });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await prisma.motherPlant.deleteMany({
      where: { id, userId: user.userId },
    });
    return res.status(200).json({ message: "Verwijderd" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
