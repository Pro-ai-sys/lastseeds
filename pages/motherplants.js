import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function AllMotherPlants() {
  const [motherPlants, setMotherPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/motherplants/all")
      .then((res) => res.json())
      .then((data) => setMotherPlants(data.motherPlants || []))
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
      <div className="px-6 py-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🌿 Moederplanten</h1>
        <p className="text-gray-400 mb-4">
          Planten die onze leden al jarenlang bewaren en waar elk jaar opnieuw
          zaad van geoogst wordt.
        </p>
        <Link
          href="/dashboard/motherplants"
          className="inline-block bg-[#4a9eff] hover:bg-[#3a8eef] text-white px-4 py-2 rounded-lg text-sm font-semibold transition mb-10"
        >
          + Voeg je eigen moederplant toe
        </Link>

        {motherPlants.length === 0 ? (
          <p className="text-gray-400">
            Er zijn nog geen moederplanten toegevoegd.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {motherPlants.map((mp) => (
              <div
                key={mp.id}
                className="bg-amber-900/10 border border-amber-700/40 rounded-2xl p-5"
              >
                {mp.photoUrl && (
                  <img
                    src={mp.photoUrl}
                    alt=""
                    className="w-full aspect-video object-cover rounded-lg mb-3"
                  />
                )}
                <p className="font-bold text-lg">{mp.species?.name}</p>
                {mp.species?.latinName && (
                  <p className="text-xs italic text-gray-500 mb-1">
                    {mp.species.latinName}
                  </p>
                )}
                <p className="text-xs text-gray-500 mb-1">
                  {mp.species?.category?.name}
                </p>
                <p className="text-xs text-amber-300 mb-2">
                  Sinds {mp.yearAcquired}
                </p>
                {mp.description && (
                  <p className="text-sm text-gray-300 mb-3">{mp.description}</p>
                )}
                <Link
                  href={`/shop/${mp.user.id}`}
                  className="text-[#4a9eff] hover:underline text-sm"
                >
                  Bekijk winkel van {mp.user.username} →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
