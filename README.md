# HitzBira

**2.7.0 · Multi-plataforma: mugikorra, tableta eta ordenagailua (lan-mahaia, 2 zutabeko Bidea eta laguntza-panela).**

Euskaraz ikasteko aplikazio estatikoa: gramatika-fitxak, deklinabidea, aditz-laborategia, praktika, Bira eta curriculumeko ibilbide pilotuak.

Gordailu honek `hitzbira-gramatika` proiektuko 29 adarren lana bateratzen du. Oinarria `p1-04-world-pilot` da; `main` adarreko eguneko bolada eta UI Kit GOLD 1.0.1 gehitu dira. [Adarren azterketa eta bateratze-erabakiak](docs/BRANCH_UNIFICATION_2026-11-25.md).

## Lokalean erabili

Zerbitzatu gordailuaren erroa HTTP bidez, adibidez `python -m http.server 8000`, eta ireki http://localhost:8000. Ez ireki zuzenean `file://` bidez. Ez da konpilaziorik edo frontend mendekotasunik instalatu behar.

## Egiaztapenak

Node.js 22 edo berriagoa: `node tests/run.cjs` edo `npm test`. GitHub Actions-ek multzo bera exekutatzen du push eta pull request bakoitzean.

## Antolaketa

| Fitxategia edo karpeta | Eginkizuna |
|---|---|
| `index.html`, `app.js`, `style.css`, `platform.css` | Interfazea eta gramatika-praktika |
| `data.js` | Bankuen karga, kontuak eta sinkronizazioa |
| `core.js` | Curriculum pilotua, hautaketa moldakorra eta tokiko errepaso-egutegia |
| `bidea/` | Gaur pantaila, Mapa, adin-profilak (Haurra, Gaztea, Heldua), ikasgai-erreproduzitzailea eta ikuskatzaile modua (`?ikuskatu=1`). B1–B2 uhartearen 1. kapitulua: 5 ikasgai, Supabaseko SMX zirriborroetako 52 ariketa |
| `world.js`, `world-design.js`, `story.js` | Mundu narratiboa eta Bira |
| `aditzak/` | Aditz-motorra, laborategia eta banku estatikoak |
| `legacy/` | Gramatika-bankuen jatorrizko snapshot-ak |
| `ui-kit/` | Diseinu-tokenak, egokitzailea eta osagaien katalogoa |
| `supabase/functions/` | Lehendik dagoen kontu-funtzioaren iturburua |
| `sw.js`, `manifest.webmanifest` | PWA eta offline baliabideak |
| `tests/`, `policy/` | Erregresio-probak eta ebidentziaren politika |

## Kontuak eta datuak

Supabase Auth-en `@hitzbira.app` kontu baieztatuek lehen saio-hasieran jasotzen dute HitzBirako erregistroa automatikoki; ez da eskuzko bigarren altarik behar. Auth-ek domeinuko kontuei rol isolatua esleitzen die. Pasahitza eta benetako saioa behar dira, eta blokeoak nahiz lehendik desgaitutako kontuak errespetatzen dira. Ikus [sarbide automatikoaren arauak](docs/ACCOUNT_ADMISSION.md).

Gonbidatuaren jarduna gailu eta domeinu honetan gordetzen da. Baimendutako kontuen gramatika- eta aditz-jardunaren zati bat lehendik dagoen Supabase zerbitzuarekin sinkronizatzen da; koadernoko bisitak eta curriculumeko errepaso-egutegia tokikoak dira. Ez aldatu datuen release-identifikatzailea bertsio bisuala eguneratze hutsagatik.

Gordailuak bezeroan erabiltzeko gako argitaragarria du. Ez gehitu service-role gakorik, pasahitzik, token pribaturik edo erabiltzaileen daturik. Gordailua bateratzeak ez ditu Supabaseko migrazioak edo funtzioak hedatzen.

## Hedapena eta mugak

Vercel-en erabili erro-direktorioa, framework `Other` eta eraikuntzarik gabeko gune estatikoa. `vercel.json` fitxategiak PWA goiburuak zehazten ditu. Lehendik dagoen Vercel proiektuaren Git lotura bereiz eguneratu behar da gordailu honetatik hedatu nahi bada.

Domeinu arteko localStorage eta saioak ez dira automatikoki migratzen. Edukiak pilotuak dira eta berrikuspen akademikoa behar dute; praktika-adierazleek ez dute hizkuntza-maila ofizialik ziurtatzen. Benetako kontuaren eta mugikorraren azken onarpena egiteke dago; ikus bateratze-txosteneko mugak.
