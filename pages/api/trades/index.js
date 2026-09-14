import { prisma } from '@/lib/prisma';
import { getUserFromReq } from '@/lib/auth';

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Niet ingelogd' });

  if (req.method === 'GET') {
    const { type } = req.query;

    const where = type === 'sent'
      ? { senderId: user.userId }
      : { receiverId: user.userId };

    const trades = await prisma.tradeRequest.findMany({
      where,
      include: {
        listing: { include: { species: true } },
        sender: { select: { username: true } },
        receiver: { select: { username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ trades });
  }

  if (req.method === 'POST') {
    const { listingId, offerDescription } = req.body;

    if (!listingId || !offerDescription) {
      return res.status(400).json({ error: 'Listing en aanbod zijn verplicht' });
    }

    const listing = await prisma.seedListing.findUnique({ where: { id: listingId } });
    if (!listing) return res.status(404).json({ error: 'Listing niet gevonden' });
    if (listing.ownerId === user.userId) {
      return res.status(400).json({ error: 'Je kunt geen ruilverzoek sturen voor je eigen listing' });
    }

    const trade = await prisma.tradeRequest.create({
      data: {
        listingId,
        senderId: user.userId,
        receiverId: listing.ownerId,
        offerDescription,
      },
    });

    return res.status(201).json({ trade });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}