---
status: sprejeta
date: 2026-10-26
---

# PostgreSQL kot podatkovna baza

## Kontekst in opis problema

Podatki v GetAd so močno povezani: uporabnik ima profil podjetja, podjetje objavi queste, quest ima referenčno gradivo in oddaje, ena oddaja je lahko zmagovalna. Pomembna so tudi pravila celovitosti (npr. zmagovalec mora biti oddaja istega questa, en ustvarjalec ima na quest največ eno oddajo). Katero podatkovno bazo uporabiti?

## Dejavniki odločitve

* povezani podatki in tuji ključi,
* zagotavljanje celovitosti podatkov (omejitve, transakcije),
* brezplačna uporaba in lokalni zagon,
* enostavna kasnejša selitev v oblak (Supabase).

## Obravnavane možnosti

* PostgreSQL
* MySQL
* SQLite
* MongoDB

## Odločitev

Izbrana možnost: "PostgreSQL", ker je relacijska baza naravna izbira za povezane podatke, je zanesljiv, brezplačen in podpira vse potrebne omejitve in transakcije. Ključno je tudi, da Supabase temelji na PostgreSQL, zato je kasnejša selitev v oblak le zamenjava povezave.

### Posledice

* Dobro, ker tuji ključi in unikatne omejitve preprečijo neveljavne podatke že na ravni baze.
* Dobro, ker transakcije zagotovijo, da se npr. izbor zmagovalca in zaprtje questa zgodita skupaj.
* Dobro, ker je selitev v Supabase brez sprememb sheme.
* Slabo, ker mora biti PostgreSQL nameščen na računalniku razvijalca (zahtevnejši zagon kot SQLite).
* Slabo, ker spremembe sheme zahtevajo migracije.

## Prednosti in slabosti možnosti

### MySQL

* Dobro, ker je razširjen in dobro podprt.
* Slabo, ker ga Supabase ne uporablja, kar oteži selitev.

### SQLite

* Dobro, ker ne potrebuje strežnika – baza je ena datoteka.
* Slabo, ker ni primeren za produkcijo z več hkratnimi uporabniki in ni združljiv s Supabase.

### MongoDB

* Dobro, ker je shema prilagodljiva.
* Slabo, ker podatki niso dokumentni, ampak povezani, celovitost pa bi morali zagotavljati v kodi.

## Dodatne informacije

Povezano: [0004 – Prisma](0004-prisma-za-dostop-do-baze.md), [0008 – Pripravljenost za oblak](0008-pripravljenost-za-oblak.md). Podatkovni model: [03-podatkovni-model.md](../03-podatkovni-model.md).
