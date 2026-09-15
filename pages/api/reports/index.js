import { prisma } from "@/lib/prisma";
import { getUserFromReq } from "@/lib/auth";

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Niet ingelogd" });

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { targetType, targetId, reason, description } = req.body;

  if (!targetType || !targetId || !reason) {
    return res
      .status(400)
      .json({ error: "Type, doel en reden zijn verplicht" });
  }

  const report = await prisma.report.create({
    data: {
      reporterId: user.userId,
      targetType,
      targetId,
      reason,
      description,
    },
  });

  return res.status(201).json({ report });
}
