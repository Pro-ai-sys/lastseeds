import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/Header";

export default function Trades() {
  const router = useRouter();
  const [tab, setTab] = useState("received");
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrades();
  }, [tab]);

  async function loadTrades() {
    setLoading(true);
    const res = await fetch(`/api/trades?type=${tab}`);
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setTrades(data.trades || []);
    setLoading(false);
  }

  async function respond(id, status) {
    await fetch(`/api/trades/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadTrades();
  }

  const statusLabel = {
    pending: "In afwachting",
    accepted: "Geaccepteerd",
    declined: "Afgewezen",
  };
  const statusColor = {
    pending: "text-yellow-400",
    accepted: "text-green-400",
    declined: "text-red-400",
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      <Header />
      <div className="px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Ruilverzoeken</h1>
            <Link
              href="/dashboard"
              className="text-[#4a9eff] hover:underline text-sm"
            >
              ← Terug naar dashboard
            </Link>
          </div>

          <div className="flex gap-2 mb-6 border-b border-[#2a3a55]">
            {["received", "sent"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 font-semibold ${tab === t ? "text-[#4a9eff] border-b-2 border-[#4a9eff]" : "text-gray-400"}`}
              >
                {t === "received" ? "Ontvangen" : "Verstuurd"}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-gray-400">Laden...</p>
          ) : trades.length === 0 ? (
            <p className="text-gray-400">Geen ruilverzoeken gevonden.</p>
          ) : (
            <div className="space-y-3">
              {trades.map((trade) => (
                <div
                  key={trade.id}
                  className="bg-[#101828] border border-[#2a3a55] rounded-xl p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold">{trade.listing?.title}</p>
                    <span
                      className={`text-xs font-semibold ${statusColor[trade.status]}`}
                    >
                      {statusLabel[trade.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    {tab === "received"
                      ? `Van: ${trade.sender?.username}`
                      : `Aan: ${trade.receiver?.username}`}
                  </p>
                  <p className="text-sm text-gray-300 mb-3">
                    Aanbod: {trade.offerDescription}
                  </p>

                  {tab === "received" && trade.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => respond(trade.id, "accepted")}
                        className="bg-green-700 hover:bg-green-600 px-3 py-1 rounded-lg text-sm"
                      >
                        Accepteren
                      </button>
                      <button
                        onClick={() => respond(trade.id, "declined")}
                        className="bg-red-900 hover:bg-red-800 px-3 py-1 rounded-lg text-sm"
                      >
                        Afwijzen
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
