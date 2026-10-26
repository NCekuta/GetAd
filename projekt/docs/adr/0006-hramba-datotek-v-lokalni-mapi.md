---
status: sprejeta
date: 2026-10-26
---

# Hramba videov in slik v lokalni mapi

## Kontekst in opis problema

Podjetja nalagajo referenčne slike in logotipe, ustvarjalci pa videe velikosti 100 MB in več. Datoteke morajo biti dostopne samo upravičenim uporabnikom (npr. oddaje so do zaključka questa skrite drugim ustvarjalcem). V fazi razvoja aplikacija teče samo lokalno. Kam shranjevati naložene datoteke?

## Dejavniki odločitve

* enostavnost pri lokalnem razvoju,
* brez stroškov in zunanjih računov med razvojem,
* nadzor dostopa do datotek,
* možnost kasnejše zamenjave z oblačno hrambo.

## Obravnavane možnosti

* Lokalna mapa `uploads` na strežniku
* Oblačna hramba (Supabase Storage, AWS S3) že od začetka
* Shranjevanje datotek neposredno v bazo (BLOB)

## Odločitev

Izbrana možnost: "Lokalna mapa `uploads`", ker je za lokalni razvoj najenostavnejša in ne zahteva zunanje storitve. V bazi hranimo le pot do datoteke, datoteke pa backend vrača prek API poti, ki pred tem preveri dostop. Shranjevanje in branje datotek je zaprto v en modul, zato ga je ob objavi mogoče zamenjati s Supabase Storage.

### Posledice

* Dobro, ker razvoj ne potrebuje interneta, računa ali ključev.
* Dobro, ker baza ostane majhna in hitra.
* Dobro, ker gre vsak dostop do datoteke skozi preverjanje pravic.
* Slabo, ker lokalna mapa ni primerna za produkcijo (ni varnostnih kopij, ne deluje na strežnikih brez trajnega diska, kot je AWS Amplify).
* Slabo, ker je pred objavo obvezna selitev na oblačno hrambo.
* Slabo, ker veliki videi zasedejo prostor na disku razvijalca; mapa je zato v `.gitignore`.

## Prednosti in slabosti možnosti

### Oblačna hramba od začetka

* Dobro, ker ni kasnejše selitve.
* Slabo, ker že razvoj zahteva račun, ključe in internetno povezavo.

### Datoteke v bazi

* Dobro, ker so podatki in datoteke na enem mestu.
* Slabo, ker veliki videi močno upočasnijo bazo in varnostne kopije.

## Dodatne informacije

Povezano: [0008 – Pripravljenost za oblak](0008-pripravljenost-za-oblak.md). Odločitev bo ob objavi nadomeščena z novim ADR za Supabase Storage.
