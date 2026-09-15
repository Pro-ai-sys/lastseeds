import { prisma } from '@/lib/prisma';
import { getUserFromReq } from '@/lib/auth';

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Niet ingelogd' });

  const unreadMessages = await prisma.message.count({
    where: { receiverId: user.userId, read: false },
  });

  const pendingTrades = await prisma.tradeRequest.count({
    where: { receiverId: user.userId, status: 'pending' },
  });

  return res.status(200).json({ unreadMessages, pendingTrades });
}