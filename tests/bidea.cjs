// Bidea 0.1: datuen osotasuna eta zuzentze-funtzioak.
const assert=require('node:assert'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++};
const api=require('../bidea/bidea.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../bidea/data.js'),'utf8'),ctx);
const D=ctx.window.HB_BIDEA;
check('data loaded',D&&D.chapters.length===8);
const ls=D.chapters[0].lessons,items=ls.flatMap(l=>l.items);
check('five lessons',ls.length===5);
check('lessons have 10-12 items',ls.every(l=>l.items.length>=10&&l.items.length<=12));
check('unique item ids',new Set(items.map(i=>i.id)).size===items.length);
check('every item traces to a Supabase draft',items.every(i=>/^DRAFT-SIN-B2-(KAUS|OND)-20261122-A0[1-5]#\d+$/.test(i.src)));
check('every item has answers and explanation',items.every(i=>Array.isArray(i.a)&&i.a.length&&i.ex));
check('gap prompts contain a blank',items.filter(i=>['mc','gap','chips'].includes(i.t)).every(i=>i.q.includes('____')));
check('mc choices contain an accepted answer',items.filter(i=>i.t==='mc').every(i=>i.ch.some(c=>api.isAccepted(c,i.a))));
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
console.log(n+' checks passed (bidea)');
