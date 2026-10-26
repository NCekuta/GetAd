---
status: sprejeta
date: 2026-10-26
---

# Pripravljenost za selitev v oblak

## Kontekst in opis problema

V prvi fazi aplikacija teče samo lokalno (lokalni PostgreSQL, mapa `uploads`). Kasneje jo želimo objaviti, da bo dostopna javno. Selitev ne sme zahtevati prepisovanja aplikacije. Kako aplikacijo zasnovati, da bo kasnejša objava v oblaku čim enostavnejša?

## Dejavniki odločitve

* lokalni razvoj brez zunanjih storitev,
* objava brez sprememb poslovne logike,
* nizki ali ničelni stroški,
* podpora za Next.js in PostgreSQL.

## Obravnavane možnosti

* Lokalni razvoj, kasneje AWS Amplify + Supabase (baza in Storage)
* Lokalni razvoj, kasneje Vercel + Supabase
* Lasten virtualni strežnik (VPS) z Dockerjem
* Razvoj neposredno v oblaku od začetka

## Odločitev

Izbrana možnost: "Lokalni razvoj, kasneje AWS Amplify + Supabase", ker Amplify podpira Next.js aplikacije, Supabase pa uporablja PostgreSQL, zato se zamenja samo povezava do baze v `.env`, koda aplikacije pa ostane enaka. Vse nastavitve, ki se med okolji razlikujejo, so v okoljskih spremenljivkah (`.env`), dostop do datotek pa je zaprt v en modul.

### Posledice

* Dobro, ker razvoj ni odvisen od zunanjih storitev in je brezplačen.
* Dobro, ker je selitev baze le sprememba `DATABASE_URL` in zagon migracij.
* Dobro, ker obe storitvi ponujata brezplačne pakete.
* Slabo, ker je treba pred objavo zamenjati hrambo datotek (glej [0006](0006-hramba-datotek-v-lokalni-mapi.md)).
* Slabo, ker lokalno okolje ni povsem enako produkcijskemu, zato se nekatere napake (npr. omejitve velikosti zahtevkov za videe) pokažejo šele po objavi.
* Slabo, ker sta aplikacija in baza pri dveh različnih ponudnikih.

## Prednosti in slabosti možnosti

### Vercel + Supabase

* Dobro, ker je Vercel avtor Next.js in ima najboljšo podporo.
* Slabo, ker ima brezplačni paket strožje omejitve velikosti zahtevkov za nalaganje velikih datotek.

### Lasten VPS z Dockerjem

* Dobro, ker je poln nadzor in ni omejitev pri datotekah.
* Slabo, ker zahteva lastno vzdrževanje strežnika, varnostnih posodobitev in kopij.

### Razvoj v oblaku od začetka

* Dobro, ker ni kasnejše selitve.
* Slabo, ker razvoj zahteva internet in račune ter je počasnejši.

## Dodatne informacije

Povezano: [0001](0001-en-projekt-nextjs.md), [0003](0003-postgresql-podatkovna-baza.md), [0006](0006-hramba-datotek-v-lokalni-mapi.md).
