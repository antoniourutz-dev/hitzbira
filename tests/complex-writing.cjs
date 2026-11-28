const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');let n=0;function check(name,ok){assert.ok(ok,name);n++;console.log('PASS '+name)}
const window={},store=new Map(),elements=new Map();
vm.runInNewContext(fs.readFileSync(path.join(root,'bidea/data.js'),'utf8'),{window});
window.HBData={keyFor:k=>k,isRemote:()=>false};
function el(){return {hidden:false,dataset:{},innerHTML:'',setAttribute(){},focus(){},querySelector(){return null}}}
const document={readyState:'complete',body:{dataset:{},appendChild(e){elements.set(e.id,e)}},documentElement:{classList:{add(){},remove(){}}},addEventListener(){},getElementById:id=>elements.get(id),createElement:()=>el(),querySelector:()=>null,querySelectorAll:()=>[]};
const localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
function load(){vm.runInNewContext(fs.readFileSync(path.join(root,'bidea/bidea.js'),'utf8'),{window,globalThis:window,document,localStorage,location:{search:''},URLSearchParams})}
load();window.HBBidea.setLevel('b1b2',false);
for(const [number,code,bad,good] of [
 [3,'subordination','Lurrek hodia buxatuta dago esan du.','Lurrek hodia buxatuta dagoela esan du.'],
 [4,'concession','Mapa aurkitu dugu arren, bidea itxita dago.','Mapa aurkitu dugun arren, bidea itxita dago.'],
 [5,'condition','Hodia berriro buxatzen da, ura ez da iritsiko.','Hodia berriro buxatzen bada, ura ez da iritsiko.']
]){
 const api=window.HBBidea,state=api._state();delete state.episodeDraft;state.episodes=state.episodes||{};
 for(let j=1;j<number;j++)state.episodes['HB-EP-CAUSE-0'+j]={treasure:'test'};
 // startEpisode builds the real lesson, and uses the normal player/check/save pipeline.
 api.startEpisode(number);api.begin();while(api._player().segment==='recall'){const p=api._player();api.sel(p.queue[p.pos].item.a[0]);api.check();api.next()}api.begin();
 const p=api._player();p.pos=p.queue.length-1;
 check(code+' task ID is in real episode queue',p.queue[p.pos].item.id.startsWith('HB-EP-CAUSE-0'+number));
 api.typed(bad);api.check();
 check(code+' first attempt offers rewrite and preserves original',p.state.writeRetry&&!p.state.checked&&p.state.writeOriginal===bad);
 check(code+' stores a single difficulty without mastery',api._state().episodeErrorMemory[code].errors===1&&api._state().xp===0);
 const evidence=api._state().episodeErrorMemory[code].writingEvidence;
 check(code+' stores task and rule provenance without learner text',evidence.taskId===p.queue[p.pos].item.id&&evidence.rule===evidence.taskId&&evidence.result==='pending'&&!JSON.stringify(evidence).includes(bad));
 const due=api._state().episodeErrorMemory[code].dueAt;
 api.askQuit();load();window.HBBidea.startEpisode(number);
 const resumed=window.HBBidea._player();
 check(code+' reload preserves original and retry',resumed.state.writeOriginal===bad&&resumed.state.writeRetry);
 window.HBBidea.typed(good);window.HBBidea.check();
 check(code+' repaired answer remains assisted and neutral',resumed.state.checked&&resumed.state.neutral&&resumed.state.hintUsed&&resumed.state.writeAssessment.status==='observed');
 check(code+' repaired attempt never duplicates difficulty',window.HBBidea._state().episodeErrorMemory[code].errors===1);
 check(code+' rewrite is supported evidence and preserves due date',window.HBBidea._state().episodeErrorMemory[code].writingEvidence.result==='supported'&&window.HBBidea._state().episodeErrorMemory[code].dueAt===due);
 window.HBBidea.close(true);delete window.HBBidea._state().episodeDraft;
}
const api=window.HBBidea;for(const item of Object.values(api._state().episodeErrorMemory))item.dueAt=0;
api.close(true);api.startDueRecall();
check('all three complex difficulties schedule different retrieval tasks',new Set(api._player().queue.map(x=>x.item.code)).size===3);
check('retrieval uses a new communicative context',api._player().queue.every(x=>!['Lurrek','Hodia','Mapa'].some(w=>x.item.q.includes(w))));
const firstProbes=new Map(api._player().queue.map(x=>[x.item.code,x.item.id]));
while(api._player().phase==='play'){
 const p=api._player(),it=p.queue[p.pos].item,m=api._state().episodeErrorMemory[it.code];
 api.sel(it.a[0]);api.check();
 check(it.code+' delayed first recognition advances interval without claiming production',m.lastProbeResult==='recognition'&&m.step===1&&m.writingEvidence.result==='supported');
 api.next();
}
api.close(true);
for(const item of Object.values(api._state().episodeErrorMemory))item.dueAt=0;
api.startDueRecall();
check('all complex categories rotate to a second unfamiliar probe',api._player().queue.every(x=>x.item.id!==firstProbes.get(x.item.code)));
const probe=api._player().queue[0].item;
api.showHint();api.sel(probe.a[0]);api.check();
check('supported retrieval keeps one-day schedule and is not autonomous recovery',api._state().episodeErrorMemory[probe.code].lastProbeResult==='supported'&&api._state().episodeErrorMemory[probe.code].step===0&&api._state().episodeErrorMemory[probe.code].recoveries===1);
api.close(true);
api.setLevel('a1a2',false);api._state().forestMission=1;
for(let number=1;number<=5;number++){
 const state=api._state();delete state.forestDraft;state.episodes=state.episodes||{};
 for(let j=1;j<number;j++)state.episodes['HB-EP-FOREST-0'+j]={treasure:'test'};
 api.startEpisode(number);api.begin();
 const html=elements.get('bd-player').innerHTML;
 check('forest '+number+' player uses exact real scene artwork',html.includes('data-scene-id="HB-EP-FOREST-0'+number+'"')&&html.includes('/assets/scenes/HB-EP-FOREST-0'+number+'.svg'));
 state.episodes['HB-EP-FOREST-0'+number]={treasure:'test'};
 api.close(true);delete state.forestDraft;
}
const art=Array.from({length:5},(_,i)=>fs.readFileSync(path.join(root,'assets/scenes/HB-EP-FOREST-0'+(i+1)+'.svg'),'utf8'));
check('five real forest scene IDs have distinct vector compositions',new Set(art).size===5&&art.every(s=>s.includes('viewBox="0 0 960 420"')));
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
check('all five artworks are in offline shell',Array.from({length:5},(_,i)=>sw.includes('/assets/scenes/HB-EP-FOREST-0'+(i+1)+'.svg')).every(Boolean));
for(const [family,level,mission] of [['SHELTER','a1a2',2],['MIRROR','a1a2',3],['CAUSE','b1b2',1]]){
 api.setLevel(level,false);const state=api._state();state.forestMission=mission;
 for(let number=1;number<=5;number++){
  delete state.forestDraft;delete state.episodeDraft;
  for(let j=1;j<number;j++)state.episodes['HB-EP-'+family+'-0'+j]={treasure:'test'};
  api.startEpisode(number);api.begin();
  // A due Gogoratu precedes the actual scene.
  while(api._player().segment==='recall'&&api._player().phase==='play'){const p=api._player();api.sel(p.queue[p.pos].item.a[0]);api.check();api.next()}
  const id='HB-EP-'+family+'-0'+number,html=elements.get('bd-player').innerHTML;
  check(id+' real player and offline shell use exact artwork',html.includes('data-scene-id="'+id+'"')&&html.includes('/assets/scenes/'+id+'.svg')&&sw.includes('/assets/scenes/'+id+'.svg'));
  art.push(fs.readFileSync(path.join(root,'assets/scenes/'+id+'.svg'),'utf8'));
  state.episodes[id]={treasure:'test'};
  api.close(true);
 }
}
check('all twenty narrative compositions are distinct',art.length===20&&new Set(art).size===20);
for(const [id,good,bad] of [
 ['HB-EP-CAUSE-03-REPORT','Hodia buxatuta dagoela esan du Lurrek.','Hodia buxatuta dago esan du Lurrek.'],
 ['HB-EP-CAUSE-04-CONCESSION','Bidea itxita dago, mapa aurkitu dugun arren.','Bidea itxita dago, mapa aurkitu dugu arren.'],
 ['HB-EP-CAUSE-05-CONDITION','Ura ez da iritsiko, hodia berriro buxatzen bada.','Ura ez da iritsiko, hodia berriro buxatzen da.'],
 ['HB-EP-MIRROR-05-OPEN','Anek esan du lagunek lamiari ispilua eta orrazia itzuli dizkiotela.','Anek esan du lagunek lamiari ispilua eta orrazia itzuli dituztela.']
]){
 const task={id,t:'write'},review=x=>api.reviewSentence(task,x);
 check(id+' reversed-order contrast repairs minimally',review(good).status==='observed'&&review(bad).status==='contrast'&&review(bad).example===good);
 check(id+' quoted and extended clauses remain unverified',review('«'+bad+'»').status==='unverified'&&review(bad+' Beste zerbait gertatu da.').status==='unverified');
}
console.log(n+' complex writing and scene checks passed');
