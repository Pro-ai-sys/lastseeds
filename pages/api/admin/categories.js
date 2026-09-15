import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function handler(req, res) {
  const admin = requireAdmin(req);
  if (!admin) {
    return res.status(403).json({ error: "Geen toegang" });
  }

  if (req.method === "GET") {
    const categories = await prisma.seedCategory.findMany({
      orderBy: { name: "asc" },
    });
    return res.status(200).json({ categories });
  }

  if (req.method === "POST") {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Naam is verplicht" });
    const category = await prisma.seedCategory.create({
      data: { name, description },
    });
    return res.status(201).json({ category });
  }

  if (req.method === "DELETE") {
    const { categoryId } = req.body;
    await prisma.seedCategory.delete({ where: { id: categoryId } });
    return res.status(200).json({ message: "Verwijderd" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
