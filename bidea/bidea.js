/* HitzBira · Bidea 0.1: Gaur, Mapa, adin-profilak eta ikasgai-erreproduzitzailea.
   Gaur pantailaren goiburua eta Mapa ikuspegia app.js-ek deitzen ditu (HBBidea.gaur / HBBidea.mapa).
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
/* Txartelak: erantzun onartu bat + beste multzo semantiko bateko hiru distraktore (sinonimorik ez). */
function chipsFor(item,groups,rnd=Math.random){const cap=capitalFor(item.q),right=item.a[0],gs=new Set(item.a.map(a=>groupOf(a,groups)).filter(Boolean));
 const pool=[];for(const [g,list] of Object.entries(groups))if(!gs.has(g))pool.push(list[0]);
 return shuffle([right,...shuffle(pool,rnd).slice(0,3)],rnd).map(w=>caseLike(w,cap))}
/* Esaldia eraikitzeko fitxak: lokailu konposatuak fitxa bakarrean. */
function tilesFor(sentence){const words=sentence.split(/\s+/).filter(Boolean),out=[];for(let i=0;i<words.length;i++){const w=words[i],nx=words[i+1];if(nx&&/^(izan|hala|esate)$/i.test(w)&&/^(ere|baterako),?$/i.test(nx)){out.push(w+" "+nx);i++}else out.push(w)}return out}
function fixTokens(item){const i=item.q.indexOf(item.w);if(i<0)return item.q.split(/\s+/);const before=item.q.slice(0,i).trim(),after=item.q.slice(i+item.w.length).trim();return [...(before?before.split(/\s+/):[]),item.w,...(after?after.split(/\s+/):[])]}
function fixOptions(item,groups,rnd=Math.random){const gr=groupOf(item.r,groups),gw=groupOf(item.w,groups),pool=[];for(const [g,list] of Object.entries(groups))if(g!==gr&&g!==gw)pool.push(list[0]);return shuffle([item.r,...shuffle(pool,rnd).slice(0,2)],rnd)}
function starsFor(first,total){const r=total?first/total:0;return r>=.9?3:r>=.7?2:1}
const api={norm,isAccepted,groupOf,capitalFor,chipsFor,tilesFor,fixTokens,fixOptions,starsFor};
if(typeof module!=="undefined"&&module.exports){module.exports=api;return}

/* ---------- Egoera ---------- */
const DATA=root.HB_BIDEA;if(!DATA)return;
const PROFILES={
 haurra:{name:"Haurra",age:"10–12 urte",hello:"Kaixo, abenturazale!",help:false,pose:"wink"},
 gaztea:{name:"Gaztea",age:"13–17 urte",hello:"Aupa! Prest gaurko erronkarako?",help:false,pose:"curious"},
 heldua:{name:"Heldua",age:"18+ urte",hello:"Egun on! Bost minutu gaurko?",help:true,pose:"hello"}};
