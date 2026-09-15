import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function WantedOverview() {
  const [wanted, setWanted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wanted/all")
      .then((res) => res.json())
      .then((data) => setWanted(data.wanted || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">
        Laden...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      <Header />
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Wat anderen zoeken</h1>
        <p className="text-gray-400 mb-8">
          Heb jij een van deze zaden liggen? Stuur een bericht naar deze
          gebruikers om te ruilen of te verkopen.
        </p>

        {wanted.length === 0 ? (
          <p className="text-gray-400">Er staat nog niets op de zoeklijst.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wanted.map((w) => (
              <div
                key={w.id}
                className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-5"
              >
                <p className="font-bold text-lg">{w.species?.name}</p>
                <p className="text-xs text-gray-500 mb-2">
                  {w.species?.category?.name}
                </p>
                {w.description && (
                  <p className="text-gray-300 text-sm mb-3">{w.description}</p>
                )}
                <p className="text-xs text-gray-500 mb-3">
                  Gezocht door:{" "}
                  <Link
                    href={`/seller/${w.user.id}`}
                    className="text-[#4a9eff] hover:underline"
                  >
                    {w.user.username}
                  </Link>
                </p>
                <Link
                  href={`/dashboard/messages/${w.user.id}`}
                  className="block text-center bg-[#4a9eff] hover:bg-[#3a8eef] py-2 rounded-lg text-sm font-semibold transition"
                >
                  Ik heb dit! Stuur bericht
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
