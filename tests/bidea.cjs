// Bidea 0.2: datuen osotasuna, maila-proba eta zuzentze-funtzioak.
const assert=require('node:assert'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++};
const api=require('../bidea/bidea.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../bidea/data.js'),'utf8'),ctx);
const D=ctx.window.HB_BIDEA;
check('data loaded',D&&D.chapters.length===8);
const ls=D.chapters[0].lessons,items=ls.flatMap(l=>l.items);
const A=D.islands.find(i=>i.id==='a1a2'),als=A.chapters[0].lessons,aitems=als.flatMap(l=>l.items),every=[...items,...aitems];
check('five lessons',ls.length===5);
check('lessons have 10-12 items',ls.every(l=>l.items.length>=10&&l.items.length<=12));
check('unique item ids across islands',new Set(every.map(i=>i.id)).size===every.length);
check('every item traces to a Supabase draft',items.every(i=>/^DRAFT-SIN-B2-(KAUS|OND)-20261122-A0[1-5]#\d+$/.test(i.src)));
check('every item has answers and explanation',items.every(i=>Array.isArray(i.a)&&i.a.length&&i.ex));
check('gap prompts contain a blank',items.filter(i=>['mc','gap','chips'].includes(i.t)).every(i=>i.q.includes('____')));
check('mc choices contain exactly one accepted answer',every.filter(i=>i.t==='mc'||(i.t==='chips'&&i.ch)).every(i=>i.ch.filter(c=>api.isAccepted(c,i.a)).length===1));
check('fix items locate the wrong connector',items.filter(i=>i.t==='fix').every(i=>i.q.includes(i.w)&&api.fixTokens(i).includes(i.w)&&api.isAccepted(i.q.replace(i.w,i.r+','),i.a)));
check('build tiles rebuild the answer',items.filter(i=>i.t==='build').every(i=>api.isAccepted(api.tilesFor(i.a[0]).join(' '),i.a)&&!api.isAccepted(api.tilesFor(i.a[0]).concat(i.x).join(' '),i.a)));
for(let k=0;k<25;k++){
 check('chips: exactly one semantic group is accepted',items.filter(i=>i.t==='chips').every(i=>{const c=api.chipsFor(i,D.groups);return c.length===4&&c.filter(x=>api.isAccepted(x,i.a)).length===1}));
 check('fix options include the right connector once',items.filter(i=>i.t==='fix').every(i=>{const o=api.fixOptions(i,D.groups);return o.filter(x=>api.norm(x)===api.norm(i.r)).length===1&&!o.includes(i.w.replace(',',''))}));
}
check('norm ignores case and punctuation',api.isAccepted(' izan ERE, ',['Izan ere'])&&!api.isAccepted('',['Izan ere']));
check('capital after full stop',api.capitalFor('Ez gara iritsi. ____, x')&&!api.capitalFor('Sarrerak agortu dira; ____, x'));
check('stars thresholds',api.starsFor(10,10)===3&&api.starsFor(7,10)===2&&api.starsFor(3,10)===1);
check('compound connector stays one tile',api.tilesFor('Bilera atzeratu dugu. Izan ere, arduraduna gaixorik dago.').includes('Izan ere,'));
const sw=fs.readFileSync(path.join(__dirname,'../sw.js'),'utf8'),html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
check('bidea files are cached offline',['/bidea/data.js','/bidea/bidea.js','/bidea/bidea.css'].every(f=>sw.includes('"'+f+'"')&&html.includes(f+'?v=')));

/* 0.2: maila-uharteak, A1–A2 kapitulua eta maila-proba */
check('two islands, no age profiles',D.islands.map(i=>i.id).join()==='a1a2,b1b2'&&!('junior' in D));
check('A1–A2 chapter has five lessons with 7–9 items',als.length===5&&als.every(l=>l.items.length>=7&&l.items.length<=9));
check('A1–A2 items trace to K02 sessions',aitems.every(i=>/^K02-S0[1-5]#\d+$/.test(i.src)));
check('every A1–A2 item explains itself',aitems.every(i=>i.ex&&i.a.length));
check('A1–A2 dialogues have Spanish help for every line',als.every(l=>l.talk.every(t=>t.length===3&&t[1]&&t[2])));
check('speakers exist in the cast',als.every(l=>l.talk.every(t=>D.cast[t[0]])));
check('canonical K02 message kept verbatim',JSON.stringify(als[0]).includes('Menditik nator, basoan bizi naiz eta errekara noa.'));
check('A1–A2 gap items give a hint',aitems.filter(i=>i.t==='gap').every(i=>i.h));
check('A1–A2 fix items rebuild the answer',aitems.filter(i=>i.t==='fix').every(i=>i.opts.includes(i.r)&&!i.opts.includes(i.w)&&api.isAccepted(i.q.replace(i.w,i.r),i.a)));
check('A1–A2 build tiles rebuild the answer',aitems.filter(i=>i.t==='build').every(i=>api.isAccepted(api.tilesFor(i.a[0]).join(' '),i.a)));
check('match items have 3–5 distinct pairs',aitems.filter(i=>i.t==='match').every(i=>i.pairs.length>=3&&i.pairs.length<=5&&new Set(i.pairs.map(p=>p[1])).size===i.pairs.length));
check('write item has a model answer',aitems.filter(i=>i.t==='write').every(i=>i.model&&i.instr));
check('B1–B2 lesson keys map to a direction pattern',ls.every(l=>l.keys.every(k=>k==='-lako'||D.patterns[api.groupOf(k,D.groups)])));
check('placement has six graded questions',D.placement.length===6&&D.placement.every(i=>i.ch.filter(c=>api.isAccepted(c,i.a)).length===1));
check('placement thresholds',api.placeLevel(6)==='b1b2'&&api.placeLevel(5)==='b1b2'&&api.placeLevel(4)==='a1a2'&&api.placeLevel(0)==='a1a2');
check('greeting follows the clock',api.greetingFor(9)[0]==='Egun on!'&&api.greetingFor(16)[0]==='Arratsalde on!'&&api.greetingFor(22)[0]==='Gabon!'&&api.greetingFor(3)[0]==='Gabon!');
check('solved sentence fills the blank',api.solvedParts({t:'mc',q:'Ez gara iritsi. ____, autobusa.',a:['izan ere']}).join('')==='Ez gara iritsi. Izan ere, autobusa.');
check('solved sentence marks the fixed word',api.solvedParts(aitems.find(i=>i.t==='fix'))[1]===aitems.find(i=>i.t==='fix').r);
check('A1-3-3 mid-sentence choices are lowercase',aitems.find(i=>i.id==='A1-3-3').ch.every(x=>x===x.toLowerCase()));
check('writeCheckList passes full model and non-hardcoded locatives',api.writeCheckList('Lehenik, etxetik liburutegira joan naiz. Gero, liburutegian egon naiz. Azkenik, museora joan naiz.').every(([,ok])=>ok));
check('writeCheckList avoids -ra and -an false positives',(()=>{const r=Object.fromEntries(api.writeCheckList('Gu gara eta euskara eman dugu; Bira atera da aurrera.'));return !r['Geldialdia (-n)']&&!r['Helmuga (-ra)']})());
(()=>{
 const store=new Map();let remote=false,uid=null;
 const ls={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
 const w={HB_BIDEA:D,HBData:{keyFor:k=>remote&&uid?k+'::hb::'+uid:k,isRemote:()=>remote},draw(){}};
 const bctx={window:w,globalThis:w,localStorage:ls,document:{readyState:'complete',body:{dataset:{}},addEventListener(){},getElementById:()=>null,documentElement:{classList:{add(){},remove(){}}}},location:{search:''},URLSearchParams};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../bidea/bidea.js'),'utf8'),bctx);
 check('initial load does not write empty guest storage',!store.has('hitzbira-bidea-v1'));
 w.HBBidea.setLevel('a1a2',false);
 check('guest state stored under guest key',JSON.parse(store.get('hitzbira-bidea-v1')).level==='a1a2');
 remote=true;uid='user-1';
 check('switching to remote account isolates level and keeps guest intact',!w.HBBidea._state().level&&JSON.parse(store.get('hitzbira-bidea-v1')).level==='a1a2');
 w.HBBidea.setLevel('b1b2',false);
 check('remote account state stored under account key',JSON.parse(store.get('hitzbira-bidea-v1::hb::user-1')).level==='b1b2');
 w.HBBidea.reset();
 check('remote account reset is blocked',JSON.parse(store.get('hitzbira-bidea-v1::hb::user-1')).level==='b1b2');
 check('Bidea screen shows narrative completion and hides guest reset for remote accounts',(()=>{const b=w.HBBidea.bidea();return b.includes('bd-map')&&b.includes('atal amaituta')&&b.includes('altxorrak')&&!b.includes('bd-world-legacy')&&!b.includes('MENPERATZEN DITUZU')&&!b.includes('Tokiko datuak ezabatu')})());
 w.storyJournal=()=>'<section id="world-test-journal">World journal</section>';
 check('existing World journal is reachable through a collapsed Bidea section, not Gaur',()=>{const b=w.HBBidea.bidea();return b.includes('<details class="bd-explore">')&&b.includes('Abentura gehiago')&&b.includes('world-test-journal')&&!w.HBBidea.gaur().includes('world-test-journal')});
 delete w.storyJournal;
 check('isAuditor defaults to false and toggles cleanly',(()=>{const def=w.HBBidea.isAuditor();w.HBBidea.auditor(true);const on=w.HBBidea.isAuditor();w.HBBidea.auditor(false);const off=w.HBBidea.isAuditor();return def===false&&on===true&&off===false})());
 remote=false;uid=null;
 check('guest Bidea screen exposes local reset action',w.HBBidea.bidea().includes('Tokiko datuak ezabatu'));
 w.HBBidea.reset();
 check('guest reset clears guest state without touching remote account',!store.has('hitzbira-bidea-v1')&&JSON.parse(store.get('hitzbira-bidea-v1::hb::user-1')).level==='b1b2');
})();

/* 0.3: Chapter 2 content (GOLD-A1-001 NOR/NOR-NORK + B1-B2 Contraste), hint + 2nd attempt, spaced review in Gaur */
(()=>{
 const a2ls=A.chapters[1].lessons,a2items=a2ls.flatMap(l=>l.items);
 const b2ls=D.chapters[1].lessons,b2items=b2ls.flatMap(l=>l.items);
 const allNew=[...a2items,...b2items],allItems=[...every,...allNew];
 check('A1-A2 Chapter 2 (Zer egin dut gaur?) has 4 lessons with 7 items each',a2ls.length===4&&a2ls.every(l=>l.items.length===7));
 check('B1-B2 Chapter 2 (Baina, hala ere, arren) has 3 lessons with 7-8 items each',b2ls.length===3&&b2ls.every(l=>l.items.length>=7&&l.items.length<=8));
 check('unique item ids across all islands and chapters',new Set(allItems.map(i=>i.id)).size===allItems.length);
 check('all Chapter 2 mc/chips items have exactly one accepted choice',allNew.filter(i=>i.t==='mc'||i.t==='chips').every(i=>i.ch.filter(c=>api.isAccepted(c,i.a)).length===1));
 check('all Chapter 2 fix items rebuild accepted answer',allNew.filter(i=>i.t==='fix').every(i=>i.q.includes(i.w)&&api.fixTokens(i).includes(i.w)&&i.opts.includes(i.r)&&!i.opts.includes(i.w)&&api.isAccepted(i.q.replace(i.w,i.w.endsWith(',')?i.r+',':i.r),i.a)));
 check('all Chapter 2 build items rebuild accepted answer and distractor fails',allNew.filter(i=>i.t==='build').every(i=>api.isAccepted(api.tilesFor(i.a[0]).join(' '),i.a)&&!api.isAccepted(api.tilesFor(i.a[0]).concat(i.x).join(' '),i.a)));
 check('all Chapter 2 items provide explanation and progressive hint',allNew.every(i=>i.ex&&api.hintFor(i,D.groups,D.patterns).length>5));
 check('writeCheckList supports nornork writing task',api.writeCheckList('Gaur goizean parkera joan naiz. Gero, bi liburu irakurri ditut.','nornork').every(([,ok])=>ok)&&!api.writeCheckList('Gaur goizean parkera joan naiz.','nornork').every(([,ok])=>ok));

 /* Spaced review scheduler intervals */
 const DAY=86400000,now=Date.parse('2026-11-26T12:00:00Z');
 const stMap={'a1a2-k1-i1':{stars:1,at:now-DAY-1000},'a1a2-k1-i2':{stars:3,at:now-3*DAY},'a1a2-k1-i3':{stars:3,at:now-8*DAY},'a1a2-k1-i4':{stars:1,at:now-2*DAY,reviewAt:now-DAY,reviews:1}};
 const due=api.dueReviews(stMap,als,now);
 check('dueReviews schedules 1-star after 1d and 3-star after 7d, skipping reviewed lessons',due.map(d=>d.lesson.id).sort().join()==='a1a2-k1-i1,a1a2-k1-i3');

 /* Interactive VM: 2nd attempt before reveal, voluntary hint, multi-chapter map, and spaced review in Gaur */
 const store=new Map(),els=new Map();
 function mkEl(id){const e={id,hidden:false,innerHTML:'',dataset:{},scrollTop:0,setAttribute(){},focus(){},querySelector:()=>null};els.set(id,e);return e}
 const ls={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
 const w={HB_BIDEA:D,HBLearningSelection:require("../learning-selection.js"),HBData:{keyFor:k=>k,isRemote:()=>false,activity(){}},draw(){}};
 const doc={readyState:'complete',body:{dataset:{},appendChild(e){els.set(e.id,e)}},addEventListener(){},getElementById:id=>els.get(id)||null,createElement:()=>mkEl('bd-player'),querySelector:()=>null,querySelectorAll:()=>[],documentElement:{classList:{add(){},remove(){}}}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../bidea/bidea.js'),'utf8'),{window:w,globalThis:w,localStorage:ls,document:doc,location:{search:''},URLSearchParams});
 w.HBBidea.setLevel('a1a2',false);
 check('Bidea retains the narrative while supplemental verb lessons remain accessible in practice',w.HBBidea.bidea().includes('Basorako bidea')&&!w.HBBidea.bidea().includes('Zer egin dut gaur?')&&w.HBBidea.supplementaryPracticeHtml().includes('Ni naiz, nik dut'));
 /* Start Chapter 2 Lesson 1 directly (index 5 = first lesson of Chapter 2) */
 w.HBBidea.start(5);
 check('Chapter 2 Lesson 1 unlocks directly without blocking',w.HBBidea._player()&&w.HBBidea._player().L.id==='a1a2-k2-i1');
 w.HBBidea.begin();
 /* 1st wrong attempt: should NOT reveal answer, should show hint and allow 2nd try */
 w.HBBidea.sel('du');
 w.HBBidea.check();
 let p=w.HBBidea._player();
 check('first wrong attempt triggers hint + second try without revealing solution',p.state.checked===false&&p.state.tries===1&&p.state.hintOn===true&&p.state.wrongSel.includes('du')&&p.state.sel===null);
 /* 2nd attempt correct: reveals feedback, awards +7 XP, keeps first-try counter honest (0) */
 w.HBBidea.sel('da');
 w.HBBidea.check();
 p=w.HBBidea._player();
 check('second attempt success marks checked, awards 7 XP, keeps first-try honest',p.state.checked===true&&p.state.ok===true&&p.xp===7&&p.first===0);
 check('progress bar advances immediately after answering Q1',els.get('bd-player').innerHTML.includes('aria-valuenow="1"')&&els.get('bd-player').innerHTML.includes('bd-bar-fill')&&!els.get('bd-player').innerHTML.includes('style="width:0%"')&&els.get('bd-player').innerHTML.includes('bd-step-count'));
 /* Next item: voluntary hint works and keeps first-try honest */
 w.HBBidea.next();
 w.HBBidea.showHint();
 p=w.HBBidea._player();
 check('voluntary showHint displays hint and marks hintUsed',p.state.hintOn===true&&p.state.hintUsed===true);
 w.HBBidea.sel('dut');
 w.HBBidea.check();
 p=w.HBBidea._player();
 check('hinted correct answer awards 7 XP without inflating first-try count',p.state.checked===true&&p.state.ok===true&&p.xp===14&&p.first===0);
 check('combo >= 2 charges top progress bar and badges XP pill',els.get('bd-player').innerHTML.includes('bd-bar-fill is-charged')&&els.get('bd-player').innerHTML.includes('bd-xp is-combo'));
 w.HBBidea.close(true);
 /* Spaced review card surfaces in Gaur when a completed lesson is overdue */
 const st=w.HBBidea._state();
 st.lessons['a1a2-k1-i1']={stars:1,best:5,runs:1,at:Date.now()-2*DAY};
 store.set('hitzbira-bidea-v1',JSON.stringify(st));
 check('Gaur surfaces spaced review card cleanly when a lesson is due',w.HBBidea.gaur().includes('BERRIKUSTEKO UNEA')&&w.HBBidea.gaur().includes('Enborreko mezua'));
 w.HBBidea.startReview('a1a2-k1-i1');
 check('startReview launches 5-item quick review session directly in play phase',w.HBBidea._player().mode==='review'&&w.HBBidea._player().phase==='play'&&w.HBBidea._player().queue.length===5);
 check('player renders desktop study sidebar with collapsible cheat-sheet and keyboard guide',els.get('bd-player').innerHTML.includes('bd-desk-side')&&els.get('bd-player').innerHTML.includes('Laguntza-txartela')&&els.get('bd-player').innerHTML.includes('<kbd>H</kbd>'));
 w.HBBidea.close(true);
 w.HBBidea.startTest();
 check('placement test omits desktop cheat-sheet sidebar',!els.get('bd-player').innerHTML.includes('bd-desk-side'));
 w.HBBidea.close(true);
 const gaurHtml=w.HBBidea.gaur();
 check('Gaur renders editorial greeting bar, redesigned Eguneko helburua with single-line ring and tinted stat icons',gaurHtml.includes('bd-desk-greet')&&gaurHtml.includes('bd-stats-card')&&gaurHtml.includes('bd-goal-val')&&gaurHtml.includes('bd-stat-ico is-fire')&&gaurHtml.includes('bd-review-banner'));
 check('Gaur has adventure navigation rather than a parallel syllabus and Bidea uses responsive grid wrapper',!gaurHtml.includes('bd-course-section')&&gaurHtml.includes('bd-level-switch')&&gaurHtml.includes('bd-mission-meter')&&w.HBBidea.bidea().includes('bd-mapa-meta'));
 w.HBBidea.setLevel('b1b2',false);
 check('first World episode is discoverable from Gaur',w.HBBidea.gaur().includes('Non dago ura?')&&w.HBBidea.gaur().includes('HBBidea.startEpisode()'));
 check('treasure collection starts undiscovered and does not reveal locked cards',w.HBBidea.gaur().includes('Nire altxorrak')&&w.HBBidea.gaur().includes('0/5 aurkituta')&&!w.HBBidea.gaur().includes('Auzolana'));
 const route=w.HBBidea.bidea(),home=w.HBBidea.gaur();
 check('Bidea shows five narrative episode titles before any completion and preserves optional grammar',["Non dago ura?","Giltza zaharra","Errotaren sekretua","Paperaren arrastoa","Ura berriro!"].every(t=>route.includes(t))&&route.includes('bd-world-path')&&!route.includes('Ikasgai gehiago')&&route.includes('Lagundu zure abenturari'));
 check('Gaur recommends the narrative before optional grammar, with games available from the start',home.includes('Non dago ura?')&&!home.includes('Ikasgai gehiago')&&home.includes('Hitzak lotu')&&route.includes('Loturen erronka'));
 w.HBBidea.startWorldGame('context');check('World context game uses causal meaning and longer stimulus',w.HBBidea._player().queue[0].item.id==='HB-CONTEXT-connected-1'&&els.get('bd-player').innerHTML.includes('hornidura-hodia'));w.HBBidea.close(true);
 w.HBBidea.startEpisode(3);check('later episodes cannot be opened out of sequence',w.HBBidea._player()===null);
 w.HBBidea.startWorldGame('words');check('starter word game has four groups without any treasure unlocked',w.HBBidea._player().mode==='worldgame'&&w.HBBidea._player().queue.length===4&&w.HBBidea._player().queue[0].item.pairs.length===3);w.HBBidea.close(true);
 w.HBBidea.startWorldGame('links');check('starter connector game is accessible immediately',w.HBBidea._player().queue.length===2);w.HBBidea.close(true);
 const before=JSON.stringify(w.HBBidea._state().lessons),beforeXp=w.HBBidea._state().xp;
 w.HBBidea.startEpisode();
 check('episode starts with Gogoratu without inventing previous evidence',w.HBBidea._player().phase==='gogoratu'&&w.HBBidea._player().recall.length===0);
 w.HBBidea.begin();
 check('episode renders original location artwork and existing mascot',els.get('bd-player').innerHTML.includes('bd-episode-landscape')&&els.get('bd-player').innerHTML.includes('Herriko iturria')&&els.get('bd-player').innerHTML.includes('bd-landscape-bira'));
 check('episode opens Argi scene and uses seven activities',w.HBBidea._player().phase==='intro'&&w.HBBidea._player().queue.length===7&&els.get('bd-player').innerHTML.includes('2 · ESZENA'));
 check('episode keys match the water mystery, not the bus example',els.get('bd-player').innerHTML.includes('iturburuko hodia hautsi da.')&&!els.get('bd-player').innerHTML.includes('autobusa matxuratu da.')&&els.get('bd-player').innerHTML.includes('width:20%'));
 check('episode tracker includes five stages and current step',els.get('bd-player').innerHTML.includes('bd-episode-stages')&&els.get('bd-player').innerHTML.includes('aria-current="step"')&&els.get('bd-player').innerHTML.includes('Hurrengoa'));
 w.HBBidea.begin();
 w.HBBidea.sel('Beraz');w.HBBidea.check();
 check('episode clear error receives hint and another try',w.HBBidea._player().state.tries===1&&!w.HBBidea._player().state.checked);
 w.HBBidea.sel('Izan ere');w.HBBidea.check();
 check('assisted answer does not count as first try',w.HBBidea._player().state.ok&&w.HBBidea._player().first===0);
 check('episode progress is visible after first answered item and feedback stays contextual',els.get('bd-player').innerHTML.includes('width:43%')&&els.get('bd-player').innerHTML.includes('Erreka lehor egoteak')&&!els.get('bd-player').innerHTML.includes('autobusa matxuratu da.'));

 w.HBBidea.next();
 for(let i=1;i<4;i++){const item=w.HBBidea._player().queue[i].item;w.HBBidea.sel(item.a[0]);w.HBBidea.check();w.HBBidea.next();}
 w.HBBidea.typed('Beste aukera bat');w.HBBidea.check();
 check('unmatched open text is neutral, without false penalty',w.HBBidea._player().state.neutral&&!w.HBBidea._player().errors.has('HB-EP-CAUSE-01-5')&&els.get('bd-player').innerHTML.includes('Erantzuna ez da automatikoki baliozkotu.'));
 w.HBBidea.next();w.HBBidea.typed('Izan ere');w.HBBidea.check();w.HBBidea.next();
 w.HBBidea.typed('Herrira ez da urik iristen. Izan ere, hodia hautsi da.');w.HBBidea.check();
 check('final writing is not auto-validated',w.HBBidea._player().state.neutral&&els.get('bd-player').innerHTML.includes('Eredu bat:'));
 w.HBBidea.next();
 check('Altxorra follows the practice',w.HBBidea._player().phase==='altxorra'&&els.get('bd-player').innerHTML.includes('Auzolana')&&els.get('bd-player').innerHTML.includes('width:60%'));
 w.HBBidea.finishEpisode();
 check('episode reaches 100 percent only at the final stage',els.get('bd-player').innerHTML.includes('aria-valuenow="100"')&&els.get('bd-player').innerHTML.includes('width:100%'));
 check('Hurrengoa closes episode without claiming mastery or XP',w.HBBidea._player().phase==='end'&&els.get('bd-player').innerHTML.includes('5 · HURRENGOA')&&w.HBBidea._state().episodes['HB-EP-CAUSE-01'].treasure==='auzolana'&&JSON.stringify(w.HBBidea._state().lessons)===before&&w.HBBidea._state().xp===beforeXp);
 check('first ending links to actual second episode',els.get('bd-player').innerHTML.includes('HBBidea.startEpisode(2)'));
 w.HBBidea.close(true);
 check('first earned treasure is visible in Gaur and Bidea',w.HBBidea.gaur().includes('1/5 aurkituta')&&w.HBBidea.gaur().includes('Auzolana')&&w.HBBidea.bidea().includes('Auzolana'));
 check('Gaur recommends second episode after visiting first',w.HBBidea.gaur().includes('Giltza zaharra'));
 w.HBBidea.startEpisode();
 check('second episode uses same five-stage player',w.HBBidea._player().L.id==='HB-EP-CAUSE-02'&&w.HBBidea._player().phase==='gogoratu');
 w.HBBidea.begin();w.HBBidea.begin();
 w.HBBidea.sel('dugu');w.HBBidea.check();
 w.HBBidea.askQuit();
 check('exit saves assisted attempt without losing position',w.HBBidea._player()===null&&w.HBBidea._state().episodeDraft.state.tries===1&&w.HBBidea.gaur().includes('Jarraitu abenturarekin'));
 w.HBBidea.startEpisode();
 check('resumed episode preserves hint and position',w.HBBidea._player().pos===0&&w.HBBidea._player().state.tries===1&&w.HBBidea._player().state.hintOn);
 w.HBBidea.sel('dugulako');w.HBBidea.check();w.HBBidea.next();
 for(let i=1;i<4;i++){w.HBBidea.sel(w.HBBidea._player().queue[i].item.a[0]);w.HBBidea.check();w.HBBidea.next()}
 w.HBBidea.typed('duela');
 w.HBBidea.askQuit();
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../bidea/bidea.js'),'utf8'),{window:w,globalThis:w,localStorage:ls,document:doc,location:{search:''},URLSearchParams});
 w.HBBidea.startEpisode();
 check('fresh VM reload restores exact draft input and item',w.HBBidea._player().pos===4&&w.HBBidea._player().state.typed==='duela');
 w.HBBidea.typed('duelako');w.HBBidea.check();w.HBBidea.next();
 w.HBBidea.typed('Izan ere');w.HBBidea.check();w.HBBidea.next();
 w.HBBidea.typed('Errotara etorri gara, ikurra ikusi dugulako.');w.HBBidea.check();w.HBBidea.next();
 check('second treasure is linked to the story',w.HBBidea._player().phase==='altxorra'&&els.get('bd-player').innerHTML.includes('Giltza'));
 w.HBBidea.finishEpisode();
 check('second episode completed and draft cleared without academic claim',w.HBBidea._state().episodes['HB-EP-CAUSE-02'].treasure==='giltza'&&!w.HBBidea._state().episodeDraft&&JSON.stringify(w.HBBidea._state().lessons)===before);
 check('second ending links to third episode',els.get('bd-player').innerHTML.includes('HBBidea.startEpisode(3)'));
 w.HBBidea.close(true);
 check('Gaur recommends third episode and shows two distinct treasures',w.HBBidea.gaur().includes('Errotaren sekretua')&&w.HBBidea.gaur().includes('2/5 aurkituta'));
 w.HBBidea.startEpisode();w.HBBidea.begin();
 check('third episode has distinct illustrated location and contextual examples',w.HBBidea._player().L.id==='HB-EP-CAUSE-03'&&els.get('bd-player').innerHTML.includes('Errotaren barrua')&&els.get('bd-player').innerHTML.includes('Hodia buxatuta dago.'));
 w.HBBidea.begin();
 for(let i=0;i<6;i++){const it=w.HBBidea._player().queue[i].item;if(it.t==='mc')w.HBBidea.sel(it.a[0]);else w.HBBidea.typed(it.a[0]);w.HBBidea.check();w.HBBidea.next()}
 w.HBBidea.typed('Errota ez dabil, hodia buxatuta dagoelako. Beraz, hodia garbitu behar dugu.');w.HBBidea.check();w.HBBidea.next();
 check('third treasure does not require autonomous production credit',w.HBBidea._player().phase==='altxorra'&&els.get('bd-player').innerHTML.includes('Errota'));
 w.HBBidea.finishEpisode();w.HBBidea.close(true);
 check('all three collectible cards are visible with no duplicate rewards',w.HBBidea.gaur().includes('3/5 aurkituta')&&w.HBBidea.bidea().includes('Errota')&&Object.keys(w.HBBidea._state().episodes).length===3);
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../bidea/bidea.js'),'utf8'),{window:w,globalThis:w,localStorage:ls,document:doc,location:{search:''},URLSearchParams});
 check('treasure collection survives fresh runtime',w.HBBidea.gaur().includes('3/5 aurkituta')&&w.HBBidea.bidea().includes('Auzolana'));
 check('Gaur offers optional vocabulary and connector games after discovering treasures',w.HBBidea.gaur().includes('Hitzak lotu')&&w.HBBidea.bidea().includes('Loturen erronka'));
 for(let n=4;n<=5;n++){
  w.HBBidea.startEpisode();w.HBBidea.begin();
  check('next narrative episode uses the shared player and seven original tasks',w.HBBidea._player().L.n===n&&w.HBBidea._player().queue.length===7);
  w.HBBidea.begin();
  for(let i=0;i<6;i++){const it=w.HBBidea._player().queue[i].item;if(it.t==='mc')w.HBBidea.sel(it.a[0]);else w.HBBidea.typed(it.a[0]);w.HBBidea.check();w.HBBidea.next()}
  w.HBBidea.typed('Hodia buxatuta zegoen. Beraz, garbitu egin dugu.');w.HBBidea.check();
  check('written production is neutral and not automatically certified',w.HBBidea._player().state.neutral);
  w.HBBidea.next();w.HBBidea.finishEpisode();
  if(n===5)check('mission ends with resolved story and optional game, not a nonexistent episode',els.get('bd-player').innerHTML.includes('Misterioa argituta!')&&els.get('bd-player').innerHTML.includes('Jolastokira')&&!els.get('bd-player').innerHTML.includes('startEpisode(6)'));
  w.HBBidea.close(true);
 }
 check('five treasure cards persist without adding XP or formal evidence',w.HBBidea.gaur().includes('5/5 aurkituta')&&Object.keys(w.HBBidea._state().episodes).length===5&&JSON.stringify(w.HBBidea._state().lessons)===before&&w.HBBidea._state().xp===beforeXp);
 const savedEpisodes=JSON.stringify(w.HBBidea._state().episodes);
 w.HBBidea.startWorldGame('context');check('later World episode offers argument and inference instead of literal detail',w.HBBidea._player().queue[0].item.id==='HB-CONTEXT-reasoning-1'&&els.get('bd-player').innerHTML.includes('mantentze-lanen gabezia'));w.HBBidea.close(true);
 w.HBBidea.startWorldGame('words');
 const pairs=w.HBBidea._player().queue[0].item.pairs;
 check('word game uses all five earned vocabulary treasures',pairs.length===5&&pairs.some(p=>p[0]==='Iturburua'));
 for(let i=0;i<pairs.length;i++){w.HBBidea.mL(i);w.HBBidea.mR(i)}
 check('matching game completes with feedback',w.HBBidea._player().state.checked&&w.HBBidea._player().state.ok);
 w.HBBidea.next();
 for(let g=1;g<4;g++){const p=w.HBBidea._player().queue[g].item.pairs;for(let i=0;i<p.length;i++){w.HBBidea.mL(i);w.HBBidea.mR(i)}w.HBBidea.next()}
 check('game finishes without changing mission or XP',w.HBBidea._player().phase==='end'&&JSON.stringify(w.HBBidea._state().episodes)===savedEpisodes&&w.HBBidea._state().xp===beforeXp);
 w.HBBidea.close(true);w.HBBidea.startWorldGame('links');
 check('connector game offers five contextual items',w.HBBidea._player().queue.length===5);
 for(let i=0;i<5;i++){w.HBBidea.sel(w.HBBidea._player().queue[i].item.a[0]);w.HBBidea.check();w.HBBidea.next()}
 check('connector game ends without formal learning credit',w.HBBidea._player().phase==='end'&&JSON.stringify(w.HBBidea._state().lessons)===before&&w.HBBidea._state().xp===beforeXp);
 w.HBBidea.close(true);
 w.HBBidea.startWorldGame('verbs');
 check('B1–B2 verb game has explicit recipient context',w.HBBidea._player().queue.some(e=>e.item.id==='HB-VERB-NORI-1'));
 w.HBBidea.sel('du');w.HBBidea.check();w.HBBidea.next();
 w.HBBidea.sel('dut');w.HBBidea.check();
 check('dative auxiliary confusion has contextual explanation and memory',w.HBBidea._state().episodeErrorMemory.nornorinork.confused==='dut'&&els.get('bd-player').innerHTML.includes('Joni da hartzailea'));
 w.HBBidea.sel('diot');w.HBBidea.check();w.HBBidea.next();w.HBBidea.sel('dio');w.HBBidea.check();w.HBBidea.next();
 check('assisted verbal practice does not count as delayed recovery',w.HBBidea._state().episodeErrorMemory.nornorinork.recoveries===0);w.HBBidea.close(true);
 const bDone=JSON.stringify(w.HBBidea._state().episodes);
 w.HBBidea.startEpisode(5);w.HBBidea.begin();w.HBBidea.askQuit();
 const bDraft=JSON.stringify(w.HBBidea._state().episodeDraft);
 w.HBBidea.setLevel('a1a2',false);
 check('forest narrative is visible in Gaur and Bidea without mixing water-mystery navigation',w.HBBidea.gaur().includes('KONDAIREN ZAINDARIAK')&&w.HBBidea.bidea().includes('Basorako bidea')&&w.HBBidea.bidea().includes('0/5'));
 check('beginner games are available before completion',w.HBBidea.gaur().includes('Hitzak lotu')&&w.HBBidea.bidea().includes('Non, nora, nondik?'));
 w.HBBidea.startWorldGame('context');check('foundation context uses a short everyday text and literal comprehension',w.HBBidea._player().queue[0].item.id==='HB-CONTEXT-foundation-1'&&els.get('bd-player').innerHTML.includes('Zer edan du Anek?'));w.HBBidea.close(true);
 w.HBBidea.startWorldGame('links');check('beginner game uses contextual locatives',w.HBBidea._player().queue.length===3&&w.HBBidea._player().queue[0].item.a[0]==='basoan');w.HBBidea.close(true);
 w.HBBidea.startEpisode();if(w.HBBidea._player().recall.length){w.HBBidea.begin();while(w.HBBidea._player().segment==='recall'){const p=w.HBBidea._player();w.HBBidea.sel(p.queue[p.pos].item.a[0]);w.HBBidea.check();w.HBBidea.next()}}else w.HBBidea.begin();
 check('forest scene reuses canonical message and illustration',w.HBBidea._player().L.id==='HB-EP-FOREST-01'&&els.get('bd-player').innerHTML.includes('Menditik nator, basoan bizi naiz eta errekara noa.')&&els.get('bd-player').innerHTML.includes('Basoko bidea'));
 w.HBBidea.begin();w.HBBidea.sel('Errekara');w.HBBidea.check();w.HBBidea.next();w.HBBidea.askQuit();
 check('beginner draft does not overwrite B1–B2 draft',w.HBBidea._state().forestDraft.pos===1&&JSON.stringify(w.HBBidea._state().episodeDraft)===bDraft);
 w.HBBidea.setLevel('b1b2',false);w.HBBidea.startEpisode();check('intermediate draft remains resumable',w.HBBidea._player().L.n===5);w.HBBidea.close(true);
 w.HBBidea.setLevel('a1a2',false);w.HBBidea.startEpisode();
 check('beginner resumes exact item',w.HBBidea._player().pos===1);
 while(w.HBBidea._player().phase==='play'){const p=w.HBBidea._player(),it=p.queue[p.pos].item;if(it.t==='match'){for(let i=0;i<it.pairs.length;i++){w.HBBidea.mL(i);w.HBBidea.mR(i)}}else if(it.t==='gap'||it.t==='write'){w.HBBidea.typed(it.t==='write'?'Errekara noa.':it.a[0]);w.HBBidea.check()}else{w.HBBidea.sel(it.a[0]);w.HBBidea.check()}if(it.t==='write')check('forest open answer remains neutral',w.HBBidea._player().state.neutral);w.HBBidea.next()}
 w.HBBidea.finishEpisode();check('forest treasure is distinct and prior mission remains completed',w.HBBidea._state().episodes['HB-EP-FOREST-01'].treasure==='basoa'&&!w.HBBidea._state().forestDraft&&JSON.stringify(w.HBBidea._state().episodeDraft)===bDraft&&Object.keys(JSON.parse(bDone)).every(k=>w.HBBidea._state().episodes[k].treasure===JSON.parse(bDone)[k].treasure));w.HBBidea.close(true);
 check('forest collection shows its own earned treasure',w.HBBidea.bidea().includes('1/5 aurkituta')&&w.HBBidea.bidea().includes('Basoa'));
 check('forest map shows all five episodes',["Enborreko mezua","Basoko hitzak","Non, nora, nondik?","Hiru bideak","Zure mapa"].every(t=>w.HBBidea.bidea().includes(t)));
 const firstCause=w.HBBidea._state().episodeErrorMemory?.cause;
 check('known cause-result error is remembered once and does not certify mastery',firstCause?.errors===1&&firstCause.confused==='result'&&firstCause.recoveries===0);
 for(let n=2;n<=5;n++){
  w.HBBidea.startEpisode(n);w.HBBidea.begin();
  let recallGuard=0;while(w.HBBidea._player().phase==='play'&&w.HBBidea._player().segment==='recall'){if(++recallGuard>10)throw Error('stalled recall');const p=w.HBBidea._player();w.HBBidea.sel(p.queue[p.pos].item.a[0]);w.HBBidea.check();w.HBBidea.next()}
  check('forest continuation uses seven activities per episode',w.HBBidea._player().L.n===n&&w.HBBidea._player().queue.length===7);
  w.HBBidea.begin();
  let loops=0;
  while(w.HBBidea._player().phase==='play'){
   if(++loops>20)throw Error('stalled forest player');
   const p=w.HBBidea._player(),it=p.queue[p.pos].item;
   if(n===3&&p.pos===0){w.HBBidea.sel('eskolara');w.HBBidea.check();check('locative diagnosis distinguishes destination from place',w.HBBidea._state().episodeErrorMemory.non.confused==='nora'&&els.get('bd-player').innerHTML.includes('helmuga'));w.HBBidea.sel('eskolan');w.HBBidea.check()}
   else if(it.t==='match'){for(let i=0;i<it.pairs.length;i++){w.HBBidea.mL(i);w.HBBidea.mR(i)}}
   else if(it.t==='build'){for(const word of w.HBBidea.tilesFor(it.a[0])){const st=w.HBBidea._player().state;w.HBBidea.tile(st.tiles.find(t=>t.w===word&&!st.picked.includes(t.k)).k)}w.HBBidea.check()}
   else if(it.t==='fix'){w.HBBidea.tap(p.state.tokens.indexOf(it.w));w.HBBidea.sel(it.r);w.HBBidea.check()}
   else if(it.t==='gap'||it.t==='write'){w.HBBidea.typed(it.t==='write'?it.model:it.a[0]);w.HBBidea.check()}
   else{w.HBBidea.sel(it.a[0]);w.HBBidea.check()}
   if(it.t==='write')check('open production does not create false learning evidence',w.HBBidea._player().state.neutral);
   if(!w.HBBidea._player().state.checked)throw Error('not checked: '+it.id);
   w.HBBidea.next();
  }
  w.HBBidea.finishEpisode();w.HBBidea.close(true);
 }
 check('all five forest treasures and water history preserved',w.HBBidea.bidea().includes('5/5 aurkituta')&&Object.keys(w.HBBidea._state().episodes).length===10);
 const memory=w.HBBidea._state().episodeErrorMemory;
 check('assisted retry does not count as delayed recovery',memory.non.errors===1&&memory.non.recoveries===0);
 memory.non.dueAt=Date.now()-1;
 w.HBBidea.startEpisode(5);check('due linguistic difficulty selects a new contextual recall',w.HBBidea._player().recall[0].id==='HB-RECALL-NON');
 w.HBBidea.begin();w.HBBidea.sel('liburutegian');w.HBBidea.check();
 check('autonomous delayed recall schedules next interval without mastery claim',memory.non.recoveries===1&&memory.non.step===1&&memory.non.dueAt>Date.now()+2*86400000);
 w.HBBidea.askQuit();
 // A second due encounter must use a different stimulus and can be completed outside the story.
 memory.non.dueAt=Date.now()-1;for(const [code,m] of Object.entries(memory))if(code!=='non')m.dueAt=Date.now()+86400000*2;
 const savedDraft=JSON.stringify(w.HBBidea._state().forestDraft);
 check('due recovery available on Gaur without opening another episode',w.HBBidea.gaur().includes('HBBidea.startDueRecall()'));
 w.HBBidea.startDueRecall();check('standalone recovery shares the same memory and changes stimulus',w.HBBidea._player().kind==='recall'&&w.HBBidea._player().queue[0].item.id==='HB-RECALL-NON-2');
 w.HBBidea.showHint();w.HBBidea.sel('parkean');w.HBBidea.check();
 check('assisted recall schedules next-day repair, never an additional recovery',memory.non.recoveries===1&&memory.non.lastProbeResult==='supported'&&memory.non.step===0&&memory.non.dueAt>Date.now());
 w.HBBidea.next();w.HBBidea.close(true);
 check('standalone recovery preserves the paused narrative draft',JSON.stringify(w.HBBidea._state().forestDraft)===savedDraft);
 memory.non.dueAt=Date.now()+86400000*2;
 w.HBData.guestLimited=()=>true;
 check('guest sees only A1-A2 story and local progress, not account-only navigation',w.HBBidea.gaur().includes('Gonbidatua')&&!w.HBBidea.gaur().includes('HITZBIRA WORLD')&&!w.HBBidea.gaur().includes('ZURE LORPENAK')&&w.HBBidea.bidea().includes('Basorako bidea')&&!w.HBBidea.bidea().includes('Ikasgai gehiago'));
 w.HBBidea.setLevel('b1b2',false);check('guest cannot switch to higher level',w.HBBidea._state().level==='a1a2');
 w.HBBidea.chooseAdventure('uraren-misterioa',true);check('Work adventure entry preserves guest restriction',w.HBBidea._state().level==='a1a2'&&w.HBBidea._player()===null);
 check('guest home preserves Work adventure labels without official levels',!/\b(?:A1|A2|B1|B2|C1|C2)\b/.test(w.HBBidea.gaur().replace(/<[^>]*>/g,' ')));
 w.HBBidea.startTest();check('guest placement test is not required or accessible',w.HBBidea._player()===null);
 w.HBBidea.startReview('b1b2-k1-i1');check('guest cannot enter registered review route directly',w.HBBidea._player()===null);
 w.HBBidea.auditor(true);check('guest cannot enter audit mode',!w.HBBidea.isAuditor());
 w.HBBidea.startEpisode();check('guest resumes stored A1-A2 draft',w.HBBidea._player()?.L?.forest===true);w.HBBidea.askQuit();
 // Complete the earlier saved first adventure replay before changing mission.
 w.HBBidea.startEpisode();while(w.HBBidea._player().phase==="play"){const p=w.HBBidea._player(),it=p.queue[p.pos].item;if(it.t==="mc"||it.t==="chips"){w.HBBidea.sel(it.a[0]);w.HBBidea.check()}else break;w.HBBidea.next()}w.HBBidea.close(true);
 const ss=w.HBBidea._state();delete ss.forestDraft;
 w.HBBidea.chooseForestMission(2);check('second free adventure opens only after five forest episodes',w.HBBidea.gaur().includes('Aterpetxeko giltza')&&w.HBBidea.bidea().includes('0/5'));
 w.HBBidea.startWorldGame('context');check('second beginner adventure uses everyday sequence and recipient comprehension',w.HBBidea._player().queue[0].item.id==='HB-CONTEXT-everyday-1');w.HBBidea.close(true);
 for(let n=1;n<=5;n++){w.HBBidea.startEpisode(n);let pl=w.HBBidea._player();check('shelter episode has stable ID and seven tasks',pl.L.id==='HB-EP-SHELTER-0'+n&&pl.L.items.length===7);w.HBBidea.begin();while(w.HBBidea._player().phase==='play'&&w.HBBidea._player().segment==='recall'){const p=w.HBBidea._player();w.HBBidea.sel(p.queue[p.pos].item.a[0]);w.HBBidea.check();w.HBBidea.next()}w.HBBidea.begin();if(n===1){w.HBBidea.sel('da');w.HBBidea.check();w.HBBidea.next();w.HBBidea.askQuit();w.HBBidea.chooseForestMission(1);w.HBBidea.startEpisode();check('second mission resumes exact item and cannot overwrite paused draft',w.HBBidea._player().L.shelter&&w.HBBidea._player().pos===1)}
 let loops=0;while(w.HBBidea._player().phase==='play'){if(++loops>25)throw Error('stalled shelter');const p=w.HBBidea._player(),it=p.queue[p.pos].item;if(it.t==='match'){for(let i=0;i<it.pairs.length;i++){w.HBBidea.mL(i);w.HBBidea.mR(i)}}else if(it.t==='build'){for(const word of w.HBBidea.tilesFor(it.a[0])){const st=p.state;w.HBBidea.tile(st.tiles.find(t=>t.w===word&&!st.picked.includes(t.k)).k)}w.HBBidea.check()}else if(it.t==='fix'){w.HBBidea.tap(p.state.tokens.indexOf(it.w));w.HBBidea.sel(it.r);w.HBBidea.check()}else if(it.t==='gap'||it.t==='write'){w.HBBidea.typed(it.t==='write'?it.model:it.a[0]);w.HBBidea.check()}else{w.HBBidea.sel(it.a[0]);w.HBBidea.check()}if(!p.state.checked)throw Error('not checked: '+it.id);if(it.t==='write')check('shelter production remains neutral',p.state.neutral);w.HBBidea.next()}w.HBBidea.finishEpisode();w.HBBidea.close(true)}
 check('all 15 episodes retained across three missions',Object.keys(w.HBBidea._state().episodes).length===15&&w.HBBidea.bidea().includes('5/5 aurkituta'));
 w.HBBidea.chooseForestMission(3);check('third guest adventure opens after prior two',w.HBBidea.bidea().includes('Lamiaren ispilua')&&w.HBBidea.bidea().includes('0/5'));
 for(let n=1;n<=5;n++){w.HBBidea.startEpisode(n);let p=w.HBBidea._player();check('mirror episode has seven contextual items',p.L.id==='HB-EP-MIRROR-0'+n&&p.L.items.length===7);w.HBBidea.begin();while(w.HBBidea._player().phase==='play'&&w.HBBidea._player().segment==='recall'){const it=w.HBBidea._player().queue[w.HBBidea._player().pos].item;w.HBBidea.sel(it.a[0]);w.HBBidea.check();w.HBBidea.next()}w.HBBidea.begin();
 while(w.HBBidea._player().phase==='play'){const p=w.HBBidea._player(),it=p.queue[p.pos].item;if(it.t==='match'){for(let i=0;i<it.pairs.length;i++){w.HBBidea.mL(i);w.HBBidea.mR(i)}}else if(it.t==='gap'||it.t==='write'){w.HBBidea.typed(it.t==='write'?it.model:it.a[0]);w.HBBidea.check()}else{w.HBBidea.sel(it.a[0]);w.HBBidea.check()}if(it.t==='write')check('mirror free response remains unverified',p.state.neutral);if(!p.state.checked)throw Error('mirror not checked '+it.id);w.HBBidea.next()}w.HBBidea.finishEpisode();w.HBBidea.close(true)}
 check('all 20 episodes retained across four adventures',Object.keys(w.HBBidea._state().episodes).length===20&&w.HBBidea.bidea().includes('5/5 aurkituta'));
 check('mirror closed tasks record differentiated recognition',w.HBBidea._state().recognitionEvidence['HB-EP-MIRROR-01-1'].skill==='reading'&&w.HBBidea._state().recognitionEvidence['HB-EP-MIRROR-01-3'].skill==='grammar');
 w.HBBidea.chooseForestMission(1);check('previous forest collection remains available',w.HBBidea.bidea().includes('Basorako bidea')&&w.HBBidea.bidea().includes('5/5 aurkituta'));
 check('polished guest home shows a real mission meter and one games section',w.HBBidea.gaur().includes('bd-mission-meter')&&(w.HBBidea.gaur().match(/aria-label="Jolastokia"/g)||[]).length===1);
 check('guest map puts mission path before games and retains guest card',w.HBBidea.bidea().indexOf('bd-world-path')<w.HBBidea.bidea().indexOf('aria-label="Jolastokia"')&&w.HBBidea.bidea().includes('bd-account-card'));
 w.HBData.guestLimited=()=>false;
 check('registered home preserves adventure progress and secondary content',w.HBBidea.gaur().includes('bd-route-overview')&&!w.HBBidea.gaur().includes('Ikasgai gehiago')&&w.HBBidea.supplementaryPracticeHtml().includes('Abenturako praktika gehiago'));
 const mem=w.HBBidea._state().episodeErrorMemory;const oldNork=mem.nornork?.errors||0;
 check('known grammar mismatch uses the same error memory',w.HBBidea.observePractice('HB07-err-2','da')&&w.HBBidea.learningContext().errors.nornork.errors===oldNork+1);
 check('unsupported grammar response is not diagnosed',!w.HBBidea.observePractice('HB07-err-2','dut'));
 w.HBData.guestLimited=()=>true;check('guest cannot access supplementary practice',w.HBBidea.supplementaryPracticeHtml()===''&&!w.HBBidea.observePractice('HB07-err-1','du'));w.HBData.guestLimited=()=>false;
 // Actual interactions: two distinct reading mismatches trigger temporary easier reading only.
 w.HBBidea.chooseAdventure('uraren-misterioa');delete w.HBBidea._state().episodeDraft;
 w.HBBidea.startWorldGame('context');
 for(let i=0;i<2;i++){const p=w.HBBidea._player(),it=p.queue[p.pos].item;w.HBBidea.sel(it.ch.find(x=>x!==it.a[0]));w.HBBidea.check();w.HBBidea.sel(it.a[0]);w.HBBidea.check();w.HBBidea.next()}
 w.HBBidea.close(true);
 const profile=require('../learning-selection.js').profile(w.HBBidea.learningContext());
 check('two distinct assisted reading answers trigger scoped support, not a level change',profile.stage==='reasoning'&&profile.readingStage==='connected'&&profile.vocabularyLevel==='B2'&&profile.skillAssessment===null);
 check('recognition retains assisted result without falsely crediting autonomy',Object.values(w.HBBidea._state().recognitionEvidence).filter(r=>r.skill==='reading'&&r.stage==='reasoning').length===2&&Object.values(w.HBBidea._state().recognitionEvidence).filter(r=>r.skill==='reading'&&r.stage==='reasoning').every(r=>r.result==='supported'&&!r.firstMatch));
 w.HBBidea.startWorldGame('context');check('support game actually changes its text pool',w.HBBidea._player().queue.every(e=>e.item.stage==='connected'));w.HBBidea.close(true);
 // A clue game records cued recall separately from recognition and leaves the narrative untouched.
 const routeBefore=JSON.stringify(w.HBBidea._state().episodes);
 w.HBBidea.startWorldGame('rosco');let rp=w.HBBidea._player();check('rosco offers six distinct letters at current stage',rp.queue.length===6&&new Set(rp.queue.map(e=>e.item.letter)).size===6&&rp.queue.every(e=>e.item.stage==='reasoning')&&els.get('bd-player').innerHTML.includes('bd-rosco-ring'));
 let ri=rp.queue[0].item;w.HBBidea.showHint();w.HBBidea.typed(ri.a[0]);w.HBBidea.check();check('hinted lexical retrieval is not mastery',w.HBBidea._state().recognitionEvidence[ri.id].mode==='cued_recall'&&w.HBBidea._state().recognitionEvidence[ri.id].result==='supported');w.HBBidea.next();
 let skipped=rp.queue[rp.pos].item.id;w.HBBidea.skipRosco();check('skip is not a mistake or evidence',!w.HBBidea._state().recognitionEvidence[skipped]);
 let unknown=rp.queue[rp.pos].item;w.HBBidea.typed('ez dakit');w.HBBidea.check();w.HBBidea.typed('beste aukera');w.HBBidea.check();check('unmatched open answer is unverified',rp.state.neutral&&w.HBBidea._state().recognitionEvidence[unknown.id].result==='unverified');w.HBBidea.close(true);
 w.HBBidea.startWorldGame('rosco');check('next rosco prioritizes previously supported and unverified words',w.HBBidea._player().queue.some(e=>e.item.id===ri.id)&&w.HBBidea._player().queue.some(e=>e.item.id===unknown.id)&&JSON.stringify(w.HBBidea._state().episodes)===routeBefore);w.HBBidea.close(true);
 const bcss=fs.readFileSync(path.join(__dirname,'../bidea/bidea.css'),'utf8');
 const source=fs.readFileSync(path.join(__dirname,'../bidea/bidea.js'),'utf8');
 check('onboarding offers direct entry to both adventures and optional test',source.includes('Hasi zuzenean')&&source.includes('Beste abentura bat: HitzBira World')&&source.includes('Zure abiapuntua ezagutu (aukerakoa)'));
 check('direct route does not imply placement evidence',w.HBBidea._state().placed===false);
 check('player separates scrollable content from fixed action area in CSS',bcss.includes('height:100dvh')&&bcss.includes('max-height:var(--bd-visible-height,100dvh)')&&bcss.includes('flex:1 1 0;min-height:0;overflow-y:auto')&&bcss.includes('flex:0 0 auto;z-index:3;margin:0')&&bcss.includes('env(safe-area-inset-bottom,0px)'));
 check('responsive CSS covers mobile tables, tablet (760px), and desktop workspace (960px/1024px)',bcss.includes('.bd-table{min-width:0}')&&bcss.includes('@media (min-width:760px)')&&bcss.includes('@media (min-width:960px)')&&bcss.includes('@media (min-width:1024px)'));
})();
console.log(n+' checks passed (bidea)');
