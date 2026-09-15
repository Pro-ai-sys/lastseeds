import { prisma } from '@/lib/prisma';
import PhotoLightbox from '@/components/PhotoLightbox';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const listings = await prisma.seedListing.findMany({
    where: { status: 'active' },
    include: {
      species: { include: { category: true } },
      owner: { select: { username: true } },
      auction: true,
      photos: { orderBy: { order: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json({ listings });
}