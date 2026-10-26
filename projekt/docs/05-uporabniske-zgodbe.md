# Uporabniške zgodbe

## US-01 Registracija in prijava

- **Funkcionalnost:** 1 Registracija in prijava (MVP)
- **Vloga:** podjetje, ustvarjalec
- **Zgodba:** Kot uporabnik želim ustvariti račun z izbiro vloge (podjetje ali ustvarjalec) in se varno prijaviti v sistem (2FA).
- **Pogoji:**
  - Pri registraciji sta na voljo samo vlogi podjetje in ustvarjalec.
  - Geslo ima vsaj 8 znakov, e-pošta mora biti unikatna.
  - Ob prijavi se preverja 2FA.

## US-02 Objava questa

- **Funkcionalnost:** 2 Objava questa z navodili (MVP)
- **Vloga:** podjetje
- **Zgodba:** Kot podjetje želim objaviti quest z opisom, slikami, nagrado in rokom, da ustvarjalci vedo, kakšen video potrebujem.
- **Pogoji:**
  - Naslov, opis, zahteve, nagrada in rok (vsaj 7 dni) so obvezni.
  - Naložimo lahko vsaj 3 slike, JPG ali PNG, do 5 MB.
  - Quest se shrani kot `draft` in z gumbom "Pošlji v pregled" preide v `in_review` k adminu.

## US-03 Odobritev questa

- **Funkcionalnost:** 3 Odobritev ali zavrnitev questa (MVP)
- **Vloga:** administrator
- **Zgodba:** Kot administrator želim odobriti ali zavrniti nove queste, da so objavljeni samo ustrezni.
- **Pogoji:**
  - Odobren quest gre v status`open` in se prikaže med odprtimi questi.
  - Zavrnitev zahteva razlog, quest se vrne v `draft`.
  - Podjetje vidi razlog in lahko quest ponovno pošlje v pregled.

## US-04 Oddaja videa

- **Funkcionalnost:** 4 Oddaja AI videa (MVP)
- **Vloga:** ustvarjalec
- **Zgodba:** Kot ustvarjalec želim oddati AI video velikosti vsaj 100 MB, na odprt quest in se potegovati za nagrado.
- **Pogoji:**
  - Video je MP4 in najmanj 100 MB, obvezni so še naslov, opis in AI orodje.
  - Na en quest je mogoča samo ena oddaja, samo do roka.
  - Oddaja dobi stanje `pending`, do roka jo je mogoče urediti ali umakniti.

## US-05 Moderacija oddaj

- **Funkcionalnost:** 5 Moderacija oddaj (MVP)
- **Vloga:** administrator
- **Zgodba:** Kot administrator želim pregledati oddaje in zavrniti neustrezne, da podjetja vidijo samo primerne videe.
- **Pogoji:**
  - Odobrena oddaja (`approved`) postane vidna podjetju.
  - Zavrnitev zahteva razlog, ki ga ustvarjalec vidi pri svoji oddaji.
  - Zavrnjena oddaja ne more zmagati.

## US-06 Samodejno zaprtje questa

- **Funkcionalnost:** 6 Zaprtje questa ob izteku roka (MVP)
- **Vloga:** podjetje
- **Zgodba:** Kot podjetje želim, da se quest ob roku sam zapre, da vsi tekmujejo pod enakimi pogoji.
- **Pogoji:**
  - Po izteku roka ima quest stanje `judging`.
  - Nove oddaje in urejanje po roku niso mogoči.
  - Na strani questa je prikazan preostali čas do roka.

## US-07 Izbor zmagovalca

- **Funkcionalnost:** 7 Izbor zmagovalca (MVP)
- **Vloga:** podjetje
- **Zgodba:** Kot podjetje želim izbrati eno najboljšo oddajo, da dobim video in nagradim avtorja.
- **Pogoji:**
  - Izbrati je mogoče samo odobreno oddajo na svojem questu v stanju `judging`.
  - Pred izbiro se prikaže potrditveno okno, izbire ni mogoče razveljaviti.
  - Po izbiri quest preide v `closed`, zmagovalec je prikazan na strani questa.

## US-08 Brskanje po questih

