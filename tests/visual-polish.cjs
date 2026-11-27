'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');let checks=0;
function check(name,fn){fn();checks++;console.log('PASS '+name)}
const context={window:{HBData:{keyFor:k=>k},addEventListener(){}},localStorage:{getItem:()=>null},document:{getElementById:()=>null},URLSearchParams,console};vm.createContext(context);
vm.runInContext(read('app.js').replace(/boot\(\);\s*$/,''),context);
vm.runInContext(`D={F:[{id:'ize',title:'Izen-sintagma'}],cards:[{id:'one',family:'ize',title:'Liburua',fn:'Deskribatu',level:'Hastapena',examples:['Liburu gorria.']}]};islandArt=()=>'';bira=()=>'';let gated=false;guestGate=()=>gated;go=v=>{view=v};`,context);
const run=s=>vm.runInContext(s,context);
check('study to practice retains the selected subject',()=>{run("practiceTopic('clause')");assert.equal(run('practiceArea'),'clause');assert.equal(run('view'),2)});
check('invalid subject safely falls back to all subjects',()=>{run("practiceTopic('missing')");assert.equal(run('practiceArea'),'all')});
check('guest cannot enter subject practice',()=>{run("gated=true;view=0;practiceTopic('verb')");assert.equal(run('view'),0);run('gated=false')});
check('unvisited lesson card has no learning claim',()=>{const html=run('catalogCard(D.cards[0])');assert.ok(html.includes('Behatu · Ulertu · Probatu'));assert.ok(!html.includes('Praktikatuta'))});
check('opening a lesson does not mark it as practiced',()=>{run("journey.lessons=['one']");const html=run('catalogCard(D.cards[0])');assert.ok(html.includes('Irekita'));assert.ok(!html.includes('Praktikatuta'))});
check('practice status uses existing item evidence',()=>{run("h.one={n:1,family:'ize',ok:1}");assert.ok(run('catalogCard(D.cards[0])').includes('Praktikatuta'))});
check('removed lesson identifiers cannot create a resume link',()=>{run("journey.lessons=['removed']");assert.ok(!run('practiceLearningLink()').includes('removed'))});
check('lesson and practice use the same stable item identifier',()=>{run("journey.lessons=['one']");const html=run('practiceLearningLink()');assert.ok(html.includes('openCard(&quot;one&quot;)'));assert.ok(html.includes('start(&quot;one&quot;'))});
const network={fetch:async()=>{throw new TypeError('Failed to fetch')},TypeError,Error,AbortSignal};vm.createContext(network);vm.runInContext(read('data.js').split('\n').find(x=>x.startsWith('async function serviceRequest(')),network);
(async()=>{let error;try{await vm.runInContext("serviceRequest('/test',{},'Kontuaren konexioa')",network)}catch(e){error=e}check('network failure names the failing service without exposing credentials',()=>{assert.ok(error.message.startsWith('Kontuaren konexioa:'));assert.ok(error.message.includes('Konexioa egiaztatu'));assert.ok(!error.message.includes('Failed to fetch'))});network.fetch=async()=>{const e=new Error();e.name='TimeoutError';throw e};try{await vm.runInContext("serviceRequest('/test',{},'Saioa')",network)}catch(e){error=e}check('timeout provides a retry message',()=>assert.ok(error.message.includes('garaiz')));console.log(checks+' visual polish checks passed')})().catch(e=>{console.error(e);process.exitCode=1});
