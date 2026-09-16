import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_ADDRESS =
  process.env.EMAIL_FROM_ADDRESS || "LastSeeds <onboarding@resend.dev>";

function baseTemplate(title, message, buttonText, buttonUrl) {
  return `
    <div style="font-family: sans-serif; max-width: 500px;">
      <h2>${title}</h2>
      <p>${message}</p>
      ${
        buttonUrl
          ? `
        <a href="${buttonUrl}" style="background:#4a9eff;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:10px;">
          ${buttonText}
        </a>
      `
          : ""
      }
      <p style="color:#888;font-size:12px;margin-top:20px;">LastSeeds</p>
    </div>
  `;
}

export async function sendVerificationEmail(to, token) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Bevestig je e-mailadres — LastSeeds",
    html: baseTemplate(
      "Welkom bij LastSeeds",
      "Klik op onderstaande link om je e-mailadres te bevestigen.",
      "Bevestig e-mailadres",
      verifyUrl
    ),
  });
}

export async function sendPasswordResetEmail(to, token) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Wachtwoord resetten — LastSeeds",
    html: baseTemplate(
      "Wachtwoord resetten",
      "Klik op onderstaande link om een nieuw wachtwoord in te stellen. Heb je dit niet aangevraagd? Negeer deze e-mail.",
      "Nieuw wachtwoord instellen",
      resetUrl
    ),
  });
}

export async function sendNewMessageEmail(to, senderUsername) {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Nieuw bericht van ${senderUsername} — LastSeeds`,
    html: baseTemplate(
      "Je hebt een nieuw bericht",
      `${senderUsername} heeft je een bericht gestuurd op LastSeeds.`,
      "Bekijk bericht",
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/messages`
    ),
  });
}

export async function sendNewTradeRequestEmail(
  to,
  senderUsername,
  listingTitle
) {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Nieuw ruilverzoek voor "${listingTitle}" — LastSeeds`,
    html: baseTemplate(
      "Je hebt een ruilverzoek ontvangen",
      `${senderUsername} wil graag ruilen voor je listing "${listingTitle}".`,
      "Bekijk ruilverzoek",
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/trades`
    ),
  });
}

export async function sendTradeStatusEmail(to, status, listingTitle) {
  const statusText = status === "accepted" ? "geaccepteerd" : "afgewezen";
  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Je ruilverzoek is ${statusText} — LastSeeds`,
    html: baseTemplate(
      `Je ruilverzoek is ${statusText}`,
      `Je ruilverzoek voor "${listingTitle}" is ${statusText}.`,
      "Bekijk details",
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/trades`
    ),
  });
}

export async function sendOutbidEmail(to, listingTitle, auctionId) {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Je bent overboden op "${listingTitle}" — LastSeeds`,
    html: baseTemplate(
      "Je bent overboden",
      `Iemand heeft een hoger bod geplaatst op "${listingTitle}". Wil je nog een kans maken?`,
      "Bekijk veiling",
      `${process.env.NEXT_PUBLIC_BASE_URL}/auction/${auctionId}`
    ),
  });
}

export async function sendAuctionWonEmail(to, listingTitle, auctionId) {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Je hebt de veiling gewonnen! — LastSeeds",
    html: baseTemplate(
      "Gefeliciteerd, je hebt gewonnen!",
      `Je hebt de veiling voor "${listingTitle}" gewonnen.`,
      "Bekijk veiling",
      `${process.env.NEXT_PUBLIC_BASE_URL}/auction/${auctionId}`
    ),
  });
}

export async function sendNewReviewEmail(to, reviewerUsername, rating) {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Nieuwe review ontvangen — LastSeeds",
    html: baseTemplate(
      "Je hebt een nieuwe review ontvangen",
      `${reviewerUsername} heeft je een review gegeven met ${rating} sterren.`,
      "Bekijk je profiel",
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/profile`
    ),
  });
}

export async function sendNewReportEmail(to, reason, targetType) {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Nieuwe melding binnengekomen — LastSeeds Admin",
    html: baseTemplate(
      "Nieuwe melding",
      `Er is een nieuwe melding binnengekomen (${targetType}, reden: ${reason}).`,
      "Bekijk meldingen",
      `${process.env.NEXT_PUBLIC_BASE_URL}/admin`
    ),
  });
}
