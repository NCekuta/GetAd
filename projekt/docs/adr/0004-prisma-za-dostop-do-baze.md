---
status: sprejeta
date: 2026-10-26
---

# Prisma za dostop do podatkovne baze

## Kontekst in opis problema

Backend mora ustvariti tabele, jih spreminjati med razvojem in iz njih brati ter pisati podatke. Ročno pisanje SQL poizvedb in migracij je zamudno in odpira možnost napak ter SQL injekcij. Kako dostopati do baze PostgreSQL iz Next.js aplikacije?

## Dejavniki odločitve

* shema opisana na enem mestu,
* samodejne migracije ob spremembi sheme,
* varnost pred SQL injekcijami,
* pregledne poizvedbe in dobra podpora v urejevalniku (samodokončanje).

## Obravnavane možnosti

* Prisma
* Drizzle ORM
* Neposredni SQL z gonilnikom `pg`

## Odločitev

Izbrana možnost: "Prisma", ker so vse tabele in relacije opisane v eni datoteki (`schema.prisma`), migracije se iz nje ustvarijo samodejno (`prisma migrate`), poizvedbe pa so pregledne in parametrizirane, zato varne pred SQL injekcijami. Seed skripta (`prisma db seed`) poenostavi ustvarjanje administratorja in testnih podatkov.

### Posledice

* Dobro, ker je shema baze dokumentirana v kodi in vedno usklajena z bazo.
* Dobro, ker urejevalnik predlaga polja in opozori na napačne poizvedbe.
* Dobro, ker se ob menjavi baze (lokalno → Supabase) spremeni le povezava v `.env`.
* Slabo, ker je Prisma dodaten sloj, ki ga je treba spoznati.
* Slabo, ker so zelo zapletene poizvedbe včasih lažje napisane v čistem SQL (Prisma to sicer omogoča z `$queryRaw`).

## Prednosti in slabosti možnosti

### Drizzle ORM

* Dobro, ker je lahek in blizu SQL sintaksi.
* Slabo, ker je novejši in ima manj dokumentacije in primerov.

### Neposredni SQL (`pg`)

* Dobro, ker ni dodatnega sloja in je poln nadzor nad poizvedbami.
* Slabo, ker je treba migracije in zaščito pred SQL injekcijami urejati ročno.

## Dodatne informacije

Povezano: [0003 – PostgreSQL](0003-postgresql-podatkovna-baza.md).
