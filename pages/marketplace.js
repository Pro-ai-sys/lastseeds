import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '@/components/Header';

export default function Marketplace() {
  const router = useRouter();
  const { type } = router.query;
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/marketplace')
      .then((res) => res.json())
      .then((data) => setListings(data.listings || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = type ? listings.filter((l) => l.listingType === type) : listings;

  const grouped = filtered.reduce((acc, listing) => {
    const catName = listing.species?.category?.name || 'Overig';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(listing);
    return acc;
  }, {});

  const typeLabel = { sale: 'Verkoop', auction: 'Veiling', trade: 'Ruil' };
  const pageTitle = type === 'auction' ? 'Veilingen' : type === 'trade' ? 'Ruilen' : 'De Kluis';
  const pageSubtitle =
    type === 'auction'
      ? 'Zeldzame zaden waarop geboden kan worden.'
      : type === 'trade'
      ? 'Zaden die aangeboden worden om te ruilen.'
      : 'Alle zaden die beschikbaar zijn om te kopen, veilen of ruilen.';

  if (loading) {
    return <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">Laden...</div>;
  }

  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      <Header />

      <div className="px-6 py-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          {type && (
            <Link href="/marketplace" className="text-sm text-[#4a9eff] hover:underline">
              (toon alles)
            </Link>
          )}
        </div>
        <p className="text-gray-400 mb-10">{pageSubtitle}</p>

        {Object.keys(grouped).length === 0 ? (
          <p className="text-gray-400">Er staan hier nog geen listings.</p>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-12">
              <h2 className="text-xl font-bold mb-4 text-[#4a9eff]">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {items.map((listing) => (
                  <div key={listing.id} className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{listing.title}</h3>
                      {listing.isHeirloom && (
                        <span className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded-full">🌱</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{listing.species?.name}</p>
                    {listing.description && (
                      <p className="text-gray-400 text-sm mb-3">{listing.description}</p>
                    )}
                    <div className="text-xs text-gray-500 space-y-1 mb-2">
                      {listing.originCountry && <p>Herkomst: {listing.originCountry}</p>}
                      {listing.plantingMonth && <p>Planten: {listing.plantingMonth}</p>}
                      <p>Aangeboden door: {listing.owner?.username}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs bg-[#2a3a55] px-2 py-1 rounded-full">{typeLabel[listing.listingType]}</span>
                      {listing.price && <span className="text-[#4a9eff] font-semibold">€{listing.price}</span>}
                    </div>
                    {listing.listingType === 'auction' && listing.auction && (
                      <Link
                        href={`/auction/${listing.auction.id}`}
                        className="block mt-3 text-center bg-[#4a9eff] hover:bg-[#3a8eef] py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Bekijk veiling
                      </Link>
                    )}
                    {listing.listingType === 'trade' && (
                      <Link
                        href={`/trade/${listing.id}`}
                        className="block mt-3 text-center bg-[#4a9eff] hover:bg-[#3a8eef] py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Doe een ruilaanbod
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}