/* Route material policy. These are editorial practice sequences, never CEFR awards.
   Only projects existing, authorized catalogue IDs; does not fetch or approve content. */
(function(root){
"use strict";
const list=s=>s.split(" ").filter(Boolean);
const basics=list("GB-ize-01 GB-ize-02 GB-ize-03 GB-ize-04 GB-ize-05 HB07-err-1 HB07-err-2 HB07-mod-1 HB07-mod-2 HB07-mod-5 HB08-pos-06 HB08-jos-01 HB08-jos-05 HB08-jos-06 HB08-jos-07 HB08-lok-01 HB08-lok-02 HB08-lok-03 HB08-ort-01 HB08-ort-02 HB08-ort-05 HB08-ort-07 HB08-ort-09");
const laterBasics=list("GB-adi-01 GB-adi-02 GB-adi-03 GB-adi-04 GB-adi-05 GB-ize-06 GB-ize-07 GB-ize-08 HB07-err-3 HB07-err-4 HB07-mod-3 HB07-mod-4 HB07-kop-1 HB07-kop-2 HB07-kop-4 HB07-kop-5 HB08-pos-07 HB08-lok-08 HB08-lok-09");
const intermediate=list("GB-adi-06 GB-adi-07 GB-adi-08 GB-adi-09 GB-adi-10 GB-osa-01 GB-osa-02 GB-osa-03 GB-osa-04 GB-osa-06 GB-osa-07 GB-osa-08 HB06-erl-01 HB06-erl-02 HB06-erl-03 HB06-erl-04 HB06-den-01 HB06-den-02 HB06-den-03 HB06-den-04 HB06-den-05 HB06-kau-01 HB06-kau-02 HB06-kau-03 HB06-kau-04 HB06-hel-01 HB06-hel-02 HB06-hel-05 HB06-bal-01 HB06-bal-02 HB06-bal-03 HB06-bal-04 HB07-kon-1 HB07-kon-2 HB07-kon-3 HB07-kon-4 HB07-kop-3 HB07-kop-6 HB07-ond-3 HB07-ond-4 HB07-ond-5 HB07-err-5 HB07-err-6 HB07-err-8 HB07-mod-6 HB07-mod-7 HB08-pos-01 HB08-pos-02 HB08-pos-03 HB08-pos-04 HB08-pos-05 HB08-pos-08 HB08-pos-09 HB08-jos-02 HB08-jos-03 HB08-jos-04 HB08-lok-04 HB08-lok-05 HB08-lok-06 HB08-lok-07 HB08-ort-03 HB08-ort-04 HB08-ort-06 HB08-ort-08 HB08-ort-10");
const needs={
 "GB-ize-06":["GB-ize-02"],"GB-ize-07":["GB-ize-02"],"GB-ize-08":["GB-ize-02"],
 "HB07-err-2":["HB07-err-1"],"HB07-err-3":["HB07-err-2"],"HB07-err-4":["HB07-err-1"],
 "HB06-kau-01":["HB07-err-1"],"HB06-kau-02":["HB06-kau-01"],"HB06-kau-03":["HB06-kau-01"],"HB06-kau-04":["GB-adi-02"],
 "HB07-ond-3":["HB06-kau-01"],"HB07-ond-4":["HB07-ond-3"],"HB07-ond-5":["HB07-ond-3","HB06-hel-01"],
 "GB-osa-01":["HB08-jos-01"],"GB-osa-02":["HB08-jos-07"],"HB06-erl-01":["GB-ize-01"],
 "HB06-hel-01":["GB-adi-02"],"HB06-bal-01":["HB07-err-2"],"HB07-kon-1":["HB06-bal-01"]
};
const errorLinks={non:{family:"decl",case:"NON"},nora:{family:"decl",case:"NORA"},nondik:{family:"decl",case:"NONDIK"},nor:{id:"HB07-err-1"},nornork:{id:"HB07-err-2"},nornorinork:{id:"HB07-err-3"},cause:{id:"HB06-kau-01"},result:{id:"HB07-ond-3"}};
const touched=(id,input)=>Number(input.attempts?.[id]?.n)>0;
/* Editorial target, not assessed proficiency: only existing narrative stages. */
function profile(context={}){
 const route=["a1a2","b1b2"].includes(context.route)?context.route:null;
 const stage=route==="b1b2"?(Number(context.episode?.number)>=4?"reasoning":"connected"):route==="a1a2"&&context.mission===2?"everyday":"foundation";
 const levels={foundation:"A1",everyday:"A2",connected:"B1",reasoning:"B2"};
 const evidence=context.recognitionEvidence||{},order=["foundation","everyday","connected","reasoning"],rows=Object.entries(evidence).filter(([id,r])=>r&&/^HB-CONTEXT-(foundation|everyday|connected|reasoning)-[1-5]$/.test(id)&&id.startsWith("HB-CONTEXT-"+r.stage+"-")&&r.skill==="reading"&&r.mode==="recognition"&&Number.isFinite(r.at));
 const difficult=rows.filter(([,r])=>r.stage===stage&&r.result!=="match"&&["mismatch","supported"].includes(r.result));
 const previous=order[Math.max(0,order.indexOf(stage)-1)],lastDifficulty=Math.max(0,...difficult.map(([,r])=>r.at));
 const repaired=rows.filter(([,r])=>r.stage===previous&&r.result==="match"&&r.assisted===false&&r.at>lastDifficulty&&r.firstMatch===true).length;
 const repair=difficult.length>=2&&previous!==stage&&repaired<2;
 return {route,stage,vocabularyLevel:levels[stage],readingStage:repair?previous:stage,readingRepair:repair,source:route?"editorial_route":"provisional",skillAssessment:null};
}
function select(cards,input={}){
 const context=input.context||{},route=["a1a2","b1b2"].includes(context.route)?context.route:null;
 const adaptation=profile(context),band=route||"a1a2",byId=new Map(cards.map(c=>[c.id,c])),errors=context.errors||{},now=input.now??Date.now();
 const target=new Set(band==="b1b2"?[...basics,...laterBasics,...intermediate]:[...basics,...(adaptation.stage==="everyday"?laterBasics:[])]);
 const exists=id=>byId.has(id),review=new Set(),prerequisites=new Set();
 const pending=id=>["incorrect","unverified"].includes(input.attempts?.[id]?.lastResult);
 const required=id=>{
  const graph=input.curriculum;
  const node=graph?.nodes?.find(n=>graph.route(n.id)?.refs.includes(id));
  const graphRefs=node?node.requires.flatMap(n=>graph.route(n)?.refs?.slice(0,1)||[]):[];
  return [...new Set([...(needs[id]||[]),...graphRefs])];
 };
 const available=id=>required(id).every(p=>exists(p)&&touched(p,input)&&!pending(p));
 for(const id of target)if(exists(id)&&!available(id))for(const p of required(id))if(exists(p)&&(!touched(p,input)||pending(p)))prerequisites.add(p);
 for(const id of prerequisites)if(!available(id))prerequisites.delete(id);
 for(const id of target)if(exists(id)&&pending(id))review.add(id);
 const reviewCases=[];
 for(const [code,m] of Object.entries(errors)){
  const link=errorLinks[code];
  if(!link||!(Number(m.errors)>0)||!(Number(m.lastErrorAt)>Number(m.lastRecoveryAt||0)||Number(m.dueAt)<=now))continue;
  if(link.id&&exists(link.id)&&(band==="b1b2"||basics.includes(link.id)||laterBasics.includes(link.id)))review.add(link.id);
  if(link.case)reviewCases.push(link.case);
 }
 const current=cards.filter(c=>target.has(c.id)&&available(c.id));
 const focus=context.focus?.length?context.focus:band==="b1b2"?["kau","ond"]:["decl","ize","err"];
 const opened=new Set(input.opened||[]),rank=c=>pending(c.id)?0:!touched(c.id,input)&&!opened.has(c.id)?1:2;
 const ordered=current.slice().sort((a,b)=>Number(!focus.includes(a.family))-Number(!focus.includes(b.family))||rank(a)-rank(b));
 const focusPrep=new Set();
 const prepare=(id,seen=new Set())=>{if(seen.has(id))return;seen.add(id);for(const p of required(id)){if(!exists(p)||touched(p,input)&&!pending(p))continue;if(available(p))focusPrep.add(p);else prepare(p,seen)}};
 for(const id of target)if(exists(id)&&focus.includes(byId.get(id).family)&&!available(id))prepare(id);
 const preferred=ordered.some(c=>focus.includes(c.family))?ordered:[...cards.filter(c=>focusPrep.has(c.id)),...ordered.filter(c=>!focusPrep.has(c.id))];
 const pool=cards.filter(c=>current.some(x=>x.id===c.id)||review.has(c.id)||prerequisites.has(c.id));
 return {route,band,adaptation,provisional:!route,source:route?(context.placed?"placement":"adventure"):"no_evidence",episode:context.episode||null,
  pool,primary:preferred.slice(0,4),review:cards.filter(c=>review.has(c.id)),prerequisites:cards.filter(c=>prerequisites.has(c.id)&&!review.has(c.id)),
  next:ordered.filter(c=>!preferred.slice(0,4).some(x=>x.id===c.id)&&!opened.has(c.id)&&!touched(c.id,input)).slice(0,6),reviewCases,
  families:["decl",...new Set(pool.map(c=>c.family))],
  blocked:cards.filter(c=>target.has(c.id)&&!available(c.id)),
  complementary:cards.filter(c=>!pool.some(x=>x.id===c.id)),
  reason:!route?"Hasi oinarrizko egiturekin eta aukeratu zure abentura.":"Hemen dituzu abenturan lagunduko dizuten egiturak eta berrikusteko gaiak."};
}
function practiceFilter(items,selection){
 const ids=new Set(selection.pool.map(c=>c.id));
 return items.filter(c=>c.family==="decl"?(/^D09-.+-(NOR|NORK|NORI|NON|NORA|NONDIK)-sg$/.test(c.id)||selection.band==="b1b2"):ids.has(c.id));
}
const api=Object.freeze({version:"HB-ROUTE-MATERIAL/3",profile,select,practiceFilter});
if(typeof module!=="undefined"&&module.exports)module.exports=api;
else root.HBLearningSelection=api;
})(typeof window!=="undefined"?window:globalThis);
