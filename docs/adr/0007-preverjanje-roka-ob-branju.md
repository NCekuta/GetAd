---
status: sprejeta
date: 2026-10-26
---

# Preverjanje roka questa ob branju

## Kontekst in opis problema

Quest mora ob izteku roka samodejno preiti iz stanja `open` v `judging` (US-06). Po roku nove oddaje in urejanje niso več dovoljeni, podjetje pa lahko izbere zmagovalca. Prehod mora biti točen, saj morajo vsi ustvarjalci tekmovati pod enakimi pogoji. Kako zagotoviti, da se quest ob roku zapre?

## Dejavniki odločitve

* stanje questa mora biti vedno pravilno,
* oddaja po roku ne sme biti mogoča niti za sekundo,
* čim manj dodatne infrastrukture,
* delovanje lokalno in v oblaku (AWS Amplify nima trajno delujočega procesa).

## Obravnavane možnosti

* Preverjanje roka ob vsakem branju ali spremembi questa
* Periodično opravilo (cron), ki zapira queste
* Čakalna vrsta z zakasnjenimi opravili (npr. BullMQ + Redis)

## Odločitev

Izbrana možnost: "Preverjanje roka ob branju", ker ne potrebuje ločenega procesa, stanje pa je vedno pravilno, ko ga kdo pogleda. Pri vsakem branju questa in pred vsako oddajo backend primerja `deadline` s trenutnim časom; če je rok potekel in je quest še `open`, ga posodobi v `judging`.

### Posledice

* Dobro, ker oddaja po roku ni mogoča, tudi če stanje v bazi še ni posodobljeno.
* Dobro, ker ni dodatne infrastrukture (cron, Redis) in deluje enako lokalno in v oblaku.
* Slabo, ker stanje v bazi lahko zaostaja – quest, ki ga nihče ne odpre, ostane zapisan kot `open`. Vse poizvedbe (npr. seznam odprtih questov) morajo zato filtrirati tudi po roku.
* Slabo, ker se ob izteku roka ne sproži nobena akcija, zato obvestilo podjetju ob izteku roka (US-14) zahteva dodatno rešitev.

## Prednosti in slabosti možnosti

### Periodično opravilo (cron)

* Dobro, ker je stanje v bazi vedno posodobljeno in lahko sproži obvestila.
* Slabo, ker je zapiranje zamaknjeno do naslednjega zagona in potrebuje ločen proces.

### Čakalna vrsta z zakasnjenimi opravili

* Dobro, ker se quest zapre točno ob roku.
* Slabo, ker zahteva Redis in ločen proces, kar je za ta projekt preveč.

## Dodatne informacije

Povezano: [US-06 Samodejno zaprtje questa](../05-uporabniske-zgodbe.md), [delovni proces questa](../02-funkcionalnosti-in-obseg.md). Če bodo obvestila ob izteku roka postala obvezna, se odločitev dopolni s periodičnim opravilom v novem ADR.
