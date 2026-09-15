import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, password } = req.body;

  if (!token || !password) {
    return res
      .status(400)
      .json({ error: "Token en wachtwoord zijn verplicht" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Wachtwoord moet minimaal 8 tekens zijn" });
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.used || new Date() > resetToken.expiresAt) {
    return res.status(400).json({ error: "Ongeldige of verlopen link" });
  }

  const hashedPassword = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    }),
  ]);

  return res.status(200).json({ message: "Wachtwoord succesvol gewijzigd" });
}
