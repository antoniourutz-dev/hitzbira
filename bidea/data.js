/* HitzBira · Bidea: B1–B2 uhartea, 1. kapitulua.
   Ariketak Supabaseko SMX zirriborroetatik datoz (DRAFT-SIN-B2-KAUS-20261122, DRAFT-SIN-B2-OND-20261122),
   erantzun onartuak eta azalpenak barne. Zirriborroak dira: ikuskatzaileak zuzenean berrikusten ditu.
   Biraren eszenak eta interfazeko testuak berriak dira eta berrikusi behar dira.
   Eremuak: t = mc (aukeratu) | gap (idatzi) | chips (txartelak) | fix (akatsa zuzendu) | build (esaldia eraiki). */
(function(){
const K="DRAFT-SIN-B2-KAUS-20261122-",O="DRAFT-SIN-B2-OND-20261122-";
const gloss={
 "izan ere":"es que / y es que (explica la causa de lo anterior)",
 "zeren":"porque / pues",
 "beraz":"así que / por lo tanto",
 "hortaz":"por lo tanto",
 "horrenbestez":"por consiguiente",
 "horregatik":"por eso",
 "ondorioz":"en consecuencia",
 "hala ere":"sin embargo / aun así",
 "aitzitik":"al contrario",
 "gainera":"además",
 "bestalde":"por otra parte",
 "adibidez":"por ejemplo",
 "esaterako":"por ejemplo",
 "esate baterako":"por ejemplo"
};
const groups={cause:["Izan ere","Zeren"],result:["Beraz","Hortaz","Horrenbestez","Horregatik","Ondorioz"],contrast:["Hala ere","Aitzitik"],add:["Gainera","Bestalde"],example:["Adibidez","Esaterako"]};

const lessons=[
{id:"b1b2-k1-i1",n:1,title:"Izan ere: zergatik?",es:"«Izan ere»: explicar por qué",
 scene:"Bira berandu iritsi da kafetegira. Lagunek galdetu diote zer gertatu den. «Barkatu! Izan ere, autobusa matxuratu da.»",
 sceneEs:"Bira llega tarde a la cafetería. Sus amigos le preguntan qué ha pasado. «¡Perdón! Es que el autobús se ha averiado.»",
 keys:["Izan ere","Beraz","Hala ere"],
 tip:"Lehenik gertatu dena; gero, «izan ere» + zergatik.",
 tipEs:"Primero lo que pasó; luego «izan ere» + el motivo.",
 items:[
 {id:"KAUS-A02-1",src:K+"A02#1",t:"mc",q:"Ez gara iritsi. ____, autobusa matxuratu da.",ch:["Izan ere","Beraz","Hala ere"],a:["Izan ere"],ex:"Autobusaren matxurak iritsi ez izana azaltzen du; «beraz»ek alderantzizko erlazioa proposatuko luke."},
 {id:"KAUS-A02-2",src:K+"A02#2",t:"mc",q:"Autobusa matxuratu da. ____, ez gara garaiz iritsi.",ch:["Izan ere","Horregatik","Esate baterako"],a:["Horregatik"],ex:"Lehen esaldiak arrazoia ematen du eta bigarrenak haren ondorioa; ez da «izan ere»ren norabide bera."},
 {id:"KAUS-A01-1",src:K+"A01#1",t:"gap",q:"Ez gara mendira joan. ____, bideak itxita zeuden.",a:["Izan ere","Zeren"],ex:"Bigarren perpausak lehena azaltzen du. «Izan ere» egokia da; «zeren» kausazko markatzailea ere zilegi izan daiteke beste erregistro batean."},
 {id:"KAUS-A02-3",src:K+"A02#3",t:"mc",q:"Ezin dugu dokumentua eman. ____, oraindik ez dago sinatuta.",ch:["Izan ere","Ondorioz","Hala ere"],a:["Izan ere"],ex:"Sinaduraren gabeziak ezin ematea azaltzen du."},
 {id:"KAUS-A01-2",src:K+"A01#2",t:"gap",q:"Gaurko bilera atzeratu dugu. ____, arduraduna gaixorik dago.",a:["Izan ere","Zeren"],ex:"Atzerapenaren arrazoia ematen da, ez atzerapenetik datorren ondorioa. «Izan ere» da ohiko azalpen-lotura."},
 {id:"KAUS-A02-4",src:K+"A02#4",t:"mc",q:"Dokumentua ez dago sinatuta. ____, ezin dugu oraindik eman.",ch:["Zeren","Izan ere","Beraz"],a:["Beraz"],ex:"Bigarren baieztapena lehenetik ondorioztatzen da."},
 {id:"KAUS-A01-3",src:K+"A01#3",t:"gap",q:"Etxeko lanak atzeratu ditugu. ____, argibide batzuk falta dira.",a:["Izan ere","Zeren"],ex:"Argibide faltak aurreko erabakia azaltzen du. «Izan ere»rekin azalpenaren norabidea argia da."},
 {id:"KAUS-A02-5",src:K+"A02#5",t:"mc",q:"Euria ari zuen. ____, kalean jarraitu genuen.",ch:["Izan ere","Hala ere","Horrenbestez"],a:["Hala ere"],ex:"Ustekabeko gertakaria da; ez da kausazko azalpena."},
 {id:"KAUS-A01-4",src:K+"A01#4",t:"gap",q:"Leihatilan ilara luzea sortu da. ____, langile bakarra dago lanean.",a:["Izan ere","Zeren"],ex:"Bigarren perpausa lehenaren azalpen kausala da."},
 {id:"KAUS-A02-6",src:K+"A02#6",t:"mc",q:"Aste honetan ordutegia aldatu dugu. ____, gela nagusia itxita egongo da.",ch:["Izan ere","Horregatik","Adibidez"],a:["Izan ere"],ex:"Gelaren itxierak ordutegia aldatzea azaltzen du, baldin eta testuinguruan itxiera ordutegia aldatzeko arrazoia bada.",rv:true}
 ]},
{id:"b1b2-k1-i2",n:2,title:"Zeren eta -lako",es:"«Zeren» y «-lako»: otras formas de dar la causa",
 scene:"Bira irakasleari mezu bat idazten ari da: ezin izan du etxeko lana bukatu. Arrazoia ondo azaldu nahi du.",
 sceneEs:"Bira escribe un mensaje a su profesora: no ha podido terminar los deberes. Quiere explicar bien el motivo.",
 keys:["Zeren","Izan ere","-lako"],
 tip:"«…, euria ari zuelako» = «… Izan ere, euria ari zuen.» Esanahi bera, egitura desberdina.",
 tipEs:"«…, euria ari zuelako» = «… Izan ere, euria ari zuen.» Mismo significado, distinta estructura.",
 items:[
 {id:"KAUS-A01-5",src:K+"A01#5",t:"gap",q:"Atezainak ez du aretoa ireki, ____ oraindik ez du giltza jaso.",a:["zeren"],ex:"«Zeren» perpaus esplikatzailearen hasieran dago. Euskaltzaindiak menderagailurik gabeko erabilera ere deskribatzen du."},
 {id:"KAUS-A05-1",src:K+"A05#1",t:"chips",q:"Gaurko tailerra atzeratu egin dute. ____, antolatzailea gaixorik dago.",a:["Izan ere"],ex:"Gaixotasuna atzerapenaren arrazoia da.",rv:true},
 {id:"KAUS-A04-1",src:K+"A04#1",t:"build",q:"Ez gara parkera joan, euria ari zuelako.",k:"Izan ere",x:"Beraz,",a:["Ez gara parkera joan. Izan ere, euria ari zuen."],ex:"«-lako» kausazko mendekotik «izan ere» diskurtso-loturara pasa da, arrazoia mantenduta.",rv:true},
 {id:"KAUS-A01-6",src:K+"A01#6",t:"gap",q:"Ez gara jarduera hasteko prest, ____ ez dugu behar adina material.",a:["zeren"],ex:"«Zeren» diskurtso-markatzaile kausala da hemen, adizki jokatu arruntarekin."},
 {id:"KAUS-A04-2",src:K+"A04#2",t:"build",q:"Atea itxi dute, hotz handia egiten duelako.",k:"Izan ere",x:"Hala ere,",a:["Atea itxi dute. Izan ere, hotz handia egiten du."],ex:"Bigarren esaldian egungo hotza azalpen gisa ematen da.",rv:true},
 {id:"KAUS-A01-7",src:K+"A01#7",t:"gap",q:"Ekitaldia bertan behera utzi dute. ____, segurtasun-baldintzak ez dira bete.",a:["Izan ere","Zeren"],ex:"Bigarren esaldiak bertan behera uztearen arrazoia azaltzen du."},
 {id:"KAUS-A05-3",src:K+"A05#3",t:"chips",q:"Ez da materiala banatu. ____, oraindik ez dago prest.",a:["Izan ere"],ex:"Materiala prest ez egoteak banatu ez izana azaltzen du.",rv:true},
 {id:"KAUS-A04-3",src:K+"A04#3",t:"build",q:"Bilkura atzeratu dugu, kide batzuk falta direlako.",k:"Izan ere",x:"direlako.",a:["Bilkura atzeratu dugu. Izan ere, kide batzuk falta dira."],ex:"Kideen gabeziak atzerapena azaltzen du; «-lako» menderagailua kentzean adizkia egokitu da.",rv:true},
 {id:"KAUS-A01-8",src:K+"A01#8",t:"gap",q:"Egitaraua berriro prestatu behar da. ____, hainbat ordutegi aldatu dira.",a:["Izan ere","Zeren"],ex:"Egitaraua berriro prestatzearen arrazoia ondoren azaltzen da."},
 {id:"KAUS-A04-4",src:K+"A04#4",t:"build",q:"Mezua berridatzi dut, lehen bertsioa nahasia zelako.",k:"Izan ere",x:"zelako.",a:["Mezua berridatzi dut. Izan ere, lehen bertsioa nahasia zen."],ex:"Iraganeko arrazoia gorde da eta esaldi autonomoan formulatu.",rv:true}
 ]},
{id:"b1b2-k1-i3",n:3,title:"Beraz, hortaz",es:"«Beraz», «hortaz»: sacar la consecuencia",
 scene:"Bira eta bere lagunak txangoa prestatzen ari dira, baina gauza asko aldatu dira. Zer erabaki behar dute?",
 sceneEs:"Bira y sus amigos preparan una excursión, pero han cambiado muchas cosas. ¿Qué deben decidir?",
 keys:["Beraz","Hortaz","Horrenbestez"],
 tip:"Lehenik egoera; gero, «beraz» + zer egingo dugun.",
 tipEs:"Primero la situación; luego «beraz» + lo que haremos.",
 items:[
 {id:"OND-A02-1",src:O+"A02#1",t:"mc",q:"Autobusak ez dira gaur ibiliko. ____, oinez joango gara.",ch:["Beraz","Izan ere","Hala ere"],a:["Beraz"],ex:"Autobus zerbitzurik ezaren ondorioz hartu den erabakia."},
 {id:"OND-A01-1",src:O+"A01#1",t:"gap",q:"Gela guztiak beteta daude. ____, ezin da ikasle gehiago hartu.",a:["Beraz","Hortaz","Horrenbestez"],ex:"Lehenengo datuak ondorio praktiko bat justifikatzen du. «Hortaz» ere egokia da.",rv:true},
 {id:"OND-A02-2",src:O+"A02#2",t:"mc",q:"Ez dago plaza librerik. ____, ezingo dugu beste inor onartu.",ch:["Izan ere","Hortaz","Aitzitik"],a:["Hortaz"],ex:"Ondorioa da; «izan ere»k arrazoia emango luke."},
 {id:"OND-A01-2",src:O+"A01#2",t:"gap",q:"Sarrerak agortu dira; ____, gaur ezin dugu gehiago saldu.",a:["hortaz","beraz"],ex:"Sarrera guztiak salduta egotetik ondorioztatzen da ezin dela gehiago saldu; «beraz» ere onargarria da.",rv:true},
 {id:"OND-A02-3",src:O+"A02#3",t:"mc",q:"Eguraldiaren iragarpena oso txarra da. ____, ekitaldia barruan egingo dugu.",ch:["Gainera","Horrenbestez","Esaterako"],a:["Horrenbestez"],ex:"Iragarpenetik ateratako antolaketa-erabakia da."},
 {id:"OND-A01-3",src:O+"A01#3",t:"gap",q:"Txostenean datu batzuk falta dira. ____, oraingoz ezin dugu onartu.",a:["Beraz","Hortaz"],ex:"Datuen gabeziatik erabakia ateratzen da; «hortaz» ere zilegi da.",rv:true},
 {id:"OND-A02-4",src:O+"A02#4",t:"mc",q:"Agiriak osatu gabe daude. ____, ezin ditugu oraindik bidali.",ch:["Hala ere","Beraz","Izan ere"],a:["Beraz"],ex:"Lehen baldintzak bigarren erabakia justifikatzen du."},
 {id:"OND-A01-4",src:O+"A01#4",t:"gap",q:"Trena bertan behera utzi dute; ____, autobusez joango gara.",a:["beraz","hortaz"],ex:"Garraio-aldaketaren ondoriozko erabakia adierazten du.",rv:true},
 {id:"OND-A02-5",src:O+"A02#5",t:"mc",q:"Izena emateko azken eguna igaro da. ____, izen-ematea itxi da.",ch:["Hortaz","Esaterako","Bestalde"],a:["Hortaz"],ex:"«Hortaz»ek izena emateko epea amaitzearen ondorioa adierazten du. «Esaterako»k adibidea ematen du, eta «bestalde»k beste alderdi bat gehitzen du."},
 {id:"OND-A02-6",src:O+"A02#6",t:"mc",q:"Aste honetan teknikari bakarra dago eskuragarri. ____, lanak txandaka egingo ditugu.",ch:["Izan ere","Hala ere","Beraz"],a:["Beraz"],ex:"Baliabidearen mugatik lan-antolaketarako ondorioa ateratzen da."}
 ]},
{id:"b1b2-k1-i4",n:4,title:"Ondorioak antolatu",es:"Organizar consecuencias",
 scene:"Herriko jaiak antolatzen laguntzen ari da Bira. Arazo bat dagoen bakoitzean, irtenbide bat proposatu behar du.",
 sceneEs:"Bira ayuda a organizar las fiestas del pueblo. Cada vez que hay un problema, tiene que proponer una solución.",
 keys:["Beraz","Hortaz","Horrenbestez"],
 tip:"Bi esaldi lotzeko: «Egoera. Beraz, erabakia.» Ez ahaztu koma lokailuaren ondoren.",
 tipEs:"Para unir dos frases: «Situación. Beraz, decisión.» No olvides la coma tras el conector.",
 items:[
 {id:"OND-A01-5",src:O+"A01#5",t:"gap",q:"Atea konpontzen ari dira. ____, beste sarrera erabili behar dugu.",a:["Hortaz","Beraz"],ex:"Lehen gertakariak bigarren esaldiko jokabidea justifikatzen du.",rv:true},
 {id:"OND-A04-1",src:O+"A04#1",t:"build",q:"Txartelak agortu dira. Ezingo dugu gehiago saldu.",k:"Beraz",x:"Izan ere,",a:["Txartelak agortu dira. Beraz, ezingo dugu gehiago saldu."],ex:"Datu batetik ateratako ondorioa lokailuz azaldu da.",rv:true},
 {id:"OND-A05-1",src:O+"A05#1",t:"chips",q:"Gaur arratsaldeko saioan ez dago lekurik. ____, ezin dira izen-emate berriak onartu.",a:["Beraz","Hortaz"],ex:"Plaza faltatik ateratzen den ondorioa da.",rv:true},
 {id:"OND-A01-6",src:O+"A01#6",t:"gap",q:"Epea gaur amaitzen da; ____, dokumentuak orain bidaliko ditugu.",a:["horrenbestez","beraz","hortaz"],ex:"Epearen datutik hartutako erabakia da. «Beraz» eta «hortaz» ere egokiak dira.",rv:true},
 {id:"OND-A04-2",src:O+"A04#2",t:"build",q:"Atea konponketa-lanetan dago. Alboko sarrera erabiliko dugu.",k:"Hortaz",x:"Gainera,",a:["Atea konponketa-lanetan dago. Hortaz, alboko sarrera erabiliko dugu."],ex:"Lehen egoeratik eratorritako erabakia ematen da.",rv:true},
 {id:"OND-A01-7",src:O+"A01#7",t:"gap",q:"Miren ez da etorri, eta bere zatia ezin dugu berrikusi. ____, bilera atzeratuko dugu.",a:["Beraz","Hortaz"],ex:"Bi premisetatik ateratako erabakia adierazten da.",rv:true},
 {id:"OND-A05-2",src:O+"A05#2",t:"chips",q:"Harrerako atea konpontzen ari dira; ____, albo-sarrera erabili behar da.",a:["hortaz","beraz"],ex:"Konponketaren ondoriozko jokabidea da.",rv:true},
 {id:"OND-A04-3",src:O+"A04#3",t:"build",q:"Azterketaren emaitzak ez dira oraindik argitaratu. Ezingo dugu behin betiko zerrendarik osatu.",k:"Horrenbestez",x:"Hala ere,",a:["Azterketaren emaitzak ez dira oraindik argitaratu. Horrenbestez, ezingo dugu behin betiko zerrendarik osatu."],ex:"Informazio-gabeziak ondorio administratiboa du.",rv:true},
 {id:"OND-A01-8",src:O+"A01#8",t:"gap",q:"Liburutegia gaur itxita dago. ____, liburuak bihar itzuliko ditugu.",a:["Hortaz","Beraz"],ex:"Itxieraren ondoriozko jarduera-plana da.",rv:true},
 {id:"OND-A04-4",src:O+"A04#4",t:"build",q:"Gela guztiak beteta daude. Ikastaroa beste areto batean egingo dugu.",k:"Beraz",x:"Izan ere,",a:["Gela guztiak beteta daude. Beraz, ikastaroa beste areto batean egingo dugu."],ex:"Egoeraren ondoriozko antolaketa-erabakia argitzen da.",rv:true}
 ]},
{id:"b1b2-k1-i5",n:5,title:"Kapituluaren erronka",es:"Reto del capítulo",challenge:true,
 scene:"Biraren lagun batek mezu bat idatzi du, baina lokailuak nahastu ditu. Lagundu diezaiokezu?",
 sceneEs:"Un amigo de Bira ha escrito un mensaje, pero ha mezclado los conectores. ¿Le ayudas?",
 keys:["Izan ere","Beraz","Hala ere"],
 tip:"Galdetu zeure buruari: bigarren esaldiak zergatia ematen du (izan ere), ondorioa (beraz) ala kontrastea (hala ere)?",
 tipEs:"Pregúntate: ¿la segunda frase da el motivo (izan ere), la consecuencia (beraz) o un contraste (hala ere)?",
 items:[
 {id:"KAUS-A03-1",src:K+"A03#1",t:"fix",q:"Ez gara garaiz iritsi. Beraz, autobusa matxuratu da.",w:"Beraz,",r:"Izan ere",a:["Ez gara garaiz iritsi. Izan ere, autobusa matxuratu da."],ex:"Iritsi ez izanaren arrazoia azaltzen dugu; «beraz»ek ondorioaren norabidea alderantziz jarriko luke.",rv:true},
 {id:"OND-A03-1",src:O+"A03#1",t:"fix",q:"Sarrerak agortu dira. Izan ere, beste inor ezin dugu hartu.",w:"Izan ere,",r:"Beraz",a:["Sarrerak agortu dira. Beraz, beste inor ezin dugu hartu."],ex:"Bigarren esaldia aurreko egoeraren ondorioa da, ez haren azalpena.",rv:true},
 {id:"KAUS-A05-2",src:K+"A05#2",t:"chips",q:"Aretoa bihar ere itxita egongo da. ____, erreserbak berriro antolatuko dituzte.",a:["Horregatik"],ex:"Hemen bigarren esaldia lehenaren ondorioa da; ez kausazko azalpena.",rv:true},
 {id:"KAUS-A03-2",src:K+"A03#2",t:"fix",q:"Bilera atzeratu dugu. Hala ere, arduraduna gaixorik dago.",w:"Hala ere,",r:"Izan ere",a:["Bilera atzeratu dugu. Izan ere, arduraduna gaixorik dago."],ex:"Gaixotasuna atzeratzeko arrazoia bada, «izan ere» egokia da eta «hala ere»k kontrastea iradokiko luke.",rv:true},
 {id:"OND-A03-2",src:O+"A03#2",t:"fix",q:"Eguna euritsua da. Hala ere, ekitaldia barruan egingo dugu, horixe baita eguraldi txarrerako plana.",w:"Hala ere,",r:"Hortaz",a:["Eguna euritsua da. Hortaz, ekitaldia barruan egingo dugu, horixe baita eguraldi txarrerako plana."],ex:"Antolaketa-plana eguraldiaren ondorioa da; ez da espero zenaren kontrako gertakaria.",rv:true},
 {id:"KAUS-A05-4",src:K+"A05#4",t:"chips",q:"Arazoak izan dira. ____, parte-hartzaileei informazioa garaiz bidali diete.",a:["Hala ere"],ex:"Ezusteko emaitza edo kontrastea da, ez aurrekoaren azalpena.",rv:true},
 {id:"KAUS-A03-3",src:K+"A03#3",t:"fix",q:"Ez dut inprimagailua erabili. Adibidez, tintarik gabe gelditu da.",w:"Adibidez,",r:"Izan ere",a:["Ez dut inprimagailua erabili. Izan ere, tintarik gabe gelditu da."],ex:"Tinta falta da erabilerarik ezaren arrazoia, ez adibidea.",rv:true},
 {id:"OND-A03-3",src:O+"A03#3",t:"fix",q:"Ez dugu informazio nahikorik. Esaterako, erabakia atzeratuko dugu.",w:"Esaterako,",r:"Beraz",a:["Ez dugu informazio nahikorik. Beraz, erabakia atzeratuko dugu."],ex:"Bigarren esaldia ondorio praktikoa da, ez lehenengoaren adibidea.",rv:true},
 {id:"OND-A05-3",src:O+"A05#3",t:"chips",q:"Ostiraleko hitzorduak bertan behera utzi dira. ____, erabiltzaileei berriak eskainiko dizkiegu.",a:["Horrenbestez","Beraz"],ex:"Antolaketa-ondorio praktikoa da.",rv:true},
 {id:"KAUS-A03-4",src:K+"A03#4",t:"fix",q:"Liburutegia itxi dute. Horregatik, goizetik argindarrik gabe dago eraikina, eta ezin da barruan lan egin.",w:"Horregatik,",r:"Izan ere",a:["Liburutegia itxi dute. Izan ere, goizetik argindarrik gabe dago eraikina, eta ezin da barruan lan egin."],ex:"Argindar-hornidura etenda egotea itxieraren azalpena da, ez hemen itxieratik ondorioztatu beharrekoa. Esanahi hori adierazteko «izan ere» dagokio.",rv:true},
 {id:"OND-A03-4",src:O+"A03#4",t:"fix",q:"Oinez joateko bidea itxita dago. Gainera, beste bide bat erabiliko dugu, aukera bakarra baita.",w:"Gainera,",r:"Hortaz",a:["Oinez joateko bidea itxita dago. Hortaz, beste bide bat erabiliko dugu, aukera bakarra baita."],ex:"Bigarren ekintza lehengo egoeraren ondorioa da, ez beste informazio gehigarri bat.",rv:true},
 {id:"OND-A05-4",src:O+"A05#4",t:"chips",q:"Informazio osagarria bihar jasoko dugu; ____, behin betiko egitaraua orduan argitaratuko dugu.",a:["beraz","hortaz"],ex:"Informazioa jaso arte ezin osatu egitaraua; ondorengo ekintza arrazoitzen du.",rv:true}
 ]}
];

const b1b2K2Lessons=[
{id:"b1b2-k2-i1",n:1,title:"Baina eta hala ere",es:"«Baina» y «hala ere»: marcar contraste",
 scene:"Bira eta lagunak txangora joan dira. Eguraldia ez da ona izan, baina egun polita pasatu dute.",
 sceneEs:"Bira y sus amigos han ido de excursión. El tiempo no ha sido bueno, pero han pasado un buen día.",
 keys:["Hala ere","Baina","Aitzitik"],
 tip:"Esaldi berean: «…, baina …». Bi esalditan: «Egoera. Hala ere, espero ez zena.»",
 tipEs:"En la misma frase: «…, baina …». En dos frases: «Situación. Hala ere, lo inesperado.»",
 items:[
 {id:"KON-1-1",src:"HB-K2-S01#1",t:"mc",q:"Euria ari zuen. ____, kalera atera ginen.",ch:["Hala ere","Beraz","Izan ere"],a:["Hala ere"],hint:"Espero ez zen gertakaria: kontrastea.",ex:"Euria egin arren kalera atera ziren: kontrastea → Hala ere."},
 {id:"KON-1-2",src:"HB-K2-S01#2",t:"mc",q:"Liburua luzea da, ____ oso interesgarria.",ch:["baina","beraz","zeren"],a:["baina"],hint:"Bi ezaugarri esaldi berean kontrajartzeko.",ex:"Esaldi berean bi ideia kontrajartzeko → baina."},
 {id:"KON-1-3",src:"HB-K2-S01#3",t:"gap",q:"Nekatuta nengoen. ____, lan guztia amaitu nuen.",hint:"Kontraste-lokailua, bi hitzez osatua.",a:["Hala ere"],ex:"Nekea gorabehera lana amaitu da → Hala ere."},
 {id:"KON-1-4",src:"HB-K2-S01#4",t:"chips",q:"Garaiz abiatu gara; ____, trafiko handia dago eta berandu iritsiko gara.",ch:["hala ere","beraz","gainera"],a:["hala ere"],hint:"Garaiz abiatu eta berandu iritsi: kontrastea da.",ex:"Espero zenaren aurkako egoera → hala ere."},
 {id:"KON-1-5",src:"HB-K2-S01#5",t:"mc",q:"Ez dut kafea nahi; ____, tea hartuko dut.",ch:["aitzitik","beraz","adibidez"],a:["aitzitik"],hint:"Aurreko aukera baztertu eta kontrakoa aukeratu.",ex:"Aurrekoaren kontrako aukera emateko → aitzitik."},
 {id:"KON-1-6",src:"HB-K2-S01#6",t:"build",q:"Hotz handia egiten du. Parkera joan gara.",k:"Hala ere",x:"Beraz,",hint:"Bi esaldi bereizi, kontraste-lokailuarekin.",a:["Hotz handia egiten du. Hala ere, parkera joan gara."],ex:"Hotza egon arren parkera joan dira: kontrastea → Hala ere."},
 {id:"KON-1-7",src:"HB-K2-S01#7",t:"fix",q:"Garestia da. Beraz, oso kalitate onekoa da eta erosi egin dugu.",w:"Beraz,",r:"Hala ere",opts:["Hala ere","Izan ere","Adibidez"],hint:"Garestia izanda ere erosi dute: ez da ondorioa.",a:["Garestia da. Hala ere, oso kalitate onekoa da eta erosi egin dugu."],ex:"Garestia izanik ere erosi dute: kontrastea da, ez ondorioa."}
 ]},
{id:"b1b2-k2-i2",n:2,title:"Arren eta nahiz eta",es:"«Arren» y «nahiz eta»: a pesar de",
 scene:"Anek lasterketa egin nahi du, nahiz eta haizea egon. Oztopoak adierazten ikasiko dugu.",
 sceneEs:"Ane quiere correr la carrera aunque haga viento. Aprenderemos a expresar obstáculos.",
 keys:["arren","Nahiz eta","Hala ere"],
 tip:"«Euria egin arren, …» (amaieran) · «Nahiz eta euria egin, …» (hasieran).",
 tipEs:"«Euria egin arren, …» (al final) · «Nahiz eta euria egin, …» (al principio).",
 items:[
 {id:"KON-2-1",src:"HB-K2-S02#1",t:"mc",q:"Euria egin ____, mendira joan ginen.",ch:["arren","baino","beraz"],a:["arren"],hint:"Aditz partizipioaren ondoren oztopoa adierazteko.",ex:"Partizipioa («egin») + «arren» → oztopoa gorabehera."},
 {id:"KON-2-2",src:"HB-K2-S02#2",t:"mc",q:"____ berandu izan, deitu lasai.",ch:["Nahiz eta","Hala ere","Horregatik"],a:["Nahiz eta"],hint:"Esaldiaren hasieran oztopoa aurkezteko.",ex:"Hasieran jartzen den kontzesio-egitura → Nahiz eta."},
 {id:"KON-2-3",src:"HB-K2-S02#3",t:"chips",q:"Nekatuta egon ____, korrika egitera atera da.",ch:["arren","delako","baina"],a:["arren"],hint:"«Egon» partizipioaren ondoren doa.",ex:"«Nekatuta egon arren» egiturak oztopoa adierazten du."},
 {id:"KON-2-4",src:"HB-K2-S02#4",t:"gap",q:"Hotza egin ____, igerilekura joan gara.",h:"oztopoa · partizipioaren ondoren",hint:"Hitza «a» letraz hasten da.",a:["arren"],ex:"«Hotza egin arren» → kontzesioa."},
 {id:"KON-2-5",src:"HB-K2-S02#5",t:"match",q:"Lotu esaldiaren hasiera eta amaiera.",pairs:[["Euria egin arren,","paseatzera atera gara."],["Nahiz eta nekatuta egon,","lana bukatu dugu."],["Garestia da, baina","oso ona da."],["Trafikoa dago; hala ere,","garaiz iritsi gara."]],a:["4 lotura"],ex:"Arren, nahiz eta, baina eta hala ere: laurak kontrastea edo oztopoa markatzen dute."},
 {id:"KON-2-6",src:"HB-K2-S02#6",t:"build",q:"Berandu da. Filma ikusten jarraituko dugu.",k:"Hala ere",x:"Horregatik,",hint:"Berandu da, baina jarraitzen dugu: kontrastea.",a:["Berandu da. Hala ere, filma ikusten jarraituko dugu."],ex:"Berandu izan arren jarraitzen dute → Hala ere."},
 {id:"KON-2-7",src:"HB-K2-S02#7",t:"gap",q:"____ garestia izan, liburu hau erosi dut.",h:"esaldi hasieran · kontzesioa",hint:"Bi hitz: «Nahiz …».",a:["Nahiz eta"],ex:"«Nahiz eta … izan» egiturak oztopoa aurkezten du hasieran."}
 ]},
{id:"b1b2-k2-i3",n:3,title:"Kontrastearen erronka",es:"Reto: causa, consecuencia y contraste",challenge:true,
 scene:"Orain hiru norabideak nahastuko ditugu: zergatia (izan ere), ondorioa (beraz) eta kontrastea (hala ere, arren).",
 sceneEs:"Ahora mezclamos las tres direcciones: causa (izan ere), consecuencia (beraz) y contraste (hala ere, arren).",
 keys:["Izan ere","Beraz","Hala ere","arren"],
 tip:"Pentsatu beti harremanean: zergatik? (←) · zer ondorio? (→) · oztopoa/kontrastea? (⇄)",
 tipEs:"Piensa siempre en la relación: ¿por qué? (←) · ¿consecuencia? (→) · ¿obstáculo/contraste? (⇄)",
 items:[
 {id:"KON-3-1",src:"HB-K2-S03#1",t:"mc",q:"Autobusa galdu dugu. ____, oinez joango gara.",ch:["Beraz","Hala ere","Izan ere"],a:["Beraz"],hint:"Bigarren esaldia lehenengoaren ondorioa da.",ex:"Autobusa galtzetik ateratako erabakia → Beraz."},
 {id:"KON-3-2",src:"HB-K2-S03#2",t:"mc",q:"Oinez etorri gara. ____, autobusa matxuratu da.",ch:["Izan ere","Beraz","Hala ere"],a:["Izan ere"],hint:"Bigarren esaldiak zergatia azaltzen du.",ex:"Oinez etortzearen arrazoia ematen da → Izan ere."},
 {id:"KON-3-3",src:"HB-K2-S03#3",t:"mc",q:"Autobusa garaiz iritsi da. ____, trafikoagatik berandu heldu gara.",ch:["Hala ere","Beraz","Izan ere"],a:["Hala ere"],hint:"Espero ez zen emaitza da.",ex:"Garaiz iritsi arren berandu heldu dira → Hala ere."},
 {id:"KON-3-4",src:"HB-K2-S03#4",t:"fix",q:"Garaiz iritsi gara. Beraz, bidean arazo asko izan ditugu.",w:"Beraz,",r:"Hala ere",opts:["Hala ere","Izan ere","Horregatik"],hint:"Arazoak izanda ere garaiz iritsi dira: kontrastea.",a:["Garaiz iritsi gara. Hala ere, bidean arazo asko izan ditugu."],ex:"Arazoak eta garaiz iristea kontrastean daude → Hala ere."},
 {id:"KON-3-5",src:"HB-K2-S03#5",t:"chips",q:"Lan handia eduki ____, laguntzera etorri da.",ch:["arren","beraz","zeren"],a:["arren"],hint:"«Eduki» partizipioaren ondoren doa.",ex:"Oztopoa gaindituta etorri da → arren."},
 {id:"KON-3-6",src:"HB-K2-S03#6",t:"fix",q:"Ezin izan dugu sartu. Hala ere, atea itxita zegoen.",w:"Hala ere,",r:"Izan ere",opts:["Izan ere","Beraz","Gainera"],hint:"Atea itxita egotea da sartu ezin izanaren arrazoia.",a:["Ezin izan dugu sartu. Izan ere, atea itxita zegoen."],ex:"Bigarren esaldiak lehenengoaren zergatia azaltzen du → Izan ere."},
 {id:"KON-3-7",src:"HB-K2-S03#7",t:"gap",q:"Plana aldatu dugu. ____, eguraldia txarra iragarri dute.",hint:"Bigarren esaldiak zergatia ematen du.",a:["Izan ere","Zeren"],ex:"Plan-aldaketaren arrazoia ematen da → Izan ere."},
 {id:"KON-3-8",src:"HB-K2-S03#8",t:"build",q:"Euria ari zuen, baina plazara joan gara.",k:"Hala ere",x:"Horregatik,",hint:"Bi esaldi bereizi, kontrastea markatuz.",a:["Euria ari zuen. Hala ere, plazara joan gara."],ex:"Bi esaldi bereizitan kontrastea markatzeko → Hala ere."}
 ]}
];

const chapters=[
 {id:"b1b2-k1",title:"Zer gertatu zen?",es:"Contar qué pasó y por qué",lessons},
 {id:"b1b2-k2",title:"Baina, hala ere, arren",es:"Contraste y concesión",lessons:b1b2K2Lessons},
 {id:"b1b2-k3",title:"Nire iritzia",es:"Dar tu opinión"},
 {id:"b1b2-k4",title:"Esan zidan…",es:"Contar lo que dijo otro"},
 {id:"b1b2-k5",title:"Noiz eta non",es:"Planes y tiempo"},
 {id:"b1b2-k6",title:"Gorputza eta osasuna",es:"Salud y consejos"},
 {id:"b1b2-k7",title:"Gure gizartea",es:"Sociedad"},
 {id:"b1b2-k8",title:"Eta baldin bada…?",es:"Hipótesis"}
];

/* Konektoreen norabidea: ikasgaien sarreran eta feedbackean erakusten den eskema. */
const patterns={
 cause:{tag:"ZERGATIA",dir:"back",a:"Berandu iritsi naiz.",k:"Izan ere,",b:"autobusa matxuratu da.",why:"Bigarren esaldiak zergatia ematen du.",es:"La segunda frase da el motivo."},
 result:{tag:"ONDORIOA",dir:"fwd",a:"Autobusa matxuratu da.",k:"Beraz,",b:"berandu iritsi naiz.",why:"Bigarren esaldia lehenengoaren ondorioa da.",es:"La segunda frase es la consecuencia de la primera."},
 contrast:{tag:"USTEKABEA",dir:"cross",a:"Euria ari zuen.",k:"Hala ere,",b:"kalera atera ginen.",why:"Bigarren esaldian espero ez zena gertatzen da.",es:"En la segunda frase pasa lo que no se esperaba."},
 baina:{tag:"KONTRASTEA",dir:"cross",a:"Liburua luzea da,",k:"baina",b:"oso interesgarria.",why:"«Baina»k esaldi berean bi ideia kontrajartzen ditu.",es:"«Baina» contrapone dos ideas en la misma frase."},
 arren:{tag:"OZTOPOA",dir:"cross",a:"Euria egin arren,",k:"",b:"mendira joan ginen.",why:"«Arren» partizipioaren ondoren doa eta oztopoa adierazten du.",es:"«Arren» va tras el participio y expresa un obstáculo."},
 nahiz:{tag:"OZTOPOA",dir:"cross",a:"Nahiz eta berandu izan,",k:"",b:"deitu lasai.",why:"«Nahiz eta» esaldiaren hasieran doa oztopoa markatzeko.",es:"«Nahiz eta» abre la frase para marcar un obstáculo."},
 add:{tag:"GEHIAGO",dir:"fwd",a:"Herria polita da.",k:"Gainera,",b:"jende jatorra dago.",why:"Bigarren esaldiak informazio gehiago ematen du.",es:"La segunda frase añade información."},
 example:{tag:"ADIBIDEA",dir:"fwd",a:"Kirol asko egiten ditut.",k:"Adibidez,",b:"igeri egiten dut.",why:"Bigarren esaldiak adibide bat ematen du.",es:"La segunda frase da un ejemplo."},
 lako:{tag:"ZERGATIA",dir:"back",a:"Berandu iritsi naiz,",k:"",b:"autobusa matxuratu delako.",why:"«-lako» aditzari lotzen zaio eta zergatia ematen du.",es:"«-lako» se une al verbo y da el motivo."}};

/* ---------- A1–A2 · Lehen urratsak · 1. kapitulua: Basorako bidea ----------
   SUSTRAI JUNIOR K02 «Basorako bidea»n oinarritua (Drive: JUNIOR_03B §7, WP01 K02, K02_LAB leku-funtzioak).
   Kanona: Anek enbor batean aurkitutako mezua, «Menditik nator, basoan bizi naiz eta errekara noa»; egilea ezezaguna.
   Ariketak eta testu guztiak zirriborro berriak dira: ikuskatzaileak berrikusi behar ditu. */
const A="K02-";
const a1Lessons=[
{id:"a1a2-k1-i1",n:1,title:"Enborreko mezua",es:"El mensaje del tronco",
 talk:[["ane","Begiratu! Enbor zahar honetan mezu bat dago.","¡Mirad! En este tronco viejo hay un mensaje."],["iker","Zer dio?","¿Qué dice?"],["ane","«Menditik nator, basoan bizi naiz eta errekara noa.»","«Vengo del monte, vivo en el bosque y voy al arroyo.»"],["lur","Nork idatzi du? Eta nora doa?","¿Quién lo ha escrito? ¿Y adónde va?"]],
 learn:"cases",keys:["menditik","basoan","errekara"],
 tip:"Amaierari begiratu: -tik (nondik?), -n (non?), -ra (nora?).",tipEs:"Fíjate en el final: -tik (¿de dónde?), -n (¿dónde?), -ra (¿adónde?).",
 items:[
 {id:"A1-1-1",src:A+"S01#1",t:"mc",q:"Nora doa mezuaren egilea?",ch:["Errekara","Mendira","Basora"],a:["Errekara"],ex:"«Errekara noa», dio mezuak. -ra amaierak NORA adierazten du: helmuga."},
 {id:"A1-1-2",src:A+"S01#2",t:"mc",q:"Eta nondik dator?",ch:["Menditik","Basotik","Errekatik"],a:["Menditik"],ex:"«Menditik nator»: -tik amaierak NONDIK adierazten du: abiapuntua."},
 {id:"A1-1-3",src:A+"S01#3",t:"mc",q:"Non bizi da?",ch:["Basoan","Errekan","Mendian"],a:["Basoan"],ex:"«Basoan bizi naiz»: -n amaierak NON adierazten du: lekua."},
 {id:"A1-1-4",src:A+"S01#4",t:"match",q:"Lotu galdera bakoitza mezuko hitzarekin.",pairs:[["Non?","basoan"],["Nora?","errekara"],["Nondik?","menditik"]],a:["basoan · errekara · menditik"],ex:"Non? → -n · Nora? → -ra · Nondik? → -tik."},
 {id:"A1-1-5",src:A+"S01#5",t:"mc",q:"Badakigu nork idatzi duen mezua?",ch:["Ez, ez dakigu.","Bai, Anek idatzi du.","Bai, Ikerrek idatzi du."],a:["Ez, ez dakigu."],ex:"Anek aurkitu du mezua, baina ez du idatzi. Mezuak ez du izenik: oraingoz misterioa da."},
 {id:"A1-1-6",src:A+"S01#6",t:"gap",q:"Mezuaren egilea ____ doa.",h:"erreka · nora?",a:["errekara"],ex:"Nora? → -ra: errekara."},
 {id:"A1-1-7",src:A+"S01#7",t:"build",q:"Haizeak mezuaren hitzak nahastu ditu!",instr:"Ordenatu mezua.",x:"basora",a:["Menditik nator, basoan bizi naiz eta errekara noa."],ex:"Mezu osoa: nondik dator, non bizi da eta nora doa."},
 {id:"A1-1-8",src:A+"S01#8",t:"chips",q:"Iker: «Mezuaren egilea aurkitu nahi dut. Goazen ____!»",ch:["errekara","errekan","errekatik"],a:["errekara"],ex:"Erreka da helmuga → NORA: errekara."}]},
{id:"a1a2-k1-i2",n:2,title:"Basoko hitzak",es:"Las palabras del bosque",
 talk:[["txinpart","Kaixo! Txinpart naiz, basoko galtzagorria.","¡Hola! Soy Txinpart, el galtzagorri del bosque."],["txinpart","Bidea aurkitu nahi duzue? Lehenik, ikasi basoko hitzak!","¿Queréis encontrar el camino? ¡Primero aprended las palabras del bosque!"],["lur","Ados! Prest gaude.","¡De acuerdo! Estamos listos."]],
 learn:"words",keys:["mendia","basoa","erreka","bidea","zubia"],
 tip:"Hitz bakoitza irudi batekin lotu, errazago gogoratzeko.",tipEs:"Asocia cada palabra a una imagen para recordarla mejor.",
 items:[
 {id:"A1-2-1",src:A+"S02#1",t:"match",q:"Lotu hitza eta azalpena.",pairs:[["mendia","Lur garaia; gora igo behar da."],["basoa","Zuhaitz asko dauden lekua."],["erreka","Ur-korronte txikia."],["zubia","Uraren gainetik pasatzeko."],["bidea","Leku batetik bestera joateko."]],a:["5 lotura"],ex:"Mendia, basoa, erreka, zubia eta bidea: Basorako bideko bost hitzak."},
 {id:"A1-2-2",src:A+"S02#2",t:"mc",q:"Zuhaitz asko daude hemen. Hau ____ da.",ch:["basoa","erreka","zubia"],a:["basoa"],ex:"Zuhaitz asko dauden lekua basoa da."},
 {id:"A1-2-3",src:A+"S02#3",t:"chips",q:"Ura entzuten dut: gertu ____ bat dago!",ch:["erreka","mendi","bide"],a:["erreka"],ex:"Ura entzuten bada, erreka bat dago gertu."},
 {id:"A1-2-4",src:A+"S02#4",t:"mc",q:"Errekaren beste aldera pasatzeko, ____ gurutzatu dugu.",ch:["zubia","basoa","mendia"],a:["zubia"],ex:"Zubiak uraren gainetik pasatzeko balio du."},
 {id:"A1-2-5",src:A+"S02#5",t:"mc",q:"Iker: «Hemen bi ____ daude: bata ezkerrera doa, eta bestea eskuinera.»",ch:["bide","zubi","erreka"],a:["bide"],ex:"Bideak leku batetik bestera eramaten gaitu."},
 {id:"A1-2-6",src:A+"S02#6",t:"gap",q:"Txinpart ____ bizi da, zuhaitzen artean.",h:"baso · non?",a:["basoan"],ex:"Non? → -n: basoan."},
 {id:"A1-2-7",src:A+"S02#7",t:"fix",q:"Errekaren gainean dagoen basoa gurutzatu dugu.",w:"basoa",r:"zubia",opts:["zubia","mendia","bidea"],a:["Errekaren gainean dagoen zubia gurutzatu dugu."],ex:"Errekaren gainean zubia dago, ez basoa."},
 {id:"A1-2-8",src:A+"S02#8",t:"mc",q:"Lur: «Begira! ____ gainean elurra dago.»",ch:["Mendiaren","Errekaren","Zubiaren"],a:["Mendiaren"],ex:"Elurra mendiaren gainean (gailurrean) egoten da."}]},
{id:"a1a2-k1-i3",n:3,title:"Non, nora, nondik?",es:"¿Dónde, adónde, de dónde?",
 talk:[["iker","Mezuan hiru amaiera daude: -n, -ra eta -tik.","En el mensaje hay tres terminaciones: -n, -ra y -tik."],["lur","Eta amaiera bakoitzak gauza bat esaten du.","Y cada terminación dice una cosa."],["bira","Proba ditzagun beste hitz batzuekin!","¡Probémoslas con otras palabras!"]],
 learn:"table",keys:["-n","-ra","-tik"],
 tip:"Aditzak laguntzen du: egon, bizi → non? · joan → nora? · atera → nondik?",tipEs:"El verbo ayuda: estar, vivir → ¿dónde? · ir → ¿adónde? · salir → ¿de dónde?",
 items:[
 {id:"A1-3-1",src:A+"S03#1",t:"chips",q:"Gaur goizean Iker ____ dago.",ch:["eskolan","eskolara","eskolatik"],a:["eskolan"],ex:"Egon → NON: eskolan."},
 {id:"A1-3-2",src:A+"S03#2",t:"chips",q:"Arratsaldean Lur ____ joan da.",ch:["parkean","parkera","parketik"],a:["parkera"],ex:"Joan + helmuga → NORA: parkera."},
 {id:"A1-3-3",src:A+"S03#3",t:"chips",q:"Eskola amaitu da. Haurrak ____ ateratzen dira.",ch:["eskolan","eskolara","eskolatik"],a:["eskolatik"],ex:"Atera → NONDIK: eskolatik."},
 {id:"A1-3-4",src:A+"S03#4",t:"match",q:"Lotu galdera eta forma.",pairs:[["Non?","mendian"],["Nora?","mendira"],["Nondik?","menditik"]],a:["mendian · mendira · menditik"],ex:"Hitz bera, hiru amaiera: mendian, mendira, menditik."},
 {id:"A1-3-5",src:A+"S03#5",t:"gap",q:"Ane ____ bizi da.",h:"herri · non?",a:["herrian"],ex:"Non? → -n: herrian."},
 {id:"A1-3-6",src:A+"S03#6",t:"gap",q:"Larunbatean ____ joango gara.",h:"mendi · nora?",a:["mendira"],ex:"Nora? → -ra: mendira."},
 {id:"A1-3-7",src:A+"S03#7",t:"gap",q:"Ur hau ____ dator.",h:"mendi · nondik?",a:["menditik"],ex:"Nondik? → -tik: menditik."},
 {id:"A1-3-8",src:A+"S03#8",t:"mc",q:"«Basoan ibili gara.» Zer adierazten du «basoan» hitzak?",ch:["Non ibili garen","Nora joan garen","Nondik etorri garen"],a:["Non ibili garen"],ex:"Mugitu gara, baina basoaren barruan: NON. Mugitzeak ez du beti NORA eskatzen."},
 {id:"A1-3-9",src:A+"S03#9",t:"fix",q:"Gaur goizean parkera jolastu gara.",w:"parkera",r:"parkean",opts:["parkean","parketik","plazara"],a:["Gaur goizean parkean jolastu gara."],ex:"Leku batean jolasten gara: NON → parkean."}]},
{id:"a1a2-k1-i4",n:4,title:"Hiru bideak",es:"Los tres caminos",map:"bideak",
 talk:[["iker","Mapa bat aurkitu dut! Gurutzebide honetatik hiru bide ateratzen dira.","¡He encontrado un mapa! De este cruce salen tres caminos."],["lur","Baina zein bide doa errekara?","¿Pero qué camino va al arroyo?"],["txinpart","Begiratu ondo seinaleei… hi, hi!","Mirad bien las señales… ¡ji, ji!"]],
 learn:"cases",keys:["gurutzebidetik","basotik","errekara"],
 tip:"Mapa irakurri: nondik abiatzen zara, nondik pasatzen zara eta nora iristen zara?",tipEs:"Lee el mapa: ¿de dónde sales, por dónde pasas y adónde llegas?",
 items:[
 {id:"A1-4-1",src:A+"S04#1",t:"mc",map:"bideak",q:"Zein bidek eramaten zaitu mendira?",ch:["Ezkerreko bideak","Erdiko bideak","Eskuineko bideak"],a:["Ezkerreko bideak"],ex:"Mapan, ezkerreko bidea mendira doa."},
 {id:"A1-4-2",src:A+"S04#2",t:"mc",map:"bideak",q:"Eskuineko bidea errekara doa. Zer arazo du?",ch:["Itxita dago.","Mendira doa.","Oso laburra da."],a:["Itxita dago."],ex:"Seinaleak dio: «Itxita». Ezin da bide horretatik pasatu."},
 {id:"A1-4-3",src:A+"S04#3",t:"mc",map:"bideak",q:"Mezuak «errekara noa» dio. Zein bide hartu behar du taldeak?",ch:["Erdiko bidea","Ezkerreko bidea","Eskuineko bidea"],a:["Erdiko bidea"],ex:"Eskuinekoa itxita dago. Erdikoa basotik pasatzen da, eta zubitik errekara iristen da."},
 {id:"A1-4-4",src:A+"S04#4",t:"match",map:"bideak",q:"Lotu ibilbidearen hiru zatiak.",pairs:[["Nondik abiatu dira?","gurutzebidetik"],["Nondik pasatu dira?","basotik"],["Nora iritsi dira?","errekara"]],a:["gurutzebidetik · basotik · errekara"],ex:"-tik amaierak abiapuntua edo pasatzeko lekua adieraz dezake; -ra, helmuga."},
 {id:"A1-4-5",src:A+"S04#5",t:"build",map:"bideak",q:"Nola iritsiko gara errekara?",instr:"Ordenatu esaldia.",x:"errekan",a:["Zubitik errekara iritsiko gara."],ex:"Zubitik (pasatzeko lekua) errekara (helmuga)."},
 {id:"A1-4-6",src:A+"S04#6",t:"gap",q:"Taldea gurutzebidetik abiatu da eta ____ iritsi da.",h:"erreka · nora?",a:["errekara"],ex:"Nora iritsi da? → errekara."},
 {id:"A1-4-7",src:A+"S04#7",t:"mc",map:"bideak",q:"Zubiaren azpian, zer dago?",ch:["Erreka","Mendia","Basoa"],a:["Erreka"],ex:"Zubia errekaren gainean dago; erreka, zubiaren azpian."},
 {id:"A1-4-8",src:A+"S04#8",t:"mc",q:"Mapak esaten digu nork idatzi zuen mezua?",ch:["Ez: mapak bideak erakusten ditu, ez egilea.","Bai: Txinpartek idatzi zuen.","Bai: Ikerrek idatzi zuen."],a:["Ez: mapak bideak erakusten ditu, ez egilea."],ex:"Mapak bideak erakusten ditu. Egilea nor den ez dakigu oraindik: ez asmatu frogarik gabe!"}]},
{id:"a1a2-k1-i5",n:5,title:"Zure mapa",es:"Tu mapa",challenge:true,map:"herria",
 talk:[["ane","Errekara iritsi gara! Eta orain, zure txanda.","¡Hemos llegado al arroyo! Y ahora, te toca a ti."],["lur","Mapa berri bat marraztu dugu: eskola, plaza eta liburutegia.","Hemos dibujado un mapa nuevo: la escuela, la plaza y la biblioteca."],["iker","Azaldu ibilbidea, guk jarraitu ahal izateko.","Explica el recorrido para que podamos seguirlo."]],
 learn:"order",keys:["lehenik","gero","azkenik"],
 tip:"Ibilbide on batek hiru gauza ditu: abiapuntua (-tik), geldialdia (-n) eta helmuga (-ra).",tipEs:"Un buen recorrido tiene tres cosas: punto de partida (-tik), parada (-n) y destino (-ra).",
 items:[
 {id:"A1-5-1",src:A+"S05#1",t:"mc",map:"herria",q:"Ane eskolatik plazara joan da. Nondik abiatu da?",ch:["Eskolatik","Plazatik","Liburutegitik"],a:["Eskolatik"],ex:"Eskolatik → abiapuntua."},
 {id:"A1-5-2",src:A+"S05#2",t:"gap",map:"herria",q:"Gero, Ane ____ gelditu da, lagunekin.",h:"plaza · non?",a:["plazan"],ex:"Non gelditu da? → plazan."},
 {id:"A1-5-3",src:A+"S05#3",t:"gap",map:"herria",q:"Azkenik, ____ joan da, liburu bat hartzera.",h:"liburutegi · nora?",a:["liburutegira"],ex:"Nora joan da? → liburutegira."},
 {id:"A1-5-4",src:A+"S05#4",t:"build",q:"Zure lehen esaldia:",instr:"Ordenatu esaldia.",x:"plazan",a:["Eskolatik plazara joan naiz."],ex:"Eskolatik (abiapuntua) plazara (helmuga)."},
 {id:"A1-5-5",src:A+"S05#5",t:"fix",q:"Liburu bat hartu dut eta etxean joan naiz.",w:"etxean",r:"etxera",opts:["etxera","etxetik","mendian"],a:["Liburu bat hartu dut eta etxera joan naiz."],ex:"Joan + helmuga → NORA: etxera."},
 {id:"A1-5-6",src:A+"S05#6",t:"mc",map:"herria",q:"Mapan: eskola → plaza → liburutegia. Zein esaldik azaltzen du ibilbidea?",ch:["Eskolatik plazara joan naiz, eta gero liburutegira.","Eskolan plazara joan naiz, eta gero liburutegian.","Liburutegitik plazara joan naiz, eta gero eskolara."],a:["Eskolatik plazara joan naiz, eta gero liburutegira."],ex:"Abiapuntua eskola da (-tik), gero plaza eta azkenik liburutegia (-ra)."},
 {id:"A1-5-7",src:A+"S05#7",t:"write",map:"zurea",q:"Orain zu! Idatzi ibilbide hau: etxea → parkea → museoa.",instr:"Idatzi bi edo hiru esaldi. Erabili lehenik, gero eta azkenik.",model:"Lehenik, etxetik parkera joan naiz. Gero, parkean jolastu naiz. Azkenik, museora joan naiz.",a:["(irekia)"],ex:"Zure testua ez da automatikoki zuzentzen. Konparatu ereduarekin eta begiratu hiru zatiak dituen."}]}
];

/* ---------- A1–A2 · 2. kapitulua: Zer egin dut gaur? (GOLD-A1-001 · NOR / NOR-NORK) ---------- */
const G="GOLD-A1-001-";
const a1K2Lessons=[
{id:"a1a2-k2-i1",n:1,title:"Ni naiz, nik dut",es:"«Ni naiz» frente a «nik dut»",
 talk:[["bira","Gaur eguneko bi ekintza kontatuko ditugu. Begiratu bi esaldiei!","Hoy contaremos dos acciones del día. ¡Fíjate en las dos frases!"],["ane","Ni etxera joan naiz.","Yo he ido a casa."],["iker","Nik liburua irakurri dut.","Yo he leído el libro."]],
 learn:"nornork",keys:["ni · naiz","nik · dut","zu · zara","zuk · duzu"],
 tip:"Nor joan da? Ni (naiz). Nork irakurri du? Nik (dut). Ez dute aditz guztiek eredu bera.",
 tipEs:"¿Quién ha ido? Ni (naiz). ¿Quién ha leído? Nik (dut). No todos los verbos siguen el mismo patrón.",
 items:[
 {id:"G1-1-1",src:G+"D01",t:"mc",q:"Ane etxera joan ____.",ch:["da","du","naiz"],a:["da"],hint:"Nor joan da? «Joan» aditzak NOR eredua du.",ex:"«Joan» aditzak NOR laguntzailea behar du: Ane etxera joan da."},
 {id:"G1-1-2",src:G+"D02",t:"mc",q:"Nik ura edan ____.",ch:["dut","naiz","da"],a:["dut"],hint:"«Nik» + objektua («ura»): NOR-NORK eredua da.",ex:"«Edan» aditzarekin NORK («nik») eta objektua («ura») daude → dut."},
 {id:"G1-1-3",src:G+"P01",t:"chips",q:"____ eskolara joan naiz.",ch:["Ni","Nik","Zu"],a:["Ni"],hint:"Begiratu laguntzaileari: «naiz» NOR da.",ex:"«Joan naiz» NOR egitura da, beraz izenordaina «Ni» da."},
 {id:"G1-1-4",src:G+"P02",t:"chips",q:"____ sagarra jan dut.",ch:["Nik","Ni","Zuk"],a:["Nik"],hint:"Begiratu laguntzaileari: «dut» NOR-NORK da.",ex:"«Jan dut» egituran subjektuak -k darama: «Nik»."},
 {id:"G1-1-5",src:G+"P03",t:"mc",q:"Zu etxera itzuli ____.",ch:["zara","duzu","naiz"],a:["zara"],hint:"«Zu» NOR da, ez «zuk».",ex:"«Itzuli» NOR ereduan doa: Zu etxera itzuli zara."},
 {id:"G1-1-6",src:G+"P04",t:"mc",q:"Zuk kafea prestatu ____.",ch:["duzu","zara","dut"],a:["duzu"],hint:"«Zuk» NORK da, eta «kafea» objektu singularra.",ex:"«Zuk» subjektuarekin eta objektu singularrarekin → duzu."},
 {id:"G1-1-7",src:G+"P00",t:"gap",q:"Nik liburua irakurri ____.",h:"nik · NOR-NORK",hint:"Nik + objektu bat → dut.",a:["dut"],ex:"«Nik» + objektu singularra («liburua») → dut."}]},
{id:"a1a2-k2-i2",n:2,title:"Gu gara, guk dugu",es:"En plural: «gu gara» y «guk dugu»",
 talk:[["ane","Gu geltokira iritsi gara!","¡Hemos llegado a la estación!"],["lur","Eta guk giltza hartu dugu.","Y nosotros hemos cogido la llave."],["bira","Ikusi? Taldean ere bi eredu daude: NOR eta NOR-NORK.","¿Ves? En plural también hay dos modelos: NOR y NOR-NORK."]],
 learn:"nornork_pl",keys:["gu · gara","guk · dugu","dira","dute"],
 tip:"NOR: gu → gara, bi lagun → dira · NOR-NORK: guk → dugu, bi lagunek → dute.",
 tipEs:"NOR: gu → gara, bi lagun → dira · NOR-NORK: guk → dugu, bi lagunek → dute.",
 items:[
 {id:"G1-2-1",src:G+"D03",t:"chips",q:"____ geltokira iritsi gara.",ch:["Gu","Guk","Zuek"],a:["Gu"],hint:"«Iritsi gara» NOR eredua da.",ex:"«Iritsi» NOR da: Gu geltokira iritsi gara."},
 {id:"G1-2-2",src:G+"P05",t:"mc",q:"Bi lagun etorri ____.",ch:["dira","da","dute"],a:["dira"],hint:"Bi lagun (plurala) + «etorri» (NOR).",ex:"«Bi lagun» plurala da, eta «etorri» NOR → dira."},
 {id:"G1-2-3",src:G+"P06",t:"mc",q:"Bi lagunek ogia erosi ____.",ch:["dute","du","dira"],a:["dute"],hint:"«Bi lagunek» NORK plurala da; «ogia» objektu singularra.",ex:"Subjektua plurala da («bi lagunek») eta objektua singularra («ogia») → dute."},
 {id:"G1-2-4",src:G+"M01",t:"match",q:"Lotu subjektua eta aditz laguntzailea.",pairs:[["Gu etxera joan…","gara"],["Guk kafea hartu…","dugu"],["Bi lagun etorri…","dira"],["Bi lagunek ogia erosi…","dute"]],a:["gara · dugu · dira · dute"],ex:"NOR: gara / dira · NOR-NORK: dugu / dute."},
 {id:"G1-2-5",src:G+"T01",t:"build",q:"Aterpetxeko oharra: gu / aterpetxera / heldu.",instr:"Ordenatu esaldia.",x:"dugu.",hint:"«Heldu» NOR da: gu → gara.",a:["Gu aterpetxera heldu gara."],ex:"«Heldu» NOR ereduan erabiltzen da: Gu aterpetxera heldu gara."},
 {id:"G1-2-6",src:G+"T02",t:"build",q:"Aterpetxeko oharra: guk / giltza / hartu.",instr:"Ordenatu esaldia.",x:"gara.",hint:"«Guk» + «giltza» → NOR-NORK singularra.",a:["Guk giltza hartu dugu."],ex:"«Guk» NORK da eta «giltza» objektu singularra → dugu."},
 {id:"G1-2-7",src:G+"T03",t:"gap",q:"Bi bezero merkatura iritsi ____.",h:"bi bezero · NOR",hint:"Bi pertsona (plurala) + «iritsi» (NOR).",a:["dira"],ex:"«Bi bezero» plurala da eta «iritsi» NOR → dira."}]},
{id:"a1a2-k2-i3",n:3,title:"Bat ala bi?",es:"¿Uno o varios?: «dut / ditut»",
 talk:[["iker","Nik liburu bat erosi dut.","Yo he comprado un libro."],["ane","Eta nik bi liburu erosi ditut!","¡Y yo he comprado dos libros!"],["bira","Begira: objektua plurala denean, laguntzailea ere aldatzen da!","Fíjate: cuando el objeto es plural, también cambia el auxiliar."]],
 learn:"obj_num",keys:["dut / ditut","duzu / dituzu","dugu / ditugu","dute / dituzte"],
 tip:"Objektu bat: du- (dut, duzu, dugu, dute). Bi edo gehiago: ditu- (ditut, dituzu, ditugu, dituzte).",
 tipEs:"Un objeto: du- (dut, duzu, dugu, dute). Dos o más: ditu- (ditut, dituzu, ditugu, dituzte).",
 items:[
 {id:"G1-3-1",src:G+"P07",t:"chips",q:"Guk bi liburu irakurri ____.",ch:["ditugu","dugu","gara"],a:["ditugu"],hint:"Zenbat liburu? Bi liburu (plurala) → ditu-.",ex:"«Bi liburu» plurala da, beraz «dugu» beharrean «ditugu»."},
 {id:"G1-3-2",src:G+"P09",t:"chips",q:"Nik bi gutun idatzi ____.",ch:["ditut","dut","naiz"],a:["ditut"],hint:"«Bi gutun» plurala da → nik + plurala.",ex:"Objektua plural bihurtzean («bi gutun»), «dut» → «ditut»."},
 {id:"G1-3-3",src:G+"R02",t:"mc",q:"Zuk bi txartel aurkitu ____.",ch:["dituzu","duzu","zara"],a:["dituzu"],hint:"«Zuk» + «bi txartel» (plurala).",ex:"«Bi txartel» objektu plurala da → dituzu."},
 {id:"G1-3-4",src:G+"M02",t:"match",q:"Lotu esaldia laguntzaile egokiarekin.",pairs:[["Nik liburu bat erosi…","dut"],["Nik bi liburu erosi…","ditut"],["Guk sagar bat jan…","dugu"],["Guk bi sagar jan…","ditugu"]],a:["dut · ditut · dugu · ditugu"],ex:"Objektu singularra: dut / dugu. Objektu plurala: ditut / ditugu."},
 {id:"G1-3-5",src:G+"R05",t:"gap",q:"Nik bi maleta ekarri ____.",h:"nik · bi maleta",hint:"Objektua plurala da («bi maleta») → ditu-.",a:["ditut"],ex:"«Nik» + «bi maleta» (plurala) → ditut."},
 {id:"G1-3-6",src:G+"T04",t:"gap",q:"Bi bezerok hiru tomate erosi ____.",h:"bi bezerok · hiru tomate",hint:"Subjektua plurala da eta objektua ere plurala → dituzte.",a:["dituzte"],ex:"NORK plurala («bi bezerok») + objektu plurala («hiru tomate») → dituzte."},
 {id:"G1-3-7",src:G+"P11",t:"fix",q:"Zuk bi argazki ikusi duzu gaur.",w:"duzu",r:"dituzu",opts:["dituzu","zara","ditut"],hint:"Zenbat argazki dira? Bi (plurala).",a:["Zuk bi argazki ikusi dituzu gaur."],ex:"«Bi argazki» plurala da, eta «zuk» NORK → dituzu."}]},
{id:"a1a2-k2-i4",n:4,title:"Gaurko bi ekintza",es:"Reto: cuenta dos acciones de hoy",challenge:true,
 talk:[["ane","Gaur goizean parkera joan naiz, eta bi liburu irakurri ditut.","Hoy por la mañana he ido al parque y he leído dos libros."],["bira","Orain zure txanda da: bereizi NOR eta NOR-NORK, eta kontatu zure eguna!","Ahora te toca a ti: distingue NOR y NOR-NORK, ¡y cuenta tu día!"]],
 learn:"nornork",keys:["naiz / dut","gara / dugu","ditut / ditugu"],
 tip:"Galdetu lehenik: NOR bakarrik, ala NORK + ZER? Gero begiratu kopuruari.",
 tipEs:"Pregunta primero: ¿solo NOR, o NORK + QUÉ? Luego fíjate en la cantidad.",
 items:[
 {id:"G1-4-1",src:G+"P12",t:"mc",q:"Zein esalditan ageri da NORK?",ch:["Anek poltsa hartu du.","Ane iritsi da.","Gu etxera joan gara."],a:["Anek poltsa hartu du."],hint:"Bilatu -k marka subjektuan eta «du» laguntzailea.",ex:"«Anek poltsa hartu du» esaldian «Anek» NORK da; besteetan NOR dago."},
 {id:"G1-4-2",src:G+"P10",t:"fix",q:"Guk etxera etorri gara.",w:"Guk",r:"Gu",opts:["Gu","Guri","Ni"],hint:"«Etorri gara» NOR eredua da; ez du -k behar.",a:["Gu etxera etorri gara."],ex:"«Etorri gara» NOR da, beraz izenordaina «Gu» da."},
 {id:"G1-4-3",src:G+"R03",t:"mc",q:"«Mikel sartu da» eta «Mikelek atea ireki du». Zeinetan da Mikel NOR?",ch:["Lehenengoan (Mikel sartu da)","Bigarrenean (Mikelek atea ireki du)","Bietan"],a:["Lehenengoan (Mikel sartu da)"],hint:"NOR kasuak ez darama -k markarik.",ex:"«Sartu da» NOR da («Mikel»); «ireki du» NOR-NORK da («Mikelek»)."},
 {id:"G1-4-4",src:G+"P08",t:"build",q:"Ane mendira joan da. Aldatu Ane → Gu.",instr:"Eraiki esaldi berria «Gu» erabiliz.",x:"dugu.",hint:"«Joan» NOR da: gu → gara.",a:["Gu mendira joan gara."],ex:"NOR eta laguntzailea aldatu dira: Ane … da → Gu … gara."},
 {id:"G1-4-5",src:G+"R01",t:"build",q:"Parkean: zu / paseatzera / atera.",instr:"Ordenatu esaldia.",x:"duzu.",hint:"«Atera» hemen NOR da: zu → zara.",a:["Zu paseatzera atera zara."],ex:"«Paseatzera atera» NOR egitura da → Zu paseatzera atera zara."},
 {id:"G1-4-6",src:G+"R06",t:"fix",q:"Nik bi liburu irakurri dut gaur.",w:"dut",r:"ditut",opts:["ditut","naiz","ditugu"],hint:"«Bi liburu» plurala da.",a:["Nik bi liburu irakurri ditut gaur."],ex:"Objektu pluralarekin («bi liburu») → ditut."},
 {id:"G1-4-7",src:G+"W01",t:"write",check:"nornork",q:"Gaur zer egin duzu? Nora joan zara?",instr:"Idatzi bi esaldi: bat NOR ereduarekin (joan, etorri, egon) eta bestea NOR-NORK ereduarekin (erosi, jan, irakurri).",model:"Gaur goizean parkera joan naiz. Gero, bi liburu irakurri ditut.",a:["(irekia)"],ex:"Konparatu zure esaldiak ereduarekin: NOR (naiz/gara) eta NOR-NORK (dut/ditut)."}]}
];

const a1Chapters=[
 {id:"a1a2-k1",title:"Basorako bidea",es:"El camino al bosque",lessons:a1Lessons},
 {id:"a1a2-k2",title:"Zer egin dut gaur?",es:"NOR y NOR-NORK: contar tu día",lessons:a1K2Lessons},
 {id:"a1a2-k3",title:"Lamiaren ispilua",es:"El espejo de la lamia"},
 {id:"a1a2-k4",title:"Galtzagorrien nahaspila",es:"El lío de los galtzagorris"},
 {id:"a1a2-k5",title:"Zubiaren azpiko mezua",es:"El mensaje bajo el puente"}];
const a1Gloss={mendia:"el monte",basoa:"el bosque",erreka:"el arroyo",bidea:"el camino",zubia:"el puente",menditik:"desde el monte",basoan:"en el bosque",errekara:"al arroyo",basotik:"por el bosque",gurutzebidetik:"desde el cruce","-n":"en (¿dónde?)","-ra":"a, hacia (¿adónde?)","-tik":"desde, por (¿de dónde?)",lehenik:"primero",gero:"luego",azkenik:"por último",eskolan:"en la escuela",parkera:"al parque",eskolatik:"desde la escuela",herrian:"en el pueblo",mendira:"al monte",plazan:"en la plaza",liburutegira:"a la biblioteca",etxera:"a casa",parkean:"en el parque",baina:"pero",arren:"a pesar de, aunque","nahiz eta":"aunque","ni · naiz":"yo soy / he (NOR)","nik · dut":"yo he (NOR-NORK)","zu · zara":"tú eres / has (NOR)","zuk · duzu":"tú has (NOR-NORK)","gu · gara":"nosotros (NOR)","guk · dugu":"nosotros (NOR-NORK)",dira:"son / han (NOR pl.)",dute:"han (NORK pl.)","dut / ditut":"he (1 / varios)","duzu / dituzu":"has (1 / varios)","dugu / ditugu":"hemos (1 / varios)","dute / dituzte":"han (1 / varios)"};
Object.assign(gloss,a1Gloss);

/* Maila-proba: sei galdera, errazenetik zailenera. Bi huts jarraian → proba amaitzen da. */
const placement=[
 {id:"P1",src:"MAILA#1",t:"mc",lv:1,q:"Kaixo! Ni Bira ____.",ch:["naiz","da","zara"],a:["naiz"]},
 {id:"P2",src:"MAILA#2",t:"mc",lv:1,q:"Gaur goizean ____ joan naiz.",ch:["eskolara","eskolan","eskolatik"],a:["eskolara"]},
 {id:"P3",src:"MAILA#3",t:"mc",lv:2,q:"Atzo zinemara ____.",ch:["joan nintzen","joango naiz","joaten naiz"],a:["joan nintzen"]},
 {id:"P4",src:"MAILA#4",t:"mc",lv:2,q:"Zuk niri liburu bat eman ____.",ch:["didazu","dizut","diozu"],a:["didazu"]},
 {id:"P5",src:"MAILA#5",t:"mc",lv:3,q:"Berandu iritsi naiz. ____, autobusa matxuratu da.",ch:["Izan ere","Beraz","Adibidez"],a:["Izan ere"]},
 {id:"P6",src:"MAILA#6",t:"mc",lv:3,q:"Euria egingo duela esan dute; ____, mendi-irteera atzeratu dugu.",ch:["hortaz","aitzitik","adibidez"],a:["hortaz"]}];

const islands=[
 {id:"a1a2",level:"A1–A2",adventure:{id:"basorako-bidea",title:"Basorako bidea",vocabularyLevel:"A1"},title:"Lehen urratsak",es:"Primeros pasos",blurb:"Leku-kasuak (non, nora, nondik) eta eguneroko ekintzak (NOR / NOR-NORK).",chapters:a1Chapters},
 {id:"b1b2",level:"B1–B2",adventure:{id:"uraren-misterioa",title:"Uraren misterioa",vocabularyLevel:"B1"},title:"Lotura uhartea",es:"La isla de los conectores",blurb:"Zergatia, ondorioa eta kontrastea: ideiak ondo lotuta euskaraz.",chapters}];
const cast={argi:{name:"Argi",c:"#b47728"},kai:{name:"Kai",c:"#367f83"},ane:{name:"Ane",c:"#f06a1d"},iker:{name:"Iker",c:"#2563eb"},lur:{name:"Lur",c:"#0f9f6e"},txinpart:{name:"Txinpart",c:"#c0262d"},bira:{name:"Bira",c:"#5b3cc4"}};

window.HB_BIDEA={version:"0.3.0",islands,island:islands[1],chapters,gloss,groups,patterns,placement,cast};
})();
