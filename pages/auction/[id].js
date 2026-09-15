import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/Header";
import PhotoLightbox from "@/components/PhotoLightbox";

export default function AuctionDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [auction, setAuction] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadAuction();
  }, [id]);

  async function loadAuction() {
    const res = await fetch(`/api/auctions/${id}`);
    const data = await res.json();
    setAuction(data.auction);
    setLoading(false);
  }

  async function handleBid(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch(`/api/auctions/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      setError(data.error || "Er ging iets mis");
      return;
    }

    setSuccess("Je bod is geplaatst!");
    setAmount("");
    loadAuction();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">
        Laden...
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">
        Veiling niet gevonden.
      </div>
    );
  }

  const highestBid = auction.bids[0]?.amount || auction.startPrice;
  const isExpired = new Date() > new Date(auction.endsAt);

  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      <Header />
      <div className="px-6 py-6">
        <Link
          href="/marketplace?type=auction"
          className="text-gray-300 hover:text-white text-sm"
        >
          ← Terug naar veilingen
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-4">
        <div className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-6">
          <PhotoLightbox photos={auction.listing.photos} />

          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold">{auction.listing.title}</h1>
            {auction.listing.isHeirloom && (
              <span className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded-full">
                🌱 Heirloom
              </span>
            )}
          </div>
          <p className="text-gray-400 mb-1">
            {auction.listing.species?.category?.name} ·{" "}
            {auction.listing.species?.name}
          </p>
          <p className="text-gray-400 text-sm mb-4">
            {auction.listing.description}
          </p>

          <div className="text-sm text-gray-400 space-y-1 mb-6">
            {auction.listing.originCountry && (
              <p>Herkomst: {auction.listing.originCountry}</p>
            )}
            {auction.listing.plantingMonth && (
              <p>Planten: {auction.listing.plantingMonth}</p>
            )}
            <p>Aangeboden door: {auction.listing.owner?.username}</p>
            <p>Sluit op: {new Date(auction.endsAt).toLocaleString("nl-NL")}</p>
          </div>

          <div className="bg-[#0a0e1a] border border-[#2a3a55] rounded-xl p-4 mb-6">
            <p className="text-gray-400 text-sm">Huidig hoogste bod</p>
            <p className="text-3xl font-bold text-[#4a9eff]">€{highestBid}</p>
            <p className="text-xs text-gray-500">
              Startprijs was €{auction.startPrice}
            </p>
          </div>

          {isExpired ? (
            <p className="text-red-400 text-sm mb-6">
              Deze veiling is gesloten.
            </p>
          ) : (
            <form onSubmit={handleBid} className="mb-6">
              {error && (
                <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-2 text-sm mb-3">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-900/40 border border-green-700 text-green-300 rounded-lg px-4 py-2 text-sm mb-3">
                  {success}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  min={highestBid + 0.01}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Meer dan €${highestBid}`}
                  className="flex-1 bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                />
                <button
                  type="submit"
                  className="bg-[#4a9eff] hover:bg-[#3a8eef] px-6 py-2 rounded-lg font-semibold transition"
                >
                  Bieden
                </button>
              </div>
            </form>
          )}

          <div>
            <h2 className="font-bold mb-3">Biedgeschiedenis</h2>
            {auction.bids.length === 0 ? (
              <p className="text-gray-500 text-sm">Nog geen biedingen.</p>
            ) : (
              <div className="space-y-2">
                {auction.bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="flex justify-between text-sm bg-[#0a0e1a] rounded-lg px-3 py-2"
                  >
                    <span className="text-gray-300">
                      {bid.bidder?.username}
                    </span>
                    <span className="text-[#4a9eff] font-semibold">
                      €{bid.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
