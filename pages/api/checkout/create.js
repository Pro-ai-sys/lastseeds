import { prisma } from '@/lib/prisma';
import { getUserFromReq } from '@/lib/auth';

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Niet ingelogd' });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { listingId } = req.body;

  const listing = await prisma.seedListing.findUnique({
    where: { id: listingId },
    include: { owner: true },
  });

  if (!listing) return res.status(404).json({ error: 'Listing niet gevonden' });
  if (listing.ownerId === user.userId) {
    return res.status(400).json({ error: 'Je kunt niet je eigen listing kopen' });
  }

  // Mollie-verplichting tijdelijk uitgeschakeld voor testfase
  // if (!listing.owner.mollieOnboarded) {
  //   return res.status(400).json({ error: 'Verkoper heeft geen betaalmethode gekoppeld' });
  // }

  if (!listing.price) {
    return res.status(400).json({ error: 'Deze listing heeft geen prijs' });
  }

  // Tijdelijke testfase-melding: betalen is nog niet volledig actief
  if (!process.env.MOLLIE_API_KEY) {
    return res.status(400).json({ error: 'Betalen is nog niet beschikbaar tijdens de testfase. Dit komt binnenkort!' });
  }

  const feePercentage = parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '7');
  const totalAmount = listing.price;
  const platformFee = Math.round(totalAmount * (feePercentage / 100) * 100) / 100;
  const sellerAmount = Math.round((totalAmount - platformFee) * 100) / 100;

  try {
    const paymentRes = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: { currency: 'EUR', value: totalAmount.toFixed(2) },
        description: `LastSeeds: ${listing.title}`,
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?listingId=${listingId}`,
        webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/webhook`,
        routing: [
          {
            amount: { currency: 'EUR', value: sellerAmount.toFixed(2) },
            destination: {
              type: 'organization',
              organizationId: listing.owner.mollieOrganizationId,
            },
          },
        ],
        metadata: { listingId, buyerId: user.userId, sellerId: listing.ownerId },
      }),
    });

    const payment = await paymentRes.json();

    if (!payment.id) {
      console.error('Mollie payment error:', payment);
      return res.status(500).json({ error: 'Betaling aanmaken mislukt' });
    }

    await prisma.payment.create({
      data: {
        listingId,
        buyerId: user.userId,
        sellerId: listing.ownerId,
        amount: totalAmount,
        status: 'held',
      },
    });

    return res.status(200).json({ checkoutUrl: payment._links.checkout.href });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Er ging iets mis' });
  }
}