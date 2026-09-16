import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/Header";
import PhotoLightbox from "@/components/PhotoLightbox";
import CategorySidebar from "@/components/CategorySidebar";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import LivestockDisclaimer from "@/components/LivestockDisclaimer";
import FavoriteButton from "@/components/FavoriteButton";
import LocationCircleMap from "@/components/LocationCircleMap";
import { countries } from "@/lib/countries";
import { prisma } from "@/lib/prisma";
import ReportButton from "@/components/ReportButton";
import ContactSellerButton from "@/components/ContactSellerButton";

const PAGE_SIZE = 24;

export async function getServerSideProps({ query }) {
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * PAGE_SIZE;

  const where = { status: "active" };
  if (query.category === "heritage-vee") {
    where.species = { category: { name: "Heritage Vee" } };
  } else {
    where.species = { category: { name: { not: "Heritage Vee" } } };
  }

  const [listings, totalCount, categories] = await Promise.all([
    prisma.seedListing.findMany({
      where,
      include: {
        species: { include: { category: true } },
        owner: {
          select: {
            username: true,
            city: true,
            country: true,
            latitude: true,
            longitude: true,
          },
        },
        auction: true,
        photos: { orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.seedListing.count({ where }),
    prisma.seedCategory.findMany({
      include: { species: { orderBy: { name: "asc" } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    props: {
      initialListings: JSON.parse(JSON.stringify(listings)),
      initialCategories: JSON.parse(JSON.stringify(categories)),
      currentPage: page,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
    },
  };
}

export default function Marketplace({
  initialListings,
  initialCategories,
  currentPage,
  totalPages,
}) {
  const router = useRouter();
  const { type, species, category } = router.query;
  const [listings] = useState(initialListings);
  const [categories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [countryFilter, setCountryFilter] = useState("");

  let filtered = type
    ? listings.filter((l) => l.listingType === type)
    : listings;
  if (species) {
    filtered = filtered.filter((l) => l.speciesId === species);
  }
  const availableCountries = [
    ...new Set(listings.map((l) => l.owner?.country).filter(Boolean)),
  ].sort();

  if (countryFilter) {
    filtered = filtered.filter((l) => l.owner?.country === countryFilter);
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(term) ||
        l.species?.name.toLowerCase().includes(term) ||
        l.description?.toLowerCase().includes(term)
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
    category === "heritage-vee"
      ? "Heritage Vee"
      : type === "auction"
      ? "Veilingen"
      : type === "trade"
      ? "Ruilen"
      : "Aanbod";
  const pageSubtitle =
    category === "heritage-vee"
      ? "Traditionele, natuurlijk resistente veerassen — ophalen bij de boer, geen verzending."
      : type === "auction"
      ? "Zeldzame zaden waarop geboden kan worden."
      : type === "trade"
      ? "Zaden die aangeboden worden om te ruilen."
      : "Alle zaden die beschikbaar zijn om te kopen, veilen of ruilen.";

  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      <Header />

      <div className="px-6 py-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        <CategorySidebar
          categories={
            category === "heritage-vee"
              ? categories.filter((c) => c.name === "Heritage Vee")
              : categories.filter((c) => c.name !== "Heritage Vee")
          }
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            {(type || species) && (
              <Link
                href={
                  category === "heritage-vee"
                    ? "/marketplace?category=heritage-vee"
                    : "/marketplace"
                }
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
            {availableCountries.length > 0 && (
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
              >
                <option value="">Alle landen</option>
                {availableCountries.map((c) => {
                  const countryInfo = countries.find(
                    (country) => country.name === c
                  );
                  return (
                    <option key={c} value={c}>
                      {countryInfo ? `${countryInfo.flag} ${c}` : c}
                    </option>
                  );
                })}
              </select>
            )}
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
                      <LivestockDisclaimer
                        categoryName={listing.species?.category?.name}
                      />
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{listing.title}</h3>
                        {listing.species?.category?.name === "Heritage Vee" ? (
                          <span className="text-xs bg-amber-900/40 text-amber-300 px-2 py-1 rounded-full">
                            🐔
                          </span>
                        ) : (
                          listing.isHeirloom && (
                            <span className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded-full">
                              🌱
                            </span>
                          )
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {listing.species?.name}
                        {listing.species?.latinName && (
                          <span className="italic text-gray-500">
                            {" "}
                            ({listing.species.latinName})
                          </span>
                        )}
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
                        {listing.seedHistory && (
                          <p>Geschiedenis: {listing.seedHistory}</p>
                        )}
                        {listing.parentPlantYear && (
                          <p>Moederplant sinds: {listing.parentPlantYear}</p>
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
                        {listing.owner?.latitude &&
                          listing.owner?.longitude && (
                            <LocationCircleMap
                              latitude={listing.owner.latitude}
                              longitude={listing.owner.longitude}
                              city={listing.owner.city}
                              compact={true}
                            />
                          )}
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
                        <ContactSellerButton
                          sellerId={listing.ownerId}
                          listingTitle={listing.title}
                          buttonText="Interesse? Neem contact op"
                        />
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
                      <div className="mt-2">
                        <ReportButton
                          targetType="listing"
                          targetId={listing.id}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              {currentPage > 1 && (
                <Link
                  href={{
                    pathname: "/marketplace",
                    query: { ...router.query, page: currentPage - 1 },
                  }}
                  className="bg-[#101828] border border-[#2a3a55] hover:border-[#4a9eff] px-4 py-2 rounded-lg text-sm transition"
                >
                  ← Vorige
                </Link>
              )}
              <span className="text-gray-400 text-sm px-3">
                Pagina {currentPage} van {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link
                  href={{
                    pathname: "/marketplace",
                    query: { ...router.query, page: currentPage + 1 },
                  }}
                  className="bg-[#101828] border border-[#2a3a55] hover:border-[#4a9eff] px-4 py-2 rounded-lg text-sm transition"
                >
                  Volgende →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
