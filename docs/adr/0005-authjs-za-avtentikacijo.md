---
status: sprejeta
date: 2026-10-26
---

# Auth.js za avtentikacijo in seje

## Kontekst in opis problema

Uporabniki se registrirajo z e-pošto in geslom ter izberejo vlogo (podjetje ali ustvarjalec). Backend mora pred vsako zaščiteno akcijo preveriti, kdo je uporabnik in kakšno vlogo ima. Blokiran uporabnik se ne sme prijaviti. Napake pri lastni implementaciji prijave in sej so pogost vir varnostnih ranljivosti. Kako izvesti prijavo in upravljanje sej?

## Dejavniki odločitve

* varnost (shranjevanje gesel, zaščita sej),
* dobra integracija z Next.js,
* podatki o uporabnikih ostanejo v lastni bazi,
* brezplačna uporaba.

## Obravnavane možnosti

* Auth.js (NextAuth) s prijavo z e-pošto in geslom
* Lastna implementacija (JWT ali seje v bazi)
* Zunanja storitev (Clerk, Auth0)
* Supabase Auth

## Odločitev

Izbrana možnost: "Auth.js", ker je preverjena knjižnica, narejena za Next.js, ki ureja prijavo, odjavo in seje v šifriranem piškotku. Gesla so zgoščena z `bcrypt`, uporabniki in vloge pa ostanejo v naši bazi PostgreSQL. Vlogo in status blokade preverjamo v lastni kodi.

### Posledice

* Dobro, ker ne pišemo lastne kriptografije in upravljanja sej.
* Dobro, ker so uporabniki v lastni bazi in niso vezani na zunanjo storitev.
* Dobro, ker je pozneje mogoče dodati prijavo z Googlom ali drugimi ponudniki.
* Slabo, ker Auth.js prijavo z geslom (Credentials) podpira le osnovno – registracijo, ponastavitev gesla in 2FA (US-01) je treba dodati sami.
* Slabo, ker je seja v piškotku, zato blokada uporabnika zahteva dodatno preverjanje statusa ob zahtevkih.

## Prednosti in slabosti možnosti

### Lastna implementacija

* Dobro, ker je poln nadzor nad delovanjem.
* Slabo, ker je veliko možnosti za varnostne napake.

### Clerk / Auth0

* Dobro, ker ponujata 2FA, ponastavitev gesla in uporabniški vmesnik.
* Slabo, ker so uporabniki pri zunanjem ponudniku, brezplačni paketi pa so omejeni.

### Supabase Auth

* Dobro, ker bi se lepo povezal s kasnejšo selitvijo v Supabase.
* Slabo, ker bi aplikacijo že pri lokalnem razvoju vezal na Supabase.

## Dodatne informacije

Povezano: [US-01 Registracija in prijava](../05-uporabniske-zgodbe.md), [US-15 Blokiranje uporabnikov](../05-uporabniske-zgodbe.md).
