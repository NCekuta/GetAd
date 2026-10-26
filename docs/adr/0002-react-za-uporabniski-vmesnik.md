---
status: sprejeta
date: 2026-10-26
---

# React za uporabniški vmesnik

## Kontekst in opis problema

Aplikacija ima več pogledov, ki se razlikujejo glede na vlogo uporabnika (seznam questov, oddaja videa, moderacija, izbor zmagovalca). Veliko elementov se ponavlja (kartice questov, obrazci, potrditvena okna). Katero knjižnico uporabiti za gradnjo uporabniškega vmesnika?

## Dejavniki odločitve

* gradnja iz ponovno uporabnih komponent,
* dobra dokumentacija in veliko primerov,
* združljivost z izbranim ogrodjem (Next.js),
* obstoječe znanje razvijalca.

## Obravnavane možnosti

* React
* Vue (z Nuxt)
* Svelte (s SvelteKit)

## Odločitev

Izbrana možnost: "React", ker je najbolj razširjen, ima največ dokumentacije in knjižnic, Next.js pa temelji na njem. Komponente omogočajo, da se isti elementi (npr. kartica questa) uporabijo v več pogledih.

### Posledice

* Dobro, ker je za skoraj vsak problem na voljo primer ali knjižnica.
* Dobro, ker se pogledi za različne vloge sestavijo iz istih komponent.
* Slabo, ker React sam po sebi ne določa strukture projekta – to pokrije Next.js.
* Slabo, ker ima React več ponavljajoče se kode (npr. upravljanje stanja obrazcev) kot Vue ali Svelte.

## Prednosti in slabosti možnosti

### Vue (Nuxt)

* Dobro, ker je enostaven za učenje in ima pregledno sintakso.
* Slabo, ker je manj razširjen in bi pomenil Nuxt namesto Next.js.

### Svelte (SvelteKit)

* Dobro, ker ima malo ponavljajoče se kode in je hiter.
* Slabo, ker ima manjšo skupnost in manj knjižnic.

## Dodatne informacije

Povezano: [0001 – En projekt v Next.js](0001-en-projekt-nextjs.md).
