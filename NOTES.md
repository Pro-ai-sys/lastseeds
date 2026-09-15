# LastSeeds — Project Notes

Overzicht van de volledige setup, zodat je dit later kunt reproduceren of aan iemand anders kunt uitleggen.

## Techstack

- Next.js 13 (Pages Router)
- Prisma 5 + PostgreSQL (gehost via Prisma Postgres op Vercel)
- Tailwind CSS 3
- Vercel (hosting)
- Vercel Blob (foto-opslag)
- Resend (transactionele e-mails)
- Mollie Connect (betalingen voor marktplaats)

## Lokale ontwikkelomgeving opzetten (nieuwe laptop/omgeving)

1. Clone de repo, ga naar de map
2. `npm install`
3. Maak een `.env`-bestand aan (zie hieronder voor alle benodigde variabelen)
4. `npx prisma generate`
5. `npx prisma migrate deploy` (of `migrate dev` als je lokaal nieuwe wijzigingen maakt)
6. `npm run dev`

## Benodigde environment variables (`.env`)

```
# Database (Prisma Postgres via Vercel)
DATABASE_URL="postgres://..."

# JWT voor sessies/inloggen
JWT_SECRET="lange-willekeurige-string"

# Basis-URL van de site (voor e-mail links, Mollie redirects)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Resend (verificatie- en reset-mails)
RESEND_API_KEY="re_..."

# Vercel Blob (foto-uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
BLOB_STORE_ID="store_..."

# Mollie (betalingen)
MOLLIE_CLIENT_ID="app_..."       # voor OAuth-koppeling verkopers
MOLLIE_CLIENT_SECRET="..."       # voor OAuth-koppeling verkopers
MOLLIE_API_KEY="test_..."        # eigen key, voor het aanmaken van betalingen (gebruik test_ prefix tijdens testen!)
PLATFORM_FEE_PERCENTAGE="7"      # percentage commissie bij verkoop
```

## Waar vind ik deze waarden terug?

- **DATABASE_URL**: Vercel dashboard → Storage → je Prisma Postgres database → Quickstart → .env.local tab → "Show secret"
- **JWT_SECRET**: zelf gegenereerd met `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **RESEND_API_KEY**: resend.com → API Keys
- **BLOB_READ_WRITE_TOKEN**: Vercel dashboard → Storage → je Blob store → gekoppeld aan project → Environment Variables
- **MOLLIE_CLIENT_ID / SECRET**: mollie.com dashboard → More → Developers → Your apps
- **MOLLIE_API_KEY**: mollie.com dashboard → Developers → API keys (let op: test_ vs live_ prefix)

## Database — belangrijke commando's

```bash
# Nieuwe migratie maken na schema-wijziging
npx prisma migrate dev --name beschrijvende-naam

# Migratie toepassen zonder nieuwe te maken (bijv. na clone)
npx prisma migrate deploy

# Prisma Client vernieuwen (nodig na schema-wijziging, meestal automatisch bij migrate)
npx prisma generate

# Database visueel bekijken/bewerken
npx prisma studio
```

## Belangrijke scripts (in prisma/)

- `seed-species.js` — vult alle categorieën en soorten (Vruchtgewassen, Bladgewassen, etc.)
- `seed-testdata.js` — maakt 80 testgebruikers + 80 testlistings aan
- `seed-testphotos.js` — voegt placeholder-foto's toe aan listings zonder foto's
- `make-admin.js <email>` — maakt een bestaande gebruiker admin
- `create-admin.js` — maakt een nieuw admin-account aan (met hardcoded gegevens, pas aan indien nodig)

## Vercel deployment

- Project: `lastseeds` (let op: er is geen `lastseeds-3hzx` meer, die is verwijderd)
- Branch: `main` is de production branch
- Environment variables moeten **ook op Vercel** worden ingesteld (Settings → Environment Variables), los van je lokale `.env`
- Na een schema-wijziging: run `npx prisma migrate dev` lokaal (dit past ook de Vercel-database aan, want je lokale `.env` wijst naar dezelfde Postgres-database)

## Bekende aandachtspunten / TODO's

- [ ] Databasewachtwoord (DATABASE_URL) is een aantal keer in chatgeschiedenis beland — overweeg te roteren via Vercel Storage → je database → "Rotate Credentials"
- [ ] Google Translate-knop in Header werkt nog niet volledig (dropdown opent, maar taalwissel triggert niet) — nog op te lossen
- [ ] Mollie-betaalflow: nog niet end-to-end getest met een tweede account
- [ ] Automatische vrijgave van betalingen na X dagen (escrow-logica) — schema staat klaar (`Payment.releaseAt`), logica/cron-job nog te bouwen
- [ ] Geschillenformulier voor kopers (Dispute-model staat klaar, UI nog te bouwen)
- [ ] Bij een eigen domein: Resend-domein koppelen zodat mails naar iedereen kunnen (nu alleen naar eigen test-adres)

## Belangrijke bestanden om te kennen

- `prisma/schema.prisma` — het volledige datamodel
- `lib/auth.js` — JWT/wachtwoord-helpers
- `lib/prisma.js` — Prisma Client singleton
- `lib/mail.js` — Resend e-mail-functies
- `components/Header.js` — navigatie + banner + login-status, gebruikt op elke pagina
- `pages/api/listings/index.js` — kern-logica voor listings aanmaken/ophalen
