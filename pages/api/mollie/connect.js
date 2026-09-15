import { getUserFromReq } from '@/lib/auth';

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Niet ingelogd' });

  const params = new URLSearchParams({
    client_id: process.env.MOLLIE_CLIENT_ID,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mollie/callback`,
    state: user.userId,
    scope: 'payments.write payments.read organizations.read onboarding.read profiles.write',
    response_type: 'code',
    approval_prompt: 'auto',
  });

  res.redirect(`https://my.mollie.com/oauth2/authorize?${params}`);
}