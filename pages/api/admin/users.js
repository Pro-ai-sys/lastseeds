import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export default async function handler(req, res) {
  const admin = requireAdmin(req);
  if (!admin) {
    return res.status(403).json({ error: 'Geen toegang' });
  }

  if (req.method === 'GET') {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, username: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ users });
  }

  if (req.method === 'PATCH') {
    const { userId, role } = req.body;
    if (!userId || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Ongeldige gegevens' });
    }
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    return res.status(200).json({ user: updated });
  }

  if (req.method === 'DELETE') {
    const { userId } = req.body;
    await prisma.user.delete({ where: { id: userId } });
    return res.status(200).json({ message: 'Verwijderd' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}