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

const chapters=[
 {id:"b1b2-k1",title:"Zer gertatu zen?",es:"Contar qué pasó y por qué",lessons},
 {id:"b1b2-k2",title:"Nola sentitzen zara?",es:"Emociones"},
 {id:"b1b2-k3",title:"Nire iritzia",es:"Dar tu opinión"},
 {id:"b1b2-k4",title:"Esan zidan…",es:"Contar lo que dijo otro"},
 {id:"b1b2-k5",title:"Noiz eta non",es:"Planes y tiempo"},
 {id:"b1b2-k6",title:"Gorputza eta osasuna",es:"Salud y consejos"},
 {id:"b1b2-k7",title:"Gure gizartea",es:"Sociedad"},
 {id:"b1b2-k8",title:"Eta baldin bada…?",es:"Hipótesis"}
];

/* SUSTRAI JUNIOR · Kondairen zaindariak · K02 (Drive, berrikuspenean). Ariketak oraindik ez daude kargatuta. */
const junior={story:"Kondairen zaindariak",chapter:"K02",title:"Basorako bidea",es:"El camino al bosque",
 stops:["Basoaren atea","Zuhaitz zaharra","Iturria","Mairuen harriak","Lainoaren zubia"]};

window.HB_BIDEA={version:"0.1.0",island:{id:"b1b2",title:"Lotura uhartea",level:"B1–B2"},chapters,junior,gloss,groups};
})();
