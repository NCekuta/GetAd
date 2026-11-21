
# Pregled prevzetega projekta GetAd

## Opis projekta
GetAd je spletna platforma za tekmovanja v AI video oglasih. Podjetja objavljajo queste z navodili, nagrado in rokom, ustvarjalci pa oddajajo svoje videe. Administrator skrbi za odobritev questov in moderacijo oddaj.

Projekt uporablja React in Vite za frontend, Node.js in Express za backend ter PostgreSQL in Prisma za podatkovno bazo.

## Pregled implementiranih MVP funkcionalnosti
V dokumentaciji je predvidenih sedem MVP funkcionalnosti:
- registracija in prijava uporabnikov,
- objava questa,
- odobritev ali zavrnitev questa,
- oddaja AI videa,
- moderacija oddaj,
- samodejno zaprtje questa po izteku roka,
- izbor zmagovalca.

V kodi so implementirane poti za vseh sedem funkcionalnosti. Lokalno smo uspešno preizkusili prijavo, objavo questa, odobritev questa, oddajo videa in moderacijo. Samodejnega zaprtja in izbora zmagovalca nismo praktično preizkusili.

## Pregled uporabniških zgodb

### US-01 Registracija in prijava
Registracija omogoča izbiro vloge podjetje ali ustvarjalec. Backend preverja obvezna polja, najmanj osem znakov dolgo geslo in unikatnost e-pošte. Prijava uporablja JWT in preverja blokirane uporabnike.

Praktično smo uspešno preverili prijavo z obstoječimi testnimi računi. Registracije novega uporabnika in negativnih primerov nismo posebej preizkusili.

Ocena: večinoma implementirano. V backendu ni vidnega posebnega preverjanja pravilnega formata e-poštnega naslova.

### US-02 Objava questa
Podjetje lahko ustvari quest z naslovom, opisom, zahtevami, nagrado in rokom. Rok mora biti vsaj sedem dni v prihodnosti. Sistem omogoča največ tri referenčne slike JPG ali PNG do 5 MB.

Uspešno smo ustvarili quest "Testni AI oglas" z nagrado 500 EUR in rokom 10. 12. 2026 ter ga poslali v pregled administratorju.

Ocena: implementirano za preverjeni osnovni potek. Omejitve slik in neveljavnih podatkov smo preverili v kodi.

### US-03 Odobritev questa
Administrator lahko pregleda queste v stanju in_review in jih odobri ali zavrne. Ob odobritvi quest preide v stanje open. Ob zavrnitvi je razlog obvezen, quest pa se vrne v draft.

Praktično smo odobrili quest "Testni AI oglas" in preverili, da je postal viden ustvarjalcu.

Ocena: implementirano. Zavrnitev in ponovno pošiljanje sta preverjena v kodi, ne pa praktično.

### US-04 Oddaja videa
Ustvarjalec lahko na odprt quest odda MP4 video do 100 MB. Obvezni so naslov, opis in uporabljeno AI orodje. Sistem omejuje oddajo na eno na posamezen quest in omogoča urejanje ali umik pred rokom.

Uspešno smo oddali testni MP4 video. Video se je prikazal v aplikaciji s stanjem pending, na voljo pa sta bili tudi možnosti Uredi in Umakni.

Ocena: implementirano za preverjeni osnovni potek. Omejitve formata, velikosti in števila oddaj so preverjene v kodi.

### US-05 Moderacija oddaj
Administrator lahko pregleda oddaje in jih odobri ali zavrne. Pri zavrnitvi je razlog obvezen. Podjetje lahko vidi samo odobrene oddaje na svojih questih, za izbor zmagovalca pa so dovoljene samo odobrene oddaje.

Praktično smo preverili oddajo videa in izvedli administratorsko odobritev.

Ocena: implementirano za osnovni potek. Zavrnitev in prikaz razloga ustvarjalcu nista bila praktično preizkušena.

## Lokalni zagon in ugotovitve
Projekt smo uspešno zagnali lokalno. PostgreSQL 17 je deloval v Dockerju na vratih 5434, backend na vratih 3000 in frontend na vratih 5173. Prisma migracija in dodajanje testnih podatkov sta bila uspešna.

Ob pregledu smo ugotovili, da projekt še nima pripravljenih skript za lint in teste, backend pa nima posebne build skripte. Pri namestitvi backend odvisnosti je npm opozoril tudi na štiri varnostne ranljivosti visoke stopnje.

## Zaključek
GetAd ima dobro pripravljeno osnovo in implementirane glavne MVP funkcionalnosti. Preverjeni osnovni uporabniški postopki delujejo. Za nadaljnji razvoj je treba dodati avtomatske teste, preverjanje kakovosti kode in CI/CD cevovod ter urediti javno namestitev aplikacije.
