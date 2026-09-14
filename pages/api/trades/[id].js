import { prisma } from '@/lib/prisma';
import { getUserFromReq } from '@/lib/auth';

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Niet ingelogd' });

  const { id } = req.query;

  if (req.method === 'PATCH') {
    const { status } = req.body;
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Ongeldige status' });
    }

    const trade = await prisma.tradeRequest.findUnique({ where: { id } });
    if (!trade) return res.status(404).json({ error: 'Ruilverzoek niet gevonden' });
    if (trade.receiverId !== user.userId) {
      return res.status(403).json({ error: 'Geen toegang tot dit ruilverzoek' });
    }

    const updated = await prisma.tradeRequest.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json({ trade: updated });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}