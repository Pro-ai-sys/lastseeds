import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .finally(() => setLoaded(true));

    fetch("/api/partners")
      .then((res) => res.json())
      .then((data) => setPartners(data.partners || []));
  }, []);

  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      <Header />

      <section className="text-center px-6 py-24 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Het laatste erfgoed op aarde,
          <br />
          bewaard voor de toekomst
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Een biologisch ongemanipuleerd zaadje is goud waard — en dat geldt net
          zo goed voor een zeldzaam, natuurlijk resistent veeras. LastSeeds is
          de marktplaats voor heirloom groente- en bloemenzaden, én traditionele
          veerassen. Koop, veil, of ruil met andere hobbyisten en boeren.
        </p>

        {loaded && !user && (
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="bg-[#4a9eff] hover:bg-[#3a8eef] text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Word lid van LastSeeds
            </Link>
            <Link
              href="/login"
              className="border border-[#2a3a55] hover:border-[#4a9eff] px-6 py-3 rounded-lg font-semibold transition"
            >
              Inloggen
            </Link>
          </div>
        )}

        {loaded && user && (
          <Link
            href="/dashboard"
            className="inline-block bg-[#4a9eff] hover:bg-[#3a8eef] text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Ga naar mijn dashboard
          </Link>
        )}
      </section>

      <section className="px-6 py-16 border-t border-[#2a3a55]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <Link
            href="/marketplace"
            className="bg-[#101828] border border-[#2a3a55] hover:border-[#4a9eff] rounded-2xl p-6 text-center transition block"
          >
            <div className="text-3xl mb-3">🌱</div>
            <h3 className="font-bold text-lg mb-2">Alleen ongemanipuleerd</h3>
            <p className="text-gray-400 text-sm">
              Elk zaadje op LastSeeds is heirloom — geen hybrides, geen
              GMO&apos;s. Puur zoals de natuur het bedoelde.
            </p>
          </Link>

          <Link
            href="/marketplace?type=auction"
            className="bg-[#101828] border border-[#2a3a55] hover:border-[#4a9eff] rounded-2xl p-6 text-center transition block"
          >
            <div className="text-3xl mb-3">⚖️</div>
            <h3 className="font-bold text-lg mb-2">Veilen</h3>
            <p className="text-gray-400 text-sm">
              Zeldzame variëteiten? Zet ze op veiling en laat andere hobbyisten
              bieden.
            </p>
          </Link>

          <Link
            href="/marketplace?type=trade"
            className="bg-[#101828] border border-[#2a3a55] hover:border-[#4a9eff] rounded-2xl p-6 text-center transition block"
          >
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-bold text-lg mb-2">Ruilen</h3>
            <p className="text-gray-400 text-sm">
              Geen geld nodig — ruil je overschot direct met anderen in de
              gemeenschap.
            </p>
          </Link>

          <Link
            href="/marketplace?category=heritage-vee"
            className="bg-[#101828] border border-[#2a3a55] hover:border-[#4a9eff] rounded-2xl p-6 text-center transition block"
          >
            <div className="text-3xl mb-3">🐔</div>
            <h3 className="font-bold text-lg mb-2">Heritage Vee</h3>
            <p className="text-gray-400 text-sm">
              Traditionele veerassen, natuurlijk resistent. Ophalen bij de boer,
              geen verzending.
            </p>
          </Link>
        </div>
      </section>

      {partners.length > 0 && (
        <section className="px-6 py-12 border-t border-[#2a3a55]">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-gray-500 text-sm mb-6">In samenwerking met</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {partners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.websiteUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 hover:opacity-100 transition"
                >
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="h-10 object-contain grayscale hover:grayscale-0 transition"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="text-center text-gray-500 text-sm py-8 border-t border-[#2a3a55]">
        <p className="mb-3">
          LastSeeds — Wat overblijft, wanneer al het andere verdwijnt.
        </p>
        <div className="flex justify-center gap-4 text-xs">
          <Link href="/privacy" className="hover:text-white">
            Privacybeleid
          </Link>
          <Link href="/terms" className="hover:text-white">
            Algemene voorwaarden
          </Link>
        </div>
      </footer>
    </div>
  );
}
