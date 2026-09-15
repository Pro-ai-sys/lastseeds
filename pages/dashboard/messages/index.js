import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '@/components/Header';

export default function MessagesOverview() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/messages')
      .then((res) => {
        if (res.status === 401) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setConversations(data.conversations || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">Laden...</div>;
  }

  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      <Header />
      <div className="px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Berichten</h1>
            <Link href="/dashboard" className="text-[#4a9eff] hover:underline text-sm">← Terug naar dashboard</Link>
          </div>

          {conversations.length === 0 ? (
            <p className="text-gray-400">Je hebt nog geen gesprekken.</p>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <Link
                  key={conv.otherUser.id}
                  href={`/dashboard/messages/${conv.otherUser.id}`}
                  className="block bg-[#101828] border border-[#2a3a55] hover:border-[#4a9eff] rounded-xl p-4 transition"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{conv.otherUser.username}</span>
                    {conv.unreadCount > 0 && (
                      <span className="bg-[#4a9eff] text-white text-xs px-2 py-1 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm truncate mt-1">{conv.lastMessage.content}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}