import { prisma } from "@/lib/prisma";
import { getUserFromReq } from "@/lib/auth";

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Niet ingelogd" });

  if (req.method === "GET") {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: user.userId }, { receiverId: user.userId }],
      },
      include: {
        sender: { select: { id: true, username: true } },
        receiver: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const conversationsMap = {};
    for (const msg of messages) {
      const otherUser =
        msg.senderId === user.userId ? msg.receiver : msg.sender;
      if (!conversationsMap[otherUser.id]) {
        conversationsMap[otherUser.id] = {
          otherUser,
          lastMessage: msg,
          unreadCount: 0,
        };
      }
      if (msg.receiverId === user.userId && !msg.read) {
        conversationsMap[otherUser.id].unreadCount++;
      }
    }

    return res
      .status(200)
      .json({ conversations: Object.values(conversationsMap) });
  }

  if (req.method === "POST") {
    const { receiverId, content } = req.body;

    if (!receiverId || !content?.trim()) {
      return res
        .status(400)
        .json({ error: "Ontvanger en bericht zijn verplicht" });
    }

    if (receiverId === user.userId) {
      return res
        .status(400)
        .json({ error: "Je kunt jezelf geen bericht sturen" });
    }

    const message = await prisma.message.create({
      data: {
        senderId: user.userId,
        receiverId,
        content: content.trim(),
      },
    });

    return res.status(201).json({ message });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