const POSES={hello:"bira_00_ongietorria_v02.svg",surprise:"bira_01_harridura_v02.svg",curious:"bira_02_jakin-mina_v02.svg",sad:"bira_03_tristura-arina_v02.svg",retry:"bira_04_berriro-saiatu_v02.svg",celebrate:"bira_05_ospakizuna_v02.svg",wink:"bira_06_keinua_v02.svg",effort:"bira_07_ahalegina_v02.svg",calm:"bira_08_poztasun-lasaia_v02.svg"};
const PRAISE=["Bikain!","Ederki!","Hori da!","Primeran!","Zuzen-zuzen!"],PRAISE_KID=["Txapeldun!","Ikaragarri!","Bai horixe!","Zu bai azkarra!"],OOPS=["Ia-ia!","Ez kezkatu, berriro aterako da.","Begiratu azalpenari, eta aurrera!"];
function load(k,d){try{const v=JSON.parse(localStorage.getItem(k)||"null");return v&&typeof v==="object"?v:d}catch{return d}}
function store(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
let S=load(KEY,{});S.lessons=S.lessons||{};S.days=S.days||{};S.xp=S.xp||0;
let AUD=load(AKEY,{});
try{const p=new URLSearchParams(location.search);if(p.has("ikuskatu")||p.has("auditor")){S.auditor=(p.get("ikuskatu")||p.get("auditor"))!=="0";store(KEY,S)}}catch{}
const save=()=>store(KEY,S);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const jq=v=>esc(JSON.stringify(v));
const today=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const help=()=>S.help==="es";
const prof=()=>PROFILES[S.profile]||null;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const bira=(pose,cls="")=>`<img class="bd-bira ${cls}" src="/assets/bira/${POSES[pose]||POSES.hello}" alt="" width="400" height="400" decoding="async" aria-hidden="true">`;
const ico=(n)=>({map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>',star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',play:'<path d="M8 5v14l11-7z"/>',check:'<path d="m5 12 5 5L20 7"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',bolt:'<path d="m13 2-9 12h7l-1 8 10-12h-7z"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',flag:'<path d="M5 21V4h11l-2 4 2 4H5"/>'}[n]);
const svg=(n,c="")=>`<svg class="bd-ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${ico(n)}</svg>`;
const chapter=()=>DATA.chapters[0],lessons=()=>chapter().lessons;
const done=id=>S.lessons[id]&&S.lessons[id].stars>0;
function unlocked(i){return i===0||done(lessons()[i-1].id)}
function nextLesson(){const ls=lessons();for(let i=0;i<ls.length;i++)if(!done(ls[i].id))return i;return -1}
function totalStars(){return Object.values(S.lessons).reduce((n,l)=>n+(l.stars||0),0)}
function xpToday(){return S.days[today()]||0}
function refresh(){if(typeof root.draw==="function")root.draw()}
function setProfile(p){if(!PROFILES[p])return;const first=!S.profile;S.profile=p;if(first||!S.help)S.help=PROFILES[p].help?"es":"eu";S.picking=false;save();applyProfile();refresh()}
function applyProfile(){if(document.body)document.body.dataset.hbProfile=S.profile||"none"}
function toggleHelp(){S.help=help()?"eu":"es";save();if(player)render();else refresh()}
function choose(){S.picking=true;refresh()}

/* ---------- Gaur ---------- */
function pickerHtml(){return `<section class="bd-card bd-picker" aria-labelledby="bd-pick-h">
 <div class="bd-picker-head">${bira("hello","bd-bira-md")}<div><span class="bd-kicker">ONGI ETORRI HITZBIRARA</span><h1 id="bd-pick-h">Nor zara?</h1><p>Aukeratu zure bidea. Gero alda dezakezu.</p></div></div>
 <div class="bd-picker-grid">${Object.entries(PROFILES).map(([k,p])=>`<button class="bd-prof bd-prof-${k}${S.profile===k?" is-on":""}" onclick="HBBidea.setProfile('${k}')">${bira(p.pose,"bd-bira-sm")}<strong>${p.name}</strong><small>${p.age}</small></button>`).join("")}</div>
</section>`}
function ring(v,max){const r=26,c=2*Math.PI*r,p=Math.min(1,v/max);return `<svg class="bd-ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="${r}" class="bd-ring-bg"/><circle cx="32" cy="32" r="${r}" class="bd-ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p)}"/></svg>`}
function todayCard(){
 if(S.profile==="haurra"){const J=DATA.junior;return `<article class="bd-card bd-today bd-today-kid">
  <span class="bd-kicker">${esc(J.story.toUpperCase())} · ${esc(J.chapter)}</span><h2>${esc(J.title)}</h2>${help()?`<p class="bd-es">${esc(J.es)}</p>`:""}
  <p>Bira basora doa kondairen bila. Kapitulu hau prestatzen ari gara: laster izango duzu hemen!</p>
  <div class="bd-stops">${J.stops.map((s,i)=>`<span class="bd-stop" style="--i:${i}">${svg("lock")}<small>${esc(s)}</small></span>`).join("")}</div>
  <button class="bd-btn bd-btn-ghost" onclick="document.querySelector('.hb-world')?.scrollIntoView({behavior:'smooth'})">Bitartean, bizi Biraren istorioak ${svg("arrow")}</button></article>`}
 const ls=lessons(),ni=nextLesson(),all=ni<0,i=all?ls.length-1:ni,L=ls[i],st=S.lessons[L.id];
 return `<article class="bd-card bd-today">
  <div class="bd-today-top"><span class="bd-kicker">GAURKO IKASGAIA · ${esc(DATA.island.level)}</span><span class="bd-chip">${i+1}/${ls.length}</span></div>
  <h2>${esc(L.title)}</h2>${help()?`<p class="bd-es">${esc(L.es)}</p>`:""}
  <p class="bd-meta">${esc(chapter().title)} · ${L.items.length} ariketa · ~${Math.round(L.items.length/2)} min${L.challenge?" · Erronka":""}</p>
  <div class="bd-pips" aria-label="Kapituluko aurrerapena">${ls.map((x,k)=>`<span class="bd-pip${done(x.id)?" is-done":""}${k===i&&!all?" is-now":""}"></span>`).join("")}</div>
  <button class="bd-btn bd-btn-main" onclick="HBBidea.start(${i})">${svg("play")} ${all?"Errepasatu":st?"Berriro":"Hasi"}</button>
  ${all?`<p class="bd-note">Kapitulua osatu duzu! Hurrengoa prestatzen ari gara.</p>`:""}</article>`}
function auditPanel(){if(!S.auditor)return "";const v=Object.values(AUD),ok=v.filter(x=>x.v==="ok").length,fx=v.filter(x=>x.v==="fix").length;
 return `<section class="bd-card bd-audit-sum"><span class="bd-kicker">IKUSKATZAILE MODUA</span><p><b>${ok}</b> ontzat · <b>${fx}</b> zuzentzeko · ${lessons().reduce((n,l)=>n+l.items.length,0)} ariketa guztira</p>
 <div class="bd-row"><button class="bd-btn bd-btn-small" onclick="HBBidea.copyAudit(this)">Kopiatu oharrak</button><button class="bd-btn bd-btn-small bd-btn-ghost" onclick="HBBidea.auditor(false)">Desaktibatu</button></div></section>`}
function gaur(){applyProfile();if(!S.profile||S.picking)return `<div class="bd-gaur">${pickerHtml()}</div>`;const p=prof(),x=xpToday();
 return `<div class="bd-gaur"><div class="bd-col">
 <section class="bd-hello"><div class="bd-hello-bira">${bira(p.pose,"bd-bira-md")}</div><div class="bd-bubble"><strong>${esc(p.hello)}</strong>${help()?`<small>${S.profile==="heldua"?"¡Buenos días! ¿Cinco minutos hoy?":"¡Hola!"}</small>`:""}</div></section>
 <div class="bd-tools"><button class="bd-chip-btn" onclick="HBBidea.choose()">${esc(p.name)} · ${esc(p.age)}</button><button class="bd-chip-btn${help()?" is-on":""}" aria-pressed="${help()}" onclick="HBBidea.toggleHelp()">ES laguntza</button></div>
 ${todayCard()}</div><div class="bd-col bd-side">
 <section class="bd-stats" aria-label="Zure aurrerapena"><div class="bd-goal">${ring(x,GOAL)}<span>${x>=GOAL?svg("check","bd-goal-ok"):`<b>${x}</b>/${GOAL}`}</span></div><div><strong>Eguneko helburua</strong><small>${x>=GOAL?"Lortuta! Ederki.":`${GOAL-x} XP falta zaizkizu`}</small></div><div class="bd-stat">${svg("bolt")}<b>${S.xp}</b><small>XP</small></div><div class="bd-stat">${svg("star")}<b>${totalStars()}</b><small>izar</small></div></section>
 <button class="bd-maplink" onclick="go(4)">${svg("map")}<span><strong>${S.profile==="haurra"?"Basorako bidea":esc(DATA.island.title)}</strong><small>Ikusi mapa osoa</small></span>${svg("arrow")}</button>
 ${auditPanel()}</div></div>`}

/* ---------- Mapa ---------- */
function mapa(){applyProfile();const kid=S.profile==="haurra";
 const juniorMap=`<section class="bd-card bd-island bd-island-kid"><span class="bd-kicker">${esc(DATA.junior.story.toUpperCase())}</span><h1>${esc(DATA.junior.chapter)} · ${esc(DATA.junior.title)}</h1><p>Kapitulu hau prestatzen ari gara. Laster: bost geldiune, istorio bat eta Biraren sekretuak.</p>
  <ol class="bd-path">${DATA.junior.stops.map((s,i)=>`<li class="bd-node is-locked" style="--i:${i}"><span class="bd-dot">${svg("lock")}</span><span class="bd-label">${esc(s)}</span></li>`).join("")}</ol></section>`;
 const ls=lessons(),ni=nextLesson();
 const island=`<section class="bd-card bd-island"><span class="bd-kicker">${esc(DATA.island.level)} · UHARTEA</span><h1>${esc(DATA.island.title)}</h1><p>Zortzi kapitulu, egoera errealak: kontatu, azaldu, iritzia eman.</p>
  <div class="bd-chapter is-open"><div class="bd-ch-head"><span class="bd-ch-n">1</span><div><strong>${esc(chapter().title)}</strong>${help()?`<small>${esc(chapter().es)}</small>`:""}</div><span class="bd-chip">${ls.filter(l=>done(l.id)).length}/${ls.length}</span></div>
  <ol class="bd-path">${ls.map((l,i)=>{const st=S.lessons[l.id],open=unlocked(i),now=i===ni;return `<li class="bd-node${st?" is-done":""}${now?" is-now":""}${open?"":" is-locked"}${l.challenge?" is-boss":""}" style="--i:${i}"><button class="bd-dot" ${open?`onclick="HBBidea.start(${i})"`:"disabled"} aria-label="${esc(l.title)}${open?"":" (blokeatuta)"}">${open?(l.challenge?svg("flag"):st?svg("check"):svg("play")):svg("lock")}</button><span class="bd-label">${esc(l.title)}${st?`<span class="bd-stars">${"★".repeat(st.stars)}${"☆".repeat(3-st.stars)}</span>`:""}</span></li>`}).join("")}</ol></div>
  ${DATA.chapters.slice(1).map((c,i)=>`<div class="bd-chapter is-locked"><div class="bd-ch-head"><span class="bd-ch-n">${i+2}</span><div><strong>${esc(c.title)}</strong>${help()?`<small>${esc(c.es)}</small>`:""}</div><span class="bd-chip">${svg("lock")} Laster</span></div></div>`).join("")}</section>`;
 return `<div class="bd-mapa">${kid?juniorMap+`<details class="bd-other"><summary>Helduen bidea ikusi (B1–B2)</summary>${island}</details>`:island}</div>`}

/* ---------- Ikasgaia ---------- */
let player=null;
function start(i){const L=lessons()[i];if(!L||!unlocked(i))return;player={i,L,phase:"intro",queue:L.items.map(x=>({item:x,retry:false})),pos:0,first:0,errors:new Set(),combo:0,best:0,xp:0,state:null,quit:false};
 let el=document.getElementById("bd-player");if(!el){el=document.createElement("div");el.id="bd-player";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Ikasgaia");document.body.appendChild(el)}
 document.documentElement.classList.add("bd-lock");el.hidden=false;render();el.focus?.()}
function close(){const el=document.getElementById("bd-player");if(el){el.hidden=true;el.innerHTML=""}document.documentElement.classList.remove("bd-lock");player=null;refresh()}
function askQuit(){if(!player)return;if(player.phase!=="play"){close();return}player.quit=!player.quit;render()}
function cur(){return player.queue[player.pos]}
function fresh(entry){const it=entry.item,st={sel:null,typed:"",tiles:[],picked:[],tapped:null,mistap:false,checked:false,ok:false};
 if(it.t==="chips")st.opts=chipsFor(it,DATA.groups);
 if(it.t==="build"){const t=tilesFor(it.a[0]);if(it.x)t.push(it.x);st.tiles=shuffle(t.map((w,k)=>({w,k})));}
 if(it.t==="fix"){st.tokens=fixTokens(it);st.opts=fixOptions(it,DATA.groups)}
 return st}
function render(){const el=document.getElementById("bd-player");if(!el||!player)return;const at=player.phase+":"+player.pos;if(el.dataset.at!==at){el.dataset.at=at;el.scrollTop=0}el.dataset.profile=S.profile||"heldua";el.innerHTML=player.phase==="intro"?intro():player.phase==="end"?end():play();
 const f=el.querySelector("[data-focus]");if(f)f.focus({preventScroll:true})}
function top(){const total=player.queue.length,p=player.phase==="end"?1:player.pos/total;return `<header class="bd-ptop"><button class="bd-x" onclick="HBBidea.askQuit()" aria-label="Itxi">${svg("x")}</button><div class="bd-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${player.pos}"><span style="width:${Math.round(p*100)}%"></span></div>${player.combo>=3?`<span class="bd-combo">${svg("bolt")}${player.combo}</span>`:`<span class="bd-xp">${player.xp} XP</span>`}</header>`}
function intro(){const L=player.L;return `<div class="bd-pwrap">${top()}<main class="bd-intro">
 <span class="bd-kicker">${esc(chapter().title.toUpperCase())} · ${L.n}. IKASGAIA</span><h1>${esc(L.title)}</h1>${help()?`<p class="bd-es">${esc(L.es)}</p>`:""}
 <div class="bd-scene">${bira("curious","bd-bira-lg")}<div class="bd-bubble bd-bubble-big"><p>${esc(L.scene)}</p>${help()?`<small>${esc(L.sceneEs)}</small>`:""}</div></div>
 <div class="bd-keys"><span class="bd-kicker">GAURKO GILTZAK</span><div>${L.keys.map(k=>`<span class="bd-key"><b>${esc(k)}</b>${help()&&DATA.gloss[k.toLowerCase()]?`<small>${esc(DATA.gloss[k.toLowerCase()])}</small>`:""}</span>`).join("")}</div><p class="bd-tip">${esc(L.tip)}${help()?`<small>${esc(L.tipEs)}</small>`:""}</p></div>
 </main><footer class="bd-pfoot"><button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.begin()">Goazen! ${svg("arrow")}</button></footer></div>`}
function begin(){player.phase="play";player.pos=0;player.state=fresh(cur());render()}
const TYPE={mc:"Aukeratu lokailu egokia",gap:"Idatzi falta den lokailua",chips:"Osatu esaldia",fix:"Aurkitu akatsa eta zuzendu",build:"Eraiki esaldi berria"};
function blankHtml(q,fill){const parts=esc(q).split("____");return parts.join(`<span class="bd-blank${fill?" is-filled":""}">${fill?esc(fill):"&nbsp;"}</span>`)}
function body(){const it=cur().item,st=player.state,dis=st.checked?"disabled":"";
 if(it.t==="mc"||it.t==="chips"){const opts=it.t==="mc"?it.ch:st.opts;return `<p class="bd-q">${blankHtml(it.q,st.sel)}</p><div class="bd-opts${it.t==="chips"?" bd-chips":""}">${opts.map(o=>{let c="";if(st.checked){if(isAccepted(o,it.a))c=" is-right";else if(o===st.sel)c=" is-wrong"}else if(o===st.sel)c=" is-sel";return `<button class="bd-opt${c}" ${dis} onclick="HBBidea.sel(${jq(o)})">${esc(o)}</button>`}).join("")}</div>`}
 if(it.t==="gap")return `<p class="bd-q">${blankHtml(it.q,st.typed&&st.checked?st.typed:"")}</p><form class="bd-type" onsubmit="event.preventDefault();HBBidea.check()"><label class="bd-sr" for="bd-in">Zure erantzuna</label><input id="bd-in" data-focus autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Idatzi hemen…" value="${esc(st.typed)}" ${dis} oninput="HBBidea.typed(this.value)" class="${st.checked?(st.ok?"is-right":"is-wrong"):""}"></form>`;
 if(it.t==="build"){const used=new Set(st.picked);return `<p class="bd-src">${esc(it.q)}</p><p class="bd-instr">Erabili <b>«${esc(it.k)}»</b> eta idatzi berriro bi esaldi gisa.</p><div class="bd-line${st.checked?(st.ok?" is-right":" is-wrong"):""}" aria-live="polite">${st.picked.length?st.picked.map(k=>{const t=st.tiles.find(x=>x.k===k);return `<button class="bd-tile is-placed" ${dis} onclick="HBBidea.untile(${k})">${esc(t.w)}</button>`}).join(""):`<span class="bd-ph">Sakatu fitxak ordenan</span>`}</div><div class="bd-bank">${st.tiles.map(t=>`<button class="bd-tile${used.has(t.k)?" is-used":""}" ${dis||used.has(t.k)?"disabled":""} onclick="HBBidea.tile(${t.k})">${esc(t.w)}</button>`).join("")}</div>`}
 if(it.t==="fix"){return `<p class="bd-instr${st.mistap?" bd-warn":""}" aria-live="polite">${st.tapped===null?(st.mistap?"Ez da hori. Begiratu lokailuei.":"Sakatu gaizki dagoen hitza."):"Ondo! Zein lokailu jarri behar da?"}</p><p class="bd-q bd-fixq${st.mistap?" bd-shake":""}">${st.tokens.map((w,k)=>{const isW=w===it.w;let c="";if(st.tapped!==null&&isW)c=" is-struck";return `<button class="bd-word${c}" ${st.tapped!==null||st.checked?"disabled":""} onclick="HBBidea.tap(${k})">${esc(w)}</button>`}).join(" ")}</p>${st.tapped!==null?`<div class="bd-opts bd-chips">${st.opts.map(o=>{let c="";if(st.checked){if(norm(o)===norm(it.r))c=" is-right";else if(o===st.sel)c=" is-wrong"}else if(o===st.sel)c=" is-sel";return `<button class="bd-opt${c}" ${dis} onclick="HBBidea.sel(${jq(o)})">${esc(o)}</button>`}).join("")}</div>`:""}`}
 return ""}
function ready(){const it=cur().item,st=player.state;if(it.t==="gap")return !!st.typed.trim();if(it.t==="build")return st.picked.length>0;if(it.t==="fix")return st.tapped!==null&&!!st.sel;return !!st.sel}
function auditBox(){if(!S.auditor)return "";const it=cur().item,a=AUD[it.id]||{};return `<aside class="bd-audit"><div class="bd-audit-h"><span class="bd-kicker">IKUSKARITZA</span><code>${esc(it.src)}</code>${it.rv?`<span class="bd-flag">Berrikusteko markatua</span>`:""}</div>
 <p><b>Onartuak:</b> ${it.a.map(esc).join(" · ")}</p><p><b>Azalpena:</b> ${esc(it.ex)}</p>
 <div class="bd-row"><button class="bd-btn bd-btn-small${a.v==="ok"?" is-on":""}" onclick="HBBidea.audit('ok')">${svg("check")} Ontzat</button><button class="bd-btn bd-btn-small bd-btn-warn${a.v==="fix"?" is-on":""}" onclick="HBBidea.audit('fix')">Zuzentzeko</button></div>
 <label class="bd-sr" for="bd-anote">Oharra</label><textarea id="bd-anote" rows="2" placeholder="Oharra (aukerakoa)…" onchange="HBBidea.auditNote(this.value)">${esc(a.note||"")}</textarea></aside>`}
function feedback(){const it=cur().item,st=player.state;if(!st.checked)return "";const g=DATA.gloss[norm(it.t==="fix"?it.r:it.t==="build"?it.k:it.a[0])];
 return `<section class="bd-fb ${st.ok?"is-ok":"is-bad"}" role="status" aria-live="assertive">${bira(st.ok?(Math.random()<.5?"celebrate":"calm"):"retry","bd-bira-sm")}<div><strong>${esc(st.msg)}</strong>${st.ok?"":`<p class="bd-sol">${esc(it.t==="gap"||it.t==="chips"||it.t==="mc"?it.a.join(" / "):it.a[0])}</p>`}<p>${esc(it.ex)}</p>${help()&&g?`<small class="bd-es">ES · ${esc((it.t==="fix"?it.r:it.t==="build"?it.k:it.a[0]))} = ${esc(g)}</small>`:""}</div></section>`}
function play(){const it=cur().item,st=player.state;return `<div class="bd-pwrap">${top()}${player.quit?`<div class="bd-quit"><p><strong>Irten nahi duzu?</strong> Ikasgai honetako aurrerapena galduko da.</p><div class="bd-row"><button class="bd-btn bd-btn-small bd-btn-ghost" onclick="HBBidea.close()">Bai, irten</button><button class="bd-btn bd-btn-small" onclick="HBBidea.askQuit()">Jarraitu</button></div></div>`:""}
 <main class="bd-item bd-t-${it.t}${st.checked?(st.ok?" bd-pop":" bd-shake"):""}"><div class="bd-ihead">${cur().retry?`<span class="bd-chip bd-chip-retry">Errepasoa</span>`:""}<span class="bd-kicker">${esc(TYPE[it.t])}</span></div>${body()}</main>
 ${feedback()}${auditBox()}
 <footer class="bd-pfoot">${st.checked?`<button class="bd-btn bd-btn-main ${st.ok?"":"bd-btn-bad"}" data-focus onclick="HBBidea.next()">Jarraitu ${svg("arrow")}</button>`:`<button class="bd-btn bd-btn-main" ${ready()?"":"disabled"} ${it.t==="gap"?"":"data-focus"} onclick="HBBidea.check()">Egiaztatu</button>`}</footer></div>`}
function sel(o){const st=player.state;if(st.checked)return;st.sel=o;render()}
function typed(v){player.state.typed=v;const b=document.querySelector(".bd-pfoot .bd-btn-main");if(b)b.disabled=!v.trim()}
function tile(k){const st=player.state;if(st.checked||st.picked.includes(k))return;st.picked.push(k);render()}
function untile(k){const st=player.state;if(st.checked)return;st.picked=st.picked.filter(x=>x!==k);render()}
function tap(k){const st=player.state,it=cur().item;if(st.checked||st.tapped!==null)return;if(st.tokens[k]===it.w){st.tapped=k;st.mistap=false}else{st.mistap=true;cur().miss=true;}render()}
function check(){if(!player||player.phase!=="play")return;const e=cur(),it=e.item,st=player.state;if(st.checked||!ready())return;
 let ok=false;if(it.t==="gap")ok=isAccepted(st.typed,it.a);else if(it.t==="build")ok=isAccepted(st.picked.map(k=>st.tiles.find(t=>t.k===k).w).join(" "),it.a);else if(it.t==="fix")ok=norm(st.sel)===norm(it.r)&&!e.miss;else ok=isAccepted(st.sel,it.a);
 st.checked=true;st.ok=ok;
 if(ok){player.combo++;player.best=Math.max(player.best,player.combo);const gain=e.retry?5:10;player.xp+=gain;if(!e.retry&&!player.errors.has(it.id))player.first++;st.msg=(S.profile==="haurra"?pick(PRAISE_KID):pick(PRAISE))+` +${gain} XP`}
 else{player.combo=0;player.errors.add(it.id);if(!e.retry)player.queue.push({item:it,retry:true});st.msg=pick(OOPS)}
 render();const fb=document.querySelector("#bd-player .bd-fb");if(fb&&fb.scrollIntoView)fb.scrollIntoView({block:"nearest",behavior:"smooth"})}
function next(){if(!player)return;player.pos++;if(player.pos>=player.queue.length){finish();return}player.state=fresh(cur());render()}
function finish(){const L=player.L,total=L.items.length,stars=starsFor(player.first,total),bonus=L.challenge?40:20;player.xp+=bonus;player.stars=stars;player.bonus=bonus;
 const prev=S.lessons[L.id]||{};S.lessons[L.id]={stars:Math.max(stars,prev.stars||0),best:Math.max(player.first,prev.best||0),runs:(prev.runs||0)+1,at:Date.now()};
 S.xp+=player.xp;S.days[today()]=(S.days[today()]||0)+player.xp;save();
 try{root.HBData?.activity?.({kind:"bidea_lesson",item:L.id,answer:String(stars)})}catch{}
 player.phase="end";render()}
function end(){const L=player.L,ls=lessons(),ni=nextLesson(),total=L.items.length,s=player.stars;
 const msg=s===3?"Ikasgai bikaina!":s===2?"Oso ondo!":"Eginda! Errepasoak lagunduko dizu.";
 return `<div class="bd-pwrap bd-endwrap">${top()}<main class="bd-end">${s===3?`<div class="bd-confetti" aria-hidden="true">${Array.from({length:18},(_,k)=>`<i style="--k:${k}"></i>`).join("")}</div>`:""}
 ${bira(s>=2?"celebrate":"effort","bd-bira-lg")}<h1>${msg}</h1><div class="bd-bigstars" aria-label="${s} izar">${[0,1,2].map(k=>`<span class="${k<s?"on":""}" style="--k:${k}">★</span>`).join("")}</div>
 <div class="bd-endstats"><div><b>${player.first}/${total}</b><small>lehen saiakeran</small></div><div><b>+${player.xp}</b><small>XP</small></div><div><b>${player.best}</b><small>jarraian</small></div></div>
 ${player.errors.size?`<p class="bd-note">Errepasatu dituzu: ${[...player.errors].length} ariketa, eta bigarren aldian ondo atera dira.</p>`:""}</main>
 <footer class="bd-pfoot">${ni>=0&&ni!==player.i?`<button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.start(${ni})">Hurrengo ikasgaia ${svg("arrow")}</button><button class="bd-btn bd-btn-ghost" onclick="HBBidea.close()">Amaitu</button>`:`<button class="bd-btn bd-btn-main" data-focus onclick="HBBidea.close()">Amaitu</button>`}</footer></div>`}

/* ---------- Ikuskaritza ---------- */
function audit(v){const it=cur().item;AUD[it.id]={...(AUD[it.id]||{}),v,src:it.src,at:new Date().toISOString()};store(AKEY,AUD);render()}
function auditNote(t){const it=cur().item;AUD[it.id]={...(AUD[it.id]||{}),note:t.slice(0,2000),src:it.src,at:new Date().toISOString()};store(AKEY,AUD)}
function auditText(){const all=lessons().flatMap(l=>l.items);return all.filter(i=>AUD[i.id]).map(i=>{const a=AUD[i.id];return `${a.v==="ok"?"✓":a.v==="fix"?"✎":"·"} ${i.src} | ${i.q}${a.note?"\n   Oharra: "+a.note:""}`}).join("\n")||"Oraindik ez dago oharrik."}
async function copyAudit(btn){const t=auditText();try{await navigator.clipboard.writeText(t);if(btn)btn.textContent="Kopiatuta ✓"}catch{const w=document.createElement("textarea");w.value=t;document.body.appendChild(w);w.select();try{document.execCommand("copy");if(btn)btn.textContent="Kopiatuta ✓"}catch{}w.remove()}}
function auditor(on){S.auditor=!!on;save();refresh()}

document.addEventListener("keydown",e=>{if(!player)return;if(e.key==="Escape"){askQuit();return}if(e.key==="Enter"&&!(e.target&&e.target.tagName==="TEXTAREA")){const b=document.querySelector("#bd-player .bd-pfoot .bd-btn-main:not([disabled])");if(b&&!(e.target&&e.target.tagName==="BUTTON")){e.preventDefault();b.click()}}});
applyProfile();
root.HBBidea={...api,gaur,mapa,start,begin,close,askQuit,sel,typed,tile,untile,tap,check,next,setProfile,choose,toggleHelp,audit,auditNote,copyAudit,auditor,auditText,_state:()=>S};
if(document.readyState!=="loading")applyProfile();else document.addEventListener("DOMContentLoaded",applyProfile);
})(typeof window!=="undefined"?window:globalThis);
