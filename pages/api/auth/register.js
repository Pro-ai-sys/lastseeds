import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Alle velden zijn verplicht' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Wachtwoord moet minimaal 8 tekens zijn' });
  }

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      return res.status(409).json({ error: 'E-mail of gebruikersnaam is al in gebruik' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: 'Account aangemaakt',
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Er ging iets mis' });
  }
}