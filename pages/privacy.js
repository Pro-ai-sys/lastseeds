import Header from "@/components/Header";
import Link from "next/link";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      <Header showNav={false} />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-white mb-6 inline-block"
        >
          ← Terug naar home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Privacybeleid</h1>
        <p className="text-gray-500 text-sm mb-8">
          Laatst bijgewerkt: [datum invullen]
        </p>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              1. Wie zijn wij
            </h2>
            <p>
              LastSeeds ([bedrijfsnaam], KVK-nummer: [invullen], gevestigd te
              [plaats]) is verantwoordelijk voor de verwerking van
              persoonsgegevens zoals beschreven in dit privacybeleid.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              2. Welke gegevens verzamelen wij
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Accountgegevens: e-mailadres, gebruikersnaam, wachtwoord
                (versleuteld opgeslagen)
              </li>
              <li>
                Profielgegevens (optioneel): voornaam, achternaam, biografie,
                profielfoto
              </li>
              <li>
                Adresgegevens: straat, huisnummer, postcode, woonplaats (voor
                verzending en betaling)
              </li>
              <li>
                Transactiegegevens: listings, biedingen, ruilverzoeken,
                berichten tussen gebruikers
              </li>
              <li>
                Technische gegevens: IP-adres, browsertype (via hosting- en
                beveiligingsvoorzieningen)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              3. Waarvoor gebruiken wij deze gegevens
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Het aanmaken en beheren van je account</li>
              <li>
                Het mogelijk maken van kopen, verkopen, veilen en ruilen tussen
                gebruikers
              </li>
              <li>
                Het versturen van transactionele e-mails (accountverificatie,
                wachtwoord-reset)
              </li>
              <li>
                Het faciliteren van verzending en (in de toekomst) betalingen
              </li>
              <li>Fraudepreventie en naleving van wettelijke verplichtingen</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              4. Delen met derden
            </h2>
            <p>
              Wij delen gegevens alleen met derde partijen voor zover
              noodzakelijk voor de dienstverlening:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                <strong>Vercel</strong> — hosting van de website en opslag van
                foto&apos;s
              </li>
              <li>
                <strong>Resend</strong> — versturen van transactionele e-mails
              </li>
              <li>
                <strong>Mollie</strong> — verwerking van betalingen (indien en
                zodra actief)
              </li>
            </ul>
            <p className="mt-2">
              Je adresgegevens worden alleen gedeeld met de koper/verkoper van
              een specifieke transactie, nooit publiek getoond.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              5. Bewaartermijn
            </h2>
            <p>
              Wij bewaren je gegevens zolang je een account hebt bij LastSeeds.
              Na verwijdering van je account worden persoonsgegevens binnen een
              redelijke termijn verwijderd, tenzij wettelijke bewaarplichten
              (bijv. voor de belastingdienst) anders vereisen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              6. Jouw rechten
            </h2>
            <p>Onder de AVG/GDPR heb je recht op:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Inzage in je persoonsgegevens</li>
              <li>Rectificatie van onjuiste gegevens</li>
              <li>
                Verwijdering van je gegevens (&quot;recht op vergetelheid&quot;)
              </li>
              <li>Beperking van de verwerking</li>
              <li>Overdraagbaarheid van gegevens</li>
              <li>Bezwaar tegen verwerking</li>
            </ul>
            <p className="mt-2">
              Neem hiervoor contact op via [e-mailadres invullen]. Je hebt ook
              het recht een klacht in te dienen bij de Autoriteit
              Persoonsgegevens.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">7. Cookies</h2>
            <p>
              LastSeeds gebruikt functionele cookies die noodzakelijk zijn voor
              het inloggen (sessiecookie) en de vertaalfunctie. Wij gebruiken
              geen trackingcookies voor advertentiedoeleinden.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              8. Beveiliging
            </h2>
            <p>
              Wachtwoorden worden versleuteld opgeslagen en nooit in leesbare
              vorm bewaard. Wij nemen passende technische maatregelen om
              misbruik, verlies en onbevoegde toegang tot persoonsgegevens te
              voorkomen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">9. Contact</h2>
            <p>
              Voor vragen over dit privacybeleid kun je contact opnemen via
              [e-mailadres invullen].
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
