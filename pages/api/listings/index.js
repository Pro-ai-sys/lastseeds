import { prisma } from '@/lib/prisma';
import { getUserFromReq } from '@/lib/auth';

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) {
    return res.status(401).json({ error: 'Niet ingelogd' });
  }

  if (req.method === 'GET') {
    const listings = await prisma.seedListing.findMany({
      where: { ownerId: user.userId },
      include: {
        species: { include: { category: true } },
        auction: { include: { bids: true } },
        photos: { orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ listings });
  }

  if (req.method === 'POST') {
    const {
      title, description, quantity, quantityUnit, isHeirloom, listingType, price,
      speciesId, originCountry, plantingMonth, startPrice, auctionDays, photoUrls,
    } = req.body;

    if (!title || !speciesId) {
        return res.status(400).json({ error: 'Titel en soort zijn verplicht' });
      }
      
      if ((listingType === 'sale' || listingType === 'auction')) {
        const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
        if (!dbUser.mollieOnboarded) {
          return res.status(403).json({ error: 'Koppel eerst je Mollie-account om te kunnen verkopen of veilen' });
        }
      }

    if (listingType === 'auction' && (!startPrice || !auctionDays)) {
      return res.status(400).json({ error: 'Startprijs en duur zijn verplicht voor een veiling' });
    }

    try {
      const listing = await prisma.seedListing.create({
        data: {
          title,
          description,
          quantity: quantity ? parseInt(quantity) : 1,
          quantityUnit: quantityUnit || 'zaadjes',
          isHeirloom: isHeirloom !== false,
          listingType: listingType || 'sale',
          price: price ? parseFloat(price) : null,
          originCountry,
          plantingMonth,
          ownerId: user.userId,
          speciesId,
        },
      });

      if (listingType === 'auction') {
        const endsAt = new Date();
        endsAt.setDate(endsAt.getDate() + parseInt(auctionDays));

        await prisma.auction.create({
          data: {
            listingId: listing.id,
            startPrice: parseFloat(startPrice),
            endsAt,
          },
        });
      }

      if (photoUrls && photoUrls.length > 0) {
        await prisma.photo.createMany({
          data: photoUrls.map((url, index) => ({
            listingId: listing.id,
            url,
            order: index,
          })),
        });
      }

      return res.status(201).json({ listing });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Er ging iets mis' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}