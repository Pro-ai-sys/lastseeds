import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const motherPlants = await prisma.motherPlant.findMany({
    include: {
      species: { include: { category: true } },
      user: { select: { id: true, username: true } },
    },
    orderBy: { yearAcquired: "asc" },
  });

  return res.status(200).json({ motherPlants });
}
