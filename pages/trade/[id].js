import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function TradeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);
  const [offer, setOffer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadListing();
  }, [id]);

  async function loadListing() {
    const res = await fetch(`/api/listings/${id}`);
    const data = await res.json();
    setListing(data.listing);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const res = await fetch('/api/trades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId: id, offerDescription: offer }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      setError(data.error || 'Er ging iets mis');
      return;
    }

    setSuccess('Je ruilaanbod is verstuurd!');
    setOffer('');
  }

  if (loading) {
    return <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">Laden...</div>;
  }

  if (!listing) {
    return <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">Listing niet gevonden.</div>;
  }

  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      <nav className="flex justify-between items-center px-6 py-4 border-b border-[#2a3a55]">
        <Link href="/" className="text-xl font-bold text-[#4a9eff]">LastSeeds</Link>
        <Link href="/marketplace?type=trade" className="text-gray-300 hover:text-white">← Terug naar ruilen</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            {listing.isHeirloom && (
              <span className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded-full">🌱 Heirloom</span>
            )}
          </div>
          <p className="text-gray-400 mb-1">{listing.species?.category?.name} · {listing.species?.name}</p>
          <p className="text-gray-400 text-sm mb-4">{listing.description}</p>

          <div className="text-sm text-gray-400 space-y-1 mb-6">
            {listing.originCountry && <p>Herkomst: {listing.originCountry}</p>}
            {listing.plantingMonth && <p>Planten: {listing.plantingMonth}</p>}
            <p>Aangeboden door: {listing.owner?.username}</p>
          </div>

          <form onSubmit={handleSubmit}>
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

            <label className="block text-sm text-gray-300 mb-1">Wat bied je in ruil aan?</label>
            <textarea
              value={offer} onChange={(e) => setOffer(e.target.value)} rows={3} required
              placeholder="Bijv. 10 gram tomatenzaad 'Coeur de Boeuf'"
              className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff] mb-3"
            />

            <button
              type="submit"
              className="bg-[#4a9eff] hover:bg-[#3a8eef] px-6 py-2 rounded-lg font-semibold transition"
            >
              Ruilaanbod versturen
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}