import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export default async function handler(req, res) {
  const admin = requireAdmin(req);
  if (!admin) {
    return res.status(403).json({ error: 'Geen toegang' });
  }

  if (req.method === 'GET') {
    const listings = await prisma.seedListing.findMany({
      include: {
        species: { include: { category: true } },
        owner: { select: { username: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ listings });
  }

  if (req.method === 'DELETE') {
    const { listingId } = req.body;
    await prisma.seedListing.delete({ where: { id: listingId } });
    return res.status(200).json({ message: 'Verwijderd' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}