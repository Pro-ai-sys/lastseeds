import { prisma } from "@/lib/prisma";
import { verifyPassword, createToken } from "@/lib/auth";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "E-mail en wachtwoord zijn verplicht" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Ongeldige inloggegevens" });
    }

    const valid = await verifyPassword(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Ongeldige inloggegevens" });
    }

    const token = createToken({ userId: user.id, role: user.role });

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      }),
    );

    return res.status(200).json({
      message: "Ingelogd",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Er ging iets mis" });
  }
}
