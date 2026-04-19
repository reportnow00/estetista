# Professione Fitness Academy

Base reale, SEO-first e pronta per la produzione per una academy digitale nel fitness, costruita con **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **PostgreSQL**, **Prisma**, **area utente**, **area admin** e **pagamenti Stripe one-time**.

Il progetto è stato impostato con una scelta strategica precisa:

- **al lancio comunica soprattutto un solo corso live**: `Diventa un Personal Trainer`
- **a livello di architettura è già multi-corso**, così da poter aggiungere facilmente nuovi percorsi dal pannello admin senza toccare il frontend

---

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Session auth custom con cookie HTTP-only
- Stripe Checkout per pagamenti one-time
- Webhook Stripe per conferma reale pagamento
- Area admin interna
- Struttura pronta per deploy su Vercel o equivalenti

---

## Architettura progetto

```text
professione-fitness-academy/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
├── src/
│   ├── actions/
│   │   ├── auth.ts
│   │   └── progress.ts
│   ├── app/
│   │   ├── api/
│   │   │   ├── logout/route.ts
│   │   │   └── stripe/
│   │   │       ├── checkout/route.ts
│   │   │       └── webhook/route.ts
│   │   ├── admin/
│   │   ├── blog/
│   │   ├── checkout/
│   │   ├── contatti/
│   │   ├── corsi/
│   │   ├── dashboard/
│   │   ├── docenti/
│   │   ├── faq/
│   │   ├── login/
│   │   ├── registrazione/
│   │   ├── recupero-password/
│   │   ├── reimposta-password/
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── course/
│   │   ├── home/
│   │   ├── layout/
│   │   └── ui/
│   └── lib/
│       ├── data.ts
│       ├── markdown.ts
│       ├── password.ts
│       ├── prisma.ts
│       ├── seo.ts
│       ├── session.ts
│       ├── site.ts
│       ├── stripe.ts
│       └── utils.ts
├── .env.example
├── next.config.ts
├── package.json
└── README.md
```

---

## Route principali

### Pubbliche

- `/`
- `/corsi`
- `/corsi/[slug]`
- `/diventare-personal-trainer`
- `/certificazioni-validita-professionale`
- `/docenti`
- `/recensioni`
- `/faq`
- `/blog`
- `/blog/[slug]`
- `/chi-siamo`
- `/contatti`
- `/privacy-policy`
- `/cookie-policy`
- `/termini-condizioni`
- `/login`
- `/registrazione`
- `/recupero-password`
- `/reimposta-password/[token]`
- `/checkout/success`
- `/checkout/cancel`

### Area utente

- `/dashboard`
- `/dashboard/corsi`
- `/dashboard/corsi/[slug]`
- `/dashboard/profilo`

### Area admin

- `/admin`
- `/admin/corsi`
- `/admin/corsi/nuovo`
- `/admin/corsi/[id]`
- `/admin/corsi/[id]/programma`
- `/admin/categorie`
- `/admin/docenti`
- `/admin/recensioni`
- `/admin/faq`
- `/admin/blog`
- `/admin/blog/nuovo`
- `/admin/blog/[id]`
- `/admin/ordini`
- `/admin/utenti`
- `/admin/impostazioni`

### API / server

- `POST /api/stripe/checkout`
- `POST /api/stripe/webhook`
- `POST /api/logout`

---

## Schema database

Entità principali implementate:

- `User`
- `Category`
- `Teacher`
- `Course`
- `CourseTeacher`
- `CourseModule`
- `Lesson`
- `Enrollment`
- `LessonProgress`
- `Order`
- `Review`
- `FAQ`
- `BlogCategory`
- `BlogPost`
- `SeoData`
- `PurchaseEventLog`
- `PasswordResetToken`
- `SiteSettings`

---

## Setup locale

### 1. Installa dipendenze

```bash
npm install
```

### 2. Crea file `.env`

Copia:

```bash
cp .env.example .env
```

Poi configura almeno:

