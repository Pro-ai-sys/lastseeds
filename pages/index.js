import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      {/* Navigatiebalk */}
      <Header />

      {/* Hero-sectie */}
      <section className="text-center px-6 py-24 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          De laatste zaden op aarde,<br />bewaard voor de toekomst
        </h1>
        <p className="text-gray-400 text-lg mb-8">
        Een handvol multinationals als Bayer, Corteva en Syngenta bezit vandaag
        de dag al het patentrecht op een groot deel van ons voedsel — en in de
        nabije toekomst zullen we steeds afhankelijker worden van hun grillen.
        Een biologisch, ongemanipuleerd zaadje is daarom goud waard.
        LastSeeds is de marktplaats voor ongemanipuleerde, heirloom groente-
        en bloemenzaden. Koop, veil, of ruil met andere hobbyisten.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="bg-[#4a9eff] hover:bg-[#3a8eef] text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Word lid van de LastSeeds
          </Link>
          <Link
            href="/login"
            className="border border-[#2a3a55] hover:border-[#4a9eff] px-6 py-3 rounded-lg font-semibold transition"
          >
            Inloggen
          </Link>
        </div>
      </section>

      {/* Kenmerken-sectie */}
      <section className="px-6 py-16 border-t border-[#2a3a55]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            href="/marketplace"
            className="bg-[#101828] border border-[#2a3a55] hover:border-[#4a9eff] rounded-2xl p-6 text-center transition block"
          >
            <div className="text-3xl mb-3">🌱</div>
            <h3 className="font-bold text-lg mb-2">Alleen ongemanipuleerd</h3>
            <p className="text-gray-400 text-sm">
              Elk zaadje op LastSeeds is heirloom — geen hybrides, geen GMO&apos;s. Puur zoals de natuur het bedoelde.
            </p>
          </Link>

          <Link
            href="/marketplace?type=auction"
            className="bg-[#101828] border border-[#2a3a55] hover:border-[#4a9eff] rounded-2xl p-6 text-center transition block"
          >
            <div className="text-3xl mb-3">⚖️</div>
            <h3 className="font-bold text-lg mb-2">Veilen</h3>
            <p className="text-gray-400 text-sm">
              Zeldzame variëteiten? Zet ze op veiling en laat andere overlevenden bieden.
            </p>
          </Link>

          <Link
            href="/marketplace?type=trade"
            className="bg-[#101828] border border-[#2a3a55] hover:border-[#4a9eff] rounded-2xl p-6 text-center transition block"
          >
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-bold text-lg mb-2">Ruilen</h3>
            <p className="text-gray-400 text-sm">
              Geen geld nodig — ruil je overschot direct met anderen in de gemeenschap.
            </p>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-8 border-t border-[#2a3a55]">
      LastSeeds — Wat overblijft, wanneer al het andere verdwijnt.
      </footer>
    </div>
  );
}