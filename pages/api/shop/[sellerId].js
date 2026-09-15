import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  const { sellerId } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const seller = await prisma.user.findUnique({
    where: { id: sellerId },
    select: {
      id: true, username: true, bio: true, city: true,
      avatarType: true, avatarUrl: true, createdAt: true,
    },
  });

  if (!seller) return res.status(404).json({ error: 'Verkoper niet gevonden' });

  const listings = await prisma.seedListing.findMany({
    where: { ownerId: sellerId, status: 'active' },
    include: {
      species: { include: { category: true } },
      auction: true,
      photos: { orderBy: { order: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json({ seller, listings });
}