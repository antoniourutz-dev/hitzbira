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
// Bounded links to the existing curriculum, not a replacement curriculum.
// A linked item observes one aspect of a node, never the complete claim.
const GUIDED_TARGETS=Object.freeze({"HB07-err-1":"V-0","HB07-err-2":"V-0","HB07-err-3":"V-1","HB06-kau-01":"KAU-1","HB07-ond-3":"OND-1","GB-osa-01":"OSA-1","HB07-kon-1":"KON-2","HB06-bal-01":"BAL-1"});
const VERB_NODES=Object.freeze({"HB-VERB-NOR-1":"V-0","HB-VERB-NORK-1":"V-0","HB-VERB-NORI-1":"V-1","HB-VERB-NORI-2":"V-1","HB-VERB-FOUND-2":"V-0","HB-VERB-FOUND-3":"V-0","HB-VERB-EVERY-1":"V-0","HB-VERB-EVERY-2":"V-0","HB-VERB-EVERY-3":"V-0","HB-VERB-CONNECTED-1":"V-1","HB-VERB-REASONING-1":"V-1"});
const ERROR_NODES=Object.freeze({non:"DEK-1",nora:"DEK-1",nondik:"DEK-1",nor:"V-0",nornork:"V-0",nornorinork:"V-1",cause:"KAU-1",result:"OND-1",subordination:"OSA-1",concession:"KON-2",condition:"BAL-1"});
function mappedNode(id,graph){
 if(typeof id!=="string")return null;
 const found=graph?.nodes?.find(n=>graph.route(n.id)?.refs.includes(id));
 const code=found?.id||GUIDED_TARGETS[id]||(/^[A-Za-z0-9-]+$/.test(id)&&/^D09-.+-(NOR|NORK|NORI|NON|NORA|NONDIK)-sg$/.test(id)?"DEK-1":null);
 return code&&graph?.get(code)?code:null;
}
function evidenceProjection({context={},attempts={},curriculum}={}){
 const rows=[],unmapped={practice:0,games:0};
 const add=(node,entry)=>{if(!node||!curriculum?.get(node))return false;rows.push({...entry,node,nodeVersion:curriculum.get(node).vid,mastery:null});return true};
 for(const [id,r] of Object.entries(attempts)){
  if(!r||!(Number(r.n)>0)||!["match","incorrect","unverified"].includes(r.lastResult))continue;
  if(!add(mappedNode(id,curriculum),{id,source:"practice",mode:r.lastMode==="write"?"bounded_written":r.lastMode==="identify"?"identification":"recognition",result:r.lastResult==="incorrect"?"mismatch":r.lastResult==="match"&&r.lastAssisted?"supported":r.lastResult,assisted:r.lastAssisted===true,contentVersion:null}))unmapped.practice++;
 }
 for(const [id,r] of Object.entries(context.guidedEvidence||{})){
  if(r?.v!==1||r.contentVersion!=="2.17.1"||!["match","mismatch"].includes(r.result)||!Number.isFinite(r.at))continue;
  add(mappedNode(id,curriculum),{id,source:"ikasi",mode:"guided_recognition",result:r.result==="match"?"supported":"mismatch",assisted:true,at:r.at,contentVersion:r.contentVersion});
 }
 for(const [id,r] of Object.entries(context.recognitionEvidence||{})){
  if(!r||!["match","mismatch","supported","unverified"].includes(r.result)||!Number.isFinite(r.at))continue;
  const node=r.skill==="verbs"&&r.mode==="recognition"?VERB_NODES[id]:null;
  if(!add(node,{id,source:"game",mode:r.mode,result:r.result,assisted:r.assisted===true,at:r.at,contentVersion:null}))unmapped.games++;
 }
 for(const [code,r] of Object.entries(context.errors||{})){
  if(!r||!(Number(r.errors)>0))continue;
  add(ERROR_NODES[code],{id:code,source:"difficulty",mode:"diagnostic_contrast",result:"mismatch",at:r.lastErrorAt,contentVersion:null});
  if(Number(r.lastRecoveryAt)>0)add(ERROR_NODES[code],{id:code,source:"recovery",mode:"delayed_recognition",result:"match",at:r.lastRecoveryAt,contentVersion:null});
 }
 return {policy:"HB-EVIDENCE/1",rows,unmapped,mastery:null,autonomousProduction:null};
}
/* Editorial target, not assessed proficiency: only existing narrative stages. */
function profile(context={}){
 const route=["a1a2","b1b2"].includes(context.route)?context.route:null;
 const stage=route==="b1b2"?(Number(context.episode?.number)>=4?"reasoning":"connected"):route==="a1a2"&&context.mission>=2?"everyday":"foundation";
 const levels={foundation:"A1",everyday:"A2",connected:"B1",reasoning:"B2"};
 const evidence=context.recognitionEvidence||{},order=["foundation","everyday","connected","reasoning"],rows=Object.entries(evidence).filter(([id,r])=>r&&/^HB-CONTEXT-(foundation|everyday|connected|reasoning)-[1-5]$/.test(id)&&id.startsWith("HB-CONTEXT-"+r.stage+"-")&&r.skill==="reading"&&r.mode==="recognition"&&Number.isFinite(r.at));
 const difficult=rows.filter(([,r])=>r.stage===stage&&r.result!=="match"&&["mismatch","supported"].includes(r.result));
 const previous=order[Math.max(0,order.indexOf(stage)-1)],lastDifficulty=Math.max(0,...difficult.map(([,r])=>r.at));
 const repaired=rows.filter(([,r])=>r.stage===previous&&r.result==="match"&&r.assisted===false&&r.at>lastDifficulty&&r.firstMatch===true).length;
 const unseen=5-rows.filter(([,r])=>r.stage===previous).length;
 const repair=difficult.length>=2&&previous!==stage&&repaired<2&&repaired+unseen>=2;
 return {route,stage,vocabularyLevel:levels[stage],readingStage:repair?previous:stage,readingRepair:repair,source:route?"editorial_route":"provisional",skillAssessment:null};
}
// Recent orientation evidence only changes priority of as-yet-unpractised material.
function placementFocus(context,attempts,now){
 const p=context.placement;
 if(p?.v!==2||!Number.isFinite(p.at)||p.at>now||now-p.at>14*86400000||!["P1","P2","P3","P4","P5","P6"].every(id=>["match","mismatch","skipped"].includes(p.answers?.[id])))return {families:[],cases:[]};
 const pending=id=>["mismatch","skipped"].includes(p.answers[id]);
 const families=[],cases=[];
 if(pending("P1")&&!Number(attempts?.["HB07-err-1"]?.n))families.push("err");
 if(pending("P4")&&!Number(attempts?.["HB07-err-3"]?.n))families.push("err");
 if(pending("P2")&&!Object.keys(attempts||{}).some(k=>/-NORA-sg$/.test(k)&&Number(attempts[k]?.n)>0))cases.push("NORA");
 if(pending("P5")&&!Number(attempts?.["HB06-kau-01"]?.n))families.push("kau");
 if(pending("P6")&&!Number(attempts?.["HB07-ond-3"]?.n))families.push("ond");
 return {families:[...new Set(families)],cases};
}
function select(cards,input={}){
 const context=input.context||{},route=["a1a2","b1b2"].includes(context.route)?context.route:null;
 const adaptation=profile(context),band=route||"a1a2",byId=new Map(cards.map(c=>[c.id,c])),errors=context.errors||{},now=input.now??Date.now();
 const target=new Set(band==="b1b2"?[...basics,...laterBasics,...intermediate]:[...basics,...(adaptation.stage==="everyday"?laterBasics:[])]);
 const exists=id=>byId.has(id),review=new Set(),prerequisites=new Set();
 const pending=id=>["incorrect","unverified"].includes(input.attempts?.[id]?.lastResult)||input.attempts?.[id]?.lastAssisted===true;
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
 const orientation=placementFocus(context,input.attempts,now),reviewCases=[...orientation.cases],evidence=evidenceProjection({...input,context});
 // Guided errors suggest distinct practice, not a prerequisite pass or academic error.
 for(const r of evidence.rows)if(r.source==="ikasi"&&r.result==="mismatch"&&target.has(r.id)&&exists(r.id)&&!touched(r.id,input))review.add(r.id);
 for(const [code,m] of Object.entries(errors)){
  const link=errorLinks[code];
  if(!link||!(Number(m.errors)>0)||!(Number(m.lastErrorAt)>Number(m.lastRecoveryAt||0)||Number(m.dueAt)<=now))continue;
  if(link.id&&exists(link.id)&&(band==="b1b2"||basics.includes(link.id)||laterBasics.includes(link.id)))review.add(link.id);
  if(link.case)reviewCases.push(link.case);
 }
 const current=cards.filter(c=>target.has(c.id)&&available(c.id));
 const focus=[...new Set([...orientation.families,...(context.focus?.length?context.focus:band==="b1b2"?["kau","ond"]:["decl","ize","err"])])];
 const opened=new Set(input.opened||[]),rank=c=>pending(c.id)?0:!touched(c.id,input)&&!opened.has(c.id)?1:2;
 const ordered=current.slice().sort((a,b)=>Number(!(orientation.families.includes(a.family)&&!touched(a.id,input)))-Number(!(orientation.families.includes(b.family)&&!touched(b.id,input)))||Number(!focus.includes(a.family))-Number(!focus.includes(b.family))||rank(a)-rank(b));
 const focusPrep=new Set();
 const prepare=(id,seen=new Set())=>{if(seen.has(id))return;seen.add(id);for(const p of required(id)){if(!exists(p)||touched(p,input)&&!pending(p))continue;if(available(p))focusPrep.add(p);else prepare(p,seen)}};
 for(const id of target)if(exists(id)&&focus.includes(byId.get(id).family)&&!available(id))prepare(id);
 const preferred=ordered.some(c=>focus.includes(c.family))?ordered:[...cards.filter(c=>focusPrep.has(c.id)),...ordered.filter(c=>!focusPrep.has(c.id))];
 const pool=cards.filter(c=>current.some(x=>x.id===c.id)||review.has(c.id)||prerequisites.has(c.id));
 return {route,band,adaptation,provisional:!route,source:route?(context.placed?"placement":"adventure"):"no_evidence",episode:context.episode||null,
  pool,primary:preferred.slice(0,4),review:cards.filter(c=>review.has(c.id)),prerequisites:cards.filter(c=>prerequisites.has(c.id)&&!review.has(c.id)),
  orientation,evidence, next:ordered.filter(c=>!preferred.slice(0,4).some(x=>x.id===c.id)&&!opened.has(c.id)&&!touched(c.id,input)).slice(0,6),reviewCases:[...new Set(reviewCases)],
  families:["decl",...new Set(pool.map(c=>c.family))],
  blocked:cards.filter(c=>target.has(c.id)&&!available(c.id)),
  complementary:cards.filter(c=>!pool.some(x=>x.id===c.id)),
  reason:!route?"Hasi oinarrizko egiturekin eta aukeratu zure abentura.":"Hemen dituzu abenturan lagunduko dizuten egiturak eta berrikusteko gaiak."};
}
function practicePriority(items,{evidence={},errors={}}={}){
 const difficult=r=>r&&["mismatch","supported"].includes(r.result);
 return items.slice().sort((a,b)=>{
  const rank=i=>{const row=evidence[i.id],m=errors[i.code];return difficult(row)?0:m&&Number(m.lastErrorAt)>Number(m.lastRecoveryAt||0)&&!row?1:!row?2:3};
  return rank(a)-rank(b)||(evidence[a.id]?.at||0)-(evidence[b.id]?.at||0)
 });
}
function practiceFilter(items,selection){
 const ids=new Set(selection.pool.map(c=>c.id));
 return items.filter(c=>c.family==="decl"?(/^D09-.+-(NOR|NORK|NORI|NON|NORA|NONDIK)-sg$/.test(c.id)||selection.band==="b1b2"):ids.has(c.id));
}
const api=Object.freeze({version:"HB-ROUTE-MATERIAL/6",profile,select,practiceFilter,practicePriority,placementFocus,mappedNode,evidenceProjection});
if(typeof module!=="undefined"&&module.exports)module.exports=api;
else root.HBLearningSelection=api;
})(typeof window!=="undefined"?window:globalThis);
