import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.redirect("/dashboard?mollie=error");
  }

  try {
    const tokenRes = await fetch("https://api.mollie.com/oauth2/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.MOLLIE_CLIENT_ID}:${process.env.MOLLIE_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mollie/callback`,
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokens.access_token) {
      console.error("Mollie token error:", tokens);
      return res.redirect("/dashboard?mollie=error");
    }

    const orgRes = await fetch("https://api.mollie.com/v2/organizations/me", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const org = await orgRes.json();

    await prisma.user.update({
      where: { id: state },
      data: {
        mollieAccessToken: tokens.access_token,
        mollieRefreshToken: tokens.refresh_token,
        mollieOrganizationId: org.id,
        mollieOnboarded: true,
      },
    });

    return res.redirect("/dashboard?mollie=success");
  } catch (error) {
    console.error(error);
    return res.redirect("/dashboard?mollie=error");
  }
}