- `DATABASE_URL`
- `SESSION_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `STRIPE_INVOICE_CREATION_ENABLED` opzionale
- `STRIPE_TAX_ID_COLLECTION_ENABLED` opzionale
- `STRIPE_PHONE_NUMBER_COLLECTION_ENABLED` opzionale
- `STRIPE_AUTOMATIC_TAX_ENABLED` opzionale
- `RESEND_API_KEY` opzionale per email reset password
- `EMAIL_FROM` opzionale per email reset password

### 3. Genera Prisma Client e applica schema

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Esegui seed iniziale

```bash
npm run db:seed
```

### 5. Avvia il progetto

```bash
npm run dev
```

---

## Seed iniziale incluso

Il seed crea:

- 1 admin
- 1 utente demo
- 1 categoria reale
- 4 docenti demo
- 1 corso pubblicato: **Diventa un Personal Trainer**
- 1 corso bozza non pubblicato per mostrare scalabilità
- moduli e lezioni realistiche
- FAQ home / FAQ generali / FAQ corso
- recensioni demo
- 5 articoli blog
- impostazioni base home
- 1 ordine pagato demo + iscrizione demo

### Credenziali seed

**Admin**
- Email: `admin@professionefitnessacademy.it`
- Password: `Admin123!`

**Utente demo**
- Email: `giulia@example.com`
- Password: `Studente123!`

---

## Flusso acquisto Stripe

### Implementato

1. Utente visita pagina corso
2. Clicca **Acquista ora**
3. Se non autenticato viene fermato e indirizzato al login
4. Il backend crea un `Order` `PENDING`
5. Viene creata una `Stripe Checkout Session`
6. Stripe reindirizza su pagina di pagamento
7. Stripe invia webhook `checkout.session.completed`
8. Il backend:
   - registra l'evento
   - aggiorna l'ordine a `PAID`
   - crea o aggiorna `Enrollment`
9. Il corso diventa visibile in `/dashboard/corsi`

### Dettagli tecnici

- pagamento **one-time**, non ricorrente
- uso di `metadata` (`orderId`, `courseId`, `userId`)
- `client_reference_id`
- `PurchaseEventLog` per audit base
- idempotenza minima: l'evento webhook viene ignorato se già registrato via `stripeEventId`

---

### Preparazione fatturazione

Il progetto e pronto per essere collegato a un account Stripe senza refactor aggiuntivi sul checkout:

- salva `stripeCustomerId` a livello utente per riuso nei checkout successivi
- salva in `Order` nome, email, telefono, tax ID e indirizzo raccolti nel checkout
- collega eventuale `invoice` Stripe all'ordine e la mostra in pagina successo e area admin
- permette di attivare `automatic tax` via env quando l'account Stripe Tax e configurato

## Configurare Stripe in test mode

### 1. Dashboard Stripe

Crea una webhook endpoint che punti a:

```text
https://tuodominio.it/api/stripe/webhook
```

oppure in locale con Stripe CLI / tunnel.

### 2. Eventi da ascoltare

Minimo:

- `checkout.session.completed`
- `checkout.session.expired`

### 3. Variabili ambiente

```env
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_CHECKOUT_LOCALE=it
STRIPE_INVOICE_CREATION_ENABLED=true
STRIPE_PHONE_NUMBER_COLLECTION_ENABLED=true
STRIPE_TAX_ID_COLLECTION_ENABLED=true
STRIPE_AUTOMATIC_TAX_ENABLED=false
# STRIPE_INVOICE_FOOTER="Professione Fitness Academy - supporto: info@professionefitnessacademy.it"
```

### 4. Test card

Per test classico Stripe:

- `4242 4242 4242 4242`

---

## SEO implementata

- metadata page-specific
- `generateMetadata` su pagine dinamiche
- `sitemap.xml`
- `robots.txt`
- canonical
- Open Graph
- Twitter card
- breadcrumbs UI + JSON-LD
- JSON-LD:
  - `Organization`
  - `Course`
  - `FAQPage`
  - `BreadcrumbList`
  - `Article`
- URL puliti
- struttura heading ordinata
- base editoriale per cluster:
  - diventare personal trainer
  - corso personal trainer
  - certificazione personal trainer
  - corso fitness riconosciuto
  - sbocchi lavorativi personal trainer

---

## Area admin: cosa puoi fare già

- creare / modificare corsi
- pubblicare o tenere in bozza
- impostare prezzi
- gestire categorie
- gestire docenti
- gestire FAQ
- gestire recensioni
- creare e modificare articoli blog
- vedere utenti e ordini
- modificare headline / CTA principali della home
- aggiungere moduli e lezioni ai corsi

Quando in futuro pubblichi un nuovo corso dal database/admin, il corso potrà comparire automaticamente in:

- catalogo corsi
- route dinamica pubblica
- area acquisto
- area utente

senza riscrivere il frontend.

---

## Note importanti

### Upload immagini
In questa base il campo immagine è gestito via **URL** per mantenere il progetto semplice e davvero pronto da estendere.  
Per produzione puoi collegare facilmente:

- Vercel Blob
- S3
- Cloudinary
- UploadThing

### Recupero password
Il reset password è già predisposto con token nel database.  
Nella base attuale il link viene loggato lato server. In produzione puoi collegarlo a:

- Resend
- SendGrid
- SMTP tradizionale

### Error handling
La base è pensata per essere pulita e pronta da rifinire. Il percorso critico login / checkout / accesso contenuti / admin è impostato. Per un go-live definitivo conviene aggiungere:

- toast UX più raffinati
- validazioni client aggiuntive
- logging centralizzato
- email transazionali
- monitoraggio errori (es. Sentry)

---

## Deploy su Vercel

### Variabili ambiente
Imposta in Vercel:

- `DATABASE_URL`
- `SESSION_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

### Build command

```bash
npm run build
```

### Raccomandazioni
- database PostgreSQL gestito (Neon, Supabase, Railway, RDS, ecc.)
- webhook Stripe puntato al dominio reale
- usare ambiente Stripe test e live separati
- completare testi legali prima del go-live

## Deploy in sottocartella

Se il progetto deve rispondere sotto una sottocartella, ad esempio:

```text
https://www.ermagency.it/palestra/
```

configura:

```env
NEXT_PUBLIC_APP_URL=https://www.ermagency.it/palestra
NEXT_PUBLIC_BASE_PATH=/palestra
```

Note operative:

- la build ora genera anche output `standalone`, utile per pubblicare il progetto su un server Node
- `NEXT_PUBLIC_BASE_PATH` aggiorna routing Next e asset per la sottocartella
- `NEXT_PUBLIC_APP_URL` mantiene corretti canonical, sitemap, robots e URL SEO
- il progetto **non e un export statico puro**: usa Prisma, login, API route e Stripe, quindi serve un runtime Node/Next sul server o un reverse proxy verso `next start`

---

## Perché questa base è strategicamente corretta

Perché evita il problema tipico dei competitor “pieni ma poco credibili”:

- non finge un catalogo enorme al day one
- concentra la comunicazione su un corso forte
- mantiene architettura realmente scalabile
- sembra un'academy vera, non una semplice landing
- ha già backend, utenti, pagamenti, admin, SEO e contenuti demo coerenti

---

## Stato del progetto

Questa è una **base concreta e vendibile**, non un mockup statico.  
È pronta per essere:

- installata
- seedata
- collegata a Stripe
- deployata
- rifinita con brand asset, immagini definitive, policy legali e copy finali
