/* Shared vocabulary selection. Only the authenticated gateway supplies live rows. */
(function(root){
"use strict";
const LEVELS=["A1","A2","B1","B2","C1","C2"],norm=s=>String(s||"").normalize("NFC").trim().toLocaleLowerCase("eu");
function shuffle(rows,rng=Math.random){const a=rows.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function resourceKey(r){return "HB-VOCAB:"+r.id+"@"+r.version+":"+r.fingerprint}
function select(rows,{level,theme="all",previous=[],evidence={},rng=Math.random}={}){
 if(!LEVELS.includes(level)||!Array.isArray(rows))return [];
 const ids=new Set(),terms=new Set(),meanings=new Set(),valid=[];
 for(const r of rows.slice(0,200)){
  if(!r||r.level!==level||(theme!=="all"&&r.theme!==theme)||typeof r.id!=="string"||!r.id||typeof r.version!=="number"||r.version<1||!r.fingerprint||!r.source||!r.rights||typeof r.term!=="string"||typeof r.meaning!=="string"||!norm(r.term)||!norm(r.meaning)||r.term.length>120||r.meaning.length>1200)continue;
  const t=norm(r.term),m=norm(r.meaning);if(ids.has(r.id)||terms.has(t)||meanings.has(m))continue;
  ids.add(r.id);terms.add(t);meanings.add(m);valid.push(r);
 }
 const old=new Set(previous),needs=r=>["mismatch","supported"].includes(evidence[resourceKey(r)]?.result);
 const repair=shuffle(valid.filter(needs),rng).slice(0,4),chosen=new Set(repair.map(r=>r.id));
 const remaining=valid.filter(r=>!chosen.has(r.id)),fresh=shuffle(remaining.filter(r=>!old.has(r.id)&&!evidence[resourceKey(r)]),rng),seen=shuffle(remaining.filter(r=>old.has(r.id)||!!evidence[resourceKey(r)]),rng);
 const selected=[...repair,...fresh,...seen].slice(0,12),out=[];
 for(let i=0;i+3<=selected.length;i+=3){const batch=selected.slice(i,i+3);out.push({id:"HB-LEX-"+batch.map(r=>r.id+"@"+r.version).join("_"),t:"match",q:"Lotu hitzak eta esanahiak.",pairs:batch.map(r=>[r.term,r.meaning]),a:["loturak"],ex:"Esanahi hauek testuinguru honi dagozkio.",vocabulary:batch.map(r=>({id:r.id,version:r.version,fingerprint:r.fingerprint,source:r.source,rights:r.rights,level:r.level,theme:r.theme})),src:"Lexikoa"})}
 return out;
}
function themeLabel(rows){const themes=[...new Set(rows.map(r=>r.theme).filter(t=>typeof t==="string"&&t))];return themes.length>1?"Gaiak nahastuta":themes.length===1?themes[0].replace(/^lexiko_/,"").replace(/_/g," "):"Hiztegia"}
function createRepository(data){
 let generation=0;const previous=new Map();
 return {cancel(){generation++},async prepare({level,theme="all",evidence={}}={}){
  const ticket=++generation,owner=data.keyFor("vocabulary"),key=owner+":"+level+":"+theme;
  if(!data.isRemote())return {mode:"fallback",reason:"guest",items:[],themes:[]};
  try{
   const result=await data.vocabulary({level,theme});
   if(ticket!==generation||owner!==data.keyFor("vocabulary")||!data.isRemote())return {mode:"cancelled",items:[]};
   if(result?.contract!=="hb-vocabulary-v1"||!Array.isArray(result.rows))throw Error("invalid_response");
   const items=select(result.rows,{level,theme,previous:previous.get(key)||[],evidence});
   const themes=[...new Set(result.rows.filter(r=>r?.level===level&&typeof r.theme==="string"&&/^[a-z0-9_-]{1,100}$/.test(r.theme)).map(r=>r.theme))];
   if(!items.length)return {mode:"fallback",reason:"unavailable",items:[],themes};
   previous.set(key,items.flatMap(i=>i.vocabulary.map(r=>r.id)));
   return {mode:"live",items,themes};
  }catch{return ticket!==generation||owner!==data.keyFor("vocabulary")?{mode:"cancelled",items:[]}:{mode:"fallback",reason:"connection",items:[],themes:[]}}
 }};
}
const api={LEVELS,resourceKey,select,themeLabel,createRepository};
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.HBVocabulary=api;
})(typeof window!=="undefined"?window:globalThis);
