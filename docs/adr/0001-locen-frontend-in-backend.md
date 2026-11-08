---
status: sprejeta
date: 2026-11-08
---

# Ločen frontend (React + Vite) in backend (Node.js + Express)

## Kontekst in opis problema

GetAd potrebuje uporabniški vmesnik z ločenimi pogledi za podjetje, ustvarjalca in administratorja ter backend s poslovno logiko (stanja questov, preverjanje pravic, nalaganje videov). Pri predmetu je zahtevano, da sta frontend in backend jasno ločena v svojih mapah (`frontend/` in `backend/`). Kako organizirati aplikacijo, da bo ločitev jasna, koda pa še vedno preprosta?

## Dejavniki odločitve

* zahteva predmeta: ločena frontend in backend,
* en programski jezik (JavaScript) za celotno aplikacijo,
* preprosta in lahko razložljiva koda,
* enostaven lokalni zagon.

## Obravnavane možnosti

* Frontend React + Vite, backend Node.js + Express
* En projekt v Next.js (strani + API poti)
* Frontend React, backend v drugem jeziku (npr. Python + FastAPI)

## Odločitev

Izbrana možnost: "Frontend React + Vite, backend Node.js + Express", ker oba dela ostaneta v JavaScriptu, Express je najbolj razširjeno in preprosto ogrodje za REST API, Vite pa je najpreprostejši način za zagon React aplikacije.

* `frontend/` – React, Vite, React Router in Tailwind CSS, teče na `http://localhost:5173`.
* `backend/` – Express, Prisma in PostgreSQL, teče na `http://localhost:3000`.
* Frontend kliče backend na poteh `/api/...`. Vite razvojni strežnik te zahtevke posreduje (proxy) na backend, zato ni treba nastavljati CORS.

### Posledice

* Dobro, ker je jasna meja med odjemalcem in strežnikom; backend je samostojen REST API.
* Dobro, ker je Express preprost: vsaka pot je ena funkcija, ki jo je enostavno razložiti.
* Dobro, ker bi backend lahko kasneje uporabljala tudi mobilna aplikacija.
* Slabo, ker sta dva projekta, dve `package.json` datoteki in dva ukaza za zagon.
* Slabo, ker frontend in backend ne delita kode (npr. validacije), zato se nekatera preverjanja ponovijo.
* Slabo, ker je ob objavi treba objaviti dva dela (glej [ADR-0008](0008-pripravljenost-za-oblak.md)).

## Prednosti in slabosti možnosti

### En projekt v Next.js

* Dobro, ker sta frontend in backend v eni kodni bazi z enim ukazom za zagon.
* Slabo, ker ne izpolnjuje zahteve po ločenem frontendu in backendu.
* Slabo, ker ima Next.js veliko posebnosti (strežniške komponente, App Router), ki zapletejo kodo.

### React + Python

* Dobro, ker sta FastAPI in Django zrela in dobro dokumentirana.
* Slabo, ker zahteva dva jezika in dve razvojni okolji.

## Dodatne informacije

Povezano: [0002 – React](0002-react-za-uporabniski-vmesnik.md), [0005 – Prijava z JWT](0005-prijava-z-jwt.md).
