import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function handler(req, res) {
  const admin = requireAdmin(req);
  if (!admin) return res.status(403).json({ error: "Geen toegang" });

  if (req.method === "GET") {
    const partners = await prisma.partner.findMany({
      orderBy: { order: "asc" },
    });
    return res.status(200).json({ partners });
  }

  if (req.method === "POST") {
    const { name, logoUrl, websiteUrl, order } = req.body;
    if (!name || !logoUrl) {
      return res.status(400).json({ error: "Naam en logo zijn verplicht" });
    }
    const partner = await prisma.partner.create({
      data: { name, logoUrl, websiteUrl, order: order ? parseInt(order) : 0 },
    });
    return res.status(201).json({ partner });
  }

  if (req.method === "DELETE") {
    const { partnerId } = req.body;
    await prisma.partner.delete({ where: { id: partnerId } });
    return res.status(200).json({ message: "Verwijderd" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
