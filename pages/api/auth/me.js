import { getUserFromReq } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  const tokenUser = getUserFromReq(req);
  if (!tokenUser) return res.status(200).json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: tokenUser.userId },
    select: { id: true, username: true, email: true, role: true, mollieOnboarded: true },
  });

  return res.status(200).json({ user });
}