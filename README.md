# JuLie spel — reken- en spelapp voor Julian & Lieke

Een vrolijke reken- en spelapp waarmee Julian en Lieke spelenderwijs leren
rekenen en spellen — samen met een ouder én zelfstandig. Gebouwd als **PWA**:
werkt direct op de telefoon (thuisscherm-icoon, ook offline), zonder appstore.

De app **groeit mee met de kinderen tot ± 10 jaar**: elke oefening past zich
qua moeilijkheid aan, en er komen automatisch nieuwe modules bij (tafels,
delen, klokkijken, lastige spelling) zodra de basis goed zit.

## Voor wie / wat zit erin

**Profielen** met een eigen thema en losse voortgang:

- **Julian** — thema *dino's & superhelden* 🦖🦸
- **Lieke** — thema *eenhoorns & regenbogen* 🦄🌈

**Rekenen:** tellen, cijfers herkennen, plus & min (met blokjes), sommen
invullen, tafels, delen, klokkijken.
**Taal:** letters & klanken, kleuren & vormen, luister & kies het woord, woord
spellen met lettertegels, woord bij plaatje, en lastige spelling (ei/ij, au/ou,
d/t…).

**Zelfstandig spelen:** alles wordt voorgelezen (Nederlandse spraak), grote
knoppen, felle kleuren, korte sessies van 8 vraagjes en directe feedback met
geluid en animatie.

**Beloning:** een mascotte die groeit en accessoires verdient (strik, feesthoed,
bril, cape, kroon), plus sterren, levels en een dagstreak.

## Op de telefoon zetten (aanbevolen: GitHub Pages)

Er zit een workflow bij die de app automatisch publiceert.

1. Zet in GitHub bij **Settings → Pages** de bron op **GitHub Actions**.
2. Merge deze code naar de `main`-branch (de workflow draait dan vanzelf).
3. Open op de telefoon de link die Pages geeft
   (`https://<gebruiker>.github.io/app-kindjes/`).
4. In de browser: **"Zet op beginscherm" / "Add to Home Screen"** → de app
   staat als icoon op de telefoon en werkt daarna ook offline.

## Lokaal proberen op de computer

Een PWA moet via een webserver draaien (niet als los bestand openen):

```bash
cd app-kindjes
python3 -m http.server 8000
# open daarna http://localhost:8000
```

## Zelf uitbreiden

Alles is gewoon HTML/CSS/JS — geen buildstap nodig.

- **Woordjes toevoegen:** `src/data/words.js` (`WORDS_T1/T2/T3` en
  `SPELLING_TRICKY`).
- **Telbare voorwerpen / kleuren / vormen:** `src/data/things.js`.
- **Nieuwe oefening maken:** voeg een module toe in `src/exercises/rekenen.js`
  of `taal.js` (een object met `generate(level)` dat een vraag teruggeeft) en
  registreer hem in `src/exercises/index.js`.
- **Wanneer iets vrijkomt / startniveau per kind:** `src/exercises/index.js`
  (`CURRICULUM` en `UNLOCK`).
- **Thema of kind aanpassen/toevoegen:** `src/themes.js` en de `PROFILES` in
  `src/state.js`.

## Hoe het "meegroeit"

- Per kind en per module wordt een **niveau** bijgehouden (1 t/m 8). Na een
  sessie gaat het niveau omhoog bij een hoge score en omlaag als het te moeilijk
  was. Zo blijft het altijd passend — van kleuter tot groep 6.
- **Geavanceerde modules** (tafels, delen, klok, lastige spelling) staan eerst
  op slot 🔒 en komen vanzelf vrij zodra de basis onder de knie is.

## Techniek

- Pure PWA: HTML + CSS + vanilla JavaScript (ES-modules), geen frameworks.
- Voortgang lokaal per kind in `localStorage`.
- Voorlezen via de Web Speech API (Nederlands); geluidjes via de Web Audio API.
- Offline dankzij een service worker (`sw.js`).
- Voortgang staat op de telefoon zelf; cloud-synchronisatie kan later.
