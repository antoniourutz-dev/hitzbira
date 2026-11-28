# HITZBIRA 2.14.0 · Eszenak eta esaldi lotuak

2026-11-28. Lan-adar bakarra: `feature/guest-access-continuity`.
Oinarria: `350cc8ae48f0a80b7ad56a30f1ea5799481acf39` (2.13.0), Git fetch eta Vercelen READY metadatuekin egiaztatua; 2.12.0ko `0653644` haren arbasoa da. Ez da main edo produkziorako aldaketarik egiten.

## Eszenen eta asseten inbentarioa

`SCENE_INVENTORY_2.14.0.json` fitxategiak benetako motorrak emandako 20 eszenen IDak, narrazioak/elkarrizketak eta idazmen-atazak jasotzen ditu. Ez dira izen hipotetikoak.

| Eszena | Artelanaren konposizioa |
|---|---|
| HB-EP-FOREST-01 · Enborreko mezua | Basoko argigunea, enborra eta mezua |
| HB-EP-FOREST-02 · Basoko hitzak | Baso trinkoa eta Txinparten aurkezpena |
| HB-EP-FOREST-03 · Non, nora, nondik? | Mendiko panorama, bidea eta erreka |
| HB-EP-FOREST-04 · Hiru bideak | Hiru adarreko gurutzea, seinaleak, zubia eta bide itxia |
| HB-EP-FOREST-05 · Zure mapa | Erreka ondoko mapa, hiru eraikin eta marrazteko arkatza |

Bost SVG desberdin, 960×420 koordinatu-sistema eta paleta komuna; ez hondo bera berriz izendatuta. Jokalarian, Bidean eta Jolastokian egungo atal berari lotzen zaizkio. Narrazioa HTML irakurgarri bereizian dago; irudi apaingarriak alt hutsarekin. PWA cacheak bost fitxategiak jasotzen ditu.

Benetako marka: `assets/bira/bira_logo_v02.svg`, `bira_00_ongietorria_v02.svg` … `bira_08_poztasun-lasaia_v02.svg`, `bira_bust_v02.svg`; bytez mantenduak. Pertsonaien aurreko erretratuak `bidea/bidea.js::face` funtzioan zeuden, ez kanpoko irudi-fitxategietan. Aneren, Ikerren, Lurren eta Txinparten koloreak eta aurpegi-geometriak mantendu dira; jakin-minaren bekainak gehitu dira, eta Txinparten txanoak galtzagorriaren silueta bereizten du. Ez da Bira ordeztu.

## Hizkuntza-kontraste mugatuak

- CAUSE-02-OPEN: kausazko mendeko perpausa, `dugu` → `dugulako`, atazak kausa eskatzen duenean soilik.
- CAUSE-03-REPORT: esandako mezua, `dago` → `dagoela`.
- CAUSE-04-CONCESSION: kontzesioa, `dugu arren` → `dugun arren`.
- CAUSE-05-CONDITION: baldintza vs baieztapena, `da` → `bada`; lehenengoa ez da berez arau-akatsa.
- MIRROR-05-OPEN: bi objektu eta hartzailea dituen zehar-estiloa, `dituztela` → `dizkiotela`.

Ataza-ID zehatza eta perpaus osoaren kontrastea eskatzen dira. Onartutako hitz-ordena alternatiboak badaude. Beste aditz-denbora, euskalki, erregimen, aipu edo perpaus zabalagoak `unverified` dira: ez dira akats frogatu bihurtzen. Lokailu solteek ez dute egitura edo kausalitatea baliozkotzen. Aurreko kausa/ondorio atazen egiaztapenak eta bankuak mantentzen dira.

Lehengo berridazketa-fluxuak originala eta laguntza gordetzen ditu; zuzenketa token bakarrekoa da. Memoria eta 1/3/7/14/30 eguneko berreskurapen-motorra berrerabili dira. Hiru egitura berriek beste egoera bateko errepaso bana dute. Ez XP, nota edo gaitasun autonomoaren baieztapenik ekoizpen irekietatik.

Egoera: **zirriborroa / berrikusteko**, ez banku kanoniko egiaztatua. Iturri-deskribapenak eta aurreko atazak erreferentziak dira, ez adituen onarpena. Kontsultatutako erreferentziak (2026-11-28):

- Euskaltzaindia, [Euskararen Gramatika, 30](https://www.euskaltzaindia.eus/index.php?kodea=30&lang=eu-ES&option=com_liburuak&task=gramatika): perpaus osagarriak; deskribapena.
- UPV/EHU, [EEH, arren](https://www.ehu.eus/eeh/cgi/bila?h=arren): erabilera-lekukotzak, ez arau debekatzailea.
- Euskaltzaindia, [Euskararen Gramatika II](https://www.euskaltzaindia.eus/dok/iker_jagon_tegiak/83272-2.pdf): baldintzazko ba- kapituluaren erreferentzia; ez da PDF osoaren egiaztapenik aldarrikatzen.
- Aurreko `DATIVE_CONTRASTS`, `VERB_TASKS` eta `bidea/data.js` bankuen erabilera mugatua. Ez da Driveko fitxa egiaztatu berririk asmatu edo argitaratu.

## Protokoloak

Tokiko kopiak aurkitu dira `Documents/Codex/2026-11-19/erabili-sustrai-gram-sortu-ikerren-c1-2/work` azpian: 00/04/05/08 v2.1 eta 02 v2.0. 00: aldaerak, froga mugatua eta originala; 02: gutxieneko zuzenketa eta berridazketa; 04: funtzioa, testuingurua eta transferentzia; 05: proba errealak vs balidazio independentea; 08: zirriborroa ez da egiaztatua. 09 ez da aurkitu. Erabiltzaileak 2026-11-28an falta denarekin aurrera egitea baimendu du; ez da ordezko protokolo kanonikorik asmatu.

## Egiaztapenak eta mugak

`node tests/run.cjs`: suite guztiak gaindituta. Kasu positiboak, negatiboak, aldaerak, aipuak, lokailu solteak, ataza ezezagunak, zuzenketa minimoa eta gainerako abentura/guest/account erregresioa. `complex-writing.cjs`: 22 proba bereizi; benetako queue/check/save/resume bidea, originala, memoria behin bakarrik, lagundutako emaitza neutrala eta berreskurapen desberdina barne. Fixtures sintetikoak; ez ikasleen ekoizpen errealak.

Benetako kontu autentifikatuen end-to-end eta adituaren hizkuntza-auditoria egiteke. Ez IA zerbitzurik, ez gakorik, ez datu-basearen eskema edo baimenen aldaketarik. 09 eta 05eko T01–T24/B01–B08 multzo osoa ez dira gainditutzat ematen.

Rollback: inkrementuaren commit-a revert egin lan-adarrean; ez dira storage gakoak edo aurreko datuak berridazten.
