/* HitzBira · Bidea 0.2: maila-proba, Gaur, Mapa, Ni eta ikasgai-erreproduzitzailea.
   Ez dago adin-hautatzailerik: ikaslearen mailak (A1–A2 / B1–B2) erabakitzen du zein uharte ikusten duen.
   app.js-ek deitzen ditu: HBBidea.gaur(), HBBidea.mapa(), HBBidea.ni(), HBBidea.focused().
   Aurrerapena gailu honetan gordetzen da (hitzbira-bidea-v1). Ikuskatzailearen oharrak ere bai (hitzbira-bidea-audit-v1). */
(function(root){
"use strict";
const KEY="hitzbira-bidea-v1",AKEY="hitzbira-bidea-audit-v1",GOAL=30;

/* ---------- Funtzio puruak (probetan ere erabiltzen dira) ---------- */
function norm(s){return String(s||"").toLowerCase().normalize("NFC").replace(/[«»"“”.,;:!?¿¡()]/g," ").replace(/\s+/g," ").trim()}
function isAccepted(answer,accepted){const n=norm(answer);return !!n&&accepted.some(a=>norm(a)===n)}
function groupOf(word,groups){const n=norm(word);for(const [g,list] of Object.entries(groups))if(list.some(x=>norm(x)===n))return g;return null}
function capitalFor(q){const i=q.indexOf("____");if(i<=0)return true;return /[.!?]\s*$/.test(q.slice(0,i))}
function caseLike(word,cap){return cap?word.charAt(0).toUpperCase()+word.slice(1):word.charAt(0).toLowerCase()+word.slice(1)}
function shuffle(list,rnd=Math.random){const a=list.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
/* Txartelak: aukera esplizituak (ch) edo erantzun onartu bat + beste multzo semantiko bateko hiru distraktore. */
function chipsFor(item,groups,rnd=Math.random){if(item.ch)return shuffle(item.ch,rnd);const cap=capitalFor(item.q),right=item.a[0],gs=new Set(item.a.map(a=>groupOf(a,groups)).filter(Boolean));
 const pool=[];for(const [g,list] of Object.entries(groups))if(!gs.has(g))pool.push(list[0]);
 return shuffle([right,...shuffle(pool,rnd).slice(0,3)],rnd).map(w=>caseLike(w,cap))}
/* Esaldia eraikitzeko fitxak: lokailu konposatuak fitxa bakarrean. */
function tilesFor(sentence){const words=sentence.split(/\s+/).filter(Boolean),out=[];for(let i=0;i<words.length;i++){const w=words[i],nx=words[i+1];if(nx&&/^(izan|hala|esate)$/i.test(w)&&/^(ere|baterako),?$/i.test(nx)){out.push(w+" "+nx);i++}else out.push(w)}return out}
function fixTokens(item){const i=item.q.indexOf(item.w);if(i<0)return item.q.split(/\s+/);const before=item.q.slice(0,i).trim(),after=item.q.slice(i+item.w.length).trim();return [...(before?before.split(/\s+/):[]),item.w,...(after?after.split(/\s+/):[])]}
function fixOptions(item,groups,rnd=Math.random){if(item.opts)return shuffle(item.opts,rnd);const gr=groupOf(item.r,groups),gw=groupOf(item.w,groups),pool=[];for(const [g,list] of Object.entries(groups))if(g!==gr&&g!==gw)pool.push(list[0]);return shuffle([item.r,...shuffle(pool,rnd).slice(0,2)],rnd)}
function starsFor(first,total){const r=total?first/total:0;return r>=.9?3:r>=.7?2:1}
/* Maila-proba: bi huts jarraian → amaitu. 5 zuzen edo gehiago → B1–B2. */
function placeLevel(score){return score>=5?"b1b2":"a1a2"}
function greetingFor(h){return h>=6&&h<13?["Egun on!","¡Buenos días!"]:h>=13&&h<20?["Arratsalde on!","¡Buenas tardes!"]:["Gabon!","¡Buenas noches!"]}
/* Esaldi osoa, erantzuna nabarmenduta: [aurretik, erantzuna, ondoren]. */
function solvedParts(item){
 if(item.t==="fix"){const s=item.a[0],r=item.r,i=s.indexOf(r);return i<0?[s,"",""]:[s.slice(0,i),r,s.slice(i+r.length)]}
 if(item.t==="build"){const s=item.a[0],k=item.k||"",i=k?s.indexOf(k):-1;return i<0?[s,"",""]:[s.slice(0,i),k,s.slice(i+k.length)]}
 if(item.q&&item.q.includes("____")){const [b,...rest]=item.q.split("____");const ans=caseLike(item.a[0],capitalFor(item.q));return [b,ans,rest.join(item.a[0])]}
 return null}
function writeCheckList(t){const s=String(t||"");return [["Abiapuntua (-tik)",/\p{L}{2,}tik\b/iu],["Geldialdia (-n)",/\b(?!(?:izan|eman|esan|edan|jan|joan|egon|zen|duen|den|nuen|zuen|baina)\b)\p{L}{3,}(?:an|ean)\b/iu],["Helmuga (-ra)",/\b(?!(?:gara|zara|dira|atera|euskara|bira|aurrera|hara|gura)\b)\p{L}{3,}ra\b/iu],["Ordena (lehenik, gero, azkenik)",/\b(lehenik|gero|azkenik|ondoren|bukatzeko)\b/i]].map(([l,re])=>[l,re.test(s)])}
const api={norm,isAccepted,groupOf,capitalFor,chipsFor,tilesFor,fixTokens,fixOptions,starsFor,placeLevel,greetingFor,solvedParts,writeCheckList};
if(typeof module!=="undefined"&&module.exports){module.exports=api;return}

/* ---------- Egoera ---------- */
const DATA=root.HB_BIDEA;if(!DATA)return;
const POSES={hello:"bira_00_ongietorria_v02.svg",surprise:"bira_01_harridura_v02.svg",curious:"bira_02_jakin-mina_v02.svg",sad:"bira_03_tristura-arina_v02.svg",retry:"bira_04_berriro-saiatu_v02.svg",celebrate:"bira_05_ospakizuna_v02.svg",wink:"bira_06_keinua_v02.svg",effort:"bira_07_ahalegina_v02.svg",calm:"bira_08_poztasun-lasaia_v02.svg"};
const PRAISE=["Bikain!","Ederki!","Hori da!","Primeran!","Zuzen-zuzen!","Oso ondo!"],OOPS=["Ia-ia!","Ez da hori, baina gertu zaude.","Lasai: amaieran berriro agertuko da."];
const keyFor=k=>root.HBData?.keyFor?root.HBData.keyFor(k):k;
function load(k,d){try{const v=JSON.parse(localStorage.getItem(keyFor(k))||"null");return v&&typeof v==="object"?v:d}catch{return d}}
function store(k,v){try{localStorage.setItem(keyFor(k),JSON.stringify(v))}catch{}}
let S={},AUD={},loadedKey=null;
function syncState(){const k=keyFor(KEY);if(loadedKey===k)return;loadedKey=k;let dirty=false;S=load(KEY,{});S.lessons=S.lessons||{};S.days=S.days||{};S.xp=S.xp||0;
 /* 0.1 bertsioko adin-profila mailara pasatu */
 if(!S.level&&S.profile){S.level=S.profile==="haurra"?"a1a2":"b1b2";dirty=true}if("profile" in S||"picking" in S){delete S.profile;delete S.picking;dirty=true}
 if(S.sound===undefined)S.sound=true;
 AUD=load(AKEY,{});
 try{const p=new URLSearchParams(location.search);if(p.has("ikuskatu")||p.has("auditor")){const next=(p.get("ikuskatu")||p.get("auditor"))!=="0";if(S.auditor!==next){S.auditor=next;dirty=true}}}catch{}
 if(dirty)store(KEY,S)}
const save=()=>{syncState();store(KEY,S)};
function reset(){if(root.HBData?.isRemote?.())return;try{localStorage.removeItem(keyFor(KEY));localStorage.removeItem(keyFor(AKEY))}catch{}loadedKey=null;player=null;syncState();applyLevel()}
syncState();
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const jq=v=>esc(JSON.stringify(v));
const today=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const help=()=>S.help==="es";
const pick=a=>a[Math.floor(Math.random()*a.length)];
const bira=(pose,cls="")=>`<img class="bd-bira ${cls}" src="/assets/bira/${POSES[pose]||POSES.hello}" alt="" width="400" height="400" decoding="async" aria-hidden="true">`;
const ICONS={map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>',star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',play:'<path d="M8 5v14l11-7z"/>',check:'<path d="m5 12 5 5L20 7"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',bolt:'<path d="m13 2-9 12h7l-1 8 10-12h-7z"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',flag:'<path d="M5 21V4h11l-2 4 2 4H5"/>',sound:'<path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',mute:'<path d="M4 9v6h4l5 4V5L8 9zM17 9l5 6M22 9l-5 6"/>',fire:'<path d="M12.6 2.2c.3 3.2-1.9 5-3.2 6.8-1.4 1.9-2.4 3.5-2.4 5.7a5.8 5.8 0 0 0 11.7-.2c0-3.3-2-5.8-3.3-7.4-.5 1.3-1.4 2-2.2 2.2.7-2.2.6-4.8-.6-7.1z"/>',pin:'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',into:'<path d="M3 12h11m-4-5 5 5-5 5"/><path d="M19 4v16"/>',outof:'<path d="M5 4v16"/><path d="M9 12h11m-4-5 5 5-5 5"/>',mountain:'<path d="m2 20 7-12 4 6 3-4 6 10z"/>',trees:'<path d="M7 3 3 11h3l-3 6h8l-3-6h3zM17 6l-3 6h2l-2 5h6l-2-5h2zM7 17v4M17 17v4"/>',river:'<path d="M2 8c3-2 5 2 8 0s5-2 8 0 4 0 4 0M2 14c3-2 5 2 8 0s5-2 8 0 4 0 4 0"/>',path:'<path d="M8 21c0-6 8-6 8-12 0-3-2-5-4-6" stroke-dasharray="3 3"/>',bridge:'<path d="M2 16h20M4 16v4M20 16v4M3 16c3-6 15-6 18 0"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'};
const svg=(n,c="")=>`<svg class="bd-ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||""}</svg>`;
const island=()=>DATA.islands.find(x=>x.id===S.level)||DATA.islands[0];
const chapter=()=>island().chapters[0],lessons=()=>chapter().lessons;
const allLessons=()=>DATA.islands.flatMap(i=>i.chapters.flatMap(c=>c.lessons||[]));
const done=id=>S.lessons[id]&&S.lessons[id].stars>0;
function unlocked(i){return i===0||done(lessons()[i-1].id)}
function nextLesson(){const ls=lessons();for(let i=0;i<ls.length;i++)if(!done(ls[i].id))return i;return -1}
function totalStars(){return Object.values(S.lessons).reduce((n,l)=>n+(l.stars||0),0)}
function xpToday(){return S.days[today()]||0}
function streak(){let n=0;const d=new Date();if(!S.days[today()])d.setDate(d.getDate()-1);for(;;){const k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");if(S.days[k]>0){n++;d.setDate(d.getDate()-1)}else return n}}
function refresh(){if(typeof root.draw==="function")root.draw()}
function applyLevel(){syncState();if(document.body)document.body.dataset.hbLevel=S.level||"none"}
function setLevel(lv,startNow){syncState();if(!DATA.islands.some(x=>x.id===lv))return;const first=!S.level||S.help===undefined;S.level=lv;if(first)S.help=lv==="a1a2"?"es":"eu";S.placed=true;save();applyLevel();if(startNow){close(true);start(nextLesson()<0?0:nextLesson())}else{close(true);refresh()}}
function toggleHelp(){syncState();S.help=help()?"eu":"es";save();if(player)render();else refresh()}
function toggleSound(){syncState();S.sound=!S.sound;save();if(S.sound)sfx("ok");refresh()}

/* ---------- Soinua eta bibrazioa (itzal daitezke) ---------- */
let AC=null;
function tone(f,t0,d,type="sine",v=.07){try{AC=AC||new (root.AudioContext||root.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+t0;o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d+.02)}catch{}}
function sfx(kind){if(!S.sound)return;
 if(kind==="ok"){tone(660,0,.16);tone(990,.09,.22)}
 else if(kind==="bad"){tone(240,0,.22,"triangle",.06)}
 else if(kind==="tap"){tone(520,0,.06,"sine",.03)}
 else if(kind==="done"){[523,659,784,1047].forEach((f,i)=>tone(f,i*.11,.3))}
 try{navigator.vibrate&&navigator.vibrate(kind==="bad"?[30,40,30]:kind==="ok"?15:kind==="done"?[20,30,20,30,60]:0)}catch{}}

/* ---------- Ilustrazioak: mapak eta pertsonaiak ---------- */
const MAPS={
 bideak:`<svg class="bd-map" viewBox="0 0 320 200" role="img" aria-label="Mapa: gurutzebidetik hiru bide. Ezkerrekoa mendira; erdikoa basotik zubira eta errekara; eskuinekoa errekara, baina itxita.">
  <rect width="320" height="200" rx="18" class="m-bg"/>
  <path d="M0 52c40-14 70 10 110 0s70-14 110 0 70 10 100 0v22c-30 10-60-6-100 4s-70 10-110-2-70-10-110 2z" class="m-water"/>
  <path d="M40 120 72 66l18 26 12-16 26 44z" class="m-mount"/><path d="m64 80 8-14 8 12z" class="m-snow"/>
  <g class="m-tree"><circle cx="150" cy="118" r="13"/><circle cx="170" cy="110" r="15"/><circle cx="188" cy="122" r="12"/><circle cx="160" cy="132" r="11"/></g>
  <rect x="150" y="56" width="40" height="10" rx="3" class="m-bridge"/>
  <path d="M160 186c0-20-70-30-84-60" class="m-road"/><path d="M160 186c0-26 8-40 10-60s0-40 0-54" class="m-road"/><path d="M160 186c10-24 70-36 96-70s0-36 0-40" class="m-road"/>
  <g class="m-closed"><rect x="232" y="118" width="54" height="20" rx="5"/><text x="259" y="132">ITXITA</text></g>
  <circle cx="160" cy="186" r="8" class="m-start"/>
  <text x="60" y="140" class="m-lab">Mendia</text><text x="196" y="146" class="m-lab">Basoa</text><text x="196" y="50" class="m-lab">Zubia</text><text x="266" y="44" class="m-lab">Erreka</text><text x="176" y="196" class="m-lab m-small">Gurutzebidea</text>
 </svg>`,
 herria:`<svg class="bd-map" viewBox="0 0 320 150" role="img" aria-label="Mapa: eskola, plaza eta liburutegia, gezi batzuekin lotuta.">
  <rect width="320" height="150" rx="18" class="m-bg"/>
  <path d="M70 92h70M180 92h70" class="m-road m-arrow"/>
  <g class="m-house"><path d="M24 70 52 48l28 22v42H24z"/><rect x="44" y="90" width="14" height="22" class="m-door"/></g>
  <g class="m-plaza"><circle cx="160" cy="92" r="26"/><circle cx="160" cy="92" r="7" class="m-water"/></g>
  <g class="m-house m-lib"><rect x="248" y="58" width="56" height="54" rx="4"/><path d="M244 58h64l-32-18z"/><rect x="268" y="90" width="16" height="22" class="m-door"/></g>
  <text x="52" y="134" class="m-lab">Eskola</text><text x="160" y="134" class="m-lab">Plaza</text><text x="276" y="134" class="m-lab">Liburutegia</text>
 </svg>`,
 zurea:`<svg class="bd-map" viewBox="0 0 320 150" role="img" aria-label="Mapa: etxea, parkea eta museoa, gezi batzuekin lotuta.">
  <rect width="320" height="150" rx="18" class="m-bg"/>
  <path d="M70 92h70M180 92h70" class="m-road m-arrow"/>
  <g class="m-house"><path d="M24 70 52 48l28 22v42H24z"/><rect x="44" y="90" width="14" height="22" class="m-door"/></g>
  <g class="m-tree"><circle cx="150" cy="86" r="14"/><circle cx="172" cy="92" r="16"/><circle cx="158" cy="104" r="11"/></g>
  <g class="m-house m-lib"><path d="M244 112V70h60v42z"/><path d="M240 70h68l-34-22z"/><path d="M252 76v30M264 76v30M284 76v30M296 76v30" class="m-col"/></g>
  <text x="52" y="134" class="m-lab">Etxea</text><text x="160" y="134" class="m-lab">Parkea</text><text x="274" y="134" class="m-lab">Museoa</text>
 </svg>`};
function face(who){const c=DATA.cast[who]||{name:who,c:"#5b3cc4"};if(who==="bira")return `<span class="bd-face bd-face-bira">${bira("wink")}</span>`;return `<span class="bd-face" style="--c:${c.c}" aria-hidden="true">${esc(c.name.charAt(0))}</span>`}
/* Leku-kasuaren amaiera nabarmendu: mendi<b>tik</b> */
function caseInfo(w){const s=String(w);if(/tik$/i.test(s))return {tag:"NONDIK?",ico:"outof",cls:"c-from",cut:s.length-3};if(/ra$/i.test(s))return {tag:"NORA?",ico:"into",cls:"c-to",cut:s.length-2};return {tag:"NON?",ico:"pin",cls:"c-in",cut:s.length-1}}
function caseWord(w){const c=caseInfo(w);return `${esc(w.slice(0,c.cut))}<b class="${c.cls}">${esc(w.slice(c.cut))}</b>`}

/* ---------- Gaur: lehen minutua ---------- */
function onboarding(){const [g,gEs]=greetingFor(new Date().getHours());return `<section class="bd-card bd-welcome" aria-labelledby="bd-w-h">
 <div class="bd-welcome-art">${bira("hello","bd-bira-lg")}<span class="bd-spark s1"></span><span class="bd-spark s2"></span><span class="bd-spark s3"></span></div>
 <div class="bd-welcome-copy"><span class="bd-kicker">${esc(g.toUpperCase().replace("!",""))} · BIRA NAIZ</span><h1 id="bd-w-h">Ikas dezagun euskara, jolasean.</h1>
 <p>Lehenik, ikus dezagun nondik hasi: <b>sei galdera, minutu bat</b>.</p><p class="bd-es">Primero veamos por dónde empezar: seis preguntas, un minuto.</p>
 <div class="bd-welcome-cta"><button class="bd-btn bd-btn-main" onclick="HBBidea.startTest()">${svg("play")} Goazen!</button>
 <button class="bd-btn bd-btn-ghost" onclick="HBBidea.setLevel('a1a2',true)">Euskara gutxi dakit: hasi hasieratik</button></div></div>
 <div class="bd-welcome-path" aria-hidden="true">${DATA.islands.map(x=>`<span><b>${esc(x.level)}</b>${esc(x.title)}</span>`).join(`<i></i>`)}</div>
</section>`}
function ring(v,max){const r=26,c=2*Math.PI*r,p=Math.min(1,v/max);return `<svg class="bd-ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="${r}" class="bd-ring-bg"/><circle cx="32" cy="32" r="${r}" class="bd-ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p)}"/></svg>`}
function todayCard(){const I=island(),ls=lessons(),ni=nextLesson(),all=ni<0,i=all?ls.length-1:ni,L=ls[i],st=S.lessons[L.id];
 return `<article class="bd-card bd-today">
  <div class="bd-today-top"><span class="bd-kicker">GAURKO IKASGAIA · ${esc(I.level)}</span><span class="bd-chip">${i+1}/${ls.length}</span></div>
  <h2>${esc(L.title)}</h2>${help()?`<p class="bd-es">${esc(L.es)}</p>`:""}
  <p class="bd-meta">${esc(chapter().title)} · ${L.items.length} ariketa · ~${Math.max(3,Math.round(L.items.length/2))} min${L.challenge?" · Erronka":""}</p>
  <div class="bd-pips" aria-label="Kapituluko aurrerapena">${ls.map((x,k)=>`<span class="bd-pip${done(x.id)?" is-done":""}${k===i&&!all?" is-now":""}"></span>`).join("")}</div>
  <button class="bd-btn bd-btn-main" onclick="HBBidea.start(${i})">${svg("play")} ${all?"Errepasatu":st?"Berriro egin":i===0?"Hasi":"Jarraitu"}</button>
  ${all?`<p class="bd-note">Kapitulua osatu duzu! Hurrengoa prestatzen ari gara.</p>`:""}</article>`}
function auditPanel(){if(!S.auditor)return "";const v=Object.values(AUD),ok=v.filter(x=>x.v==="ok").length,fx=v.filter(x=>x.v==="fix").length;
 return `<section class="bd-card bd-audit-sum"><span class="bd-kicker">IKUSKATZAILE MODUA</span><p><b>${ok}</b> ontzat · <b>${fx}</b> zuzentzeko · ${allLessons().reduce((n,l)=>n+l.items.length,0)} ariketa guztira</p>
 <div class="bd-row"><button class="bd-btn bd-btn-small" onclick="HBBidea.copyAudit(this)">Kopiatu oharrak</button><button class="bd-btn bd-btn-small bd-btn-ghost" onclick="HBBidea.auditor(false)">Desaktibatu</button></div></section>`}
function tools(){return `<div class="bd-tools"><button class="bd-chip-btn${help()?" is-on":""}" aria-pressed="${help()}" onclick="HBBidea.toggleHelp()" title="Laguntza gaztelaniaz">${svg("globe")} ES</button><button class="bd-chip-btn${S.sound?" is-on":""}" aria-pressed="${!!S.sound}" onclick="HBBidea.toggleSound()" aria-label="Soinua">${svg(S.sound?"sound":"mute")}</button></div>`}
function gaur(){applyLevel();if(!S.level)return `<div class="bd-gaur bd-gaur-first">${onboarding()}</div>`;
 const x=xpToday(),[g,gEs]=greetingFor(new Date().getHours()),ni=nextLesson(),sk=streak();
 const line=ni<0?"Kapitulu osoa eginda. Errepaso bat?":ni===0&&!S.lessons[lessons()[0].id]?"Zure lehen ikasgaia prest dago.":x>=GOAL?"Gaurko helburua lortu duzu. Zoragarri!":"Jarraitu dezagun?";
 const lineEs=ni<0?"Capítulo completo. ¿Un repaso?":ni===0&&!S.lessons[lessons()[0].id]?"Tu primera lección está lista.":x>=GOAL?"Has cumplido el objetivo de hoy. ¡Genial!":"¿Seguimos?";
 return `<div class="bd-gaur"><div class="bd-col">
 <section class="bd-hello"><div class="bd-hello-bira">${bira(x>=GOAL?"celebrate":"hello","bd-bira-md")}</div><div class="bd-bubble"><strong>${esc(g)} ${esc(line)}</strong>${help()?`<small>${esc(gEs)} ${esc(lineEs)}</small>`:""}</div></section>
 ${todayCard()}${tools()}</div><div class="bd-col bd-side">
 <section class="bd-stats" aria-label="Zure aurrerapena"><div class="bd-goal">${ring(x,GOAL)}<span>${x>=GOAL?svg("check","bd-goal-ok"):`<b>${x}</b>/${GOAL}`}</span></div><div><strong>Eguneko helburua</strong><small>${x>=GOAL?"Lortuta! Ederki.":`${GOAL-x} XP falta dira`}</small></div><div class="bd-stat bd-stat-fire">${svg("fire")}<b>${sk}</b><small>egun</small></div><div class="bd-stat">${svg("star")}<b>${totalStars()}</b><small>izar</small></div></section>
 <button class="bd-maplink" onclick="go(3)">${svg("map")}<span><strong>${esc(island().title)} · ${esc(island().level)}</strong><small>Ikusi nire bidea</small></span>${svg("arrow")}</button>
 ${auditPanel()}</div></div>`}
/* Bidea dagoenean, hasierako pantaila garbia da: gomendioa bakarrik. */
function focused(){return true}
function isAuditor(){syncState();return !!S.auditor}

/* ---------- Bidea (mapa + aurrerapena bateratuta) ---------- */
function islandPath(I){const cur=I.id===S.level,ls=I.chapters[0].lessons,ni=cur?nextLesson():-1;
 return `<div class="bd-chapter is-open"><div class="bd-ch-head"><span class="bd-ch-n">1</span><div><strong>${esc(I.chapters[0].title)}</strong>${help()?`<small>${esc(I.chapters[0].es)}</small>`:""}</div><span class="bd-chip">${ls.filter(l=>done(l.id)).length}/${ls.length}</span></div>
  <ol class="bd-path">${ls.map((l,i)=>{const st=S.lessons[l.id],open=cur&&unlocked(i),now=i===ni;return `<li class="bd-node${st?" is-done":""}${now?" is-now":""}${open?"":" is-locked"}${l.challenge?" is-boss":""}" style="--i:${i}"><button class="bd-dot" ${open?`onclick="HBBidea.start(${i})"`:"disabled"} aria-label="${esc(l.title)}${open?"":" (blokeatuta)"}">${open?(l.challenge?svg("flag"):st?svg("check"):svg("play")):svg("lock")}</button><span class="bd-label">${esc(l.title)}${help()?`<small>${esc(l.es)}</small>`:""}${st?`<span class="bd-stars">${"★".repeat(st.stars)}${"☆".repeat(3-st.stars)}</span>`:""}</span></li>`}).join("")}</ol></div>
  ${I.chapters.slice(1).map((c,i)=>`<div class="bd-chapter is-locked"><div class="bd-ch-head"><span class="bd-ch-n">${i+2}</span><div><strong>${esc(c.title)}</strong>${help()?`<small>${esc(c.es)}</small>`:""}</div><span class="bd-chip">${svg("lock")} Laster</span></div></div>`).join("")}`}
function bidea(){applyLevel();if(!S.level)return `<div class="bd-mapa">${onboarding()}</div>`;const I=island(),other=DATA.islands.filter(x=>x.id!==I.id),ls=lessons(),d=ls.filter(l=>done(l.id)),sk=streak(),ni=nextLesson(),keys=[...new Set(d.flatMap(l=>l.keys))];
 return `<div class="bd-mapa">
 <section class="bd-card bd-ni-head"><div>${bira(d.length?"calm":"curious","bd-bira-md")}</div><div><span class="bd-kicker">${esc(I.level)} · ZURE BIDEA</span><h1>${esc(I.title)}</h1><p>${esc(chapter().title)}: ${d.length}/${ls.length} ikasgai</p>
  <div class="bd-ni-bar"><span style="width:${Math.round(d.length/ls.length*100)}%"></span></div></div></section>
 <section class="bd-ni-stats">${[[svg("bolt"),S.xp,"XP guztira"],[svg("star"),totalStars(),"izar"],[svg("fire"),sk,"egun jarraian"],[svg("check"),Object.keys(S.days).filter(k=>S.days[k]>0).length,"egun ikasten"]].map(([i,n,l])=>`<div>${i}<b>${n}</b><small>${l}</small></div>`).join("")}</section>
 <section class="bd-card bd-island bd-island-${I.id}">${islandPath(I)}</section>
 <section class="bd-card"><span class="bd-kicker">LANDU DITUZU</span>${keys.length?`<div class="bd-mastered">${keys.map(k=>`<span class="bd-key"><b>${esc(k)}</b>${help()&&DATA.gloss[k.toLowerCase()]?`<small>${esc(DATA.gloss[k.toLowerCase()])}</small>`:""}</span>`).join("")}</div>`:`<p class="bd-note">Egin zure lehen ikasgaia, eta hemen agertuko dira landutako hitzak eta egiturak.</p>`}
  ${ni>=0?`<button class="bd-btn bd-btn-main bd-ni-go" onclick="HBBidea.start(${ni})">${svg("play")} Hurrengoa: ${esc(ls[ni].title)}</button>`:""}</section>
 ${other.map(o=>`<section class="bd-card bd-switch"><div><span class="bd-kicker">${esc(o.level)}</span><strong>${esc(o.title)}</strong><small>${esc(o.blurb)}</small></div><button class="bd-btn bd-btn-small bd-btn-ghost" onclick="HBBidea.setLevel('${o.id}')">Aldatu maila</button></section>`).join("")}
 <div class="bd-bidea-foot"><button class="bd-linkbtn" onclick="HBBidea.startTest()">Egin berriro maila-proba</button>${root.HBData?.isRemote?.()?"":`<button class="bd-linkbtn bd-linkbtn-muted" onclick="reset()">Tokiko datuak ezabatu</button>`}</div></div>`}
function mapa(){return bidea()}
function ni(){return bidea()}

/* ---------- Ikasgaia ---------- */
let player=null;
function ensureEl(){let el=document.getElementById("bd-player");if(!el){el=document.createElement("div");el.id="bd-player";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Ikasgaia");document.body.appendChild(el)}document.documentElement.classList.add("bd-lock");el.hidden=false;return el}
function start(i){syncState();const L=lessons()[i];if(!L||!unlocked(i))return;player={mode:"lesson",i,L,phase:"intro",queue:L.items.map(x=>({item:x,retry:false})),pos:0,first:0,errors:new Set(),combo:0,best:0,xp:0,state:null,quit:false};
 const el=ensureEl();render();el.focus?.()}
function startTest(){syncState();player={mode:"test",phase:"play",queue:DATA.placement.map(x=>({item:x})),pos:0,score:0,row:0,state:null,quit:false,xp:0,combo:0};player.state=fresh(cur());const el=ensureEl();render();el.focus?.()}
function close(silent){const el=document.getElementById("bd-player");if(el){el.hidden=true;el.innerHTML=""}document.documentElement.classList.remove("bd-lock");player=null;if(!silent)refresh()}
function askQuit(){if(!player)return;if(player.phase!=="play"||player.mode==="test"){close();return}player.quit=!player.quit;render()}
function cur(){return player.queue[player.pos]}
function fresh(entry){const it=entry.item,st={sel:null,typed:"",tiles:[],picked:[],tapped:null,mistap:false,checked:false,ok:false};
 if(it.t==="chips")st.opts=chipsFor(it,DATA.groups);
 if(it.t==="mc")st.opts=player&&player.mode==="test"?shuffle(it.ch):it.ch;
 if(it.t==="build"){const t=tilesFor(it.a[0]);if(it.x)t.push(it.x);st.tiles=shuffle(t.map((w,k)=>({w,k})));}
 if(it.t==="fix"){st.tokens=fixTokens(it);st.opts=fixOptions(it,DATA.groups)}
 if(it.t==="match"){st.right=shuffle(it.pairs.map((p,k)=>k));st.left=null;st.matched=[];st.flash=null}
 return st}
function render(){const el=document.getElementById("bd-player");if(!el||!player)return;const at=player.mode+player.phase+":"+player.pos;if(el.dataset.at!==at){el.dataset.at=at;el.scrollTop=0}el.dataset.level=S.level||"a1a2";
 el.innerHTML=player.phase==="intro"?intro():player.phase==="end"?end():player.phase==="placed"?placed():play();
 const f=el.querySelector("[data-focus]");if(f)f.focus({preventScroll:true})}
function top(){const total=player.queue.length,p=player.phase==="end"||player.phase==="placed"?1:player.pos/total;return `<header class="bd-ptop"><button class="bd-x" onclick="HBBidea.askQuit()" aria-label="Itxi">${svg("x")}</button><div class="bd-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${player.pos}"><span style="width:${Math.round(p*100)}%"></span></div>${player.mode==="test"?`<span class="bd-xp">${Math.min(player.pos+1,total)}/${total}</span>`:player.combo>=3?`<span class="bd-combo">${svg("bolt")}${player.combo}</span>`:`<span class="bd-xp">${player.xp} XP</span>`}</header>`}

/* Ikasgaiaren sarrera: elkarrizketa + «giltzak» bisualki */
function learnHtml(L){
 if(L.learn==="cases")return `<div class="bd-cases">${L.keys.map(k=>{const c=caseInfo(k);return `<div class="bd-case ${c.cls}">${svg(c.ico)}<span class="bd-case-tag">${c.tag}</span><b>${caseWord(k)}</b>${help()&&DATA.gloss[k]?`<small>${esc(DATA.gloss[k])}</small>`:""}</div>`}).join("")}</div>`;
 if(L.learn==="words"){const ic={mendia:"mountain",basoa:"trees",erreka:"river",bidea:"path",zubia:"bridge"};return `<div class="bd-words">${L.keys.map(k=>`<div class="bd-word-card">${svg(ic[k]||"star")}<b>${esc(k)}</b>${help()&&DATA.gloss[k]?`<small>${esc(DATA.gloss[k])}</small>`:""}</div>`).join("")}</div>`}
 if(L.learn==="table"){const rows=[["baso","basoan","basora","basotik"],["eskola","eskolan","eskolara","eskolatik"],["parke","parkean","parkera","parketik"]];
  return `<table class="bd-table"><thead><tr><th></th><th class="c-in">${svg("pin")}NON?</th><th class="c-to">${svg("into")}NORA?</th><th class="c-from">${svg("outof")}NONDIK?</th></tr></thead><tbody>${rows.map(r=>`<tr><th>${esc(r[0])}</th>${r.slice(1).map(w=>`<td>${caseWord(w)}</td>`).join("")}</tr>`).join("")}</tbody></table>`}
 if(L.learn==="order")return `<div class="bd-order">${L.keys.map((k,i)=>`<span><i>${i+1}</i><b>${esc(k)}</b>${help()&&DATA.gloss[k]?`<small>${esc(DATA.gloss[k])}</small>`:""}</span>`).join(svg("arrow"))}</div>`;
 /* B1–B2: lokailuen norabidea */
 const seen=new Set(),rows=[];for(const k of L.keys){const g=k==="-lako"?"lako":groupOf(k,DATA.groups);if(!g||seen.has(g))continue;seen.add(g);rows.push([k,DATA.patterns[g]])}
 return `<div class="bd-flows">${rows.map(([k,p])=>flow(p,k)).join("")}</div>`}
function flow(p,k,compact){const kk=k&&k!=="-lako"?caseLike(k,true)+",":p.k;
 return `<div class="bd-flow bd-flow-${p.dir}${compact?" is-compact":""}"><span class="bd-flow-tag">${p.dir==="back"?"←":p.dir==="cross"?"⇄":"→"} ${esc(p.tag)}</span><div class="bd-flow-row"><span class="bd-flow-a">${esc(p.a)}</span>${kk?`<b class="bd-flow-k">${esc(kk)}</b>`:""}<span class="bd-flow-b">${esc(p.b)}</span></div>${compact?"":`<small>${esc(p.why)}${help()?` · <i>${esc(p.es)}</i>`:""}</small>`}</div>`}
function sceneHtml(L){if(L.talk)return `<div class="bd-talk">${L.talk.map(([w,t,es],k)=>`<div class="bd-say${w==="bira"?" is-bira":""}" style="--k:${k}">${face(w)}<div><small class="bd-who">${esc((DATA.cast[w]||{}).name||w)}</small><p>${esc(t)}</p>${help()?`<small class="bd-es">${esc(es)}</small>`:""}</div></div>`).join("")}</div>`;
 return `<div class="bd-scene">${bira("curious","bd-bira-lg")}<div class="bd-bubble bd-bubble-big"><p>${esc(L.scene)}</p>${help()?`<small>${esc(L.sceneEs)}</small>`:""}</div></div>`}
function intro(){const L=player.L;return `<div class="bd-pwrap">${top()}<main class="bd-intro">
 <span class="bd-kicker">${esc(chapter().title.toUpperCase())} · ${L.n}. IKASGAIA</span><h1>${esc(L.title)}</h1>${help()?`<p class="bd-es">${esc(L.es)}</p>`:""}
 ${sceneHtml(L)}${L.map?`<div class="bd-mapwrap">${MAPS[L.map]}</div>`:""}
 <div class="bd-keys"><span class="bd-kicker">GAURKO GILTZAK</span>${learnHtml(L)}<p class="bd-tip">${svg("bolt")}<span>${esc(L.tip)}${help()?`<small>${esc(L.tipEs)}</small>`:""}</span></p></div>
 </main><footer class="bd-pfoot"><button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.begin()">Goazen! ${svg("arrow")}</button></footer></div>`}
function begin(){player.phase="play";player.pos=0;player.state=fresh(cur());render()}
const TYPE={mc:"Aukeratu erantzun egokia",gap:"Idatzi falta dena",chips:"Osatu esaldia",fix:"Aurkitu akatsa eta zuzendu",build:"Eraiki esaldia",match:"Lotu bikoteak",write:"Zure txanda: idatzi"};
const TYPE_B={mc:"Aukeratu lokailu egokia",gap:"Idatzi falta den lokailua",build:"Eraiki esaldi berria"};
function blankHtml(q,fill){const parts=esc(q).split("____");return parts.join(`<span class="bd-blank${fill?" is-filled":""}">${fill?esc(fill):"&nbsp;"}</span>`)}
function optBtns(opts,it,st,cls=""){return `<div class="bd-opts${cls}">${opts.map((o,k)=>{let c="";if(st.checked){if(isAccepted(o,it.a))c=" is-right";else if(o===st.sel)c=" is-wrong"}else if(o===st.sel)c=" is-sel";return `<button class="bd-opt${c}" ${st.checked?"disabled":""} onclick="HBBidea.sel(${jq(o)})"><kbd>${k+1}</kbd>${esc(o)}</button>`}).join("")}</div>`}
function body(){const it=cur().item,st=player.state,dis=st.checked?"disabled":"";const mp=it.map?`<div class="bd-mapwrap is-small">${MAPS[it.map]}</div>`:"";
 if(it.t==="mc"||it.t==="chips"){return `${mp}<p class="bd-q">${blankHtml(it.q,st.sel)}</p>${optBtns(st.opts,it,st,it.t==="chips"&&!it.ch?" bd-chips":it.t==="chips"?" bd-chips bd-chips-3":"")}`}
 if(it.t==="gap")return `${mp}<p class="bd-q">${blankHtml(it.q,st.typed&&st.checked?st.typed:"")}</p>${it.h?`<p class="bd-hint">${svg("bolt")}${esc(it.h)}</p>`:""}<form class="bd-type" onsubmit="event.preventDefault();HBBidea.check()"><label class="bd-sr" for="bd-in">Zure erantzuna</label><input id="bd-in" data-focus autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Idatzi hemen…" value="${esc(st.typed)}" ${dis} oninput="HBBidea.typed(this.value)" class="${st.checked?(st.ok?"is-right":"is-wrong"):""}"></form>`;
 if(it.t==="build"){const used=new Set(st.picked);return `${mp}<p class="bd-src">${esc(it.q)}</p><p class="bd-instr">${it.instr?esc(it.instr):`Erabili <b>«${esc(it.k)}»</b> eta idatzi berriro bi esaldi gisa.`}</p><div class="bd-line${st.checked?(st.ok?" is-right":" is-wrong"):""}" aria-live="polite">${st.picked.length?st.picked.map(k=>{const t=st.tiles.find(x=>x.k===k);return `<button class="bd-tile is-placed" ${dis} onclick="HBBidea.untile(${k})">${esc(t.w)}</button>`}).join(""):`<span class="bd-ph">Sakatu fitxak ordenan</span>`}</div><div class="bd-bank">${st.tiles.map(t=>`<button class="bd-tile${used.has(t.k)?" is-used":""}" ${dis||used.has(t.k)?"disabled":""} onclick="HBBidea.tile(${t.k})">${esc(t.w)}</button>`).join("")}</div>`}
 if(it.t==="fix"){return `${mp}<p class="bd-instr${st.mistap?" bd-warn":""}" aria-live="polite">${st.tapped===null?(st.mistap?"Ez da hori. Begiratu berriro.":"Sakatu gaizki dagoen hitza."):"Ondo! Zein hitz jarri behar da?"}</p><p class="bd-q bd-fixq${st.mistap?" bd-shake":""}">${st.tokens.map((w,k)=>{const isW=w===it.w;let c="";if(st.tapped!==null&&isW)c=" is-struck";return `<button class="bd-word${c}" ${st.tapped!==null||st.checked?"disabled":""} onclick="HBBidea.tap(${k})">${esc(w)}</button>`}).join(" ")}</p>${st.tapped!==null?optBtns(st.opts,{a:[it.r]},st," bd-chips bd-chips-3"):""}`}
 if(it.t==="match"){return `${mp}<p class="bd-instr">${esc(it.q)}</p><div class="bd-match${it.pairs.some(p=>p[1].length>16)?" is-long":""}"><div>${it.pairs.map((p,k)=>{const m=st.matched.includes(k);return `<button class="bd-m bd-m-l${m?" is-done":""}${st.left===k?" is-sel":""}${st.flash&&st.flash[0]===k?" is-bad":""}" ${m||st.checked?"disabled":""} onclick="HBBidea.mL(${k})">${esc(p[0])}</button>`}).join("")}</div><div>${st.right.map(k=>{const m=st.matched.includes(k),p=it.pairs[k];return `<button class="bd-m bd-m-r${m?" is-done":""}${st.flash&&st.flash[1]===k?" is-bad":""}" ${m||st.checked?"disabled":""} onclick="HBBidea.mR(${k})">${esc(p[1])}</button>`}).join("")}</div></div>`}
 if(it.t==="write"){return `${mp}<p class="bd-q bd-q-sm">${esc(it.q)}</p><p class="bd-instr">${esc(it.instr)}</p><label class="bd-sr" for="bd-wr">Zure testua</label><textarea id="bd-wr" class="bd-write" rows="4" data-focus placeholder="Lehenik, etxetik…" ${dis} oninput="HBBidea.typed(this.value)">${esc(st.typed)}</textarea>${st.checked?writeChecks(st.typed):""}`}
 return ""}
function writeChecks(t){return `<ul class="bd-checks">${writeCheckList(t).map(([l,ok])=>`<li class="${ok?"is-ok":""}">${svg(ok?"check":"x")}${esc(l)}</li>`).join("")}</ul>`}
function ready(){const it=cur().item,st=player.state;if(it.t==="gap")return !!st.typed.trim();if(it.t==="write")return st.typed.trim().length>=10;if(it.t==="build")return st.picked.length>0;if(it.t==="fix")return st.tapped!==null&&!!st.sel;if(it.t==="match")return st.matched.length===it.pairs.length;return !!st.sel}
function auditBox(){if(!S.auditor)return "";const it=cur().item,a=AUD[it.id]||{};return `<aside class="bd-audit"><div class="bd-audit-h"><span class="bd-kicker">IKUSKARITZA</span><code>${esc(it.src)}</code>${it.rv?`<span class="bd-flag">Berrikusteko markatua</span>`:""}</div>
 <p><b>Onartuak:</b> ${it.a.map(esc).join(" · ")}</p>${it.ex?`<p><b>Azalpena:</b> ${esc(it.ex)}</p>`:""}
 <div class="bd-row"><button class="bd-btn bd-btn-small${a.v==="ok"?" is-on":""}" onclick="HBBidea.audit('ok')">${svg("check")} Ontzat</button><button class="bd-btn bd-btn-small bd-btn-warn${a.v==="fix"?" is-on":""}" onclick="HBBidea.audit('fix')">Zuzentzeko</button></div>
 <label class="bd-sr" for="bd-anote">Oharra</label><textarea id="bd-anote" rows="2" placeholder="Oharra (aukerakoa)…" onchange="HBBidea.auditNote(this.value)">${esc(a.note||"")}</textarea></aside>`}
/* Feedbacka: esaldi zuzena osorik + zergatia, laburra eta bisuala. Azalpen teknikoa nahi duenarentzat. */
function feedback(){const it=cur().item,st=player.state;if(!st.checked)return "";
 const parts=solvedParts(it),key=it.t==="fix"?it.r:it.t==="build"?it.k:it.a[0],g=S.level==="b1b2"&&key?groupOf(key,DATA.groups):null,p=g&&DATA.patterns[g],gl=key&&DATA.gloss[norm(key)];
 const sentence=it.t==="write"?`<p class="bd-model"><span>Eredu bat:</span> ${esc(it.model)}</p>`:it.t==="match"?`<p class="bd-full">${it.pairs.map(p=>`<span>${esc(p[0])} <b>${esc(p[1])}</b></span>`).join(" · ")}</p>`:parts?`<p class="bd-full">${esc(parts[0])}<mark>${esc(parts[1])}</mark>${esc(parts[2])}</p>`:(st.ok?"":`<p class="bd-full"><mark>${esc(it.a[0])}</mark></p>`);
 const title=it.t==="write"?"Bikain! Zure ibilbidea idatzita.":st.msg;
 return `<section class="bd-fb ${st.ok?"is-ok":"is-bad"}" role="status" aria-live="assertive">${bira(st.ok?(Math.random()<.5?"celebrate":"calm"):"retry","bd-bira-sm")}<div><strong>${esc(title)}</strong>${sentence}
 ${p?`<p class="bd-why">${esc(p.why)}</p>${flow(p,g==="lako"?"":key,true)}`:it.t==="write"?"":`<p class="bd-why">${esc(it.ex)}</p>`}
 ${help()&&gl?`<small class="bd-es">ES · ${esc(key)} = ${esc(gl)}</small>`:""}
 ${p&&it.ex?`<details class="bd-more-ex"><summary>Azalpen osoa</summary><p>${esc(it.ex)}</p></details>`:it.t==="write"?`<p class="bd-why">${esc(it.ex)}</p>`:""}</div></section>`}
function play(){const it=cur().item,st=player.state,test=player.mode==="test";const label=test?"MAILA-PROBA":(S.level==="b1b2"&&TYPE_B[it.t])||TYPE[it.t];
 return `<div class="bd-pwrap">${top()}${player.quit?`<div class="bd-quit"><p><strong>Irten nahi duzu?</strong> Ikasgai honetako aurrerapena galduko da.</p><div class="bd-row"><button class="bd-btn bd-btn-small bd-btn-ghost" onclick="HBBidea.close()">Bai, irten</button><button class="bd-btn bd-btn-small" onclick="HBBidea.askQuit()">Jarraitu</button></div></div>`:""}
 <main class="bd-item bd-t-${it.t}${st.checked?(st.ok?" bd-pop":" bd-shake"):""}"><div class="bd-ihead">${cur().retry?`<span class="bd-chip bd-chip-retry">Errepasoa</span>`:""}<span class="bd-kicker">${esc(label)}</span>${test?`<span class="bd-chip">Ez dago akatsik: zure abiapuntua bilatzen ari gara</span>`:""}</div>${body()}</main>
 ${test?"":feedback()+auditBox()}
 ${test?`<footer class="bd-pfoot"><button class="bd-btn bd-btn-ghost" onclick="HBBidea.dunno()">Ez dakit</button></footer>`:`<footer class="bd-pfoot">${st.checked?`<button class="bd-btn bd-btn-main ${st.ok?"":"bd-btn-bad"}" data-focus onclick="HBBidea.next()">Jarraitu ${svg("arrow")}</button>`:it.t==="match"?"":`<button class="bd-btn bd-btn-main" ${ready()?"":"disabled"} ${it.t==="gap"||it.t==="write"?"":"data-focus"} onclick="HBBidea.check()">Egiaztatu</button>`}</footer>`}</div>`}
function sel(o){const st=player.state;if(st.checked)return;st.sel=o;sfx("tap");if(player.mode==="test"){testAnswer(isAccepted(o,cur().item.a));return}if(cur().item.t==="fix"){render();return}render()}
function typed(v){player.state.typed=v;const b=document.querySelector(".bd-pfoot .bd-btn-main");if(b)b.disabled=!ready()}
function tile(k){const st=player.state;if(st.checked||st.picked.includes(k))return;st.picked.push(k);sfx("tap");render()}
function untile(k){const st=player.state;if(st.checked)return;st.picked=st.picked.filter(x=>x!==k);render()}
function tap(k){const st=player.state,it=cur().item;if(st.checked||st.tapped!==null)return;if(st.tokens[k]===it.w){st.tapped=k;st.mistap=false;sfx("tap")}else{st.mistap=true;cur().miss=true;sfx("bad")}render()}
function mL(k){const st=player.state;if(st.checked||st.matched.includes(k))return;st.left=k;st.flash=null;sfx("tap");render()}
function mR(k){const st=player.state;if(st.checked||st.left===null||st.matched.includes(k))return;if(k===st.left){st.matched.push(k);st.left=null;st.flash=null;if(st.matched.length===cur().item.pairs.length){check();return}sfx("tap")}else{st.flash=[st.left,k];st.left=null;cur().miss=true;sfx("bad")}render()}
function check(){if(!player||player.phase!=="play")return;const e=cur(),it=e.item,st=player.state;if(st.checked||!ready())return;
 let ok=false;if(it.t==="gap")ok=isAccepted(st.typed,it.a);else if(it.t==="write")ok=true;else if(it.t==="build")ok=isAccepted(st.picked.map(k=>st.tiles.find(t=>t.k===k).w).join(" "),it.a);else if(it.t==="fix")ok=norm(st.sel)===norm(it.r)&&!e.miss;else if(it.t==="match")ok=!e.miss;else ok=isAccepted(st.sel,it.a);
 st.checked=true;st.ok=ok;
 if(ok){player.combo++;player.best=Math.max(player.best,player.combo);const gain=e.retry?5:10;player.xp+=gain;if(!e.retry&&!player.errors.has(it.id))player.first++;st.msg=pick(PRAISE)+` +${gain} XP`;sfx("ok")}
 else{player.combo=0;player.errors.add(it.id);if(!e.retry)player.queue.push({item:it,retry:true});st.msg=pick(OOPS);sfx("bad")}
 render();const fb=document.querySelector("#bd-player .bd-fb");if(fb&&fb.scrollIntoView)fb.scrollIntoView({block:"nearest",behavior:"smooth"})}
function next(){if(!player)return;player.pos++;if(player.pos>=player.queue.length){finish();return}player.state=fresh(cur());render()}
function finish(){const L=player.L,total=L.items.length,stars=starsFor(player.first,total),bonus=L.challenge?40:20;player.xp+=bonus;player.stars=stars;player.bonus=bonus;
 const prev=S.lessons[L.id]||{};S.lessons[L.id]={stars:Math.max(stars,prev.stars||0),best:Math.max(player.first,prev.best||0),runs:(prev.runs||0)+1,at:Date.now()};
 S.xp+=player.xp;S.days[today()]=(S.days[today()]||0)+player.xp;save();
 try{root.HBData?.activity?.({kind:"bidea_lesson",item:L.id,answer:String(stars)})}catch{}
 player.phase="end";sfx("done");render()}
function end(){const L=player.L,ni=nextLesson(),total=L.items.length,s=player.stars;
 const msg=s===3?"Ikasgai bikaina!":s===2?"Oso ondo!":"Eginda! Errepasoak lagunduko dizu.";
 return `<div class="bd-pwrap bd-endwrap">${top()}<main class="bd-end">${s>=2?`<div class="bd-confetti" aria-hidden="true">${Array.from({length:22},(_,k)=>`<i style="--k:${k}"></i>`).join("")}</div>`:""}
 ${bira(s>=2?"celebrate":"effort","bd-bira-lg")}<h1>${msg}</h1><div class="bd-bigstars" aria-label="${s} izar">${[0,1,2].map(k=>`<span class="${k<s?"on":""}" style="--k:${k}">★</span>`).join("")}</div>
 <div class="bd-endstats"><div><b>${player.first}/${total}</b><small>lehen saiakeran</small></div><div><b>+${player.xp}</b><small>XP</small></div><div><b>${player.best}</b><small>jarraian</small></div></div>
 <div class="bd-learned"><span class="bd-kicker">IKASI DUZU</span><div>${L.keys.map(k=>`<span class="bd-key"><b>${esc(k)}</b></span>`).join("")}</div></div>
 ${player.errors.size?`<p class="bd-note">Errepasoan ${player.errors.size} ariketa landu dituzu. Hurrengoan, lehen saiakeran!</p>`:""}</main>
 <footer class="bd-pfoot">${ni>=0&&ni!==player.i?`<button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.start(${ni})">Hurrengo ikasgaia ${svg("arrow")}</button><button class="bd-btn bd-btn-ghost" onclick="HBBidea.close()">Amaitu</button>`:`<button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.close()">Amaitu</button>`}</footer></div>`}

/* ---------- Maila-proba ---------- */
function testAnswer(ok){const p=player;if(p.busy)return;p.busy=true;p.state.checked=false;if(ok){p.score++;p.row=0}else p.row++;render();
 setTimeout(()=>{p.busy=false;if(p!==player)return;p.pos++;if(p.row>=2||p.pos>=p.queue.length){p.level=placeLevel(p.score);p.phase="placed";sfx("done");render();return}p.state=fresh(cur());render()},260)}
function dunno(){if(player&&player.mode==="test")testAnswer(false)}
function placed(){const I=DATA.islands.find(x=>x.id===player.level),o=DATA.islands.find(x=>x.id!==player.level);
 return `<div class="bd-pwrap bd-endwrap">${top()}<main class="bd-end bd-placed">${bira("celebrate","bd-bira-lg")}
 <span class="bd-kicker">ZURE ABIAPUNTUA</span><h1>${esc(I.title)}</h1><span class="bd-level">${esc(I.level)}</span><p>${esc(I.blurb)}</p><p class="bd-es">${esc(I.es)}</p>
 <p class="bd-note">${player.score} erantzun zuzen. Mapan beti alda dezakezu maila.</p></main>
 <footer class="bd-pfoot"><button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.setLevel('${I.id}',true)">${svg("play")} Hasi lehen ikasgaia</button><button class="bd-btn bd-btn-ghost" onclick="HBBidea.setLevel('${o.id}',true)">Nahiago dut ${esc(o.title)} (${esc(o.level)})</button></footer></div>`}

/* ---------- Ikuskaritza ---------- */
function audit(v){syncState();const it=cur().item;AUD[it.id]={...(AUD[it.id]||{}),v,src:it.src,at:new Date().toISOString()};store(AKEY,AUD);render()}
function auditNote(t){syncState();const it=cur().item;AUD[it.id]={...(AUD[it.id]||{}),note:t.slice(0,2000),src:it.src,at:new Date().toISOString()};store(AKEY,AUD)}
function auditText(){syncState();const all=allLessons().flatMap(l=>l.items);return all.filter(i=>AUD[i.id]).map(i=>{const a=AUD[i.id];return `${a.v==="ok"?"✓":a.v==="fix"?"✎":"·"} ${i.src} | ${i.q}${a.note?"\n   Oharra: "+a.note:""}`}).join("\n")||"Oraindik ez dago oharrik."}
async function copyAudit(btn){const t=auditText();try{await navigator.clipboard.writeText(t);if(btn)btn.textContent="Kopiatuta ✓"}catch{const w=document.createElement("textarea");w.value=t;document.body.appendChild(w);w.select();try{document.execCommand("copy");if(btn)btn.textContent="Kopiatuta ✓"}catch{}w.remove()}}
function auditor(on){syncState();S.auditor=!!on;save();refresh()}

document.addEventListener("keydown",e=>{if(!player)return;const tag=e.target&&e.target.tagName;if(e.key==="Escape"){askQuit();return}
 if(/^[1-4]$/.test(e.key)&&tag!=="INPUT"&&tag!=="TEXTAREA"&&player.phase==="play"){const b=document.querySelectorAll("#bd-player .bd-opt:not([disabled])")[+e.key-1];if(b){e.preventDefault();b.click()}return}
 if(e.key==="Enter"&&tag!=="TEXTAREA"){const b=document.querySelector("#bd-player .bd-pfoot .bd-btn-main:not([disabled])");if(b&&tag!=="BUTTON"){e.preventDefault();b.click()}}});
applyLevel();
root.HBBidea={...api,gaur,bidea,mapa,ni,focused,isAuditor,start,startTest,begin,close,askQuit,sel,typed,tile,untile,tap,mL,mR,check,next,dunno,setLevel,toggleHelp,toggleSound,audit,auditNote,copyAudit,auditor,auditText,reset,_state:()=>{syncState();return S},_player:()=>player};
if(document.readyState!=="loading")applyLevel();else document.addEventListener("DOMContentLoaded",applyLevel);
})(typeof window!=="undefined"?window:globalThis);
