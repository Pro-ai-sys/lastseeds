import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const categories = await prisma.seedCategory.findMany({
    include: { species: { orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });
  return res.status(200).json({ categories });
}
