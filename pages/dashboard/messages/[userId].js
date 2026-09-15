import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/Header";

export default function Conversation() {
  const router = useRouter();
  const { userId } = router.query;
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (userId) loadMessages();
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadMessages() {
    const res = await fetch(`/api/messages/${userId}`);
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setMessages(data.messages || []);
    setOtherUser(data.otherUser);
    setLoading(false);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!content.trim()) return;

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: userId, content }),
    });

    setContent("");
    loadMessages();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">
        Laden...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a14] text-white flex flex-col">
      <Header />
      <div className="px-6 py-6 border-b border-[#2a3a55] max-w-2xl mx-auto w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{otherUser?.username}</h1>
          <Link
            href="/dashboard/messages"
            className="text-[#4a9eff] hover:underline text-sm"
          >
            ← Alle gesprekken
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full space-y-3">
        {messages.map((msg) => {
          const isMine = msg.senderId !== userId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  isMine
                    ? "bg-[#4a9eff] text-white"
                    : "bg-[#101828] border border-[#2a3a55] text-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="px-6 py-4 border-t border-[#2a3a55] max-w-2xl mx-auto w-full flex gap-2"
      >
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Typ een bericht..."
          className="flex-1 bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
        />
        <button
          type="submit"
          className="bg-[#4a9eff] hover:bg-[#3a8eef] px-4 py-2 rounded-lg font-semibold transition"
        >
          Versturen
        </button>
      </form>
    </div>
  );
}
