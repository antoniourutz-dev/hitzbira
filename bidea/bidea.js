/* HitzBira · Bidea 0.3: maila-proba, Gaur (errepaso banatuarekin), Bidea (kapitulu anitz) eta ikasgai-erreproduzitzailea (pista + 2. saiakera).
   Ez dago adin-hautatzailerik: ikaslearen mailak (A1–A2 / B1–B2) erabakitzen du zein uharte ikusten duen.
   app.js-ek deitzen ditu: HBBidea.gaur(), HBBidea.bidea(), HBBidea.focused(), HBBidea.isAuditor().
   Aurrerapena gailu honetan gordetzen da (hitzbira-bidea-v1). Ikuskatzailearen oharrak ere bai (hitzbira-bidea-audit-v1). */
(function(root){
"use strict";
const KEY="hitzbira-bidea-v1",AKEY="hitzbira-bidea-audit-v1",GOAL=30,REVIEW_DAYS=[1,3,7,14,30],DAY_MS=86400000;

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
function tilesFor(sentence){const words=sentence.split(/\s+/).filter(Boolean),out=[];for(let i=0;i<words.length;i++){const w=words[i],nx=words[i+1];if(nx&&/^(izan|hala|esate|nahiz)$/i.test(w)&&/^(ere|baterako|eta),?$/i.test(nx)){out.push(w+" "+nx);i++}else out.push(w)}return out}
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
function writeCheckList(t,kind){const s=String(t||"");
 if(kind==="nornork")return [["NOR ekintza (naiz / gara / da / dira)",/\b(naiz|zara|da|gara|zarete|dira)\b/i],["NOR-NORK ekintza (dut / ditut / dugu / du / dute)",/\b(dut|ditut|duzu|dituzu|du|ditu|dugu|ditugu|duzue|dituzue|dute|dituzte)\b/i],["Bi esaldi gutxienez",/[^\s.!?]+[.!?]\s+[^\s.!?]+/]].map(([l,re])=>[l,re.test(s)]);
 return [["Abiapuntua (-tik)",/\p{L}{2,}tik\b/iu],["Geldialdia (-n)",/\b(?!(?:izan|eman|esan|edan|jan|joan|egon|zen|duen|den|nuen|zuen|baina)\b)\p{L}{3,}(?:an|ean)\b/iu],["Helmuga (-ra)",/\b(?!(?:gara|zara|dira|atera|euskara|bira|aurrera|hara|gura)\b)\p{L}{3,}ra\b/iu],["Ordena (lehenik, gero, azkenik)",/\b(lehenik|gero|azkenik|ondoren|bukatzeko)\b/i]].map(([l,re])=>[l,re.test(s)])}
/* Pista progresiboa: erantzuna zuzenean eman gabe lagundu. */
function hintFor(item,groups,patterns){
 if(!item)return "";
 if(item.hint)return item.hint;
 if(item.h)return "Begiratu pistari: "+item.h+".";
 const key=item.t==="fix"?item.r:item.t==="build"?item.k:(item.a&&item.a[0]);
 const g=key&&groups?groupOf(key,groups):null;
 if(g&&patterns&&patterns[g]?.why)return patterns[g].why;
 if(item.t==="fix")return "Irakurri esaldia osorik eta pentsatu zein hitzek ematen dion zentzu egokia.";
 if(item.t==="build")return "Hasi lehen ideiarekin eta ordenatu hitzak poliki.";
 return "Irakurri esaldia osorik eta begiratu aditzari eta esanahiari."}
/* Errepaso banatua: 1 · 3 · 7 · 14 · 30 egun, izar eta errepaso kopuruaren arabera. */
function dueReviews(lessonsState,lessonList,now=Date.now()){
 const out=[];
 for(const L of lessonList||[]){
  const st=lessonsState&&lessonsState[L.id];
  if(!st||!st.stars||!st.at)continue;
  const base=Math.min(2,Math.max(0,(st.stars||1)-1)),step=Math.min(REVIEW_DAYS.length-1,base+(st.reviews||0));
  const last=st.reviewAt||st.at,wait=REVIEW_DAYS[step]*DAY_MS,overdue=now-last-wait;
  if(overdue>=0)out.push({lesson:L,overdue,days:REVIEW_DAYS[step]});
 }
 return out.sort((a,b)=>b.overdue-a.overdue);
}
const api={norm,isAccepted,groupOf,capitalFor,chipsFor,tilesFor,fixTokens,fixOptions,starsFor,placeLevel,greetingFor,solvedParts,writeCheckList,hintFor,dueReviews};
if(typeof module!=="undefined"&&module.exports){module.exports=api;return}

/* ---------- Egoera ---------- */
const DATA=root.HB_BIDEA;if(!DATA)return;
const POSES={hello:"bira_00_ongietorria_v02.svg",surprise:"bira_01_harridura_v02.svg",curious:"bira_02_jakin-mina_v02.svg",sad:"bira_03_tristura-arina_v02.svg",retry:"bira_04_berriro-saiatu_v02.svg",celebrate:"bira_05_ospakizuna_v02.svg",wink:"bira_06_keinua_v02.svg",effort:"bira_07_ahalegina_v02.svg",calm:"bira_08_poztasun-lasaia_v02.svg"};
const PRAISE=["Bikain!","Ederki!","Hori da!","Primeran!","Zuzen-zuzen!","Oso ondo!"],OOPS=["Ia-ia!","Ez da hori, baina gertu zaude.","Lasai: amaieran berriro agertuko da."];
const keyFor=k=>root.HBData?.keyFor?root.HBData.keyFor(k):k;
function load(k,d){try{const v=JSON.parse(localStorage.getItem(keyFor(k))||"null");return v&&typeof v==="object"?v:d}catch{return d}}
function store(k,v){try{localStorage.setItem(keyFor(k),JSON.stringify(v))}catch{}}
let S={},AUD={},loadedKey=null;
function syncState(){const k=keyFor(KEY);if(loadedKey===k)return;loadedKey=k;let dirty=false;const remote=root.HBData?.isRemote?.()?root.HBData?.loadBidea?.():null;S=remote||load(KEY,{});S.lessons=S.lessons||{};S.days=S.days||{};S.xp=S.xp||0;
 /* 0.1 bertsioko adin-profila mailara pasatu */
 if(!S.level&&S.profile){S.level=S.profile==="haurra"?"a1a2":"b1b2";dirty=true}if("profile" in S||"picking" in S){delete S.profile;delete S.picking;dirty=true}
 if(S.sound===undefined)S.sound=true;
 AUD=load(AKEY,{});
 try{const p=new URLSearchParams(location.search);if(p.has("ikuskatu")||p.has("auditor")){const next=(p.get("ikuskatu")||p.get("auditor"))!=="0";if(S.auditor!==next){S.auditor=next;dirty=true}}}catch{}
 if(dirty)store(KEY,S)}
const save=(localOnly=false)=>{syncState();store(KEY,S);if(!localOnly&&root.HBData?.isRemote?.()&&root.HBData?.saveBidea){try{root.HBData.saveBidea(S)}catch(e){console.warn("Bidea: sinkronizazioaren zain",e.message)}}};
function reset(){if(root.HBData?.isRemote?.())return;try{localStorage.removeItem(keyFor(KEY));localStorage.removeItem(keyFor(AKEY))}catch{}loadedKey=null;player=null;syncState();applyLevel()}
syncState();
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const jq=v=>esc(JSON.stringify(v));
const today=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const help=()=>S.help==="es";
const pick=a=>a[Math.floor(Math.random()*a.length)];
const bira=(pose,cls="")=>`<img class="bd-bira ${cls}" src="/assets/bira/${POSES[pose]||POSES.hello}" alt="" width="400" height="400" decoding="async" aria-hidden="true">`;
const ICONS={map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>',star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',play:'<path d="M8 5v14l11-7z"/>',check:'<path d="m5 12 5 5L20 7"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',bolt:'<path d="m13 2-9 12h7l-1 8 10-12h-7z"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',flag:'<path d="M5 21V4h11l-2 4 2 4H5"/>',sound:'<path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',mute:'<path d="M4 9v6h4l5 4V5L8 9zM17 9l5 6M22 9l-5 6"/>',fire:'<path d="M12.6 2.2c.3 3.2-1.9 5-3.2 6.8-1.4 1.9-2.4 3.5-2.4 5.7a5.8 5.8 0 0 0 11.7-.2c0-3.3-2-5.8-3.3-7.4-.5 1.3-1.4 2-2.2 2.2.7-2.2.6-4.8-.6-7.1z"/>',pin:'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',into:'<path d="M3 12h11m-4-5 5 5-5 5"/><path d="M19 4v16"/>',outof:'<path d="M5 4v16"/><path d="M9 12h11m-4-5 5 5-5 5"/>',mountain:'<path d="m2 20 7-12 4 6 3-4 6 10z"/>',trees:'<path d="M7 3 3 11h3l-3 6h8l-3-6h3zM17 6l-3 6h2l-2 5h6l-2-5h2zM7 17v4M17 17v4"/>',river:'<path d="M2 8c3-2 5 2 8 0s5-2 8 0 4 0 4 0M2 14c3-2 5 2 8 0s5-2 8 0 4 0 4 0"/>',path:'<path d="M8 21c0-6 8-6 8-12 0-3-2-5-4-6" stroke-dasharray="3 3"/>',bridge:'<path d="M2 16h20M4 16v4M20 16v4M3 16c3-6 15-6 18 0"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',refresh:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'};
const svg=(n,c="")=>`<svg class="bd-ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||""}</svg>`;
const island=()=>DATA.islands.find(x=>x.id===S.level)||DATA.islands[0];
const playableChapters=(I=island())=>I.chapters.filter(c=>Array.isArray(c.lessons)&&c.lessons.length);
const islandLessons=(I=island())=>playableChapters(I).flatMap(c=>c.lessons);
const chapterOf=(id,I=island())=>playableChapters(I).find(c=>c.lessons.some(l=>l.id===id))||I.chapters[0];
const lessons=()=>islandLessons(island());
const allLessons=()=>DATA.islands.flatMap(i=>i.chapters.flatMap(c=>c.lessons||[]));
const done=id=>S.lessons[id]&&S.lessons[id].stars>0;
function unlocked(i){const ls=lessons(),L=ls[i];if(!L)return false;return i===0||L.n===1||done(ls[i-1].id)}
function nextLesson(){const ls=lessons();for(let i=0;i<ls.length;i++)if(!done(ls[i].id))return i;return -1}
function totalStars(){return Object.values(S.lessons).reduce((n,l)=>n+(l.stars||0),0)}
function xpToday(){return S.days[today()]||0}
function streak(){let n=0;const d=new Date();if(!S.days[today()])d.setDate(d.getDate()-1);for(;;){const k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");if(S.days[k]>0){n++;d.setDate(d.getDate()-1)}else return n}}
function refresh(){if(typeof root.draw==="function")root.draw()}
function syncSidePrefs(){const el=document.getElementById("hb-side-prefs");if(!el)return;el.innerHTML=`<button type="button" class="bd-chip-btn${help()?" is-on":""}" aria-pressed="${help()}" onclick="HBBidea.toggleHelp()" title="Laguntza gaztelaniaz">${svg("globe")} ES</button><button type="button" class="bd-chip-btn${S.sound?" is-on":""}" aria-pressed="${!!S.sound}" onclick="HBBidea.toggleSound()" aria-label="Soinua">${svg(S.sound?"sound":"mute")} ${S.sound?"Soinua":"Isila"}</button>`}
function guestLimited(){return root.HBData?.guestLimited?.()===true}
function loginForMore(){document.getElementById("hb-show-login")?.click?.()}
function applyLevel(){syncState();if(guestLimited()&&S.level&&S.level!=="a1a2"){S.level="a1a2";S.placed=false;save(true)}if(document.body)document.body.dataset.hbLevel=S.level||"none";syncSidePrefs()}
function setLevel(lv,startNow,assessed=false){syncState();if(!DATA.islands.some(x=>x.id===lv))return;if(guestLimited()&&lv!=="a1a2"){loginForMore();return}const first=!S.level||S.help===undefined;S.level=lv;if(first)S.help=lv==="a1a2"?"es":"eu";S.placed=assessed===true;save();applyLevel();if(startNow){close(true);startEpisode()}else{close(true);refresh()}}
function chooseAdventure(id,startNow=false){const route=DATA.islands.find(i=>i.adventure.id===id);if(route)setLevel(route.id,startNow,false)}
function toggleHelp(){syncState();S.help=help()?"eu":"es";save();syncSidePrefs();if(player)render();else refresh()}
function toggleSound(){syncState();S.sound=!S.sound;save();syncSidePrefs();if(S.sound)sfx("ok");refresh()}

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
function onboarding(){if(guestLimited())return `<section class="bd-card bd-welcome"><div class="bd-welcome-art">${bira("hello","bd-bira-lg")}</div><div class="bd-welcome-copy"><span class="bd-kicker">ONGI ETORRI!</span><h1>Euskara, zure abentura.</h1><p>Hasi Basorako bidearekin, konturik eta maila-probarik gabe.</p><div class="bd-welcome-cta"><button class="bd-btn bd-btn-main" onclick="HBBidea.setLevel('a1a2',true,false)">${svg("play")} Hasi abentura</button><button class="bd-btn bd-btn-ghost" onclick="HBBidea.loginForMore()">Hasi saioa</button></div><p class="bd-note">Aurrerapena nabigatzaile honetan gordeko da. Kontuarekin, beste gailuetan ere jarrai dezakezu.</p></div></section>`;const [g,gEs]=greetingFor(new Date().getHours());return `<section class="bd-card bd-welcome" aria-labelledby="bd-w-h">
 <div class="bd-welcome-art">${bira("hello","bd-bira-lg")}<span class="bd-spark s1"></span><span class="bd-spark s2"></span><span class="bd-spark s3"></span></div>
 <div class="bd-welcome-copy"><span class="bd-kicker">${esc(g.toUpperCase().replace("!",""))} · BIRA NAIZ</span><h1 id="bd-w-h">Ikas dezagun euskara, jolasean.</h1>
 <p>Hasi abentura nahi duzun tokitik. Abiapuntuko proba aukerakoa da.</p><p class="bd-es">Empieza por donde quieras. Puedes descubrir tu punto de partida si quieres.</p>
 <div class="bd-welcome-cta"><button class="bd-btn bd-btn-main" onclick="HBBidea.chooseAdventure('basorako-bidea')">${svg("play")} Hasi zuzenean</button>
 <button class="bd-btn bd-btn-ghost" onclick="HBBidea.chooseAdventure('uraren-misterioa')">Beste abentura bat: HitzBira World</button>
 <button class="bd-linkbtn" onclick="HBBidea.startTest()">Zure abiapuntua ezagutu (aukerakoa)</button></div></div>
 <div class="bd-welcome-path" aria-hidden="true">${DATA.islands.map(x=>`<span><b>${esc(x.adventure.title)}</b>${esc(x.title)}</span>`).join(`<i></i>`)}</div>
</section>`}
function ring(v,max){const r=28,c=2*Math.PI*r,p=Math.min(1,v/max);return `<svg class="bd-ring" viewBox="0 0 68 68" aria-hidden="true"><circle cx="34" cy="34" r="${r}" class="bd-ring-bg"/><circle cx="34" cy="34" r="${r}" class="bd-ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p)}"/></svg>`}
function todayCard(){const I=island(),ls=lessons(),ni=nextLesson(),all=ni<0,i=all?ls.length-1:ni,L=ls[i],st=S.lessons[L.id],ch=chapterOf(L.id,I),chLs=ch.lessons||[L],posInCh=Math.max(0,chLs.findIndex(x=>x.id===L.id));
 return `<article class="bd-card bd-today">
  <div class="bd-today-body">
   <div class="bd-today-top"><span class="bd-kicker">GAURKO IKASGAIA · ${esc(I.adventure.title)}</span><span class="bd-chip">${posInCh+1}/${chLs.length}</span></div>
   <h2>${esc(L.title)}</h2>${help()?`<p class="bd-es">${esc(L.es)}</p>`:""}
   <p class="bd-meta">${esc(ch.title)} · ${L.items.length} ariketa · ~${Math.max(3,Math.round(L.items.length/2))} min${L.challenge?" · Erronka":""}</p>
   <div class="bd-pips" aria-label="Kapituluko aurrerapena">${chLs.map((x,k)=>`<span class="bd-pip${done(x.id)?" is-done":""}${k===posInCh&&!all?" is-now":""}"></span>`).join("")}</div>
   <div class="bd-today-foot"><button class="bd-btn bd-btn-main" onclick="HBBidea.start(${i})">${svg("play")} ${all?"Errepasatu":st?"Berriro egin":posInCh===0&&i===0?"Hasi ikasgaia":"Jarraitu"}</button></div>
   ${all?`<p class="bd-note">Maila honetako ikasgai guztiak osatu dituzu! Errepasatu edo probatu beste maila.</p>`:""}
  </div>
  <div class="bd-today-art" aria-hidden="true"><span class="bd-hero-halo"></span>${bira(xpToday()>=GOAL?"celebrate":"hello","bd-bira-hero")}</div>
 </article>`}
function achievementCard(){const count=Object.keys(S.episodes||{}).filter(id=>[...FOREST_IDS,...SHELTER_IDS,...EPISODE_IDS].includes(id)).length,treasures=Object.entries(S.episodes||{}).filter(([id,e])=>[...FOREST_IDS,...SHELTER_IDS,...EPISODE_IDS].includes(id)&&e?.treasure).length;const days=root.HBData?.streakSummary?.();return `<section class="bd-card bd-stats-card"><span class="bd-kicker">ZURE LORPENAK</span><div class="bd-stat-pills"><div class="bd-stat-pill">${svg("fire")}<div><b>${days?.current??"—"}</b><small>egun jarraian</small></div></div><div class="bd-stat-pill">${svg("star")}<div><b>${treasures}</b><small>altxorrak</small></div></div><div class="bd-stat-pill">${svg("flag")}<div><b>${count}</b><small>atal amaituta</small></div></div></div></section>`}
function statsCard(x,sk){const rem=Math.max(0,GOAL-x);
 return `<section class="bd-card bd-stats-card" aria-label="Zure aurrerapena">
  <div class="bd-goal-row">
   <div class="bd-goal">${ring(x,GOAL)}<span class="bd-goal-val">${x>=GOAL?svg("check","bd-goal-ok"):`<b>${x}</b><small>/${GOAL}</small>`}</span></div>
   <div class="bd-goal-copy"><span class="bd-kicker">EGUNEKO HELBURUA</span><strong>${x>=GOAL?"Helburua lortuta!":`${rem} XP falta dira`}</strong><p class="bd-goal-sub">${x>=GOAL?"Gaurko lana ederki eginda. Jarraitu nahi baduzu!":"Ikasgai 1 osatzea nahikoa da gaurko helburua betetzeko."}</p></div>
  </div>
  <div class="bd-stat-pills">
   <div class="bd-stat-pill"><span class="bd-stat-ico is-fire">${svg("fire")}</span><div><b>${sk}</b><small>egun jarraian</small></div></div>
   <div class="bd-stat-pill"><span class="bd-stat-ico is-star">${svg("star")}</span><div><b>${totalStars()}</b><small>izar guztira</small></div></div>
  </div>
 </section>`}
function courseGrid(){const I=island(),chs=playableChapters(I),ni=nextLesson();let offset=0;
 return `<section class="bd-course-section" aria-label="Zure ikastaroa">
  <div class="bd-course-head">
   <div><span class="bd-kicker">ZURE IKASTAROA · ${esc(I.adventure.title)}</span><h2>${esc(I.title)}</h2></div>
   <span class="bd-course-summary">${lessons().filter(l=>done(l.id)).length}/${lessons().length} ikasgai osatuta</span>
  </div>
  <div class="bd-course-grid">${chs.map((c,ci)=>{const startIdx=offset;offset+=c.lessons.length;const dCount=c.lessons.filter(l=>done(l.id)).length,chPct=Math.round(dCount/Math.max(1,c.lessons.length)*100);
   return `<article class="bd-card bd-course-ch"><div class="bd-course-ch-head"><span class="bd-ch-n">${ci+1}</span><div><h3>${esc(c.title)}</h3>${help()?`<small>${esc(c.es)}</small>`:""}</div><span class="bd-chip">${dCount}/${c.lessons.length}</span></div>
    <div class="bd-ch-prog" aria-hidden="true"><span style="width:${chPct}%"></span></div>
    <ul class="bd-course-list">${c.lessons.map((l,k)=>{const idx=startIdx+k,st=S.lessons[l.id],open=unlocked(idx),now=idx===ni;
     return `<li><button class="bd-course-item${st?" is-done":""}${now?" is-now":""}${open?"":" is-locked"}" ${open?`onclick="HBBidea.start(${idx})"`:"disabled"}><span class="bd-ci-ico">${open?(l.challenge?svg("flag"):st?svg("check"):svg("play")):svg("lock")}</span><span class="bd-ci-copy"><strong>${esc(l.title)}</strong>${help()?`<small>${esc(l.es)}</small>`:""}</span>${st?`<span class="bd-stars">${"★".repeat(st.stars)}${"☆".repeat(3-st.stars)}</span>`:now?`<span class="bd-ci-cta">${idx===0?"Hasi":"Jarraitu"} ${svg("arrow")}</span>`:`<span class="bd-ci-meta">${l.items.length} ariketa</span>`}</button></li>`}).join("")}</ul></article>`}).join("")}</div>
 </section>`}
function dueRecallHtml(){syncState();if(!S.level)return "";const items=dueEpisodeItems();if(!items.length)return "";return `<section class="bd-card bd-review-card bd-review-banner"><span class="bd-rev-ico" aria-hidden="true">${svg("refresh")}</span><div class="bd-rev-copy"><div class="bd-review-head"><span class="bd-kicker">GOGORATU</span><span class="bd-chip">${items.length}</span></div><h3>Ikasitakoa gogoratzeko unea</h3><p>Erronka laburrak, aurreko zailtasunei lotuta.</p></div><button class="bd-btn bd-btn-small" onclick="HBBidea.startDueRecall()">Hasi ${svg("arrow")}</button></section>`}
function startDueRecall(){applyLevel();if(!S.level)return;const items=dueEpisodeItems();if(!items.length)return;close(true);openWorldGame("recall",items)}
function reviewCard(){
 const due=dueReviews(S.lessons,lessons());
 if(due.length){const L=due[0].lesson;
  return `<section class="bd-card bd-review-card bd-review-banner"><span class="bd-rev-ico" aria-hidden="true">${svg("refresh")}</span><div class="bd-rev-copy"><div class="bd-review-head"><span class="bd-kicker">BERRIKUSTEKO UNEA</span><span class="bd-chip">${due.length}</span></div><h3>${esc(L.title)}</h3><p>5 ariketa azkar, ikasitakoa gogoratzeko.</p></div><button class="bd-btn bd-btn-small" onclick="HBBidea.startReview(${jq(L.id)})">Berrikusi ${svg("arrow")}</button></section>`}
 const ag=root.HitzBiraAgenda?.agenda?.()||[],dueAg=ag.filter(r=>r.status==="due");
 if(dueAg.length&&typeof root.startCurriculum==="function"){
  return `<section class="bd-card bd-review-card bd-review-banner"><span class="bd-rev-ico" aria-hidden="true">${svg("refresh")}</span><div class="bd-rev-copy"><div class="bd-review-head"><span class="bd-kicker">GOGORATZEKO UNEA</span><span class="bd-chip">${dueAg.length}</span></div><h3>Aurretik landutako praktika</h3><p>Saio labur bat, ikasitako egiturak finkatzeko.</p></div><button class="bd-btn bd-btn-small" onclick="HBBidea.startAgendaReview()">Berrikusi ${svg("arrow")}</button></section>`}
 return ""}
function auditPanel(){if(!S.auditor)return "";const v=Object.values(AUD),ok=v.filter(x=>x.v==="ok").length,fx=v.filter(x=>x.v==="fix").length;
 return `<section class="bd-card bd-audit-sum"><span class="bd-kicker">IKUSKATZAILE MODUA</span><p><b>${ok}</b> ontzat · <b>${fx}</b> zuzentzeko · ${allLessons().reduce((n,l)=>n+l.items.length,0)} ariketa guztira</p>
 <div class="bd-row"><button class="bd-btn bd-btn-small" onclick="HBBidea.copyAudit(this)">Kopiatu oharrak</button><button class="bd-btn bd-btn-small bd-btn-ghost" onclick="HBBidea.auditor(false)">Desaktibatu</button></div></section>`}
function tools(){return `<div class="bd-tools"><button class="bd-chip-btn${help()?" is-on":""}" aria-pressed="${help()}" onclick="HBBidea.toggleHelp()" title="Laguntza gaztelaniaz">${svg("globe")} ES</button><button class="bd-chip-btn${S.sound?" is-on":""}" aria-pressed="${!!S.sound}" onclick="HBBidea.toggleSound()" aria-label="Soinua">${svg(S.sound?"sound":"mute")}</button></div>`}
function gaur(){applyLevel();if(guestLimited()&&S.level)return `<div class="bd-gaur bd-gaur-polished"><div class="bd-desk-greet"><div><h1>Ongi etorri!</h1><p>${esc(forestTitle())} · Gonbidatua</p></div></div><div class="bd-gaur-top"><div class="bd-col">${episodeCard()}${dueRecallHtml()}${worldGamesHtml()}</div><div class="bd-col bd-side">${adventureOverview()}${collectionHtml()}${guestAccessCard()}</div></div>${forestMissionsHtml()}</div>`;if(!S.level)return `<div class="bd-gaur bd-gaur-first">${onboarding()}</div>`;
 const I=island(),x=xpToday(),[g,gEs]=greetingFor(new Date().getHours()),ni=nextLesson(),sk=streak();
 const line=ni<0?"Ikasgai guztiak eginda. Errepaso bat?":ni===0&&!S.lessons[lessons()[0].id]?"Zure lehen ikasgaia prest dago.":x>=GOAL?"Gaurko helburua lortu duzu. Zoragarri!":"Jarraitu dezagun?";
 const lineEs=ni<0?"Todas las lecciones hechas. ¿Un repaso?":ni===0&&!S.lessons[lessons()[0].id]?"Tu primera lección está lista.":x>=GOAL?"Has cumplido el objetivo de hoy. ¡Genial!":"¿Seguimos?";
 return `<div class="bd-gaur bd-gaur-polished">
 <div class="bd-desk-greet">
  <div><h1>${esc(g)}</h1><p>${esc(currentAdventureTitle())} · Jarraitu zure erritmoan</p></div>
  <div class="bd-level-switch" role="group" aria-label="Abentura aukeratu">${DATA.islands.map(o=>`<button type="button" class="bd-lvl-pill${o.id===I.id?" is-on":""}" aria-pressed="${o.id===I.id}" onclick="HBBidea.chooseAdventure('${o.adventure.id}')">${esc(o.adventure.title)}</button>`).join("")}</div>
 </div>
 <div class="bd-gaur-top">
  <div class="bd-col">
   ${episodeCard()||todayCard()}${dueRecallHtml()}${typeof root.routeSupportHtml==="function"?root.routeSupportHtml():""}${reviewCard()}${worldGamesHtml()}${tools()}
  </div>
  <div class="bd-col bd-side">
   ${root.HBData?.isRemote?.()&&root.HBData?.streakSummary?achievementCard():statsCard(x,sk)}
   ${adventureOverview()}${collectionHtml()}${auditPanel()}
  </div>
 </div>
 ${S.level==="a1a2"?forestMissionsHtml():""}
 <section class="bd-card bd-route-overview"><span class="bd-kicker">IKASI ETA PRAKTIKATU</span><h2>Lagundu zure abenturari</h2><div class="bd-row"><button class="bd-btn bd-btn-ghost" onclick="catalogRoot()">Ikasi</button><button class="bd-btn bd-btn-ghost" onclick="practiceRoot()">Praktikatu</button></div></section>
 </div>`}
/* Bidea dagoenean, hasierako pantaila garbia da: gomendioa bakarrik. */
function focused(){return true}
function isAuditor(){syncState();return !guestLimited()&&!!S.auditor}

/* ---------- Bidea (mapa + aurrerapena bateratuta) ---------- */
function islandPath(I){const cur=I.id===S.level,ni=cur?nextLesson():-1;let offset=0;
 return I.chapters.map((c,ci)=>{
  const ls=c.lessons;
  if(!Array.isArray(ls)||!ls.length)return `<div class="bd-chapter is-locked"><div class="bd-ch-head"><span class="bd-ch-n">${ci+1}</span><div><strong>${esc(c.title)}</strong>${help()?`<small>${esc(c.es)}</small>`:""}</div><span class="bd-chip">${svg("lock")} Laster</span></div></div>`;
  const startIdx=offset;offset+=ls.length;
  return `<div class="bd-chapter is-open"><div class="bd-ch-head"><span class="bd-ch-n">${ci+1}</span><div><strong>${esc(c.title)}</strong>${help()?`<small>${esc(c.es)}</small>`:""}</div><span class="bd-chip">${ls.filter(l=>done(l.id)).length}/${ls.length}</span></div>
   <ol class="bd-path">${ls.map((l,k)=>{const idx=startIdx+k,st=S.lessons[l.id],open=cur&&unlocked(idx),now=idx===ni;return `<li class="bd-node${st?" is-done":""}${now?" is-now":""}${open?"":" is-locked"}${l.challenge?" is-boss":""}" style="--i:${k}"><button class="bd-dot" ${open?`onclick="HBBidea.start(${idx})"`:"disabled"} aria-label="${esc(l.title)}${open?"":" (blokeatuta)"}">${open?(l.challenge?svg("flag"):st?svg("check"):svg("play")):svg("lock")}</button><span class="bd-label">${esc(l.title)}${help()?`<small>${esc(l.es)}</small>`:""}${st?`<span class="bd-stars">${"★".repeat(st.stars)}${"☆".repeat(3-st.stars)}</span>`:""}</span></li>`}).join("")}</ol></div>`;
 }).join("")}

function currentAdventureTitle(){return S.level==="a1a2"?forestTitle():"Uraren misterioa"}
function missionProgress(showTitle=true){
 const ids=episodeIds(),count=ids.filter(id=>S.episodes?.[id]).length;
 return '<div class="bd-mission-progress"><div class="bd-mission-progress-copy">'+(showTitle?'<span>'+esc(currentAdventureTitle())+'</span>':'')+'<strong>'+count+'/'+ids.length+' atal</strong></div><div class="bd-mission-meter" role="progressbar" aria-label="Abenturaren aurrerapena" aria-valuemin="0" aria-valuemax="'+ids.length+'" aria-valuenow="'+count+'"><span style="width:'+Math.round(count/ids.length*100)+'%"></span></div></div>'
}
function adventureOverview(){
 return '<section class="bd-card bd-route-overview"><span class="bd-kicker">ZURE BIDEA</span><h2>'+esc(currentAdventureTitle())+'</h2>'+missionProgress(false)+'<button class="bd-btn bd-btn-ghost" onclick="go(3)">'+svg("map")+' Ikusi bidea '+svg("arrow")+'</button></section>'
}
function guestAccessCard(){return `<section class="bd-card bd-account-card"><div class="bd-account-head"><span class="bd-kicker">GONBIDATUA</span>${svg("lock")}</div><h2>Gorde zure abentura</h2><p>Bi abentura prest dituzu konturik gabe. Hirugarrena prestatzen ari gara.</p><p class="bd-note">Aurrerapena nabigatzaile honetan gordetzen da. Kontuarekin beste gailu batean ere jarrai dezakezu.</p><button class="bd-btn bd-btn-ghost" onclick="HBBidea.loginForMore()">Hasi saioa ${svg("arrow")}</button></section>`}
function bidea(){applyLevel();if(guestLimited()&&S.level)return `<div class="bd-mapa bd-mapa-world bd-mapa-polished"><section class="bd-card bd-ni-head"><div>${bira("curious","bd-bira-md")}</div><div><span class="bd-kicker">ZURE BIDEA</span><h1>${esc(forestTitle())}</h1><p>Gonbidatua</p></div></section><section class="bd-card bd-island">${worldMissionHtml()}${forestMissionsHtml()}</section><div class="bd-mapa-meta">${collectionHtml()}${worldGamesHtml()}${guestAccessCard()}</div></div>`;if(!S.level)return `<div class="bd-mapa bd-mapa-first">${onboarding()}</div>`;const I=island(),other=DATA.islands.filter(x=>x.id!==I.id),ls=lessons(),d=ls.filter(l=>done(l.id)),sk=streak(),ni=nextLesson(),keys=[...new Set(d.flatMap(l=>l.keys))];
 return `<div class="bd-mapa bd-mapa-world bd-mapa-polished">
 <section class="bd-card bd-ni-head"><div>${bira(d.length?"calm":"curious","bd-bira-md")}</div><div><span class="bd-kicker">ZURE BIDEA</span><h1>${esc(currentAdventureTitle())}</h1><p>${episodeIds().filter(id=>S.episodes?.[id]).length}/${episodeIds().length} atal amaituta</p>
  <div class="bd-ni-bar"><span style="width:${Math.round(episodeIds().filter(id=>S.episodes?.[id]).length/episodeIds().length*100)}%"></span></div></div></section>
 <section class="bd-ni-stats bd-narrative-stats">${[[svg("flag"),Object.keys(S.episodes||{}).filter(id=>[...FOREST_IDS,...SHELTER_IDS,...EPISODE_IDS].includes(id)).length,"atal amaituta"],[svg("star"),Object.entries(S.episodes||{}).filter(([id,e])=>[...FOREST_IDS,...SHELTER_IDS,...EPISODE_IDS].includes(id)&&e?.treasure).length,"altxorrak"],[svg("fire"),root.HBData?.streakSummary?.()?.current??"—","egun jarraian"]].map(([i,n,l])=>`<div>${i}<b>${n}</b><small>${l}</small></div>`).join("")}</section>
 <section class="bd-card bd-island bd-island-${I.id}">${worldMissionHtml()}${S.level==="a1a2"?forestMissionsHtml():""}</section>
 ${typeof root.storyJournal==="function"?`<details class="bd-explore bd-more-adventures"><summary><span>Abentura gehiago</span><small>Itsasargiaren sekretua · Hiru kapitulu, sei bide</small></summary>${root.storyJournal()}</details>`:""}
 <div class="bd-mapa-meta">${collectionHtml()}${worldGamesHtml()}<section class="bd-card bd-route-overview"><span class="bd-kicker">IKASI ETA PRAKTIKATU</span><h2>Lagundu zure abenturari</h2><p>Azalpenak eta ariketak, zure ibilbideari lotuta.</p><button class="bd-btn bd-btn-ghost" onclick="catalogRoot()">Ikasi ${svg("arrow")}</button><button class="bd-btn bd-btn-ghost" onclick="practiceRoot()">Praktikatu ${svg("arrow")}</button></section>
 ${other.map(o=>`<section class="bd-card bd-switch"><div><span class="bd-kicker">${esc(o.adventure.title)}</span><strong>${esc(o.title)}</strong><small>${esc(o.blurb)}</small></div><button class="bd-btn bd-btn-small bd-btn-ghost" onclick="HBBidea.chooseAdventure('${o.adventure.id}')">Abentura hau aukeratu</button></section>`).join("")}
 <div class="bd-bidea-foot"><button class="bd-linkbtn" onclick="HBBidea.startTest()">Zure abiapuntua ezagutu (aukerakoa)</button>${root.HBData?.isRemote?.()?"":`<button class="bd-linkbtn bd-linkbtn-muted" onclick="reset()">Tokiko datuak ezabatu</button>`}</div></div></div>`}
function mapa(){return bidea()}
function ni(){return bidea()}

/* ---------- Ikasgaia ---------- */
let player=null;

/* First episode: original fictional adaptation of six existing public practice items. */
function episodeLesson(n=1){
 if(S.level==="a1a2")return inShelter()?shelterEpisode(n):forestEpisode(n);
 if(n===2)return secondEpisode();
 if(n===3)return thirdEpisode();
 if(n===4||n===5)return finalEpisodes(n);
 if(n!==1)return null;
 const base=allLessons().find(l=>l.id==="b1b2-k1-i1");if(!base)return null;
 const rows=[
 ["KAUS-A02-1","Argik ezin izan du urik hartu. ____, erreka ia lehor dago.",["Izan ere","Beraz","Hala ere"],["Izan ere"],"Erreka lehor egoteak azaltzen du Argik urik hartu ezin izana."],
 ["KAUS-A02-2","Iturburutik ur gutxi dator. ____, errekan ere ur gutxi dago.",["Izan ere","Horregatik","Esate baterako"],["Horregatik"],"Bigarren esaldiak lehenengoaren ondorioa ematen du."],
 ["KAUS-A02-3","Ezin gara zubitik igaro. ____, zubia hondatuta dago.",["Izan ere","Ondorioz","Hala ere"],["Izan ere"],"Zubiaren egoerak azaltzen du zergatik ezin garen igaro."],
 ["KAUS-A02-4","Iturburuko hodia hautsi da. ____, ura ez da herrira iristen.",["Zeren","Izan ere","Beraz"],["Beraz"],"Uraren falta hodiaren hausturaren ondorioa da."],
 ["KAUS-A01-1","Argik ez du arrastoa aurkitu. ____, laino handia zegoen.",null,["Izan ere"],"Lainoak azaltzen du zergatik ez duen arrastoa aurkitu."],
 ["KAUS-A01-2","Bira aterpera itzuli da. ____, euria egiten hasi da.",null,["Izan ere"],"Euria aterpera itzultzearen arrazoia da."]
 ];
 const items=rows.map(([id,q,ch,ans,ex],i)=>{const src=base.items.find(it=>it.id===id);return src?{...src,id:"HB-EP-CAUSE-01-"+(i+1),src:src.src+" / testuinguru berria",q,a:ans,ex,...(ch?{ch}:{hint:"Bigarren esaldiak lehenengoaren zergatia azaltzen du. Zein lotura erabil dezakezu?"})}:null});
 if(items.some(x=>!x))return null;
 items.push({id:"HB-EP-CAUSE-01-OPEN",src:"Jatorrizko fikziozko jarduera / EP-CAUSE-01",t:"write",q:"Argik zure laguntza behar du.",instr:"Idatzi bi esaldi herrikoei uraren arazoa azaltzeko. Bigarrenean, erabili «izan ere».",a:["(irekia)"],model:"Herrira ez da urik iristen. Izan ere, iturburuko hodia hautsi da.",ex:"Bigarren esaldiak lehenengoaren zergatia azaltzen al du? Beste erantzun batzuk ere egokiak izan daitezke."});
 return {...base,id:"HB-EP-CAUSE-01",title:"Non dago ura?",es:"¿Dónde está el agua?",scene:"Argi herriko iturrira iritsi da, baina ez da urik ateratzen. Lurrek iturburua ikusi du: hodia hautsi da. Herritarrek zer gertatu den jakin nahi dute. Lagundu Argiri zergatia azaltzen.",sceneEs:"Argi llega a la fuente del pueblo, pero no sale agua. Lur ha visto el manantial: la tubería está rota. Ayuda a Argi a explicar el motivo.",keys:["Izan ere","Beraz"],tip:"Argik arazoa azaldu nahi du: lehenik, zer gertatu den; gero, zergatia. Ondorioa azaltzeko, alderantzizko bidea egin.",tipEs:"Argi quiere explicar el problema: primero qué ha ocurrido y luego el motivo. Para explicar la consecuencia, sigue el orden inverso.",patterns:{cause:{tag:"ZERGATIA",dir:"back",a:"Herrira ez da urik iristen.",k:"Izan ere,",b:"iturburuko hodia hautsi da.",why:"Hodiaren hausturak uraren falta azaltzen du.",es:"La rotura de la tubería explica la falta de agua."},result:{tag:"ONDORIOA",dir:"fwd",a:"Iturburuko hodia hautsi da.",k:"Beraz,",b:"herrira ez da urik iristen.",why:"Uraren falta hodiaren hausturaren ondorioa da.",es:"La falta de agua es consecuencia de la rotura."}},items};
}

function secondEpisode(){
 const base=allLessons().find(l=>l.id==="b1b2-k1-i2");if(!base)return null;
 const rows=[
 ["Giltza zaharra aurkitu dugu, hodia aztertu ____.",["dugulako","dugu","dugula"],["dugulako"],"Azterketak azaltzen du zergatik aurkitu dugun giltza: «dugulako»."],
 ["Argi errotara joan da, giltzan errotaren ikurra ikusi ____.",["du","duelako","duela"],["duelako"],"Ikurra ikustea da Argik errotara joateko arrazoia."],
 ["Atea ez da ireki, sarraila herdoilduta ____.",["dagoelako","dago","dagoela"],["dagoelako"],"Sarrailaren egoerak atea ireki ez izana azaltzen du."],
 ["Argik laguntza eskatu du. ____, atea ezin du bakarrik ireki.",["Beraz","Izan ere","Adibidez"],["Izan ere"],"Bigarren esaldiak laguntza eskatzearen zergatia ematen du."],
 ["Kai berandu iritsi da, bidea galdu ____.",null,["duelako"],"Bidea galtzea da berandu iristeko arrazoia."],
 ["Ez gara errotara sartu. ____, atea itxita dago.",null,["Izan ere"],"Atearen egoerak azaltzen du zergatik ez garen sartu."]
 ];
 const items=rows.map(([q,ch,ans,ex],i)=>({id:"HB-EP-CAUSE-02-"+(i+1),src:"Jatorrizko fikziozko jarduera / EP-CAUSE-02; b1b2-k1-i2 ereduan oinarritua",t:ch?"mc":"gap",q,a:ans,ex,...(ch?{ch}:{hint:"Zergatia adierazteko egitura erabili."})}));
 items.push({id:"HB-EP-CAUSE-02-OPEN",src:"Jatorrizko fikziozko jarduera / EP-CAUSE-02",t:"write",q:"Kaik ez daki zergatik zaudeten errotan.",instr:"Idatzi esaldi bat arrazoia azaltzeko. Erabili «-lako».",a:["(irekia)"],model:"Errotara etorri gara, giltzan errotaren ikurra ikusi dugulako.",ex:"Zure esaldiak errotara joateko arrazoia azaltzen al du? Alderatu ereduarekin; beste erantzun batzuk ere egokiak izan daitezke."});
 return {...base,id:"HB-EP-CAUSE-02",n:2,title:"Giltza zaharra",es:"La llave antigua",scene:"Argik giltzari begiratu dio: errota baten ikurra du. Lurrekin errotara joan da, baina atea itxita dago. Kai bidean dator. Lagundu Argiri zergatik dauden han azaltzen.",sceneEs:"Argi ve en la llave el símbolo de un molino. Va con Lur al molino, pero la puerta está cerrada. Kai está de camino. Ayuda a Argi a explicar por qué están allí.",keys:["-lako","Izan ere"],tip:"«-lako» aditzari lotzen zaio; «izan ere» erabilita, zergatia beste esaldi batean azal dezakezu.",tipEs:"«-lako» se añade al verbo; con «izan ere» puedes explicar el motivo en otra frase.",patterns:{lako:{tag:"ZERGATIA",dir:"back",a:"Errotara joan gara,",k:"",b:"ikurra ikusi dugulako.",why:"«-lako» bidez, arrazoia esaldi berean adierazi dugu.",es:"Con «-lako» expresamos el motivo en la misma oración."},cause:{tag:"ZERGATIA",dir:"back",a:"Errotara joan gara.",k:"Izan ere,",b:"ikurra ikusi dugu.",why:"Bigarren esaldiak lehenengoaren zergatia azaltzen du.",es:"La segunda frase explica el motivo de la primera."}},items};
}

function thirdEpisode(){
 const base=secondEpisode();if(!base)return null;
 const rows=[
 ["Kaik zarata entzun du. ____, atearen ondoan geratu da entzuteko.",["Horregatik","Izan ere","Adibidez"],["Horregatik"],"Entzundako zaratak azaltzen du atearen ondoan geratzeko erabakia."],
 ["Errotako gurpila ez dabil, urik ez ____.",["dago","dagoelako","dagoela"],["dagoelako"],"«Dagoelako» adizkiak gurpila ez ibiltzearen arrazoia ematen du."],
 ["Lurrek leihoa ireki du. ____, argia behar dute barruan.",["Beraz","Izan ere","Hala ere"],["Izan ere"],"Argiaren beharrak azaltzen du leihoa irekitzea."],
 ["Hodia buxatuta dago. ____, ura ezin da errotara iritsi.",["Izan ere","Beraz","Adibidez"],["Beraz"],"Ura ezin iristea hodiaren egoeraren ondorioa da."],
 ["Ez gara bakarrik sartu, barruan zarata entzun ____.",null,["dugulako"],"Zarata entzutea da bakarrik ez sartzeko arrazoia."],
 ["Errotako atea ireki dugu, giltza egokia ____.",null,["dugulako"],"Giltza egokia izatea da atea ireki ahal izateko arrazoia."]
 ];
 // New original fictional tasks: no imported private material.
 const items=rows.map(([q,ch,ans,ex],i)=>({id:"HB-EP-CAUSE-03-"+(i+1),src:"Jatorrizko fikziozko jarduera / EP-CAUSE-03",t:ch?"mc":"gap",q,a:ans,ex,...(ch?{ch}:{hint:"Zergatia adierazten duen adizkia osatu."})}));
 items.push({id:"HB-EP-CAUSE-03-OPEN",src:"Jatorrizko fikziozko jarduera / EP-CAUSE-03",t:"write",q:"Herritarrei aurkikuntzaren berri eman.",instr:"Idatzi bi edo hiru esaldi. Azaldu zergatik ez dabilen errota eta proposatu irtenbide bat.",a:["(irekia)"],model:"Errota ez dabil, hodia buxatuta dagoelako. Beraz, hodia garbitu behar dugu.",ex:"Arrazoia eta proposamena argi bereizi dituzu? Alderatu ereduarekin. Beste formulazio batzuk ere egokiak izan daitezke."});
 return {...base,id:"HB-EP-CAUSE-03",n:3,title:"Errotaren sekretua",es:"El secreto del molino",scene:"Kaik atearen atzean zarata entzun du. Giltzarekin atea ireki dute. Barruan, gurpila geldirik dago eta hodia buxatuta. Lurrek argia sartu du leihotik. Argik herritarrei arazoa eta irtenbidea azaldu nahi dizkie.",sceneEs:"Kai oye un ruido tras la puerta. Abren con la llave. Dentro, la rueda está parada y la tubería obstruida. Lur deja entrar luz por la ventana. Argi quiere explicar el problema y la solución al pueblo.",keys:["-lako","Beraz"],tip:"Lehenik, azaldu arazoaren zergatia; gero, proposatu ondorio logiko bat.",tipEs:"Primero explica el motivo del problema; después plantea una consecuencia lógica.",patterns:{lako:{tag:"ZERGATIA",dir:"back",a:"Errota ez dabil,",k:"",b:"urik ez dagoelako.",why:"Uraren faltak errota ez ibiltzea azaltzen du.",es:"La falta de agua explica que el molino no funcione."},result:{tag:"ONDORIOA",dir:"fwd",a:"Hodia buxatuta dago.",k:"Beraz,",b:"hodia garbitu behar dugu.",why:"Arazoa kontuan hartuta, irtenbidea proposatu dugu.",es:"Proponemos una solución a partir del problema."}},items};
}

function finalEpisodes(n){
 const base=thirdEpisode();if(!base)return null;
 const last=n===5;
 const rows=last?[
 ["Herritarrek hodia garbitu dute. ____, ura berriro iritsi da iturrira.",["Izan ere","Beraz","Adibidez"],["Beraz"],"Ura berriro iristea garbiketaren ondorioa da."],
 ["Errota martxan jarri da, ura berriro iritsi ____.",["delako","dela","da"],["delako"],"Uraren etorrerak errota berriro ibiltzea azaltzen du."],
 ["Herritarrek eskerrak eman dizkiete lagunei. ____, denon artean konpondu dute arazoa.",["Izan ere","Beraz","Hala ere"],["Izan ere"],"Bigarren esaldiak esker onaren arrazoia azaltzen du."],
 ["Iturburua zaindu behar dugu, ura beharrezkoa ____.",["delako","dela","da"],["delako"],"Uraren beharrak iturburua zaintzeko arrazoia ematen du."],
 ["Bideko harriak kendu ditugu, ura igarotzea eragozten ____.",null,["zutelako"],"Harriak oztopo zirela azaldu behar dugu: «eragozten zutelako»."],
 ["Ura garbi iristen da. ____, iturria berriro erabil dezakegu.",null,["Beraz","Horregatik","Hortaz","Ondorioz","Horrenbestez"],"Bigarren esaldiak lehenengoaren ondorioa azaltzen du."]
 ]:[
 ["Paper zaharrean mapa bat dago. ____, Lurrek mapa arretaz begiratu du.",["Beraz","Izan ere","Adibidez"],["Beraz"],"Maparen aurkikuntzaren ondorioz, Lurrek mapa aztertu du."],
 ["Argik papera gorde du, baliagarria ____.",["delako","dela","da"],["delako"],"Paperaren erabilgarritasunak gordetzeko erabakia azaltzen du."],
 ["Mapan zubi bat ageri da. ____, lagunak zubira joan dira arrastoaren bila.",["Horregatik","Izan ere","Hala ere"],["Horregatik"],"Mapako informazioak azaltzen du zubira joateko erabakia."],
 ["Kai ez da errekan sartu, ura hotz ____.",["dagoelako","dago","dagoela"],["dagoelako"],"Uraren tenperatura da errekan ez sartzeko arrazoia."],
 ["Lurrek harrien azpian begiratu du, mapan marka bat ikusi ____.",null,["duelako"],"Marka ikustea da harrien azpian begiratzeko arrazoia."],
 ["Bidea itxita dago. ____, beste bide bat bilatu behar dugu.",null,["Beraz","Horregatik","Hortaz","Ondorioz","Horrenbestez"],"Bigarren esaldiak egoeratik datorren ondorioa adierazten du."]
 ];
 const items=rows.map(([q,ch,ans,ex],i)=>({id:"HB-EP-CAUSE-0"+n+"-"+(i+1),src:"Jatorrizko fikziozko jarduera / EP-CAUSE-0"+n,t:ch?"mc":"gap",q,a:ans,ex,...(ch?{ch}:{hint:"Pentsatu kausa edo ondorioa adierazi behar duzun."})}));
 items.push({id:"HB-EP-CAUSE-0"+n+"-OPEN",src:"Jatorrizko fikziozko jarduera / EP-CAUSE-0"+n,t:"write",q:last?"Herriko batzarrean hitz egin.":"Kontatu aurkikuntza Birari.",instr:last?"Azaldu hiru esalditan zer arazo zegoen, zergatik eta nola konpondu duzuen. Erabili «-lako» eta ondoriozko lotura bat.":"Azaldu zergatik joan zareten zubira eta zer egin behar duzuen orain. Erabili «-lako» edo «izan ere», eta ondoriozko lotura bat.",a:["(irekia)"],model:last?"Herrira ez zen urik iristen, hodia buxatuta zegoelako. Herritarrek hodia garbitu dute. Beraz, errota berriro dabil.":"Zubira etorri gara, mapan marka bat ikusi dugulako. Bidea itxita dago; beraz, beste bide bat bilatu behar dugu.",ex:"Egiaztatu zure azalpenak gertakariak errespetatzen dituela eta kausa eta ondorioa bereizten dituela. Eredua ez da erantzun posible bakarra."});
 return {...base,id:"HB-EP-CAUSE-0"+n,n,title:last?"Ura berriro!":"Paperaren arrastoa",es:last?"¡Vuelve el agua!":"La pista del papel",scene:last?"Mapari esker, lagunek hodiko beste oztopoa aurkitu dute zubiaren ondoan. Herritarrekin batera kendu dituzte harriak. Ura berriro iritsi da iturrira eta errota martxan dago. Argik batzarrean azaldu behar du zer gertatu den.":"Paper zaharra ireki dute: errotatik zubira doan mapa da. Zubiaren ondoan marka bat dago. Lurrek harriak ikusi ditu; badirudi beste oztopo bat dagoela hodian. Lagundu taldeari arrastoa azaltzen.",sceneEs:last?"Gracias al mapa encuentran otro obstáculo junto al puente. Retiran las piedras con los vecinos. El agua vuelve y el molino funciona. Argi debe explicar lo ocurrido en la asamblea.":"Abren el papel: es un mapa del molino al puente. Hay una marca junto al puente. Lur ve piedras; parece haber otro obstáculo en la tubería. Ayuda al grupo a explicar la pista.",tip:last?"Kontatu gertatutakoa zure hitzekin. Erabili kausa eta ondorioa behar denean.":"Lotu arrastoa eta erabakia: zer jakin duzue eta zer egingo duzue?",tipEs:last?"Cuenta lo ocurrido con tus palabras. Usa causa y consecuencia cuando sea necesario.":"Relaciona la pista con la decisión: qué habéis averiguado y qué haréis.",patterns:{lako:{tag:"ZERGATIA",dir:"back",a:last?"Errota martxan dago,":"Zubira joan gara,",k:"",b:last?"ura iritsi delako.":"mapa aurkitu dugulako.",why:"Mendeko perpausak arrazoia ematen du.",es:"La subordinada expresa la causa."},result:{tag:"ONDORIOA",dir:"fwd",a:last?"Hodia garbitu dugu.":"Mapan marka bat ikusi dugu.",k:"Beraz,",b:last?"ura berriro iristen da.":"zubira joango gara.",why:"Bigarren ideiak lehenengoaren ondorioa adierazten du.",es:"La segunda idea expresa la consecuencia."}},items};
}
const EP_TREASURES=[
 {id:"auzolana",title:"Auzolana",kind:"ELKARLANA",desc:"Herritarrek elkarrekin egiten duten lana, komunitatearen mesedetan.",example:"Herriko iturria konpontzeko, auzolanean aritu dira.",es:"Trabajo comunitario en beneficio de la comunidad."},
 {id:"giltza",title:"Giltza",kind:"HITZEN ALTXORRA",desc:"Giltza batekin atea ireki dezakegu. Hitz hori irudiz ere erabiltzen dugu, arazo bat konpontzeko funtsezko zerbait adierazteko.",example:"Elkarlana da arazoa konpontzeko giltza.",es:"Llave; también clave para resolver un problema."},
 {id:"errota",title:"Errota",kind:"HITZEN ALTXORRA",desc:"Errota batean alea ehotzen da, adibidez irina egiteko. Uraren indarraz dabilena ur-errota da.",example:"Ur-errotako gurpilak biraka egin du.",es:"Molino. Un molino hidráulico aprovecha la fuerza del agua."},
 {id:"zubia",title:"Zubia",kind:"HITZEN ALTXORRA",desc:"Ibai, errepide edo hutsune baten gainetik igarotzeko eraikuntza.",example:"Zubitik igaro gara.",es:"Puente."},
 {id:"iturburua",title:"Iturburua",kind:"HITZEN ALTXORRA",desc:"Ura lurretik berez ateratzen den tokia.",example:"Iturburutik dator errekako ura.",es:"Manantial."}
];
function treasureArt(id){if(SHELTER_TREASURES.some(t=>t.id===id))return '<svg viewBox="0 0 100 100" aria-hidden="true" class="bd-treasure-art"><rect x="5" y="5" width="90" height="90" rx="20" fill="#f1e4ce"/>'+({aterpea:'<path d="M15 46 50 15 85 46v35H15Z" fill="#b88c62"/><rect x="40" y="53" width="20" height="28" fill="#6e5544"/>',argi:'<circle cx="50" cy="50" r="24" fill="#e6b64b"/><path d="M50 9v13m0 56v13M9 50h13m56 0h13" stroke="#b98a32" stroke-width="5"/>',kutxa:'<rect x="15" y="30" width="70" height="50" rx="5" fill="#ae8057"/><path d="M15 49h70M50 30v50" stroke="#76523b" stroke-width="5"/>',gutuna:'<rect x="12" y="25" width="76" height="50" rx="6" fill="#fff8e9" stroke="#ad815a" stroke-width="4"/><path d="m13 28 37 28 37-28" fill="none" stroke="#ad815a" stroke-width="4"/>',laguntza:'<path d="M12 48 34 28 50 44 66 28 88 48 50 80Z" fill="#c88963"/><path d="m34 55 16 13 16-13" fill="none" stroke="#805a42" stroke-width="4"/>'}[id])+'</svg>';if(["mendia","erreka","mapa"].includes(id))return '<svg viewBox="0 0 100 100" aria-hidden="true" class="bd-treasure-art"><rect x="5" y="5" width="90" height="90" rx="20" fill="#dce9dc"/>'+(id==="mendia"?'<path d="M8 80 48 15 92 80Z" fill="#548365"/><path d="m33 39 15-24 16 24-16-7Z" fill="#fff"/>':id==="erreka"?'<path d="M8 24Q75 12 48 49T92 78" fill="none" stroke="#71aebd" stroke-width="19"/>':'<path d="m15 23 24-10 24 10 22-10v64L63 87 39 77 15 87Z" fill="#eddbb2" stroke="#9a8056" stroke-width="4"/><path d="m27 65 23-18 18 13" fill="none" stroke="#548365" stroke-width="4" stroke-dasharray="4 3"/>')+'</svg>';if(id==="basoa")return '<svg viewBox="0 0 100 100" aria-hidden="true" class="bd-treasure-art"><rect x="5" y="5" width="90" height="90" rx="20" fill="#e0eee0"/><path d="M30 80V46M70 80V40" stroke="#886849" stroke-width="8"/><path d="M9 56 30 15 51 56ZM44 53 70 8 96 53Z" fill="#548365"/><path d="M8 76Q50 66 92 76" fill="none" stroke="#95ad79" stroke-width="8"/></svg>';if(id==="zubia"||id==="iturburua")return '<svg viewBox="0 0 100 100" aria-hidden="true" class="bd-treasure-art"><rect x="5" y="5" width="90" height="90" rx="20" fill="#dce9dc"/>'+(id==="zubia"?'<path d="M10 70Q30 55 50 70T90 70" fill="none" stroke="#79b3bf" stroke-width="14"/><path d="M12 52h76M24 52v23m52-23v23M24 67q26-36 52 0" fill="none" stroke="#9b7956" stroke-width="8"/>':'<path d="M10 70 34 30 57 61 73 37 92 70Z" fill="#668d72"/><path d="M48 57q-13 14 7 23t30 5" fill="none" stroke="#79b3bf" stroke-width="12"/><circle cx="48" cy="55" r="5" fill="#eaf7f8"/>')+'</svg>';const a=id==="auzolana"?'<path d="M18 44 34 28 50 44 66 28 82 44 50 75Z" fill="#e6b67a" stroke="#754e35" stroke-width="3"/><path d="M18 44 8 32 23 18 34 28M82 44 92 32 77 18 66 28" fill="#5e8b81" stroke="#365c54" stroke-width="3"/><path d="m38 55 12 9 12-9" fill="none" stroke="#754e35" stroke-width="3"/>':id==="giltza"?'<circle cx="32" cy="31" r="17" fill="none" stroke="#b88232" stroke-width="9"/><path d="m44 43 34 34 8-8-8-8 7-7" fill="none" stroke="#b88232" stroke-width="9" stroke-linejoin="round"/>':'<path d="M14 75V35l36-24 36 24v40Z" fill="#d8bc8d" stroke="#6b6251" stroke-width="3"/><path d="M9 38 50 8l41 30" fill="none" stroke="#a75d4d" stroke-width="7"/><circle cx="68" cy="62" r="23" fill="#9ac5c7" stroke="#557d83" stroke-width="4"/><path d="M68 39v46M45 62h46M52 46l32 32M84 46 52 78" stroke="#557d83" stroke-width="3"/>';
 return '<svg viewBox="0 0 100 100" aria-hidden="true" class="bd-treasure-art">'+a+'</svg>'
}
function treasureCard(t,unlocked){return '<article class="bd-treasure-card '+(unlocked?"is-discovered":"is-unknown")+'">'+(unlocked?treasureArt(t.id):svg("lock"))+'<span class="bd-kicker">'+(unlocked?esc(t.kind):"EZAGUTZEKO")+'</span><h3>'+ (unlocked?esc(t.title):"Altxor berria")+'</h3>'+(unlocked?'<p>'+esc(t.desc)+'</p><p class="bd-treasure-example">'+esc(t.example)+'</p>':'<p>Abenturan aurrera egin ahala aurkituko duzu.</p>')+'</article>'}
function collectionHtml(){
 const ts=episodeTreasures(),ids=episodeIds(),found=ts.map((t,i)=>S.episodes?.[ids[i]]?.treasure===t.id),count=found.filter(Boolean).length;
 return '<section class="bd-card bd-collection"><details><summary><span class="bd-collection-head">'+svg("star")+'<span><strong>Nire altxorrak</strong><small>'+count+'/'+ts.length+' aurkituta</small></span></span><span class="bd-chip">Ikusi</span></summary><div class="bd-collection-grid">'+ts.map((t,i)=>treasureCard(t,found[i])).join("")+'</div></details></section>'
}
function episodeLandscape(n){if(inShelter())return '<figure class="bd-episode-landscape"><svg viewBox="0 0 640 200" aria-hidden="true"><rect width="640" height="200" fill="#b8cdd0"/><path d="M0 140 125 42 270 140 405 30 640 145V200H0Z" fill="#729389"/><path d="M0 170Q170 134 320 170T640 155V200H0Z" fill="#496f61"/><path d="M210 175V80L320 25 430 80V175Z" fill="#d8c5a5" stroke="#76614d" stroke-width="4"/><path d="m198 85 122-65 122 65" fill="none" stroke="#8b5247" stroke-width="13"/><rect x="290" y="110" width="62" height="65" rx="5" fill="#705744"/><rect x="372" y="100" width="34" height="35" fill="#f4d88b"/><path d="M45 15l-12 25m40-10L61 55m80-42-12 25m420-30-12 25m48-10-12 25" stroke="#e3eff0" stroke-width="5"/></svg><span class="bd-location">Aterpetxeko giltza</span>'+bira("curious","bd-landscape-bira")+'</figure>';if(S.level==="a1a2")return '<figure class="bd-episode-landscape"><svg viewBox="0 0 640 200" aria-hidden="true"><rect width="640" height="200" fill="#c9e3d8"/><path d="M0 115 160 18 330 119 480 30 640 115V200H0Z" fill="#88ab90"/><path d="M0 156Q180 85 360 155T640 140V200H0Z" fill="#5f9272"/><path d="M290 200Q355 160 315 125" stroke="#dbc49a" stroke-width="40" fill="none"/><path d="M110 166V48M485 170V38" stroke="#765f49" stroke-width="24"/><path d="M40 100 110 5 180 100ZM415 90 485 0 555 90Z" fill="#36745b"/><rect x="91" y="111" width="38" height="26" rx="4" fill="#f6dda7" stroke="#765f49" stroke-width="3"/><path d="M98 120h23m-23 6h17" stroke="#765f49" stroke-width="2"/></svg><span class="bd-location">'+esc(["Basoko bidea","Basoko txokoa","Basoko bidea","Gurutzebidea","Herriko mapa"][n-1])+'</span>'+bira("curious","bd-landscape-bira")+'</figure>';
 const common='<rect width="640" height="200" fill="#dce9dc"/><circle cx="525" cy="35" r="25" fill="#f7d78c"/><path d="M0 120 120 36 210 110 340 20 470 110 640 50V200H0Z" fill="#8daea0"/><path d="M0 145Q150 90 300 142T640 122V200H0Z" fill="#668d72"/>';
 const scenes=[
 '<path d="M0 180Q170 145 320 184T640 162V200H0" fill="#79b3bf"/><path d="M180 152h150v22H180Z" fill="#a6a69b"/><path d="M210 150v-55h88v55" fill="#d8c9ac" stroke="#7b7867" stroke-width="4"/><path d="M244 124h42v10h-15v12" fill="none" stroke="#6a7475" stroke-width="7"/><path d="M386 172h105v-64h-34m-17 0h-28v64" fill="none" stroke="#9a7056" stroke-width="13"/><path d="m445 100 10 17m-17 0 12-18" stroke="#f7d78c" stroke-width="3"/>',
 '<path d="M0 181Q175 135 350 176T640 152V200H0" fill="#b0aa78"/><path d="M210 170V80L320 32 430 80V170Z" fill="#d4c0a1" stroke="#6d796b" stroke-width="4"/><path d="m195 86 125-62 125 62" stroke="#985d51" stroke-width="13" fill="none"/><path d="M290 170v-50a30 30 0 0 1 60 0v50" fill="#536961"/><circle cx="336" cy="143" r="4" fill="#f6d479"/><path d="M440 155h85v15h-85" fill="#a3a69b"/>',
 '<rect width="640" height="200" fill="#455b59"/><path d="M0 0 130 200M640 0 510 200" stroke="#344a48" stroke-width="32"/><path d="M420 20h105v70H420Z" fill="#f6d99c"/><path d="M420 90 300 200h190l35-110" fill="#f6d99c" opacity=".3"/><circle cx="240" cy="116" r="65" fill="#a8bb9f" stroke="#b78e62" stroke-width="14"/><path d="M240 51v130m-65-65h130m-111-46 92 92m0-92-92 92" stroke="#8c704e" stroke-width="8"/><path d="M370 155h140v-25" fill="none" stroke="#91a09d" stroke-width="16"/>'
 ];
 return '<figure class="bd-episode-landscape"><svg viewBox="0 0 640 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+(n===3?"":common)+(scenes[n-1]|| (n===4?'<path d="M0 175Q180 120 350 175T640 160V200H0Z" fill="#79b3bf"/><path d="M110 137h400M160 137v40m320-40v40M160 169q160-110 320 0" fill="none" stroke="#b89b74" stroke-width="22"/>':'<path d="M0 180Q180 140 350 181T640 155V200H0Z" fill="#79b3bf"/><path d="M200 160v-60h155v60" fill="#d8c9ac" stroke="#7b7867" stroke-width="5"/><path d="M260 115h52v12h-18v25q0 10 20 18" fill="none" stroke="#5f98af" stroke-width="9"/>'))+'</svg><span class="bd-location">'+esc(["Herriko iturria","Errota zaharra","Errotaren barrua","Zubia","Herriko plaza"][n-1])+'</span>'+bira("curious","bd-landscape-bira")+'</figure>'
}
const EPISODE_IDS=["HB-EP-CAUSE-01","HB-EP-CAUSE-02","HB-EP-CAUSE-03","HB-EP-CAUSE-04","HB-EP-CAUSE-05"];

const FOREST_ID="HB-EP-FOREST-01";
const FOREST_IDS=[FOREST_ID,"HB-EP-FOREST-02","HB-EP-FOREST-03","HB-EP-FOREST-04","HB-EP-FOREST-05"];
const FOREST_TREASURE={id:"basoa",title:"Basoa",kind:"NATURA",desc:"Zuhaitz asko hazten diren eremua.",example:"Basoan zuhaitz asko daude.",es:"Bosque."};
function forestEpisode(n=1){
 const base=allLessons().find(l=>l.id==="a1a2-k1-i"+n);if(!base||!FOREST_IDS.includes(FOREST_IDS[n-1]))return null;
 if(n>1){
 const selected={2:[1,2,3,4,6,7],3:[1,2,3,4,5,6],4:[1,2,3,4,6,7],5:[1,2,3,4,5,6,7]}[n];
 const items=selected.map(k=>base.items.find(i=>i.id==="A1-"+n+"-"+k)).map(i=>({...i,id:"HB-EP-FOREST-0"+n+"-"+i.id.split("-").pop()}));
 if(n<5){const tasks={2:["Txinpartek non bizi zaren jakin nahi du.","Idatzi esaldi bat: basoan bizi zarela esan.","Basoan bizi naiz."],3:["Birari kontatu nora zoazen.","Esan mendira zoazela.","Mendira noa."],4:["Lagundu Lurri bidea aurkitzen.","Idatzi esaldi bat: zubitik errekara joango zaretela esan.","Zubitik errekara joango gara."]};const [q,instr,model]=tasks[n];items.push({id:"HB-EP-FOREST-0"+n+"-OPEN",src:"Jatorrizko egokitzapena / EP-FOREST-0"+n,t:"write",q,instr,model,a:["(irekia)"],ex:"Alderatu zure esaldia ereduarekin. Beste formulazio batzuk ere egokiak izan daitezke."})}
 return {...base,id:FOREST_IDS[n-1],forest:true,patterns:{},items};
 }
 const items=base.items.filter(i=>["A1-1-1","A1-1-2","A1-1-3","A1-1-4","A1-1-6","A1-1-8"].includes(i.id)).map((i,k)=>({...i,id:"HB-EP-FOREST-01-"+(k+1)}));
 items.push({id:"HB-EP-FOREST-01-OPEN",src:"Jatorrizko egokitzapena / EP-FOREST-01",t:"write",q:"Birak jakin nahi du nora zoazen.",instr:"Idatzi esaldi labur bat. Esan errekara zoazela.",model:"Errekara noa.",a:["(irekia)"],ex:"Begiratu: zure esaldiak helmuga adierazten al du? Ereduarekin alderatu."});
 return {...base,id:FOREST_ID,n:1,title:"Enborreko mezua",forest:true,patterns:{},items};
}

const SHELTER_IDS=Array.from({length:5},(_,i)=>"HB-EP-SHELTER-0"+(i+1));
const SHELTER_TREASURES=[
 {id:"aterpea",title:"Aterpea",kind:"HITZEN ALTXORRA",desc:"Euria edo hotza saihesteko lekua.",example:"Euria ari du; aterpera joan gara.",es:"Refugio."},
 {id:"argi",title:"Argia",kind:"HITZEN ALTXORRA",desc:"Gauzak ikusteko behar duguna.",example:"Argia piztu dugu.",es:"Luz."},
 {id:"kutxa",title:"Kutxa",kind:"HITZEN ALTXORRA",desc:"Gauzak gordetzeko ontzia.",example:"Bi gutun daude kutxan.",es:"Caja."},
 {id:"gutuna",title:"Gutuna",kind:"HITZEN ALTXORRA",desc:"Norbaiti bidaltzen diogun idatzia.",example:"Gutun bat idatzi dut.",es:"Carta."},
 {id:"laguntza",title:"Laguntza",kind:"HITZEN ALTXORRA",desc:"Beste norbaiti zerbait egiten ematen diogun babesa.",example:"Lagunek laguntza eman dute.",es:"Ayuda."}
];
function shelterUnlocked(){return FOREST_IDS.every(id=>!!S.episodes?.[id])}
function inShelter(){return S.level==="a1a2"&&shelterUnlocked()&&(S.forestMission===2||SHELTER_IDS.includes(S.forestDraft?.id))}
function forestTitle(){return inShelter()?"Aterpetxeko giltza":"Basorako bidea"}
function chooseForestMission(n,startNow=false){
 syncState();if(S.level!=="a1a2"||![1,2].includes(n)||n===2&&!shelterUnlocked())return;
 const draft=S.forestDraft;if(draft&&!(n===2?SHELTER_IDS:FOREST_IDS).includes(draft.id))return;
 close(true);S.forestMission=n;save();if(startNow)startEpisode();else refresh()
}
function forestMissionsHtml(){
 const second=shelterUnlocked(),paused=!!S.forestDraft;
 return '<section class="bd-card bd-missions"><span class="bd-kicker">KONDAIREN ZAINDARIAK</span><h2>Abenturak</h2><div class="bd-world-game-grid">'+[["Basorako bidea",FOREST_IDS,1],["Aterpetxeko giltza",SHELTER_IDS,2]].map(([title,ids,n])=>{
 const allowed=(n===1||second)&&(!paused||ids.includes(S.forestDraft.id)),count=ids.filter(id=>S.episodes?.[id]).length;
 return '<button class="bd-game-tile bd-mission-tile'+((inShelter()?2:1)===n?" is-active":"")+'" '+((inShelter()?2:1)===n?'aria-current="true" ':"")+(allowed?'onclick="HBBidea.chooseForestMission('+n+')"':'disabled')+'>'+svg(allowed?"map":"lock")+'<span><strong>'+esc(title)+'</strong><small>'+count+'/5 atal · '+(allowed?((inShelter()?2:1)===n?"Uneko abentura":"Ikusi"):paused?"Amaitu irekita duzun atala":"Lehen abentura amaitu")+'</small></span>'+svg("arrow")+'</button>'
 }).join("")+'</div><p class="bd-note">Hirugarren abentura: prestatzen ari gara.</p></section>'
}
/* Original narrative adaptation of the public A1–A2 K2 verb lessons. */
function shelterEpisode(n){
 const base=allLessons().find(l=>l.id==="a1a2-k2-i"+Math.min(n,4));if(!base||!SHELTER_IDS[n-1])return null;
 const scenes=[
 ["Aterpe bila","En busca de refugio","Ane eta Iker basotik atera dira. Euria hasi da. Anek aterpetxea ikusi du. Zer egin du bakoitzak?","Ane e Iker salen del bosque. Empieza a llover. Ane ve un refugio. ¿Qué ha hecho cada uno?","Ni aterpera joan naiz.","He ido al refugio."],
 ["Atea ireki","Abrir la puerta","Lur eta Txinpart iritsi dira. Lau lagunak atearen aurrean daude. Giltza lurrean dago. Zer egin dute elkarrekin?","Lur y Txinpart llegan. Los cuatro están ante la puerta. La llave está en el suelo. ¿Qué han hecho juntos?","Guk giltza hartu dugu.","Hemos cogido la llave."],
 ["Kutxako sekretua","El secreto de la caja","Barruan, kutxa bat dago. Anek gutun bat ikusi du, baina Ikerrek bi gutun aurkitu ditu. Zenbat gauza aurkitu dituzte?","Dentro hay una caja. Ane ve una carta, pero Iker encuentra dos. ¿Cuántas cosas han encontrado?","Nik bi gutun aurkitu ditut.","He encontrado dos cartas."],
 ["Zer gertatu da?","¿Qué ha pasado?","Txinpartek aterpean gertatutakoa jakin nahi du. Ane barrura sartu da eta Lurrek kutxa ireki du. Kontatu gertatutakoa.","Txinpart quiere saber lo sucedido. Ane ha entrado y Lur ha abierto la caja. Cuenta lo que ha pasado.","Ane sartu da. Lurrek kutxa ireki du.","Ane ha entrado. Lur ha abierto la caja."],
 ["Lagunentzako mezua","Un mensaje para los amigos","Euria gelditu da. Gutunetako mapak errekara eramango ditu lagunak. Bira zain dago: kontatu zer egin duzuen eta zer aurkitu duzuen.","Ha dejado de llover. El mapa de las cartas llevará al grupo al arroyo. Bira espera: cuenta qué habéis hecho y encontrado.","Gu aterpera etorri gara. Guk bi gutun irakurri ditugu.","Hemos venido al refugio. Hemos leído dos cartas."]
 ];
 const [title,es,scene,sceneEs,model,modelEs]=scenes[n-1];
 const rows=[
 [
 ["G1-1-1","Ane aterpera joan ____.","da",["da","du","naiz"],"Ane da joan dena: da."],
 ["G1-1-2","Nik ura edan ____.","dut",["dut","naiz","da"],"Nik edan dut; ura da edandakoa."],
 ["G1-1-3","____ aterpera joan naiz.","Ni",["Ni","Nik","Zu"],"Ni naiz joan dena."],
 ["G1-1-4","____ giltza ikusi dut.","Nik",["Nik","Ni","Zuk"],"Nik ikusi dut giltza."],
 ["G1-1-5","Zu aterpera iritsi ____.","zara",["zara","duzu","naiz"],"Zu zara iritsi dena."],
 ["G1-1-7","Nik atea ikusi ____.","dut",null,"Nik ikusi dut atea."]
 ],[
 ["G1-2-1","____ aterpera iritsi gara.","Gu",["Gu","Guk","Zuek"],"Gu gara iritsi garenak."],
 ["G1-2-2","Bi lagun etorri ____.","dira",["dira","da","dute"],"Bi lagun dira etorri direnak."],
 ["G1-2-3","Bi lagunek giltza hartu ____.","dute",["dute","du","dira"],"Bi lagunek hartu dute giltza."],
 ["G1-2-4",null,null,null,null],
 ["G1-2-5",null,null,null,null],
 ["G1-2-6",null,null,null,null]
 ],[
 ["G1-3-1","Guk bi gutun irakurri ____.","ditugu",["ditugu","dugu","gara"],"Bi gutun irakurri ditugu, ez gutun bakarra."],
 ["G1-3-2","Nik bi gutun aurkitu ____.","ditut",["ditut","dut","naiz"],"Bi gutun aurkitu ditut."],
 ["G1-3-3","Zuk bi giltza aurkitu ____.","dituzu",["dituzu","duzu","zara"],"Zuk bi giltza aurkitu dituzu."],
 ["G1-3-4",null,null,null,null],
 ["G1-3-5","Nik bi harri ekarri ____.","ditut",null,"Bi harri ekarri ditut."],
 ["G1-3-7",null,null,null,null]
 ],[
 ["G1-4-1","Zein esalditan ageri da NORK?","Anek kutxa ireki du.",["Anek kutxa ireki du.","Ane iritsi da.","Gu aterpera joan gara."],"Anek ireki du kutxa."],
 ["G1-4-2",null,null,null,null],
 ["G1-4-3",null,null,null,null],
 ["G1-4-4",null,null,null,null],
 ["G1-4-5",null,null,null,null],
 ["G1-4-6",null,null,null,null]
 ],[
 ["G1-4-1","Lur aterpera itzuli ____.","da",["du","da","dira"],"Lur da itzuli dena."],
 ["G1-4-3","____ mapa ikusi dugu.","Guk",["Gu","Guk","Nik"],"Guk ikusi dugu mapa."],
 ["G1-4-4","Gu errekara joan ____.","gara",null,"Gu gara joan garenak."],
 ["G1-4-5","Anek bi gutun irakurri ____.","ditu",["du","ditu","da"],"Anek bi gutun irakurri ditu."],
 ["G1-4-6","Nik mapa hartu ____.","dut",["naiz","dut","ditut"],"Nik mapa hartu dut."],
 ["G1-4-2","Bi lagunek bi gutun aurkitu ____.","dituzte",null,"Bi lagunek bi gutun aurkitu dituzte."]
 ]
 ][n-1];
 const items=rows.map(([source,q,ans,ch,ex],i)=>{
 const original=base.items.find(it=>it.id===source);if(!original)return null;
 const id=SHELTER_IDS[n-1]+"-"+(i+1),src=original.src+" / "+source+" / aterpetxeko egokitzapena";
 if(q!==null)return {id,src,t:ch?"mc":"gap",q,a:[ans],...(ch?{ch}:{}),hint:"Begiratu nork edo nor joan den eta zenbat gauza diren.",ex};
 return {...original,id,src};
 });
 if(items.some(i=>!i))return null;
 // Contextualize the reusable pair/build/fix tasks without changing their target.
 if(n===2){
 items[3]={...items[3],pairs:[["Gu aterpera joan…","gara"],["Guk giltza hartu…","dugu"],["Bi lagun etorri…","dira"],["Bi lagunek atea ireki…","dute"]]};
 }
 if(n===3){items[3]={...items[3],pairs:[["Nik gutun bat irakurri…","dut"],["Nik bi gutun irakurri…","ditut"],["Guk giltza bat hartu…","dugu"],["Guk bi giltza hartu…","ditugu"]]};
 items[5]={...items[5],q:"Zuk bi gutun ikusi duzu.",a:["Zuk bi gutun ikusi dituzu."],hint:"Bi gutun dira.",ex:"Bi gutun ikusi dituzu."}}
 if(n===4){items[1]={...items[1],q:"Guk aterpera etorri gara.",a:["Gu aterpera etorri gara."],ex:"Gu gara etorri garenak."};
 items[2]={...items[2],q:"«Ane sartu da» eta «Anek atea ireki du». Zeinetan da Ane NOR?",ch:["Lehenengoan (Ane sartu da)","Bigarrenean (Anek atea ireki du)","Bietan"],a:["Lehenengoan (Ane sartu da)"],ex:"Ane da sartu dena; Anek ireki du atea."};
 items[3]={...items[3],q:"Ane aterpera joan da. Aldatu Ane → Gu.",a:["Gu aterpera joan gara."],ex:"Gu gara joan garenak."};
 items[4]={...items[4],q:"Zu / aterpetik / atera.",a:["Zu aterpetik atera zara."],ex:"Zu zara atera dena."};
 items[5]={...items[5],q:"Nik bi gutun irakurri dut.",a:["Nik bi gutun irakurri ditut."],hint:"Bi gutun dira.",ex:"Bi gutun irakurri ditut."}}
 items.push({id:SHELTER_IDS[n-1]+"-OPEN",src:"Jatorrizko fikziozko ekoizpena / "+base.id,t:"write",q:"Birari kontatu zer gertatu den.",instr:["Esan aterpera joan zarela.","Esan taldeak giltza hartu duela. Erabili «guk».","Esan bi gutun aurkitu dituzula. Erabili «nik».","Idatzi bi esaldi: Ane sartu da eta Lurrek kutxa ireki duela adierazi.","Idatzi bi esaldi: nora joan zareten eta zer aurkitu duzuen."][n-1],model,a:["(irekia)"],ex:"Alderatu zure esaldia ereduarekin. Beste formulazio zuzen batzuk ere egon daitezke."});
 return {...base,id:SHELTER_IDS[n-1],n,title,es,forest:true,shelter:true,talk:undefined,scene,sceneEs,patterns:{},items,tip:n===3?"Gauza bat ala bi? Laguntzailea ere alda daiteke.":"Nor joan da? Nork egin du zerbait? Begiratu pertsonari eta adizkiari.",tipEs:n===3?"¿Una cosa o varias? También puede cambiar el auxiliar.":"¿Quién ha ido? ¿Quién ha hecho algo? Observa la persona y el auxiliar.",example:model,exampleEs:modelEs}
}

function episodeIds(){return S.level==="a1a2"?(inShelter()?SHELTER_IDS:FOREST_IDS):EPISODE_IDS}
const FOREST_TREASURES=[FOREST_TREASURE,{id:"mendia",title:"Mendia",kind:"NATURA",desc:"Inguruko lurrak baino gorago dagoen lur-eremua.",example:"Mendira joan gara.",es:"Monte."},{id:"erreka",title:"Erreka",kind:"NATURA",desc:"Ibai txikia.",example:"Errekaren ondoan gaude.",es:"Arroyo."},{id:"zubia",title:"Zubia",kind:"HITZEN ALTXORRA",desc:"Alde batetik bestera igarotzeko eraikuntza.",example:"Zubitik igaro gara.",es:"Puente."},{id:"mapa",title:"Mapa",kind:"HITZEN ALTXORRA",desc:"Leku baten irudikapena.",example:"Mapan herriko plaza aurkitu dugu.",es:"Mapa."}];
function episodeTreasures(){return S.level==="a1a2"?(inShelter()?SHELTER_TREASURES:FOREST_TREASURES):EP_TREASURES}
function draftKey(){return S.level==="a1a2"?"forestDraft":"episodeDraft"}
function activeDraft(){return S[draftKey()]}


/* Optional games share the existing player; no XP, mastery or mission progress. */

function wordGameGroups(){
 const forest=S.level==="a1a2",ts=episodeTreasures(),ids=episodeIds();
 const discovered=ts.filter((t,i)=>S.episodes?.[ids[i]]?.treasure===t.id).map(t=>[t.title,t.desc]);
 const starter=inShelter()?SHELTER_TREASURES.slice(0,3).map(t=>[t.title,t.desc]):forest?[["Basoa","Zuhaitz asko dauden lekua."],["Erreka","Ibai txikia."],["Mendia","Lur garaia."]]:[["Hodia","Likidoa garraiatzeko pieza hutsa."],["Erreka","Ibai txikia."],["Giltza","Atea edo sarraila irekitzeko tresna."]];
 const extra=inShelter()?[
 [["Giltza","Atea irekitzeko tresna."],["Atea","Sarrera ireki edo ixteko atala."],["Leihoa","Argia eta airea sartzeko irekidura."]],
 [["Euria","Hodeietatik erortzen den ura."],["Hodeia","Zeruan ikusten den ur tanta multzoa."],["Eguzkia","Egunez argia eta beroa ematen digun izarra."]],
 [["Papera","Idazteko edo marrazteko erabiltzen den materiala."],["Arkatza","Idazteko edo marrazteko tresna."],["Mapa","Leku baten irudikapena."]]
 ]:forest?[
 [["Enborra","Zuhaitzaren zurezko atal nagusia."],["Hostoa","Landarearen atal laua, gehienetan berdea."],["Adarra","Enborretik ateratzen den zurezko atala."]],
 [["Bidea","Leku batetik bestera joateko ibilbidea."],["Seinalea","Informazioa edo norabidea adierazten duen ikurra."],["Gurutzebidea","Bi bide edo gehiago elkartzen diren lekua."]],
 [["Eskola","Ikasteko lekua."],["Plaza","Herriko edo hiriko gune irekia."],["Liburutegia","Liburuak irakurtzeko edo maileguan hartzeko lekua."]]
 ]:[
 [["Iturria","Ura hartzeko gailua edo gunea."],["Sarraila","Giltzaz irekitzen edo ixten den mekanismoa."],["Leihoa","Argia eta airea sartzeko irekidura."]],
 [["Gurpila","Ardatz baten inguruan biratzen den pieza biribila."],["Harria","Material mineral gogorreko zatia."],["Arrastoa","Zerbaiten berri ematen duen aztarna."]],
 [["Herritarra","Herri bateko biztanlea."],["Batzarra","Gai bat aztertzeko pertsonen bilera."],["Konponbidea","Arazoa konpontzeko modua."]]
 ];
 const primary=[...discovered,...starter.filter(p=>!discovered.some(d=>d[0]===p[0]))].slice(0,Math.max(3,discovered.length));
 return [primary,...extra].map((pairs,i)=>({id:(inShelter()?"HB-SHELTER":forest?"HB-FOREST":"HB-WORLD")+"-GAME-WORDS-"+(i+1),t:"match",q:"Lotu hitzak eta esanahiak · "+(i+1)+"/4",pairs:shuffle(pairs),a:["loturak"],ex:"Hitzak eta esanahiak lotu dituzu."}));
}
const VERB_TASKS=[
 {id:"HB-VERB-NOR-1",code:"nor",level:"a1a2",t:"mc",q:"Ane basora joan ____. (Ane bakarrik.)",ch:["da","du","dio"],a:["da"],ex:"Ane da joan dena; ez dago objekturik edo hartzailerik.",why:{du:"«Du» objektua eta egilea lotzeko erabiltzen da. Hemen Ane da joan dena.",dio:"«Dio» hartzailea ere adierazteko erabiltzen da. Hemen Ane da joan dena."}},
 {id:"HB-VERB-NORK-1",code:"nornork",level:"b1b2",t:"mc",q:"Argik giltza aurkitu ____.",ch:["da","du","dio"],a:["du"],ex:"Argik aurkitu du; giltza da aurkitutako objektua.",why:{da:"«Da» ez dator bat hemen ageri diren egilearekin eta objektuarekin. Argik giltza aurkitu du.",dio:"«Dio» adizkiak hartzailea ere adierazten du; hemen ez da hartzailerik aipatzen."}},
 {id:"HB-VERB-NORI-1",code:"nornorinork",level:"b1b2",t:"mc",q:"Nik Joni mapa eman ____. (Joni da hartzailea.)",ch:["dut","diot","dizut"],a:["diot"],ex:"Ni naiz egilea, mapa da objektua eta Joni da hartzailea: diot.",why:{dut:"«Dut» adizkiak objektua eta egilea adierazten ditu. Esaldi honetan Joni da hartzailea; hartzailearekiko komunztadura ere behar dugu.",dizut:"«Dizut» adizkiaren hartzailea zu zara; hemen Joni da hartzailea."}},
 {id:"HB-VERB-NORI-2",code:"nornorinork",level:"b1b2",t:"mc",q:"Argik Lurri gutuna eman ____. (Lur da hartzailea.)",ch:["du","dio","diot"],a:["dio"],ex:"Argi da egilea, gutuna da objektua eta Lur da hartzailea: dio.",why:{du:"Lurri hartzailea ageri da; harekiko komunztadura ere behar dugu.",diot:"«Diot» adizkiak ni adierazten du egile gisa; hemen Argik eman du."}}
].map(x=>({...x,src:"Jatorrizko testuinguru mugatua / HB-VERB-PILOT-v1"}));
function worldGameItems(kind){
 if(kind==="words")return wordGameGroups();
 if(kind==="verbs")return VERB_TASKS.filter(x=>x.level===S.level);
 if(S.level==="a1a2"){
 const words=[["Basoa","Zuhaitz asko dauden lekua."],["Erreka","Ibai txikia."],["Mendia","Lur garaia."]];for(const t of FOREST_TREASURES)if(S.episodes?.[FOREST_IDS[FOREST_TREASURES.indexOf(t)]]?.treasure===t.id&&!words.some(p=>p[0]===t.title))words.push([t.title,t.desc]);
 if(kind==="words")return [{id:"HB-FOREST-GAME-WORDS",t:"match",q:"Lotu hitzak eta esanahiak.",pairs:words,a:["loturak"],ex:"Basoa, erreka eta mendia."}];
 return [["Ane ____ dago.",["basoan","basora","basotik"],"basoan","Non? Basoan."],["Iker ____ doa.",["errekan","errekara","errekatik"],"errekara","Nora? Errekara."],["Lur ____ dator.",["mendian","mendira","menditik"],"menditik","Nondik? Menditik."]].map(([q,ch,answer,ex],i)=>({id:"HB-FOREST-GAME-PLACE-"+i,t:"mc",q,ch,a:[answer],ex}));
 }
 const pairs=EP_TREASURES.filter((t,i)=>S.episodes?.[EPISODE_IDS[i]]?.treasure===t.id);
 const n=pairs.length;
 if(kind==="words"){
  const words=[{title:"Hodia",desc:"Ura edo beste likido bat toki batetik bestera eramateko pieza hutsa."},{title:"Erreka",desc:"Ibai txikia, bere ibilgutik ura daramana."}];
  const selected=[...pairs,...words,...(n===0?[EP_TREASURES[1]]:[])].slice(0,5);
  return [{id:"HB-WORLD-GAME-WORDS",t:"match",q:"Lotu abenturako hitzak eta esanahiak.",pairs:selected.map(t=>[t.title,t.desc]),a:["loturak"],ex:"Hitzak eta haien esanahiak lotu dituzu."}];
 }
 const rows=[
 ["Iturria ez dabil. ____, hodia hautsi da.",["Izan ere","Beraz","Adibidez"],"Izan ere","Hodiaren hausturak azaltzen du iturria ez ibiltzea."],
 ["Hodia hautsi da. ____, ura ez da iristen.",["Izan ere","Beraz","Hala ere"],"Beraz","Uraren falta da ondorioa."],
 ["Errota ikusi dugu, mapan agertu ____.",["delako","dela","da"],"delako","«-lako» egiturak arrazoia adierazten du."],
 ["Zubia hondatuta dago. ____, beste bide bat hartu dugu.",["Izan ere","Horregatik","Adibidez"],"Horregatik","Beste bidea hartzea da ondorioa."],
 ["Herriko lagunak elkartu dira, ura behar ____.",["dutelako","dutela","dute"],"dutelako","Uraren beharrak elkartzeko arrazoia adierazten du."]
 ];
 return rows.slice(0,Math.min(5,Math.max(2,n+1))).map(([q,ch,answer,ex],i)=>({id:"HB-WORLD-GAME-LINK-"+i,t:"mc",q,ch,a:[answer],ex}));
}
let vocabularyRepo=null,vocabularyOwner=null,vocabularyTheme="all",vocabularyThemes=[];
function vocabularyFilters(){
 const owner=keyFor(KEY)+":"+island().adventure.id;if(vocabularyOwner!==owner){vocabularyOwner=owner;vocabularyTheme="all";vocabularyThemes=[];vocabularyRepo?.cancel()}
 return {level:island().adventure.vocabularyLevel,theme:vocabularyTheme};
}
function setVocabularyTheme(value){if(guestLimited())return;if(value!=="all"&&!vocabularyThemes.includes(value))return;vocabularyTheme=value;refresh()}
function vocabularyControls(){if(guestLimited())return "";vocabularyFilters();return '<p class="bd-note">'+esc(island().adventure.title)+' · Abenturan landutako hitzekin jolastuko zara.</p>'+(vocabularyThemes.length?'<div class="bd-vocab-controls"><label>Gaia <select onchange="HBBidea.setVocabularyTheme(this.value)"><option value="all">Gai guztiak</option>'+vocabularyThemes.map(t=>'<option value="'+esc(t)+'"'+(t===vocabularyTheme?' selected':'')+'>'+esc(t.replace(/^lexiko_/,"").replace(/_/g," "))+'</option>').join('')+'</select></label></div>':'')}
function vocabularyNotice(){
 if(player?.kind!=="words")return "";
 if(player.vocabularyMode!=="live")return '<p class="bd-note" role="status">'+esc(player.vocabularyReason==="guest"?"Abenturako tokiko hitzak. Bankuko hitzak erabiltzeko, hasi saioa.":player.vocabularyReason==="connection"?"Bankua ezin izan da kargatu. Abenturako tokiko hitzekin ari zara.":"Oraindik ez dago abentura honetarako bankuko hitz nahikorik. Abenturako tokiko hitzekin ari zara.")+'</p>';
 const rows=cur().item.vocabulary||[];
 return '<p class="bd-note">'+esc(island().adventure.title)+' · '+esc(root.HBVocabulary.themeLabel(rows))+'</p><details class="bd-vocab-sources"><summary>Hitzen jatorria</summary>'+rows.map(r=>'<p>'+esc(r.source)+' · '+esc(r.id)+' · v'+esc(r.version)+' · '+esc(r.rights)+'</p>').join('')+'</details>';
}
async function prepareVocabulary(){
 syncState();const filters=vocabularyFilters(),owner=keyFor(KEY);
 if(!root.HBData?.isRemote?.()||!root.HBVocabulary){openWorldGame("words",wordGameGroups(),{mode:"fallback",reason:"guest"});return}
 vocabularyRepo=vocabularyRepo||root.HBVocabulary.createRepository(root.HBData);
 const loading={mode:"worldgame",kind:"words",phase:"loading",owner};player=loading;const el=ensureEl();render();el.focus?.();
 const result=await vocabularyRepo.prepare(filters);
 if(player!==loading||owner!==keyFor(KEY)||result.mode==="cancelled")return;
 vocabularyThemes=[...new Set([...vocabularyThemes,...(result.themes||[])])];
 openWorldGame("words",result.mode==="live"?result.items:wordGameGroups(),{...result,level:filters.level});
}
function worldGamesHtml(){
 const count=episodeIds().filter(id=>S.episodes?.[id]).length;
 return '<section class="bd-card bd-world-games" aria-label="Jolastokia"><span class="bd-kicker">JOLASTOKIA</span><h2>Jolastu eta praktikatu</h2><p>'+(count?"Praktika librea, presarik eta zigorrik gabe.":"Hasi jolasean; altxor berriak aurkitzean, hitz gehiago landuko dituzu.")+'</p>'+vocabularyControls()+'<div class="bd-world-game-grid"><button class="bd-game-tile bd-game-words" onclick="HBBidea.startWorldGame(\'words\')">'+svg("map")+'<span><strong>Hitzak lotu</strong><small>Lotu hitzak eta esanahiak</small></span>'+svg("arrow")+'</button><button class="bd-game-tile bd-game-links" onclick="HBBidea.startWorldGame(\'links\')">'+svg("bolt")+'<span><strong>'+(S.level==="a1a2"?"Non, nora, nondik?":"Loturen erronka")+'</strong><small>'+(S.level==="a1a2"?"Lekua, helmuga eta abiapuntua":"Kausa ala ondorioa?")+'</small></span>'+svg("arrow")+'</button><button class="bd-game-tile bd-game-verbs" onclick="HBBidea.startWorldGame(\'verbs\')">'+svg("bolt")+'<span><strong>Aditzen erronka</strong><small>Nor, nork eta nori?</small></span>'+svg("arrow")+'</button></div></section>'
}
function startWorldGame(kind){
 applyLevel();if(guestLimited()&&S.level!=="a1a2"){loginForMore();return}if(!["words","links","verbs"].includes(kind))return;if(kind==="words")return prepareVocabulary();openWorldGame(kind,worldGameItems(kind));
}
function openWorldGame(kind,items,vocabulary={}){
 if(!items.length)return;
 const L={id:"HB-WORLD-GAME-"+kind,title:kind==="recall"?"Gogoratu":kind==="verbs"?"Aditzen erronka":kind==="words"?"Hitzak lotu":S.level==="a1a2"?"Non, nora, nondik?":"Loturen erronka",keys:[],items};
 player={mode:"worldgame",owner:keyFor(KEY),L,kind,vocabularyMode:vocabulary.mode,vocabularyReason:vocabulary.reason,vocabularyLevel:vocabulary.level,phase:"play",queue:items.map(item=>({item,retry:false})),pos:0,first:0,errors:new Set(),combo:0,best:0,xp:0,lastPct:0,lastXp:0,state:null,quit:false};
 player.state=fresh(cur());const el=ensureEl();render();el.focus?.()
}
function worldGameEnd(){if(player.kind==="recall")return '<div class="bd-pwrap bd-endwrap">'+top()+'<main class="bd-end">'+bira("calm","bd-bira-lg")+'<span class="bd-kicker">GOGORATU</span><h1>Errepasoa eginda!</h1><p>Ikasitakoa berriro landu duzu. Beste egun batean itzuliko gara egitura hauetara.</p></main><footer class="bd-pfoot"><button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.close()">Amaitu</button></footer></div>';return '<div class="bd-pwrap bd-endwrap">'+top()+'<main class="bd-end">'+bira("calm","bd-bira-lg")+'<span class="bd-kicker">JOLASTOKIA</span><h1>Jolasa amaituta!</h1><p>Abenturako hizkuntza berriz landu duzu.</p><p class="bd-note">Nahi duzunean itzul zaitezke.</p></main><footer class="bd-pfoot"><button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.startWorldGame(\''+player.kind+'\')">Berriro jolastu</button><button class="bd-btn bd-btn-ghost" onclick="HBBidea.close()">Amaitu</button></footer></div>'}

/* First contextual error-memory extension, integrated with Gogoratu.
   Only known, closed contrasts; no inference about unrestricted writing. */
const EP_REVIEW_DAY=86400000;
const EP_REVIEW_INTERVALS=[1,3,7,14,30];
const LOCATIVE_FORMS=[["basoan","basora","basotik"],["errekan","errekara","errekatik"],["mendian","mendira","menditik"],["eskolan","eskolara","eskolatik"],["parkean","parkera","parketik"],["herrian","herrira","herritik"],["plazan","plazara","plazatik"],["liburutegian","liburutegira","liburutegitik"]];
const LOCATIVE_TAGS=["non","nora","nondik"];
const LOCATIVE_ITEMS=new Set(["HB-EP-FOREST-01-5","HB-EP-FOREST-01-6","HB-EP-FOREST-02-6","HB-EP-FOREST-03-1","HB-EP-FOREST-03-2","HB-EP-FOREST-03-3","HB-EP-FOREST-03-5","HB-EP-FOREST-03-6","HB-EP-FOREST-04-6","HB-EP-FOREST-05-2","HB-EP-FOREST-05-3"]);
const ERROR_RECALL=[
 {id:"HB-RECALL-NON",code:"non",level:"a1a2",t:"mc",q:"Ane liburu bat irakurtzen ari da. Orain ____ dago.",ch:["liburutegira","liburutegitik","liburutegian"],a:["liburutegian"],ex:"Non dago? Lekua adierazteko: liburutegian."},
 {id:"HB-RECALL-NORA",code:"nora",level:"a1a2",t:"mc",q:"Ane etxean dago. Orain ____ joango da.",ch:["liburutegitik","liburutegira","liburutegian"],a:["liburutegira"],ex:"Nora joango da? Helmuga adierazteko: liburutegira."},
 {id:"HB-RECALL-NONDIK",code:"nondik",level:"a1a2",t:"mc",q:"Anek liburutegia utzi du. ____ atera da.",ch:["Liburutegitik","Liburutegian","Liburutegira"],a:["Liburutegitik"],ex:"Nondik atera da? Abiapuntua adierazteko: liburutegitik."},
 {id:"HB-RECALL-CAUSE",code:"cause",level:"b1b2",t:"mc",q:"Ez dugu kontzertua aire zabalean egingo. ____, euria ari du.",ch:["Beraz","Izan ere"],a:["Izan ere"],ex:"Euria da kontzertua kanpoan ez egitearen arrazoia."},
 {id:"HB-RECALL-RESULT",code:"result",level:"b1b2",t:"mc",q:"Euria ari du. ____, kontzertua barruan egingo dugu.",ch:["Izan ere","Beraz"],a:["Beraz"],ex:"Kontzertua barruan egitea euriaren ondorioa da."}
,{id:"HB-RECALL-NOR-VERB",code:"nor",level:"a1a2",t:"mc",q:"Iker etxera itzuli ____.",ch:["du","da","dio"],a:["da"],ex:"Iker da itzuli dena.",why:{du:"Hemen ez dago objekturik: Iker da itzuli dena.",dio:"Hemen ez dago hartzailerik: Iker da itzuli dena."}},
 {id:"HB-RECALL-NORNORK",code:"nornork",level:"b1b2",t:"mc",q:"Kaik papera hartu ____.",ch:["da","dio","du"],a:["du"],ex:"Kaik hartu du; papera da objektua.",why:{da:"Kai da egilea eta papera da objektua; biak adizkian jasotzen dira.",dio:"Ez da hartzailerik aipatzen."}},
 {id:"HB-RECALL-NORINORK",code:"nornorinork",level:"b1b2",t:"mc",q:"Nik Aneri giltza eman ____. (Ane da hartzailea.)",ch:["dut","diot","dizut"],a:["diot"],ex:"Nik eman diot Aneri giltza.",why:{dut:"Ane da hartzailea: harekiko komunztadura ere behar dugu.",dizut:"Hartzailea Ane da, ez zu."}}
,{id:"HB-RECALL-NOR-VERB-2",code:"nor",level:"a1a2",t:"mc",q:"Miren geltokira iritsi ____.",ch:["da","du","dio"],a:["da"],ex:"Miren da iritsi dena.",why:{du:"Ez da objekturik aipatzen.",dio:"Ez da hartzailerik aipatzen."}},
 {id:"HB-RECALL-NORNORK-2",code:"nornork",level:"a1a2",t:"mc",q:"Jonek poltsa hartu ____.",ch:["da","du","dio"],a:["du"],ex:"Jonek hartu du poltsa.",why:{da:"Jon da egilea; poltsa da objektua.",dio:"Ez da hartzailerik aipatzen."}}
,{id:"HB-RECALL-NON-2",code:"non",level:"a1a2",t:"mc",q:"Haurrak jolasean ari dira. ____ daude, zuhaitzen artean.",ch:["parketik","parkean","parkera"],a:["parkean"],ex:"Non daude? Parkean. Lekua adierazten du."},
 {id:"HB-RECALL-NORA-2",code:"nora",level:"a1a2",t:"mc",q:"June etxean dago. Lagunekin elkartzeko, ____ joango da.",ch:["plazatik","plazan","plazara"],a:["plazara"],ex:"Nora joango da? Plazara. Helmuga adierazten du."},
 {id:"HB-RECALL-NONDIK-2",code:"nondik",level:"a1a2",t:"mc",q:"Eskola amaitu da. Haurrak ____ atera dira.",ch:["eskolara","eskolatik","eskolan"],a:["eskolatik"],ex:"Nondik atera dira? Eskolatik. Abiapuntua adierazten du."},
 {id:"HB-RECALL-CAUSE-2",code:"cause",level:"b1b2",t:"mc",q:"Ez gara mendira joango. ____, eguraldi txarra iragarri dute.",ch:["Beraz","Izan ere"],a:["Izan ere"],ex:"Eguraldiaren iragarpenak azaltzen du zergatik ez garen mendira joango."},
 {id:"HB-RECALL-RESULT-2",code:"result",level:"b1b2",t:"mc",q:"Denda itxita dago. ____, bihar itzuliko gara.",ch:["Izan ere","Beraz"],a:["Beraz"],ex:"Bihar itzultzea dendaren itxieraren ondorioa da."},
 {id:"HB-RECALL-NORINORK-2",code:"nornorinork",level:"b1b2",t:"mc",q:"Maialenek irakasleari koadernoa eman ____.",ch:["du","dio","diot"],a:["dio"],ex:"Maialen da egilea, koadernoa objektua eta irakaslea hartzailea.",why:{du:"Irakaslearekiko komunztadura ere behar dugu.",diot:"Egilea Maialen da, ez ni."}},
 {id:"HB-RECALL-NOR-VERB-3",code:"nor",level:"a1a2",t:"mc",q:"Lagunak geltokira iritsi ____.",ch:["dute","dira","da"],a:["dira"],ex:"Lagunak dira iritsi direnak.",why:{dute:"Ez da objekturik aipatzen.",da:"Lagunak plurala da."}},
 {id:"HB-RECALL-NORNORK-3",code:"nornork",level:"a1a2",t:"mc",q:"Anek bi sagar erosi ____.",ch:["du","ditu","da"],a:["ditu"],ex:"Anek erosi ditu bi sagarrak: objektua plurala da.",why:{du:"Bi sagar aipatzen dira; objektua plurala da.",da:"Egilea eta objektua ditugu."}}
].map(i=>({...i,src:"Jatorrizko berreskurapen ariketa / HB-ERROR-v1"}));
function classifyEpisodeError(it,response){
 const expected=norm(it.a?.[0]),actual=norm(response);
 const shelterNor=["HB-EP-SHELTER-01-1","HB-EP-SHELTER-01-5","HB-EP-SHELTER-02-2","HB-EP-SHELTER-05-1"],shelterNork=["HB-EP-SHELTER-01-2","HB-EP-SHELTER-02-3","HB-EP-SHELTER-05-5"];if(shelterNor.includes(it.id)&&["du","duzu","dute"].includes(actual))return {code:"nor",confused:actual,message:"Begiratu nor joan edo etorri den: ez da objekturik aipatzen."};if(shelterNork.includes(it.id)&&["naiz","da","dira"].includes(actual))return {code:"nornork",confused:actual,message:"Egilea eta objektua ditugu; begiratu biak."};
 if(it.code&&it.why?.[actual])return {code:it.code,confused:actual,message:it.why[actual]};
 if(!actual||!expected||isAccepted(response,it.a))return null;
 if(LOCATIVE_ITEMS.has(it.id)||it.id.startsWith("HB-RECALL-")&&it.level==="a1a2"){
  const forms=LOCATIVE_FORMS.find(f=>f.includes(expected)&&f.includes(actual));if(!forms)return null;
  const want=forms.indexOf(expected),got=forms.indexOf(actual);if(want===got)return null;
  const meaning=["lekua","helmuga","abiapuntua"],question=["Non?","Nora?","Nondik?"];
  return {code:LOCATIVE_TAGS[want],confused:LOCATIVE_TAGS[got],message:"«"+actual+"» formak "+meaning[got]+" adierazten du. Hemen "+meaning[want]+" behar dugu: "+question[want]+" Pentsatu berriro."}
 }
 if((it.id.startsWith("HB-EP-CAUSE-")||it.level==="b1b2"&&it.id.startsWith("HB-RECALL-"))&&it.t==="mc"){
  const want=groupOf(expected,DATA.groups),got=groupOf(actual,DATA.groups);
  if(["cause","result"].includes(want)&&["cause","result"].includes(got)&&want!==got)return {code:want,confused:got,message:got==="cause"?"Aukeratutako loturak arrazoia adierazten du. Hemen ondorioa behar dugu.":"Aukeratutako loturak ondorioa adierazten du. Hemen zergatia behar dugu."}
 }
 return null
}
function episodeErrorStore(){return S.episodeErrorMemory||(S.episodeErrorMemory={})}
function storeDifficulty(code,confused){const memory=episodeErrorStore(),old=memory[code]||{errors:0,recoveries:0},now=Date.now();memory[code]={...old,errors:(old.errors||0)+1,confused,lastErrorAt:now,dueAt:now+EP_REVIEW_DAY,step:0};save()}
function observePractice(id,answer){syncState();if(guestLimited()||!S.level)return false;const allowed={"HB07-err-1":{code:"nor",wrong:["du","dio"]},"HB07-err-2":{code:"nornork",wrong:["da","zaio"]},"HB07-err-3":{code:"nornorinork",wrong:["da","zaio"]}},rule=allowed[id],actual=norm(answer);if(!rule||!rule.wrong.includes(actual)||(rule.code==="nornorinork"&&S.level==="a1a2"))return false;storeDifficulty(rule.code,actual);return true}
function rememberEpisodeError(st,diagnosis){
 if(!diagnosis||st.errorRecorded||player.owner!==keyFor(KEY))return;
 st.errorRecorded=true;st.diagnosis=diagnosis.message;storeDifficulty(diagnosis.code,diagnosis.confused)
}
function dueEpisodeItems(){
 const now=Date.now(),memory=S.episodeErrorMemory||{};
 const eligible=ERROR_RECALL.filter(i=>(S.level==="b1b2"||i.level==="a1a2"||i.code==="nornork")&&Number.isFinite(memory[i.code]?.dueAt)&&memory[i.code].dueAt<=now);const groups=new Map();for(const i of eligible){if(!groups.has(i.code))groups.set(i.code,[]);groups.get(i.code).push(i)}return [...groups.values()].map(items=>items[((memory[items[0].code].probeCursor??memory[items[0].code].step??0)%items.length+items.length)%items.length]).sort((a,b)=>memory[a.code].dueAt-memory[b.code].dueAt).slice(0,3)
}
function recordEpisodeRecovery(it,st,e,ok){
 const recall=player.mode==="episode"&&player.segment==="recall"||player.mode==="worldgame"&&player.kind==="recall";
 if(!recall||player.owner!==keyFor(KEY)||!it.code||!ERROR_RECALL.some(i=>i.id===it.id)||e.retry||st.recallRecorded)return;
 const m=S.episodeErrorMemory?.[it.code],now=Date.now();if(!m||(m.dueAt>now&&!st.errorRecorded))return;
 st.recallRecorded=true;
 const assisted=!!(st.tries||st.hintUsed||st.errorRecorded);
 m.probeCursor=(m.probeCursor??m.step??0)+1;m.lastProbeId=it.id;m.lastProbeAt=now;m.lastProbeResult=ok?(assisted?"supported":"recognition"):"mismatch";
 if(ok&&!assisted){const step=Math.min((m.step||0)+1,EP_REVIEW_INTERVALS.length-1);m.step=step;m.recoveries=(m.recoveries||0)+1;m.lastRecoveryAt=now;m.dueAt=now+EP_REVIEW_INTERVALS[step]*EP_REVIEW_DAY}
 else{m.step=0;m.dueAt=now+EP_REVIEW_DAY}
 save()
}
function episodeNumber(){const ids=episodeIds(),draft=activeDraft();if(draft?.v===1&&ids.includes(draft.id))return ids.indexOf(draft.id)+1;const next=ids.findIndex(id=>!S.episodes?.[id]);return next<0?ids.length:next+1}
function saveEpisodeDraft(localOnly=false){
 const p=player;if(p?.mode!=="episode"||p.phase==="end"||p.owner!==keyFor(KEY))return;
 syncState();S[p.L.forest?"forestDraft":"episodeDraft"]={v:1,id:p.L.id,phase:p.phase,segment:p.segment,recall:p.recall.map(i=>i.id),queue:p.queue.map(e=>({id:e.item.id,retry:!!e.retry})),pos:p.pos,state:p.state,first:p.first,errors:[...p.errors],combo:p.combo,best:p.best,xp:p.xp};save(localOnly)
}
function restoreEpisodeDraft(L){
 const d=activeDraft();if(d?.v!==1||d.id!==L.id||!["gogoratu","intro","play","altxorra"].includes(d.phase)||!["recall","story"].includes(d.segment)||!Array.isArray(d.queue)||!Array.isArray(d.recall)||d.queue.length>24||d.recall.length>3)return null;
 const pool=new Map([...allLessons().flatMap(l=>l.items),...L.items,...ERROR_RECALL].map(i=>[i.id,i]));
 const queue=d.queue.map(e=>({item:pool.get(e.id),retry:!!e.retry})),recall=d.recall.map(id=>pool.get(id));
 if(queue.some(e=>!e.item)||recall.some(i=>!i)||!Number.isInteger(d.pos)||d.pos<0||d.pos>queue.length||(d.phase==="play"&&(!d.state||d.pos>=queue.length)))return null;
 return {mode:"episode",owner:keyFor(KEY),i:-1,L,phase:d.phase,segment:d.segment,recall,queue,pos:d.pos,state:d.state,first:d.first||0,errors:new Set(Array.isArray(d.errors)?d.errors:[]),combo:d.combo||0,best:d.best||0,xp:d.xp||0,lastPct:0,lastXp:0,quit:false}
}

function worldMissionHtml(){
 const ids=episodeIds(),count=ids.filter(id=>S.episodes?.[id]).length;
 const d=activeDraft(),draft=d?.v===1&&ids.includes(d.id)?d:null;
 const list=ids.map((id,i)=>{
  const n=i+1,L=episodeLesson(n),done=!!S.episodes?.[id],open=n===1||!!S.episodes?.[ids[i-1]],paused=draft?.id===id,blocked=!!draft&&!paused,can=!!L&&open&&!blocked;
  const current=can&&(paused||(!done&&n===episodeNumber()));const status=paused?"Jarraitu":done?"Amaituta · Berriro bizi":open?"Hasi":"Aurreko atala amaitu";
  return '<li class="bd-world-step '+(done?"is-done":can?"is-ready":"is-locked")+(current?" is-current":"")+'"><button type="button" class="bd-world-step-btn" '+(current?'aria-current="step" ':"")+(can?'onclick="HBBidea.startEpisode('+n+')"':'disabled')+'><span class="bd-world-step-num">'+n+'</span><span class="bd-world-step-copy"><strong>'+esc(L?.title||"Atala")+'</strong><small>'+esc(blocked?"Jarraitu irekita duzun atala":status)+'</small></span>'+svg(can?(done?"check":"play"):"lock")+'</button></li>';
 }).join("");
 return '<div class="bd-world-mission"><span class="bd-kicker">'+(S.level==="a1a2"?"KONDAIREN ZAINDARIAK":"HITZBIRA WORLD")+'</span><div class="bd-world-mission-head"><h2>'+(S.level==="a1a2"?forestTitle():"Uraren misterioa")+'</h2></div>'+missionProgress(false)+'<p class="bd-note">Jarraitu istorioa, atalez atal.</p><ol class="bd-world-path">'+list+'</ol></div>'
}
function resumeLabel(){const d=activeDraft();if(!d)return "";const phase=({gogoratu:"Gogoratu",intro:"Eszena",play:"Erronka",altxorra:"Altxorra"})[d.phase];return phase?"<p class=\"bd-note\">Gordetako urratsa: "+esc(phase)+(d.phase==="play"&&d.segment==="story"?" · "+Math.min(d.pos+1,7)+"/7":"")+"</p>":""}
function episodeCard(){if(S.level==="a1a2"&&!inShelter()&&shelterUnlocked()&&!S.forestDraft&&!S.episodes?.[SHELTER_IDS[0]])return '<section class="bd-card bd-today"><div class="bd-today-body"><span class="bd-kicker">KONDAIREN ZAINDARIAK · ABENTURA BERRIA</span><h2>Aterpetxeko giltza</h2><p>Euria hasi da! Lagundu Aneri eta Ikerri aterpea aurkitzen.</p><button class="bd-btn bd-btn-main" onclick="HBBidea.chooseForestMission(2,true)">'+svg("play")+' Hasi abentura berria</button></div><div class="bd-today-art" aria-hidden="true">'+bira("curious","bd-bira-hero")+'</div></section>';const n=episodeNumber(),L=episodeLesson(n);if(!L)return "";return '<section class="bd-card bd-today"><div class="bd-today-body"><span class="bd-kicker">'+(L.forest?"KONDAIREN ZAINDARIAK":"HITZBIRA WORLD")+' · '+n+'. ATALA</span><h2>'+esc(L.title)+'</h2><p>'+(L.shelter?"Ane eta Ikerrekin argitu aterpetxeko misterioa.":L.forest?"Ane, Iker eta Lurrekin aurkitu basoko mezua.":"Argirekin ikertu herriko uraren misterioa.")+'</p><div class="bd-hero-meta"><span class="bd-chip">7 erronka</span><span class="bd-chip">8–12 min inguru</span></div>'+resumeLabel()+'<button class="bd-btn bd-btn-main" onclick="HBBidea.startEpisode()">'+svg("play")+' '+(activeDraft()?.id===L.id?"Jarraitu abenturarekin":S.episodes?.[L.id]?"Berriro bizi":"Abentura hasi")+'</button></div><div class="bd-today-art" aria-hidden="true">'+bira("curious","bd-bira-hero")+'</div></section>'}
function startEpisode(n){
 applyLevel();if(guestLimited()&&S.level!=="a1a2"){loginForMore();return}n=n||episodeNumber();const L=episodeLesson(n);const ids=episodeIds(),d=activeDraft();if(!L||(n>1&&!S.episodes?.[ids[n-2]])||(d?.v===1&&ids.includes(d.id)&&d.id!==L.id))return;
 const saved=restoreEpisodeDraft(L);if(saved){player=saved;const el=ensureEl();render();el.focus?.();return}
 const previous=[...dueEpisodeItems(),...(guestLimited()?[]:dueReviews(S.lessons,lessons()).flatMap(x=>x.lesson.items.filter(it=>it.t==="mc")))].slice(0,3);
 player={mode:"episode",owner:keyFor(KEY),i:-1,L,phase:"gogoratu",segment:"recall",recall:previous,queue:previous.map(item=>({item,retry:false})),pos:0,first:0,errors:new Set(),combo:0,best:0,xp:0,lastPct:0,lastXp:0,state:null,quit:false};
 const el=ensureEl();render();el.focus?.()
}
function episodeGogoratu(){return '<div class="bd-pwrap">'+top()+'<main class="bd-intro"><span class="bd-kicker">1 · GOGORATU</span><h1>'+(player.recall.length?"Zer gogoratzen duzu?":"Prest al zaude?")+'</h1>'+bira("curious","bd-bira-lg")+'<p>'+(player.recall.length?"Aurreko jardueretako galdera batzuk, pistarik gabe hasita.":(player.L.forest?"Oraingoz ez dago berrikusteko jarduerarik. Pentsatu: nora joan nahi duzu?":"Oraingoz ez dago berrikusteko jarduerarik. Pentsatu: nola azalduko zenuke zerbaiten zergatia?"))+'</p></main><footer class="bd-pfoot"><button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.begin()">'+(player.recall.length?"Gogoratu":"Goazen istorioara")+' '+svg("arrow")+'</button></footer></div>'}
function episodeScene(){player.segment="story";player.phase="intro";player.queue=player.L.items.map(item=>({item,retry:false}));player.pos=0;player.state=null;player.first=0;player.errors=new Set();player.combo=0;player.best=0;player.xp=0;player.lastPct=0;render()}
function episodeTreasure(){const t=episodeTreasures()[player.L.n-1];return '<div class="bd-pwrap">'+top()+'<main class="bd-intro bd-treasure-screen"><span class="bd-kicker">4 · ALTXORRA</span><h1>Altxor berria!</h1>'+treasureCard(t,true)+(help()?'<p class="bd-es">'+esc(t.es)+'</p>':"")+'</main><footer class="bd-pfoot"><button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.finishEpisode()">Gorde eta jarraitu '+svg("arrow")+'</button></footer></div>'}
function finishEpisode(){if(!player||player.mode!=="episode"||player.phase!=="altxorra")return;if(player.owner!==keyFor(KEY)){close();return}syncState();S.episodes=S.episodes||{};S.episodes[player.L.id]={visitedAt:Date.now(),treasure:episodeTreasures()[player.L.n-1].id};delete S[draftKey()];save();player.phase="end";render()}
function episodeEnd(){if(player.L.shelter){const n=player.L.n,t=SHELTER_TREASURES[n-1];return '<div class="bd-pwrap bd-endwrap">'+top()+'<main class="bd-end">'+bira("calm","bd-bira-lg")+'<span class="bd-kicker">5 · HURRENGOA</span><h1>'+(n===5?"Bigarren abentura amaitu duzu!":"Arrasto berri bat!")+'</h1><p>'+esc(["Nork egin du zerbait? Hurrengoan, taldearen ekintzak kontatuko dituzu.","Atea ireki duzue. Zer ote dago kutxan?","Bi gutun aurkitu dituzue. Kontatu gertatutakoa!","Birak zuen mezua entzun nahi du.","Gutuneko mapak hurrengo abenturaren bidea erakusten du."] [n-1])+'</p><span class="bd-chip">'+svg("star")+' '+esc(t.title)+' · Nire altxorrak</span></main><footer class="bd-pfoot">'+(n<5?'<button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.startEpisode('+(n+1)+')">Hurrengo atala '+svg("arrow")+'</button>':'<button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.startWorldGame(\'words\')">Jolastokira '+svg("arrow")+'</button>')+'<button class="bd-btn bd-btn-ghost" onclick="HBBidea.close()">Gaurkoz amaitu</button></footer></div>'}if(player.L.forest){const n=player.L.n,t=FOREST_TREASURES[n-1],head=["Mezua aurkitu duzu!","Basoko hitzak aurkitu dituzu!","Bidea azaltzen ari zara!","Errekara iritsi zarete!","Ibilbidea osatu duzu!"][n-1],learned=["Non, nora eta nondik galderak landu dituzu.","Basoko hitzak landu dituzu.","Lekuak, helmugak eta abiapuntuak bereizten aritu zara.","Mapa irakurri eta bidea aukeratu duzu.","Ibilbide berri bat azaltzen aritu zara."][n-1],hook=["Nor bizi ote da basoan?","Hiru amaierek zer esan nahi dute?","Zein bidek eramango zaituzte errekara?","Orain, azaldu zuk beste ibilbide bat.","Mezuaren egilea nor den ez dakigu oraindik. Baina lehen misioa amaitu duzu."][n-1];return '<div class="bd-pwrap bd-endwrap">'+top()+'<main class="bd-end">'+bira("calm","bd-bira-lg")+'<span class="bd-kicker">5 · HURRENGOA</span><h1>'+esc(head)+'</h1><p>'+esc(learned)+'</p><p>'+esc(hook)+'</p><span class="bd-chip">'+svg("star")+' '+esc(t.title)+' · Nire altxorrak</span></main><footer class="bd-pfoot">'+(n<FOREST_IDS.length?'<button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.startEpisode('+(n+1)+')">Hurrengo atala '+svg("arrow")+'</button>':'<button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.chooseForestMission(2,true)">Hurrengo abentura '+svg("arrow")+'</button>')+'<button class="bd-btn bd-btn-ghost" onclick="HBBidea.close()">Gaurkoz amaitu</button></footer></div>'}
 const n=player.L.n,head=["Lehen arrastoa aurkitu duzu!","Errotaren atarian!","Sekretua argitzen hasi da!","Azken arrastoa aurkitu duzu!","Misterioa argituta!"][n-1],learned=["Zergatia eta ondorioa bereizteko jarduerak landu dituzu.","Zergatia adierazteko bi modu landu dituzu.","Arazo baten zergatia azaltzen eta irtenbide bat proposatzen aritu zara.","Arrastoak eta erabakiak lotzen aritu zara.","Kausa eta ondorioa erabiliz, herritarrei gertatutakoa azaltzen aritu zara."][n-1],hook=["Argik hodi hautsiaren ondoan giltza zahar bat aurkitu du. Zer irekitzen ote du?","Kaik atearen atzean zarata bat entzun du. Zer ote dago barruan?","Hodia garbitzean, paper zahar bat agertu da. Nork utzi ote du han?","Mapak azken oztopora eraman zaituzte. Herritarrekin konponduko ote duzue?","Ura berriro dabil eta herriak auzolanean konpondu du arazoa. Misioa amaitu duzu."][n-1];
 return '<div class="bd-pwrap bd-endwrap">'+top()+'<main class="bd-end">'+bira("calm","bd-bira-lg")+'<span class="bd-kicker">5 · HURRENGOA</span><h1>'+esc(head)+'</h1><p>'+esc(learned)+'</p><p>'+esc(hook)+'</p><span class="bd-chip">'+svg("star")+' '+esc(EP_TREASURES[n-1].title)+' · Nire altxorrak</span>'+(n===EPISODE_IDS.length?'<p class="bd-note">Nahi baduzu, Jolastokian abenturako hitzekin jolastu.</p>':"")+'</main><footer class="bd-pfoot">'+(n<EPISODE_IDS.length?'<button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.startEpisode('+(n+1)+')">Hurrengo atala '+svg("arrow")+'</button><button class="bd-btn bd-btn-ghost" onclick="HBBidea.close()">Gaurkoz amaitu</button>':'<button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.startWorldGame(\'words\')">Jolastokira '+svg("arrow")+'</button><button class="bd-btn bd-btn-ghost" onclick="HBBidea.close()">Gaurkoz amaitu</button>')+'</footer></div>'
}

function updatePlayerViewport(){const el=document.getElementById("bd-player"),v=root.visualViewport;if(el?.style&&v?.height>0)el.style.setProperty("--bd-visible-height",Math.floor(v.height)+"px")}
root.visualViewport?.addEventListener?.("resize",updatePlayerViewport);
function ensureEl(){let el=document.getElementById("bd-player");if(!el){el=document.createElement("div");el.id="bd-player";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Ikasgaia");document.body.appendChild(el)}document.documentElement.classList.add("bd-lock");el.hidden=false;updatePlayerViewport();return el}
function supplementaryPracticeHtml(){syncState();if(guestLimited()||!S.level)return "";return `<details class="academy-search"><summary>Abenturako praktika gehiago</summary><div class="bd-supplementary-list">${lessons().map((L,i)=>`<button class="bd-game-tile" onclick="HBBidea.start(${i},true)">${svg("play")}<span><strong>${esc(L.title)}</strong><small>${done(L.id)?"Berriro praktikatu":"Praktikatu"}</small></span>${svg("arrow")}</button>`).join("")}</div></details>`}
function start(i,supplementary=false){syncState();if(guestLimited()){loginForMore();return}const L=lessons()[i];if(!L||(!supplementary&&!unlocked(i)))return;player={mode:"lesson",supplementary:supplementary===true,i,L,phase:"intro",queue:L.items.map(x=>({item:x,retry:false})),pos:0,first:0,errors:new Set(),combo:0,best:0,xp:0,lastPct:0,lastXp:0,state:null,quit:false};
 const el=ensureEl();render();el.focus?.()}
function startReview(lessonId){syncState();if(guestLimited()){loginForMore();return}const L=allLessons().find(x=>x.id===lessonId);if(!L)return;const pool=L.items.filter(x=>x.t!=="write");const picked=shuffle(pool.length?pool:L.items).slice(0,5);
 player={mode:"review",i:-1,L,phase:"play",queue:picked.map(x=>({item:x,retry:false})),pos:0,first:0,errors:new Set(),combo:0,best:0,xp:0,lastPct:0,lastXp:0,state:null,quit:false,totalInit:picked.length};
 player.state=fresh(cur());const el=ensureEl();render();el.focus?.()}
function startAgendaReview(){if(guestLimited()){loginForMore();return}const ag=root.HitzBiraAgenda?.agenda?.()||[],due=ag.find(r=>r.status==="due");if(due&&typeof root.startCurriculum==="function")root.startCurriculum(due.node,null,true,due.key)}
function startTest(){syncState();if(guestLimited()){loginForMore();return}player={mode:"test",phase:"play",queue:DATA.placement.map(x=>({item:x})),pos:0,score:0,row:0,state:null,quit:false,xp:0,combo:0,lastPct:0,lastXp:0};player.state=fresh(cur());const el=ensureEl();render();el.focus?.()}
function close(silent){vocabularyRepo?.cancel();const el=document.getElementById("bd-player");if(el){el.hidden=true;el.innerHTML=""}document.documentElement.classList.remove("bd-lock");player=null;if(!silent)refresh()}
function askQuit(){if(!player)return;if(player.mode==="episode"||player.mode==="worldgame"){saveEpisodeDraft();close();return}if(player.phase!=="play"||player.mode==="test"){close();return}player.quit=!player.quit;render()}
function cur(){return player.queue[player.pos]}
function fresh(entry){const it=entry.item,st={sel:null,typed:"",tiles:[],picked:[],tapped:null,mistap:false,checked:false,ok:false,tries:0,wrongSel:[],hintOn:false,hintUsed:false};
 if(it.t==="chips")st.opts=chipsFor(it,DATA.groups);
 if(it.t==="mc")st.opts=player&&player.mode==="test"?shuffle(it.ch):it.ch;
 if(it.t==="build"){const t=tilesFor(it.a[0]);if(it.x)t.push(it.x);st.tiles=shuffle(t.map((w,k)=>({w,k})));}
 if(it.t==="fix"){st.tokens=fixTokens(it);st.opts=fixOptions(it,DATA.groups)}
 if(it.t==="match"){st.right=shuffle(it.pairs.map((p,k)=>k));st.left=null;st.matched=[];st.flash=null;st.vocabularyAttempts={}}
 return st}
function progressPct(){const total=Math.max(1,player.queue.length),done=player.phase==="intro"?0:(player.phase==="end"||player.phase==="placed"||player.phase==="altxorra")?total:player.pos+((player.state&&player.state.checked)||player.busy?1:0);return {done,total,pct:Math.round(done/total*100)}}
function render(){const el=document.getElementById("bd-player");if(!el||!player)return;if((player.mode==="episode"||player.mode==="worldgame")&&player.owner!==keyFor(KEY)){close();return}saveEpisodeDraft();const at=player.mode+player.phase+":"+player.pos,changed=el.dataset.at!==at,oldScroll=el.querySelector(".bd-pgrid,.bd-intro,.bd-end")?.scrollTop||0;if(changed){el.dataset.at=at;el.scrollTop=0}el.dataset.level=S.level||"a1a2";el.dataset.mode=player.mode;
 if(player.phase==="loading"){el.innerHTML='<div class="bd-pwrap"><main class="bd-end"><p role="status">Hitzak prestatzen…</p><button class="bd-btn bd-btn-ghost" onclick="HBBidea.close()">Itxi</button></main></div>';return}
 const prevPct=player.lastPct||0,prog=progressPct();
 el.innerHTML=player.phase==="gogoratu"?episodeGogoratu():player.phase==="altxorra"?episodeTreasure():player.phase==="intro"?intro():player.phase==="end"?(player.mode==="episode"?episodeEnd():player.mode==="worldgame"?worldGameEnd():end()):player.phase==="placed"?placed():play();
 const bar=el.querySelector(".bd-bar-fill");
 if(player.mode!=="episode"&&bar&&prevPct!==prog.pct&&typeof root.requestAnimationFrame==="function"){bar.style.width=prevPct+"%";root.requestAnimationFrame(()=>{bar.style.width=prog.pct+"%"})}
 player.lastPct=prog.pct;player.lastXp=player.xp;
 const content=el.querySelector(".bd-pgrid,.bd-intro,.bd-end");if(content)content.scrollTop=changed?0:oldScroll;
 const f=el.querySelector("[data-focus]");if(f)f.focus({preventScroll:true})}
function episodeProgress(){
 const p=player,stage=p.phase==="gogoratu"||(p.phase==="play"&&p.segment==="recall")?0:p.phase==="intro"?1:p.phase==="play"?2:p.phase==="altxorra"?3:4;
 const items=p.queue,done=items.slice(0,p.pos).filter(e=>!e.retry).length+(p.state?.checked&&!items[p.pos]?.retry?1:0),total=stage===2?p.L.items.length:stage===0?p.recall.length:0;
 const fraction=total?Math.min(1,done/total):0,pct=stage===4?100:Math.round(stage*20+((stage===0||stage===2)?fraction*20:0));
 const label=stage===2?(items[p.pos]?.retry?"Errepasoa":Math.min(total,p.pos+1)+"/"+total):stage===0&&total&&p.phase==="play"?Math.min(total,p.pos+1)+"/"+total:(stage+1)+"/5";
 return {stage,pct,label};
}
function episodeTop(){
 const {stage,pct,label}=episodeProgress(),stages=["Gogoratu","Eszena","Erronka","Altxorra","Hurrengoa"];
 return '<header class="bd-ptop bd-episode-top"><div class="bd-player-context"><span>'+esc(currentAdventureTitle())+'</span><strong>'+esc(player.L.title)+'</strong></div><button class="bd-x" onclick="HBBidea.askQuit()" aria-label="Itxi">'+svg("x")+'</button><div class="bd-bar bd-episode-bar" role="progressbar" aria-label="Atalaren aurrerapena" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><span class="bd-bar-fill" style="width:'+pct+'%"></span></div><span class="bd-step-count">'+esc(label)+'</span><ol class="bd-episode-stages" aria-label="Ataleko urratsak">'+stages.map((s,i)=>'<li class="'+(i<stage?"is-done":i===stage?"is-current":"")+'"'+(i===stage?' aria-current="step"':'')+'><span class="bd-stage-dot">'+(i<stage?svg("check"):i+1)+'</span><span class="bd-stage-name">'+s+'</span></li>').join("")+'</ol></header>';
}
function top(){if(player.mode==="episode")return episodeTop();const {done,total,pct}=progressPct(),xpBump=player.xp>(player.lastXp||0);
 const stepText=player.phase==="gogoratu"?"Gogoratu":player.phase==="altxorra"?"Altxorra":player.phase==="intro"?"Sarrera":player.phase==="end"||player.phase==="placed"?`${total}/${total}`:`${Math.min(player.pos+1,total)}/${total}`;
 const rightBadge=player.mode==="worldgame"?`<span class="bd-step-count">${stepText}</span>`:player.mode==="episode"?`<span class="bd-step-count">${stepText}</span>`:player.mode==="test"?`<span class="bd-xp">${stepText}</span>`:`<span class="bd-step-count">${stepText}</span><span class="bd-xp${player.combo>=2?" is-combo":""}${xpBump?" is-bump":""}">${player.combo>=2?svg("bolt")+player.combo+" · ":""}${player.xp} XP</span>`;
 return `<header class="bd-ptop"><button class="bd-x" onclick="HBBidea.askQuit()" aria-label="Itxi">${svg("x")}</button><div class="bd-bar" role="progressbar" aria-label="Ikasgaiaren aurrerapena" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}"><span class="bd-bar-fill${player.combo>=2?" is-charged":""}" style="width:${pct}%"></span></div>${rightBadge}</header>`}

/* Ikasgaiaren sarrera: elkarrizketa + «giltzak» bisualki */
function learnHtml(L){
 if(L.shelter)return `<div class="bd-keys"><p class="bd-tip"><span>${esc(L.example)}${help()?`<small>${esc(L.exampleEs)}</small>`:""}</span></p></div>`;
 if(L.learn==="cases")return `<div class="bd-cases">${L.keys.map(k=>{const c=caseInfo(k);return `<div class="bd-case ${c.cls}">${svg(c.ico)}<span class="bd-case-tag">${c.tag}</span><b>${caseWord(k)}</b>${help()&&DATA.gloss[k]?`<small>${esc(DATA.gloss[k])}</small>`:""}</div>`}).join("")}</div>`;
 if(L.learn==="words"){const ic={mendia:"mountain",basoa:"trees",erreka:"river",bidea:"path",zubia:"bridge"};return `<div class="bd-words">${L.keys.map(k=>`<div class="bd-word-card">${svg(ic[k]||"star")}<b>${esc(k)}</b>${help()&&DATA.gloss[k]?`<small>${esc(DATA.gloss[k])}</small>`:""}</div>`).join("")}</div>`}
 if(L.learn==="table"){const rows=[["baso","basoan","basora","basotik"],["eskola","eskolan","eskolara","eskolatik"],["parke","parkean","parkera","parketik"]];
  return `<div class="bd-table-wrap"><table class="bd-table"><thead><tr><th></th><th class="c-in">${svg("pin")}NON?</th><th class="c-to">${svg("into")}NORA?</th><th class="c-from">${svg("outof")}NONDIK?</th></tr></thead><tbody>${rows.map(r=>`<tr><th>${esc(r[0])}</th>${r.slice(1).map(w=>`<td>${caseWord(w)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`}
 if(L.learn==="nornork"){const rows=[["Ni / Nik","joan naiz","liburua irakurri dut"],["Zu / Zuk","itzuli zara","kafea prestatu duzu"],["Ane / Anek","etorri da","ogia erosi du"]];
  return `<div class="bd-table-wrap"><table class="bd-table"><thead><tr><th></th><th class="c-in">NOR</th><th class="c-to">NOR-NORK</th></tr></thead><tbody>${rows.map(r=>`<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</tbody></table></div>`}
 if(L.learn==="nornork_pl"){const rows=[["Gu / Guk","iritsi gara","giltza hartu dugu"],["Bi lagun / Bi lagunek","etorri dira","ogia erosi dute"]];
  return `<div class="bd-table-wrap"><table class="bd-table"><thead><tr><th></th><th class="c-in">NOR</th><th class="c-to">NOR-NORK</th></tr></thead><tbody>${rows.map(r=>`<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</tbody></table></div>`}
 if(L.learn==="obj_num"){const rows=[["Nik","liburu bat → dut","bi liburu → ditut"],["Zuk","txartel bat → duzu","bi txartel → dituzu"],["Guk","liburu bat → dugu","bi liburu → ditugu"],["Bi lagunek","tomate bat → dute","hiru tomate → dituzte"]];
  return `<div class="bd-table-wrap"><table class="bd-table"><thead><tr><th></th><th class="c-in">1 objektu</th><th class="c-to">2+ objektu</th></tr></thead><tbody>${rows.map(r=>`<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</tbody></table></div>`}
 if(L.learn==="order")return `<div class="bd-order">${L.keys.map((k,i)=>`<span><i>${i+1}</i><b>${esc(k)}</b>${help()&&DATA.gloss[k]?`<small>${esc(DATA.gloss[k])}</small>`:""}</span>`).join(svg("arrow"))}</div>`;
 /* B1–B2: lokailuen norabidea */
 const special={"-lako":"lako",baina:"baina",arren:"arren","nahiz eta":"nahiz"};
 const seen=new Set(),rows=[],patterns=L.patterns||DATA.patterns;for(const k of L.keys){const g=special[k.toLowerCase()]||groupOf(k,DATA.groups);if(!g||seen.has(g)||!patterns[g])continue;seen.add(g);rows.push([k,patterns[g],g])}
 return `<div class="bd-flows">${rows.map(([k,p,g])=>flow(p,special[k.toLowerCase()]?"":k)).join("")}</div>`}
function flow(p,k,compact){const kk=k&&k!=="-lako"?caseLike(k,true)+",":p.k;
 return `<div class="bd-flow bd-flow-${p.dir}${compact?" is-compact":""}"><span class="bd-flow-tag">${p.dir==="back"?"←":p.dir==="cross"?"⇄":"→"} ${esc(p.tag)}</span><div class="bd-flow-row"><span class="bd-flow-a">${esc(p.a)}</span>${kk?`<b class="bd-flow-k">${esc(kk)}</b>`:""}<span class="bd-flow-b">${esc(p.b)}</span></div>${compact?"":`<small>${esc(p.why)}${help()?` · <i>${esc(p.es)}</i>`:""}</small>`}</div>`}
function sceneHtml(L){if(L.talk)return `<div class="bd-talk">${L.talk.map(([w,t,es],k)=>`<div class="bd-say${w==="bira"?" is-bira":""}" style="--k:${k}">${face(w)}<div><small class="bd-who">${esc((DATA.cast[w]||{}).name||w)}</small><p>${esc(t)}</p>${help()?`<small class="bd-es">${esc(es)}</small>`:""}</div></div>`).join("")}</div>`;
 return `<div class="bd-scene">${bira("curious","bd-bira-lg")}<div class="bd-bubble bd-bubble-big"><p>${esc(L.scene)}</p>${help()?`<small>${esc(L.sceneEs)}</small>`:""}</div></div>`}
function intro(){const L=player.L,ch=chapterOf(L.id);return `<div class="bd-pwrap">${top()}<main class="bd-intro">
 <span class="bd-kicker">${player.mode==="episode"?"2 · ESZENA":esc(ch.title.toUpperCase())+" · "+L.n+". IKASGAIA"}</span><h1>${esc(L.title)}</h1>${help()?`<p class="bd-es">${esc(L.es)}</p>`:""}
 ${player.mode==="episode"?episodeLandscape(L.n):""}${sceneHtml(L)}${L.map?`<div class="bd-mapwrap">${MAPS[L.map]}</div>`:""}
 <div class="bd-keys"><span class="bd-kicker">GAURKO GILTZAK</span>${learnHtml(L)}<p class="bd-tip">${svg("bolt")}<span>${esc(L.tip)}${help()?`<small>${esc(L.tipEs)}</small>`:""}</span></p></div>
 </main><footer class="bd-pfoot"><button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.begin()">Goazen! ${svg("arrow")}</button></footer></div>`}
function begin(){if(player.phase==="gogoratu"&&!player.recall.length){episodeScene();return}player.phase="play";player.pos=0;player.state=fresh(cur());render()}
const TYPE={mc:"Aukeratu erantzun egokia",gap:"Idatzi falta dena",chips:"Osatu esaldia",fix:"Aurkitu akatsa eta zuzendu",build:"Eraiki esaldia",match:"Lotu bikoteak",write:"Zure txanda: idatzi"};
const TYPE_B={mc:"Aukeratu lokailu egokia",gap:"Idatzi falta den lokailua",build:"Eraiki esaldi berria"};
function blankHtml(q,fill){const parts=esc(q).split("____");return parts.join(`<span class="bd-blank${fill?" is-filled":""}">${fill?esc(fill):"&nbsp;"}</span>`)}
function optBtns(opts,it,st,cls=""){return `<div class="bd-opts${cls}">${opts.map((o,k)=>{const tried=st.wrongSel.includes(o);let c="";if(st.checked){if(isAccepted(o,it.a))c=" is-right";else if(o===st.sel||tried)c=" is-wrong"}else if(tried)c=" is-tried";else if(o===st.sel)c=" is-sel";return `<button class="bd-opt${c}" ${st.checked||tried?"disabled":""} onclick="HBBidea.sel(${jq(o)})"><kbd>${k+1}</kbd>${esc(o)}</button>`}).join("")}</div>`}
function body(){const it=cur().item,st=player.state,dis=st.checked?"disabled":"";const mp=it.map?`<div class="bd-mapwrap is-small">${MAPS[it.map]}</div>`:"";
 if(it.t==="mc"||it.t==="chips"){return `${mp}<p class="bd-q">${blankHtml(it.q,st.sel)}</p>${optBtns(st.opts,it,st,it.t==="chips"&&!it.ch?" bd-chips":it.t==="chips"?" bd-chips bd-chips-3":"")}`}
 if(it.t==="gap")return `${mp}<p class="bd-q">${blankHtml(it.q,st.typed&&st.checked?st.typed:"")}</p>${it.h?`<p class="bd-hint">${svg("bolt")}${esc(it.h)}</p>`:""}<form class="bd-type" onsubmit="event.preventDefault();HBBidea.check()"><label class="bd-sr" for="bd-in">Zure erantzuna</label><input id="bd-in" data-focus autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Idatzi hemen…" value="${esc(st.typed)}" ${dis} oninput="HBBidea.typed(this.value)" class="${st.checked&&!st.neutral?(st.ok?"is-right":"is-wrong"):""}"></form>`;
 if(it.t==="build"){const used=new Set(st.picked);return `${mp}<p class="bd-src">${esc(it.q)}</p><p class="bd-instr">${it.instr?esc(it.instr):`Erabili <b>«${esc(it.k)}»</b> eta idatzi berriro bi esaldi gisa.`}</p><div class="bd-line${st.checked?(st.ok?" is-right":" is-wrong"):""}" aria-live="polite">${st.picked.length?st.picked.map(k=>{const t=st.tiles.find(x=>x.k===k);return `<button class="bd-tile is-placed" ${dis} onclick="HBBidea.untile(${k})">${esc(t.w)}</button>`}).join(""):`<span class="bd-ph">Sakatu fitxak ordenan</span>`}</div><div class="bd-bank">${st.tiles.map(t=>`<button class="bd-tile${used.has(t.k)?" is-used":""}" ${dis||used.has(t.k)?"disabled":""} onclick="HBBidea.tile(${t.k})">${esc(t.w)}</button>`).join("")}</div>`}
 if(it.t==="fix"){return `${mp}<p class="bd-instr${st.mistap?" bd-warn":""}" aria-live="polite">${st.tapped===null?(st.mistap?"Ez da hori. Begiratu berriro.":"Sakatu gaizki dagoen hitza."):"Ondo! Zein hitz jarri behar da?"}</p><p class="bd-q bd-fixq${st.mistap?" bd-shake":""}">${st.tokens.map((w,k)=>{const isW=w===it.w;let c="";if(st.tapped!==null&&isW)c=" is-struck";return `<button class="bd-word${c}" ${st.tapped!==null||st.checked?"disabled":""} onclick="HBBidea.tap(${k})">${esc(w)}</button>`}).join(" ")}</p>${st.tapped!==null?optBtns(st.opts,{a:[it.r]},st," bd-chips bd-chips-3"):""}`}
 if(it.t==="match"){return `${mp}<p class="bd-instr">${esc(it.q)}</p><div class="bd-match${it.pairs.some(p=>p[1].length>16)?" is-long":""}"><div>${it.pairs.map((p,k)=>{const m=st.matched.includes(k);return `<button class="bd-m bd-m-l${m?" is-done":""}${st.left===k?" is-sel":""}${st.flash&&st.flash[0]===k?" is-bad":""}" ${m||st.checked?"disabled":""} onclick="HBBidea.mL(${k})">${esc(p[0])}</button>`}).join("")}</div><div>${st.right.map(k=>{const m=st.matched.includes(k),p=it.pairs[k];return `<button class="bd-m bd-m-r${m?" is-done":""}${st.flash&&st.flash[1]===k?" is-bad":""}" ${m||st.checked?"disabled":""} onclick="HBBidea.mR(${k})">${esc(p[1])}</button>`}).join("")}</div></div>`}
 if(it.t==="write"){return `${mp}<p class="bd-q bd-q-sm">${esc(it.q)}</p><p class="bd-instr">${esc(it.instr)}</p><label class="bd-sr" for="bd-wr">Zure testua</label><textarea id="bd-wr" class="bd-write" rows="4" data-focus placeholder="${it.check==="nornork"?"Gaur goizean…":"Lehenik, etxetik…"}" ${dis} oninput="HBBidea.typed(this.value)">${esc(st.typed)}</textarea>${st.checked&&player.mode!=="episode"?writeChecks(st.typed,it.check):""}`}
 return ""}
function writeChecks(t,kind){return `<ul class="bd-checks">${writeCheckList(t,kind).map(([l,ok])=>`<li class="${ok?"is-ok":""}">${svg(ok?"check":"x")}${esc(l)}</li>`).join("")}</ul>`}
function ready(){const it=cur().item,st=player.state;if(it.t==="gap")return !!st.typed.trim();if(it.t==="write")return st.typed.trim().length>=(player.mode==="episode"&&player.L.forest?3:10);if(it.t==="build")return st.picked.length>0;if(it.t==="fix")return st.tapped!==null&&!!st.sel;if(it.t==="match")return st.matched.length===it.pairs.length;return !!st.sel}
function auditBox(){if(!S.auditor)return "";const it=cur().item,a=AUD[it.id]||{};return `<aside class="bd-audit"><div class="bd-audit-h"><span class="bd-kicker">IKUSKARITZA</span><code>${esc(it.src)}</code>${it.rv?`<span class="bd-flag">Berrikusteko markatua</span>`:""}</div>
 <p><b>Onartuak:</b> ${it.a.map(esc).join(" · ")}</p>${it.ex?`<p><b>Azalpena:</b> ${esc(it.ex)}</p>`:""}
 <div class="bd-row"><button class="bd-btn bd-btn-small${a.v==="ok"?" is-on":""}" onclick="HBBidea.audit('ok')">${svg("check")} Ontzat</button><button class="bd-btn bd-btn-small bd-btn-warn${a.v==="fix"?" is-on":""}" onclick="HBBidea.audit('fix')">Zuzentzeko</button></div>
 <label class="bd-sr" for="bd-anote">Oharra</label><textarea id="bd-anote" rows="2" placeholder="Oharra (aukerakoa)…" onchange="HBBidea.auditNote(this.value)">${esc(a.note||"")}</textarea></aside>`}
function nudgeHtml(){const it=cur().item,st=player.state;if(st.checked||!st.hintOn||player.mode==="test")return "";
 const retryTry=st.tries>0;
 return `<section class="bd-nudge${retryTry?" is-retry":""}" role="status" aria-live="polite">${bira(retryTry?"retry":"curious","bd-bira-sm")}<div><strong>${retryTry?"Ia-ia! Saiatu berriro.":"Pista"}</strong><p>${esc(st.diagnosis||hintFor(it,DATA.groups,DATA.patterns))}</p></div></section>`}
function deskSide(){if(!player||player.mode==="test"||player.mode==="worldgame"||!player.L)return "";const L=player.L;
 return `<aside class="bd-desk-side" aria-label="Ikasteko laguntza">
  <details class="bd-card bd-desk-cheat"><summary>Laguntza-txartela</summary><div class="bd-desk-cheat-body">${learnHtml(L)}<p class="bd-tip">${svg("bolt")}<span>${esc(L.tip)}${help()?`<small>${esc(L.tipEs)}</small>`:""}</span></p></div></details>
  <section class="bd-card bd-desk-keys"><span class="bd-kicker">TEKLATUA</span><ul><li><kbd>1–4</kbd><span>Aukeratu</span></li><li><kbd>H</kbd><span>Pista</span></li><li><kbd>Enter</kbd><span>Egiaztatu / Jarraitu</span></li><li><kbd>Esc</kbd><span>Itxi</span></li></ul></section>
 </aside>`}
/* Feedbacka: esaldi zuzena osorik + zergatia, laburra eta bisuala. Azalpen teknikoa nahi duenarentzat. */
function feedback(){const it=cur().item,st=player.state;if(!st.checked)return "";
 if(player.mode==="episode"&&st.neutral)return '<section class="bd-fb is-neutral" role="status"><div><strong>'+(it.t==="write"?"Zure testua prest dago.":"Alderatu proposamenarekin.")+'</strong><p><b>Eredu bat:</b> '+esc(it.t==="write"?it.model:(solvedParts(it)||[]).join(""))+'</p><p>'+esc(it.ex)+'</p><p class="bd-note">Erantzuna ez da automatikoki baliozkotu.</p></div></section>';
 const parts=solvedParts(it),key=it.t==="fix"?it.r:it.t==="build"?it.k:it.a[0],g=S.level==="b1b2"&&key?groupOf(key,DATA.groups):null,p=g&&(player.mode==="episode"&&player.segment==="story"?player.L.patterns:DATA.patterns)[g],gl=key&&DATA.gloss[norm(key)];
 const sentence=it.t==="write"?`<p class="bd-model"><span>Eredu bat:</span> ${esc(it.model)}</p>`:it.t==="match"?`<p class="bd-full">${it.pairs.map(p=>`<span>${esc(p[0])} <b>${esc(p[1])}</b></span>`).join(" · ")}</p>`:parts?`<p class="bd-full">${esc(parts[0])}<mark>${esc(parts[1])}</mark>${esc(parts[2])}</p>`:(st.ok?"":`<p class="bd-full"><mark>${esc(it.a[0])}</mark></p>`);
 const title=it.t==="write"?"Bikain! Zure testua idatzita.":st.msg;
 return `<section class="bd-fb ${st.ok?"is-ok":"is-bad"}" role="status" aria-live="assertive">${bira(st.ok?(Math.random()<.5?"celebrate":"calm"):"retry","bd-bira-sm")}<div><strong>${esc(title)}</strong>${sentence}
 ${(player.mode==="worldgame"||player.mode==="episode"&&(player.segment==="story"||it.code))?`<p class="bd-why">${esc(it.ex)}</p>`:p?`<p class="bd-why">${esc(p.why)}</p>${flow(p,g==="lako"?"":key,true)}`:it.t==="write"?"":`<p class="bd-why">${esc(it.ex)}</p>`}
 ${help()&&gl?`<small class="bd-es">ES · ${esc(key)} = ${esc(gl)}</small>`:""}
 ${p&&it.ex&&player.mode!=="worldgame"&&!(player.mode==="episode"&&player.segment==="story")?`<details class="bd-more-ex"><summary>Azalpen osoa</summary><p>${esc(it.ex)}</p></details>`:it.t==="write"?`<p class="bd-why">${esc(it.ex)}</p>`:""}</div></section>`}
function play(){const it=cur().item,st=player.state,test=player.mode==="test",rev=player.mode==="review";const label=test?"ZURE ABIAPUNTUA":player.mode==="worldgame"?(player.kind==="recall"?"GOGORATU":"JOLASTOKIA")+" · "+TYPE[it.t]:player.mode==="episode"?(player.segment==="recall"?"1 · GOGORATU":"3 · ERRONKA")+" · "+TYPE[it.t]:(S.level==="b1b2"&&TYPE_B[it.t])||TYPE[it.t];
 const canHint=!test&&!st.checked&&!st.hintOn&&it.t!=="match"&&it.t!=="write";
 const side=deskSide();
 return `<div class="bd-pwrap${side?" has-desk-side":""}">${top()}${player.quit?`<div class="bd-quit"><p><strong>Irten nahi duzu?</strong> Saio honetako aurrerapena galduko da.</p><div class="bd-row"><button class="bd-btn bd-btn-small bd-btn-ghost" onclick="HBBidea.close()">Bai, irten</button><button class="bd-btn bd-btn-small" onclick="HBBidea.askQuit()">Jarraitu</button></div></div>`:""}
 <div class="bd-pgrid"><div class="bd-pmain"><main class="bd-item bd-t-${it.t}${st.checked&&!st.neutral?(st.ok?" bd-pop":" bd-shake"):st.tries&&!st.checked?" bd-shake":""}"><div class="bd-ihead">${cur().retry||rev?`<span class="bd-chip bd-chip-retry">Errepasoa</span>`:""}<span class="bd-kicker">${esc(label)}</span>${test?`<span class="bd-chip">Ez dago akatsik: zure abiapuntua bilatzen ari gara</span>`:""}</div>${vocabularyNotice()}${body()}</main>
 ${test?"":nudgeHtml()+feedback()+auditBox()}</div>${side}</div>
 ${test?`<footer class="bd-pfoot"><button class="bd-btn bd-btn-ghost" onclick="HBBidea.dunno()">Ez dakit</button></footer>`:`<footer class="bd-pfoot">${st.checked?`<button class="bd-btn bd-btn-main ${st.ok||st.neutral?"":"bd-btn-bad"}" data-focus onclick="HBBidea.next()">Jarraitu ${svg("arrow")}</button>`:it.t==="match"?"":`<div class="bd-pfoot-row">${canHint?`<button type="button" class="bd-btn bd-btn-ghost bd-btn-hint" onclick="HBBidea.showHint()">${svg("bolt")} Pista</button>`:""}<button class="bd-btn bd-btn-main" ${ready()?"":"disabled"} ${it.t==="gap"||it.t==="write"?"":"data-focus"} onclick="HBBidea.check()">Egiaztatu</button></div>`}</footer>`}</div>`}
function showHint(){if(!player||player.phase!=="play"||player.mode==="test")return;const st=player.state;if(st.checked||st.hintOn)return;st.hintOn=true;st.hintUsed=true;sfx("tap");render()}
function sel(o){const st=player.state;if(st.checked||st.wrongSel.includes(o))return;st.sel=o;sfx("tap");if(player.mode==="test"){testAnswer(isAccepted(o,cur().item.a));return}render()}
function typed(v){player.state.typed=v;saveEpisodeDraft(true);const b=document.querySelector(".bd-pfoot .bd-btn-main");if(b)b.disabled=!ready()}
function tile(k){const st=player.state;if(st.checked||st.picked.includes(k))return;st.picked.push(k);sfx("tap");render()}
function untile(k){const st=player.state;if(st.checked)return;st.picked=st.picked.filter(x=>x!==k);render()}
function tap(k){const st=player.state,it=cur().item;if(st.checked||st.tapped!==null)return;if(st.tokens[k]===it.w){st.tapped=k;st.mistap=false;sfx("tap")}else{st.mistap=true;cur().miss=true;sfx("bad")}render()}
function mL(k){if(player?.owner&&player.owner!==keyFor(KEY)){close();return}const st=player.state;if(st.checked||st.matched.includes(k))return;st.left=k;st.flash=null;sfx("tap");render()}
function mR(k){if(player?.owner&&player.owner!==keyFor(KEY)){close();return}const st=player.state;if(st.checked||st.left===null||st.matched.includes(k))return;if(cur().item.vocabulary){const row=cur().item.vocabulary[st.left],chosen=cur().item.vocabulary[k];if(!row||!chosen)return;const attempt=st.vocabularyAttempts[st.left]=(st.vocabularyAttempts[st.left]||0)+1;root.HBData?.activity?.({kind:"vocabulary_match",telemetryVersion:2,attempt,resource:row,chosen:chosen.id,result:k===st.left?"match":"mismatch",mode:"recognition",assisted:attempt>1,academicState:"not_observed"})}if(k===st.left){st.matched.push(k);st.left=null;st.flash=null;if(st.matched.length===cur().item.pairs.length){check();return}sfx("tap")}else{st.flash=[st.left,k];st.left=null;cur().miss=true;sfx("bad")}render()}
function check(){if(!player||player.phase!=="play")return;if(player.owner&&player.owner!==keyFor(KEY)){close();return}const e=cur(),it=e.item,st=player.state;if(st.checked||!ready())return;
 if((player.mode==="episode"||player.mode==="worldgame")&&!st.studyRecorded&&!e.retry){st.studyRecorded=true;S.episodeStudyDays=S.episodeStudyDays||{};S.episodeStudyDays[today()]=true;save();if(root.HBData?.isRemote?.())root.HBData.activity?.({kind:"answer",item:it.id})}
 const diagnosis=(player.mode==="episode"||player.mode==="worldgame"&&(it.why||player.kind==="recall"))?classifyEpisodeError(it,it.t==="gap"?st.typed:st.sel):null;
 if(diagnosis)rememberEpisodeError(st,diagnosis);
 if(player.mode==="episode"&&(it.t==="write"||(it.t==="gap"&&!isAccepted(st.typed,it.a)&&!diagnosis))){st.checked=true;st.neutral=true;st.ok=false;render();return}
 let ok=false;if(it.t==="gap")ok=isAccepted(st.typed,it.a);else if(it.t==="write")ok=true;else if(it.t==="build")ok=isAccepted(st.picked.map(k=>st.tiles.find(t=>t.k===k).w).join(" "),it.a);else if(it.t==="fix")ok=norm(st.sel)===norm(it.r)&&!e.miss;else if(it.t==="match")ok=player.mode==="worldgame"||!e.miss;else ok=isAccepted(st.sel,it.a);
 /* Lehen hutsean: pista erakutsi eta bigarren aukera eman, erantzuna zuzenean erakutsi aurretik. */
 if(!ok&&st.tries===0&&!e.retry&&it.t!=="match"&&it.t!=="write"){
  st.tries=1;st.hintOn=true;player.combo=0;player.errors.add(it.id);
  if((it.t==="mc"||it.t==="chips"||it.t==="fix")&&st.sel){if(!st.wrongSel.includes(st.sel))st.wrongSel.push(st.sel);st.sel=null}
  sfx("bad");render();return;
 }
 st.checked=true;st.ok=ok;
 recordEpisodeRecovery(it,st,e,ok);
 if(player.mode==="worldgame"){st.msg=ok?"Ongi!":"Berrikusi loturak.";render();return}
 if(ok){player.combo++;player.best=Math.max(player.best,player.combo);const gain=e.retry?5:(st.tries>0||st.hintUsed)?7:10;player.xp+=gain;if(!e.retry&&st.tries===0&&!st.hintUsed&&!player.errors.has(it.id))player.first++;st.msg=(st.tries>0?"Ederki! Bigarren saiakeran":pick(PRAISE))+` +${gain} XP`;sfx("ok")}
 else{player.combo=0;player.errors.add(it.id);if(!e.retry)player.queue.push({item:it,retry:true});st.msg=pick(OOPS);sfx("bad")}
 render();const fb=document.querySelector("#bd-player .bd-fb");if(fb&&fb.scrollIntoView)fb.scrollIntoView({block:"nearest",behavior:root.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches?"auto":"smooth"})}
function next(){if(!player)return;player.pos++;if(player.pos>=player.queue.length){if(player.mode==="worldgame"){player.phase="end";render();return}if(player.mode==="episode"){if(player.segment==="recall"){episodeScene();return}player.phase="altxorra";player.state=null;render();return}finish();return}player.state=fresh(cur());render()}
function finish(){const L=player.L,isRev=player.mode==="review",total=isRev?(player.totalInit||player.queue.length):L.items.length,stars=starsFor(player.first,total),bonus=isRev?15:L.challenge?40:20;player.xp+=bonus;player.stars=stars;player.bonus=bonus;
 const prev=S.lessons[L.id]||{};
 if(isRev){S.lessons[L.id]={...prev,stars:Math.max(prev.stars||1,stars),reviewAt:Date.now(),reviews:(prev.reviews||0)+1}}
 else{S.lessons[L.id]={...prev,stars:Math.max(stars,prev.stars||0),best:Math.max(player.first,prev.best||0),runs:(prev.runs||0)+1,at:Date.now(),reviewAt:Date.now()}}
 S.xp+=player.xp;S.days[today()]=(S.days[today()]||0)+player.xp;save();
 try{root.HBData?.activity?.({kind:"bidea_lesson",item:L.id,answer:isRev?"review":String(stars)})}catch{}
 player.phase="end";sfx("done");render()}
function end(){const L=player.L,isRev=player.mode==="review",ni=nextLesson(),total=isRev?(player.totalInit||player.queue.length):L.items.length,s=player.stars;
 const msg=isRev?"Errepasoa eginda!":s===3?"Ikasgai bikaina!":s===2?"Oso ondo!":"Eginda! Errepasoak lagunduko dizu.";
 return `<div class="bd-pwrap bd-endwrap">${top()}<main class="bd-end">${s>=2||isRev?`<div class="bd-confetti" aria-hidden="true">${Array.from({length:22},(_,k)=>`<i style="--k:${k}"></i>`).join("")}</div>`:""}
 ${bira(s>=2||isRev?"celebrate":"effort","bd-bira-lg")}<h1>${msg}</h1><div class="bd-bigstars" aria-label="${s} izar">${[0,1,2].map(k=>`<span class="${k<s?"on":""}" style="--k:${k}">★</span>`).join("")}</div>
 <div class="bd-endstats"><div><b>${player.first}/${total}</b><small>lehen saiakeran</small></div><div><b>+${player.xp}</b><small>XP</small></div><div><b>${player.best}</b><small>jarraian</small></div></div>
 <div class="bd-learned"><span class="bd-kicker">${isRev?"BERRIKUSI DUZU":"LANDU DUZU"}</span><div>${L.keys.map(k=>`<span class="bd-key"><b>${esc(k)}</b></span>`).join("")}</div></div>
 ${player.errors.size?`<p class="bd-note">${player.errors.size} ariketa landu dituzu berriro. Hurrengoan, lehen saiakeran!</p>`:""}</main>
 <footer class="bd-pfoot">${!isRev&&!player.supplementary&&ni>=0&&ni!==player.i?`<button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.start(${ni})">Hurrengo ikasgaia ${svg("arrow")}</button><button class="bd-btn bd-btn-ghost" onclick="HBBidea.close()">Amaitu</button>`:`<button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.close()">Amaitu</button>`}</footer></div>`}

/* ---------- Maila-proba ---------- */
function testAnswer(ok){const p=player;if(p.busy)return;p.busy=true;p.state.checked=false;if(ok){p.score++;p.row=0}else p.row++;render();
 setTimeout(()=>{p.busy=false;if(p!==player)return;p.pos++;if(p.row>=2||p.pos>=p.queue.length){p.level=placeLevel(p.score);p.phase="placed";sfx("done");render();return}p.state=fresh(cur());render()},260)}
function dunno(){if(player&&player.mode==="test")testAnswer(false)}
function placed(){const I=DATA.islands.find(x=>x.id===player.level),o=DATA.islands.find(x=>x.id!==player.level);
 return `<div class="bd-pwrap bd-endwrap">${top()}<main class="bd-end bd-placed">${bira("celebrate","bd-bira-lg")}
 <span class="bd-kicker">ZURE ABIAPUNTUA</span><h1>${esc(I.title)}</h1><p>${esc(I.blurb)}</p><p class="bd-es">${esc(I.es)}</p>
 <p class="bd-note">${player.score} erantzun zuzen. Bidean beste abentura bat aukeratu dezakezu.</p></main>
 <footer class="bd-pfoot"><button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.setLevel('${I.id}',true,true)">${svg("play")} Hasi abentura</button><button class="bd-btn bd-btn-ghost" onclick="HBBidea.setLevel('${o.id}',true)">Nahiago dut ${esc(o.adventure.title)}</button></footer></div>`}

/* ---------- Ikuskaritza ---------- */
function audit(v){syncState();const it=cur().item;AUD[it.id]={...(AUD[it.id]||{}),v,src:it.src,at:new Date().toISOString()};store(AKEY,AUD);render()}
function auditNote(t){syncState();const it=cur().item;AUD[it.id]={...(AUD[it.id]||{}),note:t.slice(0,2000),src:it.src,at:new Date().toISOString()};store(AKEY,AUD)}
function auditText(){syncState();const all=allLessons().flatMap(l=>l.items);return all.filter(i=>AUD[i.id]).map(i=>{const a=AUD[i.id];return `${a.v==="ok"?"✓":a.v==="fix"?"✎":"·"} ${i.src} | ${i.q}${a.note?"\n   Oharra: "+a.note:""}`}).join("\n")||"Oraindik ez dago oharrik."}
async function copyAudit(btn){const t=auditText();try{await navigator.clipboard.writeText(t);if(btn)btn.textContent="Kopiatuta ✓"}catch{const w=document.createElement("textarea");w.value=t;document.body.appendChild(w);w.select();try{document.execCommand("copy");if(btn)btn.textContent="Kopiatuta ✓"}catch{}w.remove()}}
function auditor(on){syncState();if(guestLimited())return;S.auditor=!!on;save();refresh()}

document.addEventListener("keydown",e=>{if(!player||e.metaKey||e.ctrlKey||e.altKey)return;const tag=e.target&&e.target.tagName;if(e.key==="Escape"){askQuit();return}
 if(tag!=="INPUT"&&tag!=="TEXTAREA"&&player.phase==="play"){
  if(/^[1-4]$/.test(e.key)){const b=document.querySelectorAll("#bd-player .bd-opt")[+e.key-1];if(b&&!b.disabled){e.preventDefault();b.click()}return}
  if(e.key.toLowerCase()==="h"&&player.mode!=="test"){e.preventDefault();showHint();return}
 }
 if(e.key==="Enter"&&tag!=="TEXTAREA"){const b=document.querySelector("#bd-player .bd-pfoot .bd-btn-main:not([disabled])");if(b&&tag!=="BUTTON"){e.preventDefault();b.click()}}});
applyLevel();
root.addEventListener?.("pagehide",()=>saveEpisodeDraft());
/* Read-only projection of the real, account-scoped engine state. Never infers an exact CEFR level. */
function learningContext(){
 syncState();
 const route=DATA.islands.some(i=>i.id===S.level)?S.level:null,mission=route==="a1a2"&&inShelter()?2:1;
 const n=route?episodeNumber():null,L=route?episodeLesson(n):null;
 const errors=Object.fromEntries(Object.entries(S.episodeErrorMemory||{}).map(([k,v])=>[k,{errors:v.errors,lastErrorAt:v.lastErrorAt,lastRecoveryAt:v.lastRecoveryAt,dueAt:v.dueAt}]));
 return {route,placed:S.placed===true,mission,episode:L?{id:L.id,title:L.title,number:n}:null,
  focus:route==="b1b2"?["kau","ond"]:mission===2?["err","mod","ize"]:n===2?["ize","decl"]:["decl","ize","jos"],errors};
}
root.HBBidea={...api,learningContext,dueRecallHtml,startDueRecall,observePractice,supplementaryPracticeHtml,chooseForestMission,loginForMore,guestLimited,gaur,bidea,mapa,ni,focused,isAuditor,chooseAdventure,start,startEpisode,finishEpisode,startWorldGame,setVocabularyTheme,startReview,startAgendaReview,startTest,begin,close,askQuit,sel,typed,tile,untile,tap,mL,mR,showHint,check,next,dunno,setLevel,toggleHelp,toggleSound,audit,auditNote,copyAudit,auditor,auditText,reset,_state:()=>{syncState();return S},_player:()=>player};
if(document.readyState!=="loading")applyLevel();else document.addEventListener("DOMContentLoaded",applyLevel);
})(typeof window!=="undefined"?window:globalThis);