- **Funkcionalnost:** 8 Brskanje s filtri
- **Vloga:** ustvarjalec
- **Zgodba:** Kot ustvarjalec želim filtrirati queste po nagradi in roku, da hitro najdem zanimive.
- **Pogoji:**
  - Prikazani so samo queste v stanju `open`.
  - Razvrščanje po najvišji nagradi ali najbližjem roku.
  - Največ 12 questov na stran, ob praznem rezultatu sporočilo "Ni questov".

## US-9 Skrite oddaje

- **Funkcionalnost:** 9 Skrite oddaje do zaključka
- **Vloga:** ustvarjalec
- **Zgodba:** Kot ustvarjalec želim, da drugi ne vidijo moje oddaje pred koncem, da mi ne kopirajo ideje.
- **Pogoji:**
  - Pred zaključkom ustvarjalec vidi samo svojo oddajo.
  - Dostop do tuje oddaje vrne napako 403.
  - Podjetje in administrator vidita vse oddaje ves čas.

## US-10 Galerija

- **Funkcionalnost:** 10 Javna galerija zaključenih questov
- **Vloga:** podjetje in uporabnik
- **Zgodba:** Kot podjetje ali uporabnik želim po razglasitvi zmagovalca videti vse videe posameznega questa, da vidim kaj so ustvarili drugi.
- **Pogoji:**
  - Prikazani so samo zaključeni questi, kjer je zmagovalec znan
  - Vsak quest vsebuje naslov, podjetje, nagrada in vse tekmovalne videe.
  - Galerija je dostopna tudi brez prijave.

## US-11 Profil ustvarjalca

- **Funkcionalnost:** 11 Profil ustvarjalca
- **Vloga:** ustvarjalec
- **Zgodba:** Kot ustvarjalec želim javni profil z oddajami in zmagami, da podjetjem pokažem svoje delo.
- **Pogoji:**
  - Prikazani so število oddaj, število zmag in skupni znesek nagrad.
  - Vidne so samo oddaje na zaključenih questih.
  - Zmagovalne oddaje imajo oznako "Zmaga".

## US-12 Lestvica

- **Funkcionalnost:** 12 Lestvica ustvarjalcev
- **Vloga:** ustvarjalec
- **Zgodba:** Kot ustvarjalec želim videti lestvico po zmagah, da se primerjam z drugimi.
- **Pogoji:**
  - Ustvarjalci so razvrščeni po številu zmag.
  - Prikazanih je prvih 20 ustvarjalcev.
  - Klik na ime odpre njegov profil.

## US-13 Povratna informacija

- **Funkcionalnost:** 13 Povratna informacija na oddajo
- **Vloga:** podjetje
- **Zgodba:** Kot podjetje želim ustvarjalcu napisati kratek komentar, da ve, kaj nam je bilo všeč, kaj pa bi lahko bilo boljše.
- **Pogoji:**
  - Komentarje lahko da samo na odobrene oddaje svojih questov.
  - Največ 500 znakov.
  - Vidi jo samo avtor oddaje.

## US-14 Obvestila

- **Funkcionalnost:** 14 Obvestila v aplikaciji
- **Vloga:** ustvarjalec, podjetje
- **Zgodba:** Kot uporabnik želim obvestilo na ob spremembi stanja, da mi ni treba stalno preverjati strani.
- **Pogoji:**
  - Ustvarjalec dobi obvestilo ob odobritvi, zavrnitvi ali zmagi oddaje.
  - Podjetje dobi obvestilo ob odobritvi ali zavrnitvi questa in ob izteku roka.
  - Obestila in število neprebranih so prikazana v glavi strani.

## US-15 Blokiranje uporabnikov

- **Funkcionalnost:** upravljanje uporabnikov
- **Vloga:** administrator
- **Zgodba:** Kot administrator želim blokirati uporabnika, ki krši pravila, da zaščitim platformo in ostale uporabnike.
- **Pogoji:**
  - Blokiran uporabnik se ne more prijaviti, njegova seja se prekine.
  - Njegove oddaje in questi, niso več vidni.
  - Administrator lahko blokado kadarkoli prekliče.