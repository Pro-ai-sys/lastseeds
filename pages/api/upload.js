import { put } from "@vercel/blob";
import sharp from "sharp";
import { getUserFromReq } from "@/lib/auth";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Niet ingelogd" });

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const resized = await sharp(buffer)
      .resize(800, 800, { fit: "cover" })
      .jpeg({ quality: 85 })
      .toBuffer();

    const filename = `listing-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

    const blob = await put(filename, resized, {
      access: "public",
      contentType: "image/jpeg",
    });

    return res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Upload mislukt" });
  }
}
