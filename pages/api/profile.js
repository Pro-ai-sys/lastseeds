import { prisma } from "@/lib/prisma";
import { getUserFromReq } from "@/lib/auth";

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Niet ingelogd" });

  if (req.method === "GET") {
    const profile = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatarType: true,
        avatarUrl: true,
        street: true,
        houseNumber: true,
        houseNumberAddition: true,
        postalCode: true,
        city: true,
      },
    });
    return res.status(200).json({ profile });
  }

  if (req.method === "PUT") {
    const {
      username,
      firstName,
      lastName,
      bio,
      avatarType,
      avatarUrl,
      street,
      houseNumber,
      houseNumberAddition,
      postalCode,
      city,
    } = req.body;

    if (username) {
      const existing = await prisma.user.findFirst({
        where: { username, NOT: { id: user.userId } },
      });
      if (existing) {
        return res
          .status(409)
          .json({ error: "Gebruikersnaam is al in gebruik" });
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.userId },
      data: {
        username,
        firstName,
        lastName,
        bio,
        avatarType,
        avatarUrl,
        street,
        houseNumber,
        houseNumberAddition,
        postalCode,
        city,
      },
    });

    return res
      .status(200)
      .json({ message: "Profiel bijgewerkt", profile: updated });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
