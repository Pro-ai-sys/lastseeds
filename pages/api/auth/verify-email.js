import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token ontbreekt' });

  const verification = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!verification || verification.used || new Date() > verification.expiresAt) {
    return res.status(400).json({ error: 'Ongeldige of verlopen verificatielink' });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: verification.userId },
      data: { emailVerified: true },
    }),
    prisma.emailVerificationToken.update({
      where: { id: verification.id },
      data: { used: true },
    }),
  ]);

  return res.status(200).json({ message: 'E-mailadres bevestigd' });
}