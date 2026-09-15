import { useState } from 'react';

export default function FavoriteButton({ listingId, initialFavorited = false }) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    try {
      if (favorited) {
        const res = await fetch(`/api/favorites?listingId=${listingId}`, {
          method: 'DELETE',
        });
        if (res.ok) setFavorited(false);
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId }),
        });
        if (res.ok || res.status === 409) setFavorited(true);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="absolute top-3 right-3 z-10 bg-[#060a14]/70 rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-[#060a14] transition"
    >
      {favorited ? '❤️' : '🤍'}
    </button>
  );
}