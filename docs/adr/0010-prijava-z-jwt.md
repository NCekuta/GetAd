---
status: sprejeta
date: 2026-11-08
---

# Prijava z JWT žetonom v piškotku

## Kontekst in opis problema

V [ADR-0005](0005-authjs-za-avtentikacijo.md) smo za prijavo izbrali Auth.js, ki je narejen za Next.js. Po prehodu na ločen Express backend ([ADR-0009](0009-locen-frontend-in-backend.md)) Auth.js ni več naravna izbira. Backend mora pred vsako zaščiteno akcijo vedeti, kdo je uporabnik in kakšno vlogo ima. Kako izvesti prijavo in seje v Express backendu?

## Dejavniki odločitve

* varno shranjevanje gesel,
* preprosta koda, ki jo je mogoče razložiti,
* deluje z Express backendom,
* uporabniki ostanejo v lastni bazi.

## Obravnavane možnosti

* JWT žeton v `httpOnly` piškotku (`jsonwebtoken` + `bcryptjs`)
* Seje na strežniku (`express-session`)
* Passport.js
* Auth.js z Express adapterjem

## Odločitev

Izbrana možnost: "JWT žeton v `httpOnly` piškotku", ker potrebuje le dve majhni knjižnici in nekaj vrstic kode.

1. Ob registraciji se geslo zgosti z `bcryptjs` in shrani v bazo.
2. Ob prijavi backend preveri geslo in ustvari JWT žeton z `id` in `role` uporabnika, podpisan s skrivnim ključem iz `.env`.
3. Žeton se shrani v `httpOnly` piškotek, ki ga JavaScript v brskalniku ne more prebrati.
4. Vmesna funkcija (middleware) na backendu ob vsakem zaščitenem zahtevku preveri žeton, prebere uporabnika iz baze, preveri blokado in vlogo.
5. Odjava piškotek izbriše.

### Posledice

* Dobro, ker je celoten postopek prijave kratek in pregleden.
* Dobro, ker so gesla zgoščena, žeton pa ni dostopen JavaScriptu v brskalniku.
* Dobro, ker blokada uporabnika deluje takoj, saj middleware ob vsakem zahtevku preveri uporabnika v bazi.
* Slabo, ker je del varnostne logike naš; paziti moramo na dovolj dolg skrivni ključ in rok veljavnosti žetona.
* Slabo, ker ponastavitev gesla in 2FA nista vključena (2FA je med kasnejšimi nadgradnjami).

## Prednosti in slabosti možnosti

### express-session

* Dobro, ker je seja na strežniku in jo je mogoče kadarkoli preklicati.
* Slabo, ker za trajne seje potrebuje dodatno hrambo (npr. tabelo v bazi).

### Passport.js

* Dobro, ker podpira veliko načinov prijave.
* Slabo, ker za samo prijavo z geslom doda več konfiguracije kot koristi.

### Auth.js z Express adapterjem

* Dobro, ker je preverjena knjižnica.
* Slabo, ker je adapter za Express manj dokumentiran in prilagojen predvsem Next.js.

## Dodatne informacije

Nadomešča [ADR-0005](0005-authjs-za-avtentikacijo.md). Povezano: [US-01 Registracija in prijava](../05-uporabniske-zgodbe.md), [US-15 Blokiranje uporabnikov](../05-uporabniske-zgodbe.md).
