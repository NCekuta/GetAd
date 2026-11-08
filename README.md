# GetAd

**GetAd** je spletna platforma za tekmovanja v AI video oglasih. Podjetja objavijo natečaj (quest) z opisom želenega videa, referenčnim gradivom, nagrado in rokom. Ustvarjalci z AI orodji po lastni izbiri pripravijo video in ga oddajo. Administrator pregleda queste in oddaje, po izteku roka pa podjetje izbere zmagovalca.

Uporabniške vloge: **podjetje**, **ustvarjalec** in **administrator**.

## Tehnologije

| Del | Tehnologija |
|---|---|
| Frontend | React, Vite, React Router, Tailwind CSS |
| Backend | Node.js, Express |
| Podatkovna baza | PostgreSQL, Prisma |
| Avtentikacija | JWT v piškotku, bcrypt |
| Hramba datotek | lokalna mapa `uploads` (kasneje Supabase Storage) |

## Struktura repozitorija

```
GetAd/
├── README.md
├── .gitignore
├── frontend/          React aplikacija (Vite)
├── backend/           Express API, Prisma, mapa uploads
└── docs/
    ├── 01-06 *.md     projektna dokumentacija
    ├── wireframes/    žičnati modeli zaslonov
    └── adr/           arhitekturne odločitve (ADR)
```

## Dokumentacija

1. [Zasnova rešitve](docs/01-zasnova-resitve.md)
2. [Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
3. [Podatkovni model](docs/03-podatkovni-model.md)
4. [Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md)
5. [Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md)
6. [Wireframes](docs/06-wireframes.md)

### Arhitekturne odločitve (ADR)

- [Predloga ADR](docs/adr/adr-template.md)
- [0001 – En projekt v Next.js za frontend in backend](docs/adr/0001-en-projekt-nextjs.md) *(nadomeščena z 0009)*
- [0002 – React za uporabniški vmesnik](docs/adr/0002-react-za-uporabniski-vmesnik.md)
- [0003 – PostgreSQL kot podatkovna baza](docs/adr/0003-postgresql-podatkovna-baza.md)
- [0004 – Prisma za dostop do baze](docs/adr/0004-prisma-za-dostop-do-baze.md)
- [0005 – Auth.js za avtentikacijo](docs/adr/0005-authjs-za-avtentikacijo.md) *(nadomeščena z 0010)*
- [0006 – Hramba datotek v lokalni mapi](docs/adr/0006-hramba-datotek-v-lokalni-mapi.md)
- [0007 – Preverjanje roka ob branju](docs/adr/0007-preverjanje-roka-ob-branju.md)
- [0008 – Pripravljenost za selitev v oblak](docs/adr/0008-pripravljenost-za-oblak.md)
- [0009 – Ločen frontend (React + Vite) in backend (Express)](docs/adr/0009-locen-frontend-in-backend.md)
- [0010 – Prijava z JWT žetonom v piškotku](docs/adr/0010-prijava-z-jwt.md)

## Razvojni proces

Razvoj poteka po strategiji **GitHub Flow**:

1. Za vsako spremembo ustvari novo vejo iz `main` (npr. `feature/oddaja-videa`, `docs/adr`).
2. Spremembe commitaj na to vejo in jo potisni na GitHub.
3. Odpri pull request v `main`.
4. Po pregledu se pull request združi, veja se izbriše.

Veja `main` je zaščitena: neposredni push, prisilno prepisovanje zgodovine in brisanje niso dovoljeni.
