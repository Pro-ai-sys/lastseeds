import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const wanted = await prisma.wantedListing.findMany({
    where: { status: "active" },
    include: {
      species: { include: { category: true } },
      user: { select: { username: true, id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json({ wanted });
}
