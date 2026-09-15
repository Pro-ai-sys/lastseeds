import { prisma } from '@/lib/prisma';
import { getUserFromReq } from '@/lib/auth';

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Niet ingelogd' });

  const { userId: otherUserId } = req.query;

  if (req.method === 'GET') {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: user.userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    await prisma.message.updateMany({
      where: { senderId: otherUserId, receiverId: user.userId, read: false },
      data: { read: true },
    });

    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: { id: true, username: true },
    });

    return res.status(200).json({ messages, otherUser });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}