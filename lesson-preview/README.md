# Ikasgai koherentearen aurrebista

Egoera: diseinua berrikusteko eredua, ez ikastaro edo gaitasun-ebaluazio berri bat.

## Ikaslearen esperientzia

Hasiera: gai zehatza, helburua, hasi/jarraitu eta lau urrats ikusgarri. Ikasgai bakarra: **Gauzak deskribatu**. Adibidea → irudiekin bi hautu gidatu → idatziz erabiltzea → egindakoaren laburpena. Laguntza eta erantzunen berrikuspena eskuragarri. Hurrengo ikasgai osatugaberik ez da iragartzen. Saioa eten eta gailu berean jarrai daiteke.

Jatorrizko oinarria: `legacy/bank05.js`, `GB-ize-01` (izena/izenondoa, *Liburu gorria hartu dut* / *Etxe handia ikusi dugu*). Irudi eta ataza berriak aurrebistarako egokitzapenak dira; ez da baliozkotze akademiko independentea aldarrikatzen. Ez du B2/C1 curriculum osoaren ordezkapena egiten, ezta sei nodoko pilotua ikastaro osotzat aurkezten ere.

## Jarduna eta mugak

- Hautu gidatuak lagundutako jarduna dira. Idatzizko azken erantzunaren laguntza bereizita gordetzen da.
- Bankuko ereduarekin bat etortzea ez da gaitasunaren edo mailaren egiaztapena. Ezagutzen ez den idatzia `unverified` da.
- Aurrebistak ez du Supabase, produkzioko kontu, saiakera edo aurrerapenik irakurri/aldatzen. Bere gako lokal bakarra erabiltzen du; ez dago gailuen arteko sinkronizaziorik.
- Ez du analitika, kanpoko AI zerbitzu edo erantzun-bidalketarik egiten. Argitaratutako aurrebistan marka-irudiak bertan txertatuta daude.
- Ez du produkzioko aplikazioa ordezkatzen. Diseinua onartu ondoren, lehendik dagoen ikaslearen shellarekin eta erregistro-kontratuarekin integratu behar da.

## Eraiki eta egiaztatu

`node lesson-preview/build-preview.cjs` komandoak `lesson-preview/preview-worker.mjs` sortzen du HTML/CSS/JS eta lehendik dauden Bira aktiboekin. Irteera sortua git-etik kanpo dago. Jatorrizko static asset arkitektura ez da aldatzen; aurrebista independente hau Worker txiki autoeduki gisa zerbitzatzen da.

`node tests/run.cjs`: lehengo erregresio-bateriak eta ikasgaiaren egoera-trantsizioak. Benetako nabigatzaileko probak aparte dokumentatuko dira.

## Egindako egiaztapenak · 2026-11-25

- 246 egiaztapen automatiko: lehengo 232 + 11 egoera-trantsizio eta 3 gomendio-moten erregresio. Hautua aurretik bete gabe ezin da aurrera egin; bidalketa bikoitza ez da onartzen; ezezagunak ez dira akastzat jotzen; laguntza eta zirriborroa berriz kargatzean mantentzen dira.
- Nabigatzaile errealean: hasiera → azalpena → hautu desegokiaren feedbacka → orria berriz kargatu → bigarren hautua → idazten hasi → hasierara itzuli → berriz kargatu → zirriborroarekin jarraitu → idatzia alderatu → amaierako laburpena. 0 kontsola-errore.
- 375 × 812 bistaren neurriak: hasiera, azalpena eta laburpena irakurgarri; horizontalean gainezka egin gabe; Bira irudiak kargatuta. Ez da benetako telefono fisikoaren edo haurrekin egindako erabilgarritasun-probaren ordezkoa.
- `studentLaunchPlan()`-en aurkitutako erregresioa adar berean zuzenduta: `browse`, `explore` eta `assess` bakoitzak dagokion ekintza egiten du. Ez da produkziora eraman.

Cloudflareko aurrebista: https://hitzbira-ikasgai-eredua.antonio-urutz.workers.dev/
Main eta https://hitzbira.antonio-urutz.workers.dev/ ez dira aurrebista honekin ordezkatu.
