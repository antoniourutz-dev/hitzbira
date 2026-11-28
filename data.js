/* HitzBira 1.6: optional manual account login, persistent learning journal. */
(function(){
"use strict";
const BASE="https://awdajwrzxceqazmaorxc.supabase.co",KEY="sb_publishable_USopGmel8SEMUckG1DoXTA_2-O0fQQk",RELEASE="hb-1.2-e461f43",STORE="hb-pilot-session-v1",META={"total":1867,"source":1867,"image":115,"synthetic":144,"counts":{"0-0":7,"0-1":7,"0-2":7,"0-3":7,"0-4":7,"0-5":7,"0-6":7,"0-7":7,"0-8":7,"0-9":7,"0-10":5,"1-0":40,"1-1":40,"1-2":40,"1-3":40,"1-4":40,"1-5":40,"1-6":40,"1-7":40,"1-8":40,"1-9":40,"1-10":28,"2-0":40,"2-1":40,"2-2":40,"2-3":40,"2-4":40,"2-5":40,"2-6":40,"2-7":40,"2-8":40,"2-9":40,"2-10":20,"3-0":88,"3-1":88,"3-2":88,"3-3":88,"3-4":88,"3-5":88,"3-6":88,"3-7":88,"3-8":88,"3-9":88,"3-10":64},"systems":[{"total":75,"zuka":64},{"total":428,"zuka":300},{"total":420,"zuka":292},{"total":944,"zuka":600}]},memo=new Map();
const SUFFIX="@hitzbira.app",ROLE="hitzbira_isolated",ENDPOINT=BASE+"/functions/v1/"+(location.hostname==="hitzbira.vercel.app"?"hitzbira-learning-production":["hitzbira-git-feature-hitzbira-171a80-antoniourutz-devs-projects.vercel.app","hitzbira-git-feature-guest-ac-cbff4f-antoniourutz-devs-projects.vercel.app"].includes(location.hostname)?"hitzbira-learning-preview":"hitzbira-pilot-account");
let session=null,authorized=false,refreshing=null,starting=false;
function claims(token){try{const x=token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(atob(x.padEnd(Math.ceil(x.length/4)*4,"=")))}catch{return {}}}
function emailFor(value){const name=String(value||"").trim().toLowerCase();if(!/^[a-z0-9][a-z0-9._-]{2,23}$/.test(name))throw Error("Egiaztatu erabiltzaile-izena.");return name+SUFFIX}
function saveSession(x,name){const c=claims(x.access_token||"");if(c.role!==ROLE||!c.sub||!String(c.email||"").endsWith(SUFFIX))throw Error("Kontu honek ez du HitzBira erabiltzeko baimenik.");session={access_token:x.access_token,refresh_token:x.refresh_token||session?.refresh_token||"",expires_at:x.expires_at||Date.now()/1000+x.expires_in,uid:c.sub,username:name||String(c.email).split("@")[0]};try{sessionStorage.setItem(STORE,JSON.stringify(session))}catch{}}
function clearSession(){authorized=false;session=null;memo.clear();try{sessionStorage.removeItem(STORE)}catch{}}
try{const x=JSON.parse(sessionStorage.getItem(STORE)||"null");if(x?.access_token){const c=claims(x.access_token);if(c.sub&&c.role===ROLE&&String(c.email||"").endsWith(SUFFIX)){session={...x,uid:c.sub,username:String(c.email).split("@")[0]}}else clearSession()}}catch{clearSession()}
function keyFor(k){return authorized&&session?.uid?k+"::hb::"+session.uid:k}
const streams=["hitzbira-unified-09","hitzbira-goal-v1","hitzbira-assessment-v1","hitzbira-journey-v1","sustrai-aditzak-v1","hitzbira-path-v1"];
const prev=new Map(),counterKeys=new Set(["n","ok","auto","unverified","attempts","correct"]);
let flushing=null,streak=null,syncError="",storageError="",retryAt=0,hydrated=false,sequence=0;
const copy=v=>JSON.parse(JSON.stringify(v)),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b),obj=v=>v&&typeof v==="object"&&!Array.isArray(v);
function patch(before,after,path=[],stream=""){
 if(eq(before,after))return null;
 const k=path[path.length-1];
 // path scores are latest result, not additive; only their attempts are additive.
 const counts=stream==="hitzbira-unified-09"&&path.length===2&&["n","ok","auto","unverified"].includes(k)||stream==="sustrai-aditzak-v1"&&path.length===2&&["attempts","correct"].includes(k)||stream==="hitzbira-path-v1"&&path.length===3&&k==="attempts";
 if(counts&&Number.isInteger(after)&&after>=Number(before||0))return {t:"inc",v:after-Number(before||0)};
 if(Array.isArray(after)){const old=Array.isArray(before)?before:[];return {t:"union",v:after.filter(x=>!old.some(y=>eq(x,y)))}}
 if(obj(after)){const old=obj(before)?before:{},v={};for(const key of Object.keys(after)){if(["__proto__","constructor","prototype"].includes(key))continue;const p=patch(old[key],after[key],[...path,key],stream);if(p)v[key]=p}return Object.keys(v).length?{t:"obj",v}:null}
 return {t:"set",v:after===undefined?null:after};
}
function readLocal(k){try{const s=localStorage.getItem(k);return s===null?undefined:JSON.parse(s)}catch{return undefined}}
function outPrefix(){return "hb-outbox-1::"+session.uid+"::"}
function pending(){if(!authorized||!session)return [];const prefix=outPrefix(),rows=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith(prefix)){const e=readLocal(k);if(e?.id)rows.push({key:k,event:e});else storageError="Gordetako gertaera bat ezin da irakurri."}}return rows.sort((a,b)=>a.event.at.localeCompare(b.event.at)||(a.event.seq||0)-(b.event.seq||0)||a.event.id.localeCompare(b.event.id))}
const LOCAL_STREAK_KEY="hitzbira-streak-days-v1",DAY_LABELS=["Ig","Al","As","Az","Og","Or","Lr"];
const MINI_FLAME='<svg class="hb-flame-mini" viewBox="0 0 24 24" aria-hidden="true"><path class="fl-outer" d="M12.6 2.2c.3 3.2-1.9 5-3.2 6.8-1.4 1.9-2.4 3.5-2.4 5.7A5.8 5.8 0 0 0 12.8 20.5a5.9 5.9 0 0 0 5.9-6c0-3.3-2-5.8-3.3-7.4-.5 1.3-1.4 2-2.2 2.2.7-2.2.6-4.8-.6-7.1Z"/><path class="fl-core" d="M12.5 11.4c-.9 1.3-1.8 2.4-1.8 3.8a2.3 2.3 0 0 0 4.6 0c0-1.5-1.1-2.7-2.8-3.8Z"/></svg>';
function localToday(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function localStreak(){
 const today=localToday(),raw=readLocal(LOCAL_STREAK_KEY),list=Array.isArray(raw)?[...new Set(raw.filter(x=>typeof x==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(x)))].sort():[];
 const set=new Set(list),base=new Date(today+"T12:00:00Z");
 let current=0,cursor=base;
 if(!set.has(today))cursor=new Date(base.getTime()-86400000);
 while(set.has(cursor.toISOString().slice(0,10))){current++;cursor=new Date(cursor.getTime()-86400000)}
 let best=0,run=0,prevT=null;
 for(const s of list){const t=Date.parse(s+"T12:00:00Z");run=(prevT!==null&&Math.round((t-prevT)/86400000)===1)?run+1:1;if(run>best)best=run;prevT=t}
 return {current,best,total:list.length,days:list,today,local:true};
}
function touchLocalDay(details){
 if(authorized||!details||!["answer","verb_answer","assessment_answer","lab_answer","bidea_lesson"].includes(details.kind))return;
 const today=localToday(),raw=readLocal(LOCAL_STREAK_KEY),list=Array.isArray(raw)?raw.filter(x=>typeof x==="string"):[];
 if(!list.includes(today)){list.push(today);try{localStorage.setItem(LOCAL_STREAK_KEY,JSON.stringify(list.slice(-120)))}catch{}}
}
function clearLocalStreak(){try{localStorage.removeItem(LOCAL_STREAK_KEY)}catch{}paint()}
function paint(){
 const n=document.getElementById("hb-sync-status"),dot=document.getElementById("hb-sync-dot"),btn=document.getElementById("hb-streak-btn"),pop=document.getElementById("hb-streak-pop");
 if(n||dot){
  if(!authorized){if(n)n.hidden=true;if(dot)dot.className="hb-sync-dot"}
  else{
   let count=0;try{count=pending().length}catch{storageError="Gailuko biltegia ez dago erabilgarri."}
   const warn=!!(storageError||syncError),tone=warn?"hb-sync-warning":count?"hb-sync-pending":"hb-sync-ok";
   if(n){
    n.hidden=false;
    n.textContent=storageError?"⚠ "+storageError:count?"↻ Gordetzen…"+(syncError?" · konexioaren zain":""):syncError?"⚠ "+syncError:hydrated?"✓ Aurrerapena gordeta":"Kargatzen…";
    n.className="hb-sync-status "+tone;
   }
   if(dot){dot.className="hb-sync-dot "+tone}
  }
 }
 if(!btn||!pop)return;
 const s=authorized?streak:localStreak();
 const countEl=document.getElementById("hb-streak-count"),sumEl=document.getElementById("hb-streak-summary"),bestEl=document.getElementById("hb-streak-best"),daysEl=document.getElementById("hb-streak-days"),footEl=document.getElementById("hb-streak-foot");
 if(!s){countEl.textContent="·";btn.classList.remove("lit","warm");sumEl.textContent="Bolada kargatzen…";return}
 const days=new Set(s.days||[]),today=s.today||localToday(),litToday=days.has(today),cur=Number(s.current)||0,best=Number(s.best)||0,total=Number(s.total)||0;
 countEl.textContent=String(cur);
 btn.classList.toggle("lit",litToday);
 btn.classList.toggle("warm",!litToday&&cur>0);
 pop.classList.toggle("lit",litToday);
 btn.setAttribute("aria-label","Eguneroko bolada: "+cur+" egun"+(litToday?" · gaur piztuta":""));
 btn.title=cur?cur+" egun jarraian"+(litToday?" · gaur piztuta":" · piztu gaurko sua"):"Eguneroko bolada · piztu gaurko sua";
 const base=new Date(today+"T12:00:00Z");daysEl.replaceChildren();
 for(let i=6;i>=0;i--){
  const dt=new Date(base.getTime()-i*86400000),iso=dt.toISOString().slice(0,10),on=days.has(iso),dow=DAY_LABELS[dt.getUTCDay()];
  const cell=document.createElement("div");
  cell.className="hb-day-cell"+(on?" lit":"")+(i===0?" today":"");
  cell.title=iso+(on?" · landua":" · atseden");
  cell.innerHTML='<span class="hb-day-dot" role="img" aria-label="'+iso+(on?" · landua":" · atseden")+'">'+(on?MINI_FLAME:'<i></i>')+'</span><small>'+dow+'</small>';
  daysEl.append(cell);
 }
 sumEl.textContent=cur?cur+" egun jarraian":total?"Piztu gaurko sua berriro":"Piztu gaurko sua";
 bestEl.textContent=total?"Zure marka: "+best+" egun · "+total+" egun guztira":"Egun bakoitzeko ariketa bat nahikoa da.";
 footEl.textContent=authorized?"Zure bolada zure kontuan gordeta dago. Atseden hartzen baduzu, bihar berriro piztu dezakezu.":"Gailu honetan gordeta. Kontuarekin saioa hasita, beste gailuetan ere mantenduko da.";
}
function persistEvent(stream,p,details={}){
 if(!authorized||!session)return;
 const e={id:crypto.randomUUID(),stream,patch:p,details,at:new Date().toISOString(),seq:++sequence};
 try{localStorage.setItem(outPrefix()+e.id,JSON.stringify(e))}catch(err){storageError="Gailuan ezin izan da gorde. Ez itxi saioa; saiatu berriro.";paint();throw err}
 return e;
}
function save(k,value,details={}){
 if(!streams.includes(k))throw Error("Unknown stream");
 const old=prev.has(k)?prev.get(k):readLocal(keyFor(k));
 const next=copy(value);
 // Preserve the independently versioned Bidea namespace when legacy Journey saves lessons/labs.
 if(k==="hitzbira-journey-v1"&&obj(next)&&obj(old)&&typeof old.bideaPilotV1==="string"&&!Object.prototype.hasOwnProperty.call(next,"bideaPilotV1"))next.bideaPilotV1=old.bideaPilotV1;
 const p=patch(old,next,[],k);
 // Durable journal first; never acknowledge a local save which was not written.
 if(authorized&&p)persistEvent(k,p,details);
 try{localStorage.setItem(keyFor(k),JSON.stringify(next));prev.set(k,next)}catch(e){storageError="Gailuko biltegia beteta dago.";paint();if(!authorized||!p)throw e}
 touchLocalDay(details);
 paint();
 if(authorized)void flush();
}

/* Bidea pilot uses the existing authenticated journey stream, not a new table or permission.
   The scalar snapshot deliberately replaces arrays/drafts rather than applying union semantics.
   The existing outbox and server acknowledgment govern synchronization. Sequential devices only. */
function localGuestBidea(){
 const raw=readLocal("hitzbira-bidea-v1");if(!obj(raw))return null;
 const episodes=Object.fromEntries(Object.entries(raw.episodes||{}).filter(([id,v])=>/^HB-EP-(?:FOREST|SHELTER|MIRROR)-0[1-5]$/.test(id)&&obj(v)));
 const forestDraft=raw.forestDraft?.v===1&&/^HB-EP-(?:FOREST|SHELTER|MIRROR)-0[1-5]$/.test(raw.forestDraft.id)?raw.forestDraft:null;
 const days=Object.fromEntries(Object.entries(raw.episodeStudyDays||{}).filter(([k,v])=>/^\d{4}-\d{2}-\d{2}$/.test(k)&&v===true));
 const memory=Object.fromEntries(Object.entries(raw.episodeErrorMemory||{}).filter(([k,v])=>["non","nora","nondik","nor","nornork","nornorinork"].includes(k)&&obj(v)));
 const recognitionEvidence=Object.fromEntries(Object.entries(raw.recognitionEvidence||{}).filter(([id,r])=>obj(r)&&((r.mode==="recognition"&&["match","mismatch","supported"].includes(r.result))||(r.mode==="cued_recall"&&r.skill==="vocabulary"&&/^HB-ROSCO-v1-(foundation|everyday)-[1-8]$/.test(id)&&["match","supported","unverified"].includes(r.result)))&&Number.isFinite(r.at)&&["foundation","everyday"].includes(r.stage)&&((r.skill==="reading"&&new RegExp("^HB-CONTEXT-"+r.stage+"-[1-5]$").test(id))||(["reading","grammar"].includes(r.skill)&&r.stage==="everyday"&&/^HB-EP-MIRROR-0[1-5]-[1-4]$/.test(id))||(r.skill==="vocabulary"&&r.mode==="cued_recall"&&new RegExp("^HB-ROSCO-v1-"+r.stage+"-[1-8]$").test(id))||(r.skill==="verbs"&&["HB-VERB-NOR-1","HB-VERB-FOUND-2","HB-VERB-EVERY-1","HB-VERB-EVERY-2"].includes(id)))).map(([id,r])=>[id,{skill:r.skill,stage:r.stage,mode:r.mode,result:r.result,assisted:r.assisted===true,at:r.at,firstMatch:r.firstMatch===true,attempts:Math.min(999,Math.max(1,Number(r.attempts)||1))}]));
 if(!Object.keys(episodes).length&&!forestDraft&&!Object.keys(days).length&&!Object.keys(memory).length&&!Object.keys(recognitionEvidence).length)return null;
 return {level:"a1a2",forestMission:[2,3].includes(raw.forestMission)?raw.forestMission:1,placed:false,lessons:{},days:{},xp:0,episodes,episodeErrorMemory:memory,episodeStudyDays:days,recognitionEvidence,...(forestDraft?{forestDraft}:{}),help:raw.help==="eu"?"eu":"es",sound:raw.sound!==false}
}
async function importGuestBidea(){
 if(!authorized||loadBidea())return false;
 const own=readLocal(keyFor("hitzbira-bidea-v1"));
 const ownProgress=obj(own)&&(own.level||Object.keys(own.episodes||{}).length||own.forestDraft||own.episodeDraft)?own:null;
 const guest=localGuestBidea(),candidate=ownProgress||(guest&&confirm("Gailu honetan egindako abentura eta aurrerapena zure kontura ekarri? Ziurtatu zureak direla. Tokiko kopia mantenduko da.")?guest:null);
 if(!candidate)return false;
 saveBidea(candidate);await flush();if(pending().length)throw Error("Bideko aurrerapena gordetzeke dago. Saiatu berriro Internetekin.");
 return true;
}
function loadBidea(){
 if(!authorized)return null;
 const j=readLocal(keyFor("hitzbira-journey-v1"));if(typeof j?.bideaPilotV1!=="string")return null;
 try{const e=JSON.parse(j.bideaPilotV1);if(e?.v===1&&obj(e.state))return e.state}catch{}
 return null
}
function saveBidea(state){
 if(!authorized)return;
 if(!obj(state))throw Error("Bideko egoera baliogabea.");
 const k="hitzbira-journey-v1",raw=readLocal(keyFor(k)),j=obj(raw)?raw:{};
 const encoded=JSON.stringify({v:1,state});
 if(encoded===j.bideaPilotV1)return;
 // Check the serialized patch, including escaping; never send oversized snapshots.
 const candidate={...j,bideaPilotV1:encoded};
 if(new TextEncoder().encode(JSON.stringify(patch(j,candidate,[],k))).length>300000){storageError="Bideko datuak handiegiak dira sinkronizatzeko.";paint();throw Error(storageError)}
 save(k,candidate,{kind:"bidea_checkpoint"});
}
function activity(details){touchLocalDay(details);if(!authorized){paint();return}persistEvent("activity",{t:"set",v:null},details);paint();void flush()}
async function pull(){const result=await gateway({action:"learning_load"},await currentToken());if(!Array.isArray(result.state)||!result.streak)throw Error("Sinkronizazio-erantzuna ez da baliozkoa.");streak=result.streak;return result.state}
async function flush(){
 if(!authorized||!session)return;if(flushing)return flushing;
 const uid=session.uid;
 flushing=(async()=>{try{for(;;){const row=pending()[0];if(!row)break;const ack=await gateway({action:"learning_push",event:row.event},await currentToken());if(!ack.ok)throw Error("Gordetzea ez da baieztatu.");if(ack.streak)streak=ack.streak;
 // Only remove the durable event after a committed server ACK.
 if(session?.uid!==uid)return;localStorage.removeItem(row.key);paint()}
 syncError="";retryAt=0;paint();
 }catch(e){syncError=e.status===403?"Saioa berritu behar da.": "Sinkronizatu gabe · berriz saiatuko gara.";retryAt=Date.now()+5000;paint();throw e}})().catch(()=>{}).finally(()=>{flushing=null});return flushing;
}
async function hydrate(){
 if(!authorized)return;
 // Complete outstanding sends before replacing any projection with server state.
 await flush();if(pending().length)throw Error("Gordetzeke dauden aldaketak daude. Saiatu berriro Internetekin.");
 let state=await pull(),present=new Set(state.map(x=>x.stream));
 const empty=state.length===0,hasOwn=streams.some(k=>readLocal(keyFor(k))!==undefined),hasGuest=streams.some(k=>readLocal(k)!==undefined);
 const importGuest=empty&&!hasOwn&&hasGuest&&confirm("Gailu honetako gonbidatuaren jarduna zure kontura kopiatu? Zurea dela ziurtatu. Tokiko kopia mantenduko da.");
 for(const k of streams){const marker="hb-seed-1::"+session.uid+"::"+k;if(localStorage.getItem(marker))continue;const value=readLocal(keyFor(k))??(importGuest?readLocal(k):undefined);if(value!==undefined){persistEvent(k,{t:"seed",v:value},{kind:"legacy_baseline",appliedIfEmpty:!present.has(k)});localStorage.setItem(marker,"1")}}
 await flush();if(pending().length)throw Error("Gordetzeke dauden aldaketak daude. Saiatu berriro Internetekin.");
 state=await pull();for(const row of state){if(streams.includes(row.stream)){localStorage.setItem(keyFor(row.stream),JSON.stringify(row.payload));prev.set(row.stream,copy(row.payload))}}
 if(await importGuestBidea()){state=await pull();for(const row of state){if(streams.includes(row.stream)){localStorage.setItem(keyFor(row.stream),JSON.stringify(row.payload));prev.set(row.stream,copy(row.payload))}}}
 hydrated=true;paint();
}

function authError(msg,status){const e=Error(msg);e.status=status;return e}
async function serviceRequest(url,options,label){try{return await fetch(url,{...options,signal:options.signal||AbortSignal.timeout(12000)})}catch(e){if(e.name==="TimeoutError"||e.name==="AbortError")throw Error(label+": zerbitzuak ez du garaiz erantzun. Saiatu berriro.");if(e instanceof TypeError)throw Error(label+": ezin izan da konexioa egin. Egiaztatu sare-konexioa eta saiatu «Konexioa egiaztatu» aukerarekin.");throw e}}
async function tokenRequest(type,payload){const r=await serviceRequest(BASE+"/auth/v1/token?grant_type="+type,{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json"},body:JSON.stringify(payload),cache:"no-store"},"Saioa hasteko zerbitzua");if(!r.ok)throw authError(r.status===429?"Saiakera gehiegi. Saiatu geroago.":"Egiaztatu erabiltzailea eta pasahitza.",r.status);return r.json()}
async function currentToken(){if(!session)throw authError("Hasi saioa berriro.",401);if(session.expires_at>Date.now()/1000+30)return session.access_token;if(!session.refresh_token)throw authError("Saioa iraungi da.",401);if(!refreshing)refreshing=(async()=>{const uid=session.uid;const x=await tokenRequest("refresh_token",{refresh_token:session.refresh_token});const c=claims(x.access_token||"");if(c.sub!==uid||c.role!==ROLE)throw authError("Saioa ez da baliozkoa.",403);saveSession(x);return session.access_token})().finally(()=>{refreshing=null});return refreshing}
async function gateway(body,token,signal){const r=await serviceRequest(ENDPOINT,{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify(body),cache:"no-store",...(signal?{signal}:{})},"Kontuaren konexioa");const x=await r.json().catch(()=>({}));if(!r.ok)throw authError(x.error||"Zerbitzua ezin izan da erabili.",r.status);return x}
async function verify(){const token=await currentToken();const info=await gateway({action:"check"},token);if(!info.ok||info.username!==session.username)throw authError("Kontuak ez du baimenik.",403);if(info.release!==RELEASE)throw authError("Zerbitzuaren bertsioa ez dator bat. Saiatu berriro.",409);authorized=true}
async function signIn(name,password){const email=emailFor(name),x=await tokenRequest("password",{email,password});saveSession(x,email.split("@")[0]);try{await verify()}catch(e){clearSession();throw e}}
function lockAndReload(){clearSession();document.body.classList.add("hb-locked");location.reload()}
async function signOut(){const old=session;clearSession();document.body.classList.add("hb-locked");try{if(old?.access_token)await fetch(BASE+"/auth/v1/logout?scope=local",{method:"POST",headers:{apikey:KEY,Authorization:"Bearer "+old.access_token},cache:"no-store",signal:AbortSignal.timeout(3000)})}catch{}location.reload()}
function cached(k,fn){if(!memo.has(k))memo.set(k,Promise.resolve().then(fn).catch(e=>{memo.delete(k);throw e}));return memo.get(k)}
function count(s,m){return Object.entries(META.counts).filter(([k])=>{let [x,y]=k.split("-").map(Number);return(s===-1||s===x)&&(m===-1||m===y)}).reduce((n,[,v])=>n+v,0)}
async function query(kind,expected,filter={}){if(!authorized)throw authError("Hasi saioa.",401);const offsets=[];for(let offset=0;offset<expected;offset+=100)offsets.push(offset);let rows=[];for(let i=0;i<offsets.length;i+=4){const token=await currentToken();const batch=await Promise.all(offsets.slice(i,i+4).map(async offset=>{const page=await gateway({action:"read",kind,offset,filter},token);if(!Array.isArray(page)||page.length!==Math.min(100,expected-offset))throw Error("Bankuaren osotasun-kontrolak huts egin du.");return page}));for(const page of batch)rows.push(...page)}return rows}
function validate(rows,n,predicate){if(rows.length!==n||new Set(rows.map(r=>r.ordinal)).size!==n||new Set(rows.map(r=>r.payload.id)).size!==n||!rows.every(r=>r.payload&&predicate(r.payload)))throw Error("Bankuaren osotasun-kontrolak huts egin du.");return rows.sort((a,b)=>a.ordinal-b.ordinal)}
function staticBlock(k){return cached("static:"+k,async()=>{const r=await fetch("/aditzak/data/"+k+".json");if(!r.ok)throw Error("Tokiko blokea ezin izan da kargatu.");return r.json()})}
function aux(s=-1,m=-1){let n=count(s,m);return cached("aux:"+s+":"+m,async()=>{if(!n)return [];let rows;const filter={};if(s!==-1)filter.partition_key="eq."+s;if(m!==-1)filter["payload->>m"]="eq."+m;
 if(authorized){try{rows=await query("aux",n,filter)}catch(e){if(e.status===401||e.status===403)throw e;}}
 if(!rows){const ks=Object.keys(META.counts).filter(k=>{const [x,y]=k.split("-").map(Number);return(s===-1||s===x)&&(m===-1||m===y)});rows=(await Promise.all(ks.map(staticBlock))).flat()}
 return validate(rows,n,d=>(s===-1||d.s===s)&&(m===-1||d.m===m)&&typeof d.form==="string"&&Array.isArray(d.roles))})}
function synthetic(){return cached("synthetic",async()=>{let rows;if(authorized){try{rows=await query("synthetic",META.synthetic)}catch(e){if(e.status===401||e.status===403)throw e}}return validate(rows||await staticBlock("synthetic"),META.synthetic,d=>typeof d.form==="string"&&typeof d.lemma==="string")})}
function grammar(n){if(!["decl","bank05","bank06","bank07","bank08"].includes(n))throw Error("Banku ezezaguna");return cached("grammar:"+n,async()=>{if(authorized){try{const rows=await query("grammar_bank",1,{record_id:"eq."+n});return rows[0].payload}catch(e){if(e.status===401||e.status===403)throw e}}const r=await fetch("/legacy/"+n+".js");if(!r.ok)throw Error("Bankua ezin izan da kargatu.");const m=(await r.text()).match(/^\s*const\s+(?:BANK|DATA)\s*=\s*([\s\S]*);\s*$/);if(!m)throw Error("Datu-formatua ez da zuzena.");return JSON.parse(m[1])})}
async function vocabulary({level,theme="all"}={}){if(!authorized)throw authError("Hasi saioa.",401);const owner=session.uid;const result=await gateway({action:"vocabulary",level,theme},await currentToken(),AbortSignal.timeout(8000));if(!authorized||session?.uid!==owner)throw authError("Saioa aldatu da.",401);return result}
const AVATAR_KEY="hitzbira-avatar-v1";
const AVATARS=[
 {id:"bira",name:"Bira",svg:'<svg viewBox="0 0 40 40" class="hb-av-svg" aria-hidden="true"><rect width="40" height="40" rx="14" fill="#EDE6FC"/><path d="M16 9H24C30.5 9 33.5 12.6 33.5 18.6V23.4C33.5 29.2 30.6 31.8 25 32H18.5L13.5 35.4L14.2 31.3C9.8 30.2 7.5 27.6 7.5 23.2V18.6C7.5 12.6 10.6 9 16 9Z" fill="#FFE28A" stroke="#34204F" stroke-width="2.1" stroke-linejoin="round"/><path d="M11.8 15.6Q13.6 12 18 11.7" fill="none" stroke="#FFF6D6" stroke-width="2.1" stroke-linecap="round"/><circle cx="13.8" cy="23.4" r="1.9" fill="#F6A078"/><circle cx="26.8" cy="23.4" r="1.9" fill="#F6A078"/><ellipse cx="16.8" cy="19.9" rx="1.4" ry="1.8" fill="#34204F"/><ellipse cx="23.8" cy="19.9" rx="1.4" ry="1.8" fill="#34204F"/><path d="M18 23.4Q20.3 26 22.6 23.3" fill="none" stroke="#34204F" stroke-width="1.8" stroke-linecap="round"/></svg>'},
 {id:"txinpart",name:"Txinpart",svg:'<svg viewBox="0 0 40 40" class="hb-av-svg" aria-hidden="true"><rect width="40" height="40" rx="14" fill="#FFF0E3"/><path d="M10.5 17L9 8.8L16.2 12.6Z" fill="#FF7A59" stroke="#34204F" stroke-width="2" stroke-linejoin="round"/><path d="M29.5 17L31 8.8L23.8 12.6Z" fill="#FF7A59" stroke="#34204F" stroke-width="2" stroke-linejoin="round"/><ellipse cx="20" cy="22.5" rx="11.5" ry="9.8" fill="#FF8C5A" stroke="#34204F" stroke-width="2.1"/><path d="M12 24.5C14.5 22 17.5 24 20 24C22.5 24 25.5 22 28 24.5C27.5 29.2 24.2 31.8 20 31.8C15.8 31.8 12.5 29.2 12 24.5Z" fill="#FFF4DF"/><circle cx="15.4" cy="21" r="1.6" fill="#34204F"/><circle cx="24.6" cy="21" r="1.6" fill="#34204F"/><path d="M18.6 24.4L20 25.6L21.4 24.4" fill="#34204F" stroke="#34204F" stroke-width="1.2" stroke-linejoin="round"/><path d="M17.5 27.2Q20 29 22.5 27.2" fill="none" stroke="#34204F" stroke-width="1.7" stroke-linecap="round"/><circle cx="12.8" cy="24.2" r="1.5" fill="#FFB4A2"/><circle cx="27.2" cy="24.2" r="1.5" fill="#FFB4A2"/></svg>'},
 {id:"lur",name:"Lur",svg:'<svg viewBox="0 0 40 40" class="hb-av-svg" aria-hidden="true"><rect width="40" height="40" rx="14" fill="#E3F6EE"/><path d="M20 12.5C20 8.5 23.2 6.4 26.8 7C26.5 10.6 23.8 13 20 12.5Z" fill="#34D399" stroke="#34204F" stroke-width="1.9" stroke-linejoin="round"/><path d="M20 12.5C19.5 9.2 16.5 7.5 13.8 8.4C14.4 11.4 16.8 13 20 12.5Z" fill="#10B981" stroke="#34204F" stroke-width="1.9" stroke-linejoin="round"/><rect x="8.5" y="12.5" width="23" height="20" rx="10" fill="#22C58B" stroke="#34204F" stroke-width="2.1"/><ellipse cx="20" cy="24.8" rx="8.2" ry="6.2" fill="#E6FBF2"/><circle cx="15.8" cy="21.4" r="1.6" fill="#34204F"/><circle cx="24.2" cy="21.4" r="1.6" fill="#34204F"/><circle cx="13" cy="24.4" r="1.6" fill="#F9A88C"/><circle cx="27" cy="24.4" r="1.6" fill="#F9A88C"/><path d="M18 25Q20 27.2 22 25" fill="none" stroke="#34204F" stroke-width="1.8" stroke-linecap="round"/></svg>'},
 {id:"argi",name:"Argi",svg:'<svg viewBox="0 0 40 40" class="hb-av-svg" aria-hidden="true"><rect width="40" height="40" rx="14" fill="#ECE9FF"/><circle cx="20" cy="22" r="11.2" fill="#8B6CF6" stroke="#34204F" stroke-width="2.1"/><path d="M13 16Q15.5 12.6 20 12.5" fill="none" stroke="#CBB8FF" stroke-width="2" stroke-linecap="round"/><path d="M20 6.8L21.5 10.2L25.2 10.6L22.4 13L23.2 16.6L20 14.7L16.8 16.6L17.6 13L14.8 10.6L18.5 10.2Z" fill="#FFCA3A" stroke="#34204F" stroke-width="1.6" stroke-linejoin="round"/><circle cx="15.8" cy="22.4" r="1.6" fill="#34204F"/><circle cx="24.2" cy="22.4" r="1.6" fill="#34204F"/><circle cx="16.3" cy="21.8" r=".55" fill="#FFF"/><circle cx="24.7" cy="21.8" r=".55" fill="#FFF"/><circle cx="13" cy="25.2" r="1.6" fill="#F5A3B8"/><circle cx="27" cy="25.2" r="1.6" fill="#F5A3B8"/><path d="M17.8 25.8Q20 28 22.2 25.8" fill="none" stroke="#34204F" stroke-width="1.8" stroke-linecap="round"/></svg>'},
 {id:"kai",name:"Kai",svg:'<svg viewBox="0 0 40 40" class="hb-av-svg" aria-hidden="true"><rect width="40" height="40" rx="14" fill="#E5F2FF"/><circle cx="20" cy="21.5" r="11.2" fill="#4DA3FF" stroke="#34204F" stroke-width="2.1"/><path d="M10.5 17.2C13 11.5 27 11.5 29.5 17.2Z" fill="#FFCA3A" stroke="#34204F" stroke-width="2" stroke-linejoin="round"/><rect x="11.6" y="18.2" width="7.2" height="5.6" rx="2.6" fill="#FFF" stroke="#34204F" stroke-width="1.8"/><rect x="21.2" y="18.2" width="7.2" height="5.6" rx="2.6" fill="#FFF" stroke="#34204F" stroke-width="1.8"/><path d="M18.8 20.8H21.2" stroke="#34204F" stroke-width="1.8"/><circle cx="15.4" cy="21" r="1.3" fill="#34204F"/><circle cx="24.6" cy="21" r="1.3" fill="#34204F"/><path d="M17.4 26.8Q20 29.2 22.6 26.8" fill="none" stroke="#34204F" stroke-width="1.8" stroke-linecap="round"/></svg>'},
 {id:"basajaun",name:"Basajaun",svg:'<svg viewBox="0 0 40 40" class="hb-av-svg" aria-hidden="true"><rect width="40" height="40" rx="14" fill="#FBF0DC"/><circle cx="11.5" cy="13.5" r="4.2" fill="#C48252" stroke="#34204F" stroke-width="2"/><circle cx="28.5" cy="13.5" r="4.2" fill="#C48252" stroke="#34204F" stroke-width="2"/><circle cx="11.5" cy="13.5" r="1.8" fill="#F3C8A2"/><circle cx="28.5" cy="13.5" r="1.8" fill="#F3C8A2"/><ellipse cx="20" cy="22.5" rx="11.2" ry="10.2" fill="#D49260" stroke="#34204F" stroke-width="2.1"/><ellipse cx="20" cy="25.8" rx="5.8" ry="4.4" fill="#FFF2DF"/><circle cx="15.6" cy="20.4" r="1.6" fill="#34204F"/><circle cx="24.4" cy="20.4" r="1.6" fill="#34204F"/><ellipse cx="20" cy="24.2" rx="1.9" ry="1.3" fill="#34204F"/><path d="M17.8 26.8Q20 28.6 22.2 26.8" fill="none" stroke="#34204F" stroke-width="1.7" stroke-linecap="round"/><circle cx="12.6" cy="23.6" r="1.6" fill="#F6A08A"/><circle cx="27.4" cy="23.6" r="1.6" fill="#F6A08A"/></svg>'}
];
function defaultAvatarId(name){let h=0;const s=String(name||"bira").toLowerCase();for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return AVATARS[h%AVATARS.length].id}
function currentAvatar(){const saved=readLocal(keyFor(AVATAR_KEY));const hit=AVATARS.find(a=>a.id===saved);return hit||AVATARS.find(a=>a.id===defaultAvatarId(session?.username))||AVATARS[0]}
function prettyName(name){const s=String(name||"").trim();return s?s.charAt(0).toUpperCase()+s.slice(1):"Gonbidatua"}
function paintAccount(){
 const wrap=document.getElementById("hb-account-wrap"),slot=document.getElementById("hb-avatar-slot"),popAv=document.getElementById("hb-pop-avatar"),popName=document.getElementById("hb-pop-name"),grid=document.getElementById("hb-avatar-grid");
 const name=authorized?prettyName(session?.username):"Gonbidatua";
 if(status)status.textContent=name;
 if(popName)popName.textContent=name;
 if(wrap)wrap.hidden=!authorized;
 if(login)login.hidden=authorized||document.body?.dataset.hbLoading==="true";
 if(!authorized)return;
 const av=currentAvatar();
 if(slot)slot.innerHTML=av.svg;
 if(popAv)popAv.innerHTML=av.svg;
 if(acctBtn)acctBtn.setAttribute("aria-label","Zure kontua: "+name+" ("+av.name+")");
 if(grid){
  grid.replaceChildren();
  for(const item of AVATARS){
   const b=document.createElement("button");
   b.type="button";
   b.className="hb-av-choice"+(item.id===av.id?" is-on":"");
   b.setAttribute("aria-pressed",String(item.id===av.id));
   b.innerHTML=item.svg+"<span>"+item.name+"</span>";
   b.addEventListener("click",()=>{try{localStorage.setItem(keyFor(AVATAR_KEY),JSON.stringify(item.id))}catch{}paintAccount()});
   grid.append(b);
  }
 }
}
window.HBData={meta:META,count,aux,synthetic,grammar,vocabulary,isRemote:()=>authorized,guestLimited:()=>!authorized,streakSummary:()=>authorized?streak:null,release:RELEASE,keyFor,save,loadBidea,saveBidea,activity,flush,clearLocalStreak,avatars:AVATARS,currentAvatar,uiReady,syncShell};
const form=document.getElementById("hb-login-form"),submit=document.getElementById("hb-login-submit"),msg=document.getElementById("hb-login-message"),status=document.getElementById("hb-account-name"),out=document.getElementById("hb-sign-out"),login=document.getElementById("hb-show-login"),close=document.getElementById("hb-login-close"),modal=document.getElementById("hb-login"),streakBtn=document.getElementById("hb-streak-btn"),streakPop=document.getElementById("hb-streak-pop"),acctBtn=document.getElementById("hb-account-btn"),acctPop=document.getElementById("hb-account-pop");
function setStreakOpen(open){if(!streakBtn||!streakPop)return;if(open)setAcctOpen(false);streakPop.hidden=!open;streakBtn.setAttribute("aria-expanded",String(open))}
function setAcctOpen(open){if(!acctBtn||!acctPop)return;if(open&&streakPop&&!streakPop.hidden){streakPop.hidden=true;streakBtn?.setAttribute("aria-expanded","false")}acctPop.hidden=!open;acctBtn.setAttribute("aria-expanded",String(open))}
if(streakBtn&&streakPop)streakBtn.addEventListener("click",e=>{e.stopPropagation();setStreakOpen(streakPop.hidden)});
if(acctBtn&&acctPop)acctBtn.addEventListener("click",e=>{e.stopPropagation();setAcctOpen(acctPop.hidden)});
if((streakBtn&&streakPop)||(acctBtn&&acctPop)){
 document.addEventListener("click",e=>{if(streakPop&&!streakPop.hidden&&!streakPop.contains(e.target)&&!streakBtn.contains(e.target))setStreakOpen(false);if(acctPop&&!acctPop.hidden&&!acctPop.contains(e.target)&&!acctBtn.contains(e.target))setAcctOpen(false)});
 document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(acctPop&&!acctPop.hidden){setAcctOpen(false);acctBtn.focus()}else if(streakPop&&!streakPop.hidden){setStreakOpen(false);streakBtn.focus()}});
}
function loadScript(src){return new Promise((resolve,reject)=>{const script=document.createElement("script");script.src=src;script.onload=resolve;script.onerror=()=>reject(Error("Aplikazioa ezin izan da kargatu."));document.head.appendChild(script)})}
let loginReturn=null;
function syncShell(){const loading=document.body?.dataset.hbLoading==="true",opened=modal&&!modal.hidden,lesson=document.getElementById("bd-player"),playing=lesson&&!lesson.hidden;for(const node of document.querySelectorAll?.("body > #hb-sidebar, body > header, body > main, body > footer, body > nav, body > .hb-skip-link")||[]){node.inert=!!(opened||playing||loading&&node.id!=="app")}if(lesson)lesson.inert=!!opened}
function uiReady(){if(document.body){document.body.dataset.hbLoading="false";document.getElementById("app")?.setAttribute("aria-busy","false")}syncShell();paintAccount()}
function showLogin(){if(!modal.hidden)return;loginReturn=document.activeElement;modal.hidden=false;msg.textContent="";msg.classList.toggle("connection-ok",false);syncShell();form.elements.identifier.focus()}
function hideLogin(){if(submit.disabled)return;modal.hidden=true;form.reset();msg.textContent="";syncShell();const target=loginReturn?.isConnected&&!loginReturn.hidden?loginReturn:login;target?.focus();loginReturn=null}
function loginKey(e){if(!modal||modal.hidden)return;if(e.key==="Escape"){e.preventDefault();hideLogin();return}if(e.key!=="Tab")return;const nodes=Array.from(modal.querySelectorAll?.("button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex=\"-1\"])")||[]).filter(x=>!x.hidden);if(!nodes.length)return;const first=nodes[0],last=nodes[nodes.length-1],active=document.activeElement;if(!nodes.includes(active)||(e.shiftKey&&active===first)||(!e.shiftKey&&active===last)){e.preventDefault();(e.shiftKey?last:first).focus()}}
modal.addEventListener("keydown",loginKey);syncShell();
async function start(){if(starting)return;starting=true;if(document.body)document.body.dataset.hbAccess=authorized?"account":"guest";paintAccount();paint();try{for(const src of ["/audit.js","/feedback.js","/aditzak/engine.js","/core.js","/world.js","/world-design.js","/story.js","/app.js"])await loadScript(src)}catch(e){document.getElementById("app").textContent=e.message;starting=false;uiReady()}}
function busy(on){submit.disabled=on;form.setAttribute("aria-busy",String(on));submit.textContent=on?"Saioa egiaztatzen…":"Sartu"}
login.onclick=showLogin;close.onclick=hideLogin;
const connectionButton=document.getElementById("hb-check-connection");
if(connectionButton)connectionButton.onclick=async()=>{connectionButton.disabled=true;msg.classList.toggle("connection-ok",false);msg.textContent="Konexioa egiaztatzen…";try{const auth=await serviceRequest(BASE+"/auth/v1/health",{headers:{apikey:KEY},cache:"no-store"},"Saioa hasteko zerbitzua");if(!auth.ok)throw Error("Saioa hasteko zerbitzua ez dago prest ("+auth.status+").");const account=await serviceRequest(ENDPOINT,{method:"OPTIONS",cache:"no-store"},"Kontuaren konexioa");if(!account.ok)throw Error("Kontuaren konexioa ez dago prest ("+account.status+").");msg.classList.toggle("connection-ok",true);msg.textContent="Konexioa prest dago. Saiatu saioa hasten zure erabiltzaile-izenarekin eta pasahitzarekin."}catch(e){msg.textContent=e.message}finally{connectionButton.disabled=false}};
out.onclick=async()=>{if(!confirm("Saioa itxi? Sinkronizatu gabeko jarduna gailu honetan mantenduko da."))return;await Promise.race([flush(),new Promise(resolve=>setTimeout(resolve,2500))]);const old=session;clearSession();try{if(old?.access_token)await fetch(BASE+"/auth/v1/logout?scope=local",{method:"POST",headers:{apikey:KEY,Authorization:"Bearer "+old.access_token},cache:"no-store",signal:AbortSignal.timeout(2500)})}catch{}location.reload()};
form.onsubmit=async e=>{e.preventDefault();if(submit.disabled)return;busy(true);msg.classList.toggle("connection-ok",false);msg.textContent="";try{await signIn(form.elements.identifier.value,form.elements.password.value);location.reload()}catch(err){form.elements.password.value="";msg.textContent=err.status===403?"Ez duzu sartzeko baimenik. Jarri harremanetan arduradunarekin.":err.message||"Konexio-arazoa."}finally{busy(false)}};
window.addEventListener("online",()=>{if(authorized)void flush()});window.addEventListener("pagehide",()=>{if(authorized)void flush()});document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&authorized)void flush()});setInterval(()=>{if(authorized&&Date.now()>=retryAt)void flush()},10000);
// Keep an unverified account locked, not silently downgraded to a guest.
let restoringAccount=false;
function accountRecovery(denied){
 const app=document.getElementById("app");if(!app)return;
 app.setAttribute("aria-busy","false");
 app.innerHTML='<section class="hb-account-recovery panel" role="region" aria-labelledby="hb-recovery-title"><h1 id="hb-recovery-title">'+(denied?'Saioa berritu behar duzu':'Ezin izan dugu kontua kargatu')+'</h1><p>'+(denied?'Hasi saioa berriro zure kontuko jardunarekin jarraitzeko.':'Konexioa edo zerbitzua ez dago prest. Zure kontuko tokiko jarduna ez dugu ezabatu.')+'</p><button type="button" id="hb-recovery-retry">'+(denied?'Saioa berritu':'Saiatu berriro')+'</button>'+(denied?'':'<button type="button" class="alt" id="hb-recovery-reauth">Saioa berritu</button>')+'</section>';
 const retry=document.getElementById("hb-recovery-retry"),reauth=document.getElementById("hb-recovery-reauth");
 function renew(){clearSession();location.reload()}
 if(retry){retry.onclick=denied?renew:()=>{retry.disabled=true;if(reauth)reauth.disabled=true;app.setAttribute("aria-busy","true");void restoreAccount()};retry.focus?.()}
 if(reauth)reauth.onclick=renew;
}
async function restoreAccount(){
 if(restoringAccount)return;restoringAccount=true;
 try{
  if(session){authorized=false;try{await verify();await hydrate()}catch(e){authorized=false;const denied=e.status===401||e.status===403;if(denied)clearSession();accountRecovery(denied);return}}
  await start()
 }finally{restoringAccount=false}
}
void restoreAccount();
})();
