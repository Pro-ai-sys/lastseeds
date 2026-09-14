import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const listing = await prisma.seedListing.findUnique({
    where: { id },
    include: {
      species: { include: { category: true } },
      owner: { select: { username: true } },
    },
  });

  if (!listing) return res.status(404).json({ error: 'Listing niet gevonden' });
  return res.status(200).json({ listing });
}