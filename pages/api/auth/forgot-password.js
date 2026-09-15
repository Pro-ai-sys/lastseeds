import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "E-mail is verplicht" });

  const user = await prisma.user.findUnique({ where: { email } });

  // Altijd hetzelfde bericht, ongeacht of het account bestaat (voorkomt e-mail-enumeratie)
  const genericMessage =
    "Als dit e-mailadres bij ons bekend is, ontvang je een reset-link.";

  if (!user) {
    return res.status(200).json({ message: genericMessage });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  try {
    await sendPasswordResetEmail(user.email, token);
  } catch (error) {
    console.error("Reset-mail versturen mislukt:", error);
  }

  return res.status(200).json({ message: genericMessage });
}
