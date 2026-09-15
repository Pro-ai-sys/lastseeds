import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '@/components/Header';
import PhotoLightbox from '@/components/PhotoLightbox';
import Avatar from '@/components/Avatar';

export default function Shop() {
  const router = useRouter();
  const { sellerId } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sellerId) load();
  }, [sellerId]);

  async function load() {
    const res = await fetch(`/api/shop/${sellerId}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  if (loading) {
    return <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">Laden...</div>;
  }

  if (!data?.seller) {
    return <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">Winkel niet gevonden.</div>;
  }

  const { seller, listings } = data;
  const typeLabel = { sale: 'Verkoop', auction: 'Veiling', trade: 'Ruil' };

  const grouped = listings.reduce((acc, listing) => {
    const catName = listing.species?.category?.name || 'Overig';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(listing);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      <Header />

      <div className="px-6 py-10 max-w-6xl mx-auto">
        {/* Winkel-header */}
        <div className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-6 mb-10 flex items-center gap-5">
          <Avatar type={seller.avatarType} url={seller.avatarUrl} size={72} />
          <div>
            <h1 className="text-2xl font-bold">{seller.username}&apos;s winkel</h1>
            {seller.city && <p className="text-gray-400 text-sm">{seller.city}</p>}
            {seller.bio && <p className="text-gray-300 text-sm mt-1">{seller.bio}</p>}
            <Link href={`/seller/${seller.id}`} className="text-[#4a9eff] hover:underline text-sm mt-2 inline-block">
              Bekijk reviews en profiel →
            </Link>
          </div>
        </div>

        {listings.length === 0 ? (
          <p className="text-gray-400">Deze verkoper heeft nog geen actieve listings.</p>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-12">
              <h2 className="text-xl font-bold mb-4 text-[#4a9eff]">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {items.map((listing) => (
                  <div key={listing.id} className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-5">
                    <PhotoLightbox photos={listing.photos} />
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{listing.title}</h3>
                      {listing.isHeirloom && (
                        <span className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded-full">🌱</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{listing.species?.name}</p>
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