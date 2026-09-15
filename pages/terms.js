import Header from "@/components/Header";
import Link from "next/link";

export default function Terms() {
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
        <h1 className="text-3xl font-bold mb-2">Algemene voorwaarden</h1>
        <p className="text-gray-500 text-sm mb-8">
          Laatst bijgewerkt: [datum invullen]
        </p>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              1. Wat is LastSeeds
            </h2>
            <p>
              LastSeeds is een online marktplaats waar gebruikers zaden kunnen
              kopen, verkopen, veilen en ruilen met elkaar. LastSeeds treedt op
              als platform en is geen partij bij de transactie tussen kopers en
              verkopers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              2. Gebruikersaccount
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Je moet minimaal 18 jaar oud zijn om een account aan te maken.
              </li>
              <li>
                Je bent verantwoordelijk voor het geheimhouden van je
                inloggegevens.
              </li>
              <li>Eén persoon mag slechts één account aanmaken.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              3. Listings en verplichtingen verkoper
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Je mag alleen zaden aanbieden waarvan je zelf eigenaar bent of
                gerechtigd bent te verhandelen.
              </li>
              <li>
                Informatie over het aangeboden product (soort, hoeveelheid,
                herkomst) moet naar waarheid worden vermeld.
              </li>
              <li>
                Het is verboden zaden aan te bieden waarvan de handel wettelijk
                verboden is in Nederland.
              </li>
              <li>
                Cannabiszaden mogen worden aangeboden als genetisch materiaal,
                in lijn met de Nederlandse wetgeving. Kopers zijn zelf
                verantwoordelijk voor naleving van de wetgeving in hun eigen
                land.
              </li>
              <li>
                Verboden middelen (waaronder psilocybine-bevattende
                paddenstoelen/sporen) mogen niet worden aangeboden.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              4. Veilingen en biedingen
            </h2>
            <p>
              Een geplaatst bod is bindend. Bij het winnen van een veiling ga je
              de verplichting aan het bedrag te voldoen aan de verkoper via de
              op het platform aangeboden betaalmethode.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. Ruilen</h2>
            <p>
              Bij ruiltransacties zijn beide partijen zelf verantwoordelijk voor
              het nakomen van de afspraak. LastSeeds bemiddelt niet actief bij
              geschillen over ruiltransacties, maar biedt wel een
              berichtenfunctie om onderling afspraken te maken.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">6. Betalingen</h2>
            <p>
              Betalingen via LastSeeds worden verwerkt door een externe
              betaalprovider. LastSeeds brengt een servicekosten-percentage in
              rekening over succesvolle verkopen, zoals aangegeven bij het
              afronden van een transactie.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              7. Verboden gebruik
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Het plaatsen van misleidende, frauduleuze of illegale listings
              </li>
              <li>
                Het lastigvallen, bedreigen of intimideren van andere gebruikers
              </li>
              <li>Het omzeilen van beveiligingsmaatregelen van het platform</li>
              <li>
                Het gebruiken van het platform voor doeleinden die niet in
                overeenstemming zijn met deze voorwaarden
              </li>
            </ul>
            <p className="mt-2">
              LastSeeds behoudt zich het recht voor accounts te schorsen of te
              verwijderen bij overtreding van deze voorwaarden.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              8. Aansprakelijkheid
            </h2>
            <p>
              LastSeeds is niet aansprakelijk voor schade voortvloeiend uit
              transacties tussen gebruikers, de kwaliteit of kiemkracht van
              aangeboden zaden, of het niet nakomen van afspraken door
              gebruikers onderling.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              9. Wijzigingen
            </h2>
            <p>
              LastSeeds kan deze voorwaarden van tijd tot tijd wijzigen.
              Gebruikers worden hiervan op de hoogte gesteld via het platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">10. Contact</h2>
            <p>Voor vragen over deze voorwaarden: [e-mailadres invullen].</p>
          </section>
        </div>
      </div>
    </div>
  );
}
