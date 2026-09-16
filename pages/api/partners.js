import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });
  return res.status(200).json({ partners });
}
