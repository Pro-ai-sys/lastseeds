import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function handler(req, res) {
  const admin = requireAdmin(req);
  if (!admin) {
    return res.status(403).json({ error: "Geen toegang" });
  }

  if (req.method === "GET") {
    const reports = await prisma.report.findMany({
      include: { reporter: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ reports });
  }

  if (req.method === "PATCH") {
    const { reportId, status } = req.body;
    const updated = await prisma.report.update({
      where: { id: reportId },
      data: { status },
    });
    return res.status(200).json({ report: updated });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
