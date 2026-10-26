---
status: sprejeta
date: 2026-10-26
---

# En projekt v Next.js za frontend in backend

## Kontekst in opis problema

GetAd potrebuje uporabniški vmesnik z ločenimi pogledi za podjetje, ustvarjalca in administratorja ter backend s poslovno logiko (stanja questov, preverjanje pravic, nalaganje videov). Projekt razvija ena oseba v omejenem času, zato mora biti struktura čim enostavnejša za razvoj, zagon in kasnejšo objavo. Kako organizirati frontend in backend?

## Dejavniki odločitve

* en razvijalec in omejen čas – čim manj ločenih projektov in konfiguracije,
* en programski jezik za celotno aplikacijo,
* preprost lokalni zagon (en ukaz),
* možnost kasnejše objave v oblaku (AWS Amplify).

## Obravnavane možnosti

* En projekt v Next.js (strani + API poti)
* Ločen frontend (React + Vite) in backend (Node.js + Express)
* Ločen frontend (React) in backend v drugem jeziku (npr. Python + Django/FastAPI)

## Odločitev

Izbrana možnost: "En projekt v Next.js", ker združi frontend in backend v eni kodni bazi, v enem jeziku (JavaScript) in z enim ukazom za zagon (`npm run dev`). Za projekt te velikosti ločena storitev ne prinese dovolj koristi, da bi upravičila dodatno delo.

### Posledice

* Dobro, ker frontend in backend delita kodo (npr. preverjanje podatkov, tipe stanj questa).
* Dobro, ker ni treba urejati CORS, dveh strežnikov in dveh postopkov objave.
* Dobro, ker AWS Amplify neposredno podpira objavo Next.js aplikacij.
* Slabo, ker sta frontend in backend tesno povezana – če bi kasneje potrebovali mobilno aplikacijo ali javni API, bi bilo treba API poti bolj jasno ločiti.
* Slabo, ker se mora razvijalec naučiti posebnosti Next.js (App Router, strežniške in odjemalske komponente).
* Slabo, ker mapi `frontend/` in `backend/` v repozitoriju ostaneta prazni oziroma ne odražata dejanske strukture kode.

## Prednosti in slabosti možnosti

### Ločen React + Express

* Dobro, ker je jasna ločitev med odjemalcem in strežnikom.
* Slabo, ker zahteva dva projekta, dva zagona in nastavitev CORS.

### React + Python backend

* Dobro, ker sta Django in FastAPI zrela in dobro dokumentirana.
* Slabo, ker zahteva dva jezika in dve okolji, kar za enega razvijalca pomeni več dela.

## Dodatne informacije

Povezano: [0002 – React](0002-react-za-uporabniski-vmesnik.md), [0008 – Pripravljenost za oblak](0008-pripravljenost-za-oblak.md).
