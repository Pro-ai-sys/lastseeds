import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/Header";
import PhotoLightbox from "@/components/PhotoLightbox";
import CategorySidebar from "@/components/CategorySidebar";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import FavoriteButton from "@/components/FavoriteButton";

export default function Marketplace() {
  const router = useRouter();
  const { type, species } = router.query;
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    Promise.all([
      fetch("/api/marketplace").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
    ]).then(([listingsData, categoriesData]) => {
      setListings(listingsData.listings || []);
      setCategories(categoriesData.categories || []);
      setLoading(false);
    });
  }, []);

  let filtered = type
    ? listings.filter((l) => l.listingType === type)
    : listings;
  if (species) {
    filtered = filtered.filter((l) => l.speciesId === species);
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(term) ||
        l.species?.name.toLowerCase().includes(term) ||
        l.description?.toLowerCase().includes(term),
    );
  }

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
    if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const grouped = filtered.reduce((acc, listing) => {
    const catName = listing.species?.category?.name || "Overig";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(listing);
    return acc;
  }, {});

  const typeLabel = { sale: "Verkoop", auction: "Veiling", trade: "Ruil" };
  const pageTitle =
    type === "auction" ? "Veilingen" : type === "trade" ? "Ruilen" : "Aanbod";
  const pageSubtitle =
    type === "auction"
      ? "Zeldzame zaden waarop geboden kan worden."
      : type === "trade"
        ? "Zaden die aangeboden worden om te ruilen."
        : "Alle zaden die beschikbaar zijn om te kopen, veilen of ruilen.";

  async function handleBuy(listingId) {
    const res = await fetch("/api/checkout/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });
    const data = await res.json();
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else {
      alert(data.error || "Er ging iets mis");
    }
  }

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

      <div className="px-6 py-10 max-w-7xl mx-auto flex gap-6">
        <CategorySidebar categories={categories} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            {(type || species) && (
              <Link
                href="/marketplace"
                className="text-sm text-[#4a9eff] hover:underline"
              >
                (toon alles)
              </Link>
            )}
          </div>
          <p className="text-gray-400 mb-6">{pageSubtitle}</p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Zoek op naam, soort of beschrijving..."
              className="flex-1 bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
            >
              <option value="newest">Nieuwste eerst</option>
              <option value="price-asc">Prijs: laag naar hoog</option>
              <option value="price-desc">Prijs: hoog naar laag</option>
            </select>
          </div>

          {Object.keys(grouped).length === 0 ? (
            <p className="text-gray-400">Er staan hier nog geen listings.</p>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-12">
                <h2 className="text-xl font-bold mb-4 text-[#4a9eff]">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {items.map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-5 relative"
                    >
                      <FavoriteButton listingId={listing.id} />
                      <PhotoLightbox photos={listing.photos} />
                      <LegalDisclaimer
                        categoryName={listing.species?.category?.name}
                      />
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{listing.title}</h3>
                        {listing.isHeirloom && (
                          <span className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded-full">
                            🌱
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {listing.species?.name}
                      </p>
                      {listing.description && (
                        <p className="text-gray-400 text-sm mb-3">
                          {listing.description}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 space-y-1 mb-2">
                        {listing.originCountry && (
                          <p>Herkomst: {listing.originCountry}</p>
                        )}
                        {listing.plantingMonth && (
                          <p>Planten: {listing.plantingMonth}</p>
                        )}
                        <p>
                          Aangeboden door:{" "}
                          <Link
                            href={`/seller/${listing.ownerId}`}
                            className="text-[#4a9eff] hover:underline"
                          >
                            {listing.owner?.username}
                          </Link>
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs bg-[#2a3a55] px-2 py-1 rounded-full">
                          {typeLabel[listing.listingType]}
                        </span>
                        {listing.price && (
                          <span className="text-[#4a9eff] font-semibold">
                            €{listing.price}
                          </span>
                        )}
                      </div>
                      {listing.listingType === "sale" && listing.price && (
                        <button
                          onClick={() => handleBuy(listing.id)}
                          className="block w-full mt-3 text-center bg-[#4a9eff] hover:bg-[#3a8eef] py-2 rounded-lg text-sm font-semibold transition"
                        >
                          Koop nu
                        </button>
                      )}
                      {listing.listingType === "auction" && listing.auction && (
                        <Link
                          href={`/auction/${listing.auction.id}`}
                          className="block mt-3 text-center bg-[#4a9eff] hover:bg-[#3a8eef] py-2 rounded-lg text-sm font-semibold transition"
                        >
                          Bekijk veiling
                        </Link>
                      )}
                      {listing.listingType === "trade" && (
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
    </div>
  );
}
