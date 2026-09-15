import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to, token) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: 'LastSeeds <onboarding@resend.dev>',
    to,
    subject: 'Bevestig je e-mailadres — LastSeeds',
    html: `
      <div style="font-family: sans-serif; max-width: 500px;">
        <h2>Welkom bij LastSeeds</h2>
        <p>Klik op onderstaande link om je e-mailadres te bevestigen:</p>
        <a href="${verifyUrl}" style="background:#4a9eff;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">
          Bevestig e-mailadres
        </a>
        <p style="color:#888;font-size:12px;">Deze link is 24 uur geldig.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to, token) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: 'LastSeeds <onboarding@resend.dev>',
    to,
    subject: 'Wachtwoord resetten — LastSeeds',
    html: `
      <div style="font-family: sans-serif; max-width: 500px;">
        <h2>Wachtwoord resetten</h2>
        <p>Klik op onderstaande link om een nieuw wachtwoord in te stellen:</p>
        <a href="${resetUrl}" style="background:#4a9eff;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">
          Nieuw wachtwoord instellen
        </a>
        <p style="color:#888;font-size:12px;">Deze link is 1 uur geldig. Heb je dit niet aangevraagd? Negeer deze e-mail.</p>
      </div>
    `,
  });
}