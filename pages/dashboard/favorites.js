import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '@/components/Header';
import PhotoLightbox from '@/components/PhotoLightbox';
import FavoriteButton from '@/components/FavoriteButton';

function formatTimeLeft(endsAt) {
  const diff = new Date(endsAt) - new Date();
  if (diff <= 0) return 'Afgelopen';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  if (days > 0) return `${days}d ${hours}u resterend`;
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `${hours}u ${minutes}m resterend`;
}

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch('/api/favorites');
    if (res.status === 401) {
      router.push('/login');
      return;
    }
    const data = await res.json();
    setFavorites(data.favorites || []);
    setLoading(false);
  }

  const auctionFavorites = favorites
    .filter((f) => f.listing.listingType === 'auction' && f.listing.auction)
    .sort((a, b) => new Date(a.listing.auction.endsAt) - new Date(b.listing.auction.endsAt));

  const otherFavorites = favorites.filter((f) => f.listing.listingType !== 'auction' || !f.listing.auction);

  const typeLabel = { sale: 'Verkoop', auction: 'Veiling', trade: 'Ruil' };

  function ListingCard({ listing }) {
    return (
      <div className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-5 relative">
        <FavoriteButton listingId={listing.id} initialFavorited={true} />
        <PhotoLightbox photos={listing.photos} />
        <h3 className="font-bold text-lg mb-1">{listing.title}</h3>
        <p className="text-gray-400 text-sm mb-2">{listing.species?.name}</p>
        {listing.listingType === 'auction' && listing.auction && (
          <p className="text-amber-300 text-sm font-semibold mb-2">
            ⏱ {formatTimeLeft(listing.auction.endsAt)}
          </p>
        )}
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
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">Laden...</div>;
  }

  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      <Header />
      <div className="px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Mijn favorieten</h1>
            <Link href="/dashboard" className="text-[#4a9eff] hover:underline text-sm">← Terug naar dashboard</Link>
          </div>

          {favorites.length === 0 ? (
            <p className="text-gray-400">Je hebt nog geen favorieten opgeslagen.</p>
          ) : (
            <>
              {auctionFavorites.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-lg font-bold mb-4 text-amber-300">⏱ Aflopende veilingen</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {auctionFavorites.map((f) => (
                      <ListingCard key={f.id} listing={f.listing} />
                    ))}
                  </div>
                </div>
              )}

              {otherFavorites.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-4 text-[#4a9eff]">Overige favorieten</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {otherFavorites.map((f) => (
                      <ListingCard key={f.id} listing={f.listing} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}