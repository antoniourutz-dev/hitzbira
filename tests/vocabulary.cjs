'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const api=require('../vocabulary.js');
let checks=0;function check(name,condition){assert.ok(condition,name);checks++}
const rows=Array.from({length:24},(_,i)=>({id:'entry-'+i,version:1,fingerprint:'hash-'+i,source:'TEST-SYNTHETIC',rights:'Synthetic test fixture',term:'Hitza '+i,meaning:'Esanahia '+i,level:'C1',theme:i<12?'lexiko_a':'lexiko_b'}));
async function main(){
 const items=api.select(rows,{level:'C1',rng:()=>.25});
 check('bounded rounds with unique pairs',items.length===4&&new Set(items.flatMap(i=>i.vocabulary.map(r=>r.id))).size===12);
 check('mixed themes have an honest label',api.themeLabel([rows[0],rows[12]])==='Gaiak nahastuta');
 check('single theme is named precisely',api.themeLabel([rows[0],rows[1]])==='a');
 const next=api.select(rows,{level:'C1',previous:items.flatMap(i=>i.vocabulary.map(r=>r.id)),rng:()=>.25});
 check('next game uses unseen vocabulary when enough exists',next.flatMap(i=>i.vocabulary).every(r=>!items.flatMap(i=>i.vocabulary).some(p=>p.id===r.id)));
 check('level cannot be silently widened',api.select(rows,{level:'B1'}).length===0);
 check('theme cannot be silently widened',api.select(rows,{level:'C1',theme:'lexiko_a'}).flatMap(i=>i.vocabulary).every(r=>r.theme==='lexiko_a'));
 check('insufficient pairs do not create a game',api.select(rows.slice(0,2),{level:'C1'}).length===0);
 check('duplicate meanings and terms excluded',api.select([rows[0],{...rows[1],meaning:rows[0].meaning},{...rows[2],term:rows[0].term}],{level:'C1'}).length===0);
 check('missing provenance excluded',api.select(rows.slice(0,3).map(r=>({...r,source:''})),{level:'C1'}).length===0);
 let owner='A',remote=true,reply={contract:'hb-vocabulary-v1',rows},resolve;
 const data={keyFor:k=>k+'::'+owner,isRemote:()=>remote,vocabulary:async()=>reply};
 const repo=api.createRepository(data);
 check('repository produces live result from validated gateway contract',(await repo.prepare({level:'C1'})).mode==='live');
 remote=false;check('guest uses explicit fallback',(await repo.prepare({level:'C1'})).reason==='guest');remote=true;
 reply={contract:'hb-vocabulary-v1',rows:[]};check('empty bank explicit fallback',(await repo.prepare({level:'C1'})).reason==='unavailable');
 reply={rows};check('unknown contract explicit fallback',(await repo.prepare({level:'C1'})).reason==='connection');
 data.vocabulary=()=>new Promise(r=>{resolve=r});let pending=repo.prepare({level:'C1'});owner='B';resolve({contract:'hb-vocabulary-v1',rows});check('account switch discards response',(await pending).mode==='cancelled');
 pending=repo.prepare({level:'C1'});repo.cancel();resolve({contract:'hb-vocabulary-v1',rows});check('closed game discards response',(await pending).mode==='cancelled');
 data.vocabulary=async()=>{throw Error('network')};check('network error explicit fallback',(await repo.prepare({level:'C1'})).reason==='connection');

 const gateway=require('./helpers/gateway.cjs')();
 const uid='11111111-1111-4111-8111-111111111111',group={id:uid,slug:'lexiko_a',current_content_hash:'g',last_reviewed_hash:'g'};
 const entry={id:'entry-1',group_id:uid,term_eu:'Synthetic',nuance_eu:'Synthetic definition',level:'C1',version:1,current_content_hash:'h',last_reviewed_hash:'h',knowledge_metadata:{hitzbira_vocab:{rights_status:'approved',matching_review:'approved',reviewed_fingerprint:'h',rights_basis:'Synthetic fixture only',source_ref:'TEST-ONLY'}}};
 async function request(body={action:'vocabulary',level:'C1',theme:'all'},opts={}){
  let handler;const calls=[];const res=(body,status=200)=>new Response(JSON.stringify(body),{status});
  const user={id:uid,email:'student@hitzbira.app',role:'hitzbira_isolated',app_metadata:{hitzbira_pilot:true},email_confirmed_at:'2026-01-01'};
  const fetch=async(url,options={})=>{const u=new URL(url);calls.push(u);
   if(u.pathname==='/auth/v1/user')return res(user,opts.invalid?401:200);
   if(u.pathname==='/auth/v1/admin/users/'+uid)return res(user);
   if(u.pathname==='/rest/v1/hb_registered_accounts')return res([{user_id:uid,username:'student',email:user.email,enabled:true}]);
   assert.equal(options.method,'GET');
   assert.equal(u.searchParams.get('status'),'eq.published');assert.equal(u.searchParams.get('review_status'),'eq.approved');assert.equal(u.searchParams.get('needs_review'),'eq.false');assert.equal(u.searchParams.get('level'),'eq.C1');
   assert.ok(!u.searchParams.get('select').includes('*'));
   if(u.pathname==='/rest/v1/editorial_lexical_groups'){assert.equal(u.searchParams.get('limit'),'100');return res(opts.groups||[group])}
   if(u.pathname==='/rest/v1/editorial_lexical_entries'){assert.equal(u.searchParams.get('limit'),'200');if(!opts.preview&&!opts.production)assert.equal(u.searchParams.get('knowledge_metadata->hitzbira_vocab->>rights_status'),'eq.approved');return res(opts.entries||[entry])}
   throw Error('Unexpected read');
  };
  vm.runInNewContext(opts.production?require('./helpers/gateway.cjs')('production'):opts.preview?require('./helpers/gateway.cjs')(true):gateway,{Deno:{env:{get:k=>({SUPABASE_URL:'https://example.test',SUPABASE_SERVICE_ROLE_KEY:'private-test',SUPABASE_ANON_KEY:'public-test'})[k]},serve:f=>handler=f},fetch,Response,URLSearchParams,TextDecoder,Uint8Array,atob,Date});
  const token='header.'+Buffer.from(JSON.stringify({sub:uid,role:user.role})).toString('base64url')+'.signature';
  const r=await handler(new Request('https://example.test',{method:'POST',headers:{Origin:opts.origin||(opts.preview?'https://hitzbira-git-feature-hitzbira-171a80-antoniourutz-devs-projects.vercel.app':'https://hitzbira.vercel.app'),Authorization:'Bearer '+token},body:JSON.stringify(body)}));
  return {status:r.status,body:await r.json(),calls};
 }
 let r=await request();check('gateway returns only public projection',r.status===200&&r.body.rows.length===1&&!JSON.stringify(r.body).includes('knowledge_metadata')&&!JSON.stringify(r.body).includes('private-test'));
 for(const change of [{knowledge_metadata:{}},{last_reviewed_hash:'stale'},{knowledge_metadata:{hitzbira_vocab:{...entry.knowledge_metadata.hitzbira_vocab,rights_status:'pending'}}},{knowledge_metadata:{hitzbira_vocab:{...entry.knowledge_metadata.hitzbira_vocab,matching_review:'pending'}}}]){
  r=await request(undefined,{entries:[{...entry,...change}]});check('gateway excludes unapproved or stale row',r.body.rows.length===0);
 }
 r=await request(undefined,{groups:[{...group,last_reviewed_hash:'stale'}]});check('stale group prevents entry read',r.body.rows.length===0&&!r.calls.some(u=>u.pathname.endsWith('editorial_lexical_entries')));
 r=await request(undefined,{invalid:true});check('invalid authentication prevents vocabulary reads',r.status===403&&!r.calls.some(u=>u.pathname.includes('editorial_')));
 r=await request({action:'vocabulary',level:'C1',theme:'all&select=*'});check('query injection rejected',r.status===400&&!r.calls.some(u=>u.pathname.includes('editorial_')));
 r=await request(undefined,{origin:'https://hitzbira-preview-unapproved.vercel.app'});check('preview origin remains closed without specific authorization',r.status===403&&r.calls.length===0);

 const releaseContext={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../supabase/functions/_shared/vocabulary-release.ts'),'utf8').replace('export const vocabularyRelease','this.release'),releaseContext);
 const grant=releaseContext.release.rows[0],grantedGroup={...group,id:grant.groupId,current_content_hash:grant.groupFingerprint,last_reviewed_hash:grant.groupFingerprint},grantedEntry={...entry,id:grant.id,group_id:grant.groupId,version:grant.version,current_content_hash:grant.fingerprint,last_reviewed_hash:grant.fingerprint,knowledge_metadata:{}};
 const releaseOptions={preview:true,groups:[grantedGroup],entries:[grantedEntry]};
 r=await request(undefined,releaseOptions);check('owner-confirmed preview release reads exact approved version',r.status===200&&r.body.rows.length===1);
 r=await request(undefined,{...releaseOptions,origin:'https://hitzbira-git-feature-guest-ac-cbff4f-antoniourutz-devs-projects.vercel.app'});check('stable guest development origin uses authenticated preview gateway',r.status===200&&r.body.rows.length===1);
 r=await request(undefined,{...releaseOptions,origin:'https://hitzbira-git-feature-guest-ac-cbff4f-antoniourutz-devs-projects.vercel.app.example.test'});check('lookalike preview origin rejected',r.status===403&&r.calls.length===0);
 r=await request(undefined,{...releaseOptions,origin:'https://hitzbira.vercel.app'});check('isolated preview gateway rejects production origin',r.status===403&&r.calls.length===0);
 r=await request(undefined,{...releaseOptions,entries:[{...grantedEntry,version:grant.version+1}]});check('new entry version requires new release approval',r.body.rows.length===0);
 r=await request(undefined,{...releaseOptions,groups:[{...grantedGroup,current_content_hash:'changed',last_reviewed_hash:'changed'}]});check('changed group wording requires new release approval',r.body.rows.length===0);
 r=await request(undefined,{...releaseOptions,entries:[{...grantedEntry,knowledge_metadata:{hitzbira_vocab:{rights_status:'revoked'}}}]});check('explicit revocation overrides owner release',r.body.rows.length===0);
 r=await request(undefined,{...releaseOptions,entries:[{...grantedEntry,id:'unapproved-id'}]});check('unlisted resource cannot use release approval',r.body.rows.length===0);
 r=await request(undefined,{...releaseOptions,invalid:true});check('release never bypasses account authentication',r.status===403);
 const productionOptions={production:true,groups:[grantedGroup],entries:[grantedEntry]};
 r=await request(undefined,productionOptions);check('production gateway serves only exact owner-approved lexical versions',r.status===200&&r.body.rows.length===1);
 r=await request(undefined,{...productionOptions,origin:'https://hitzbira.vercel.app.example.test'});check('production gateway rejects lookalike origin',r.status===403&&r.calls.length===0);
 r=await request(undefined,{...productionOptions,origin:'https://hitzbira-git-feature-guest-ac-cbff4f-antoniourutz-devs-projects.vercel.app'});check('production gateway rejects preview origin',r.status===403&&r.calls.length===0);
 r=await request(undefined,{...productionOptions,invalid:true});check('production release requires authentication',r.status===403);
 r=await request(undefined,{...productionOptions,entries:[{...grantedEntry,version:grant.version+1}]});check('production release rejects changed version',r.body.rows.length===0);
 r=await request(undefined,{...productionOptions,entries:[{...grantedEntry,knowledge_metadata:{hitzbira_vocab:{rights_status:'revoked'}}}]});check('production release honors revocation',r.body.rows.length===0);
 const releaseRows=Array.from(releaseContext.release.rows);check('release contains references only and no definitions',releaseRows.length===32&&releaseRows.every(r=>!r.term&&!r.meaning&&r.fingerprint.length===64));

 const store=new Map(),els=new Map(),events=[],requests=[],w={HBVocabulary:api,draw(){}};
 const el=()=>({hidden:false,innerHTML:'',dataset:{},scrollTop:0,setAttribute(){},focus(){},querySelector:()=>null});
 const doc={readyState:'complete',body:{dataset:{},appendChild(e){els.set(e.id,e)}},addEventListener(){},getElementById:id=>els.get(id)||null,createElement:el,querySelector:()=>null,querySelectorAll:()=>[],documentElement:{classList:{add(){},remove(){}}}};
 let isRemote=false;
 w.HBData={keyFor:k=>k,isRemote:()=>isRemote,activity:e=>events.push(e),vocabulary:async({level,theme})=>{requests.push({level,theme});return {contract:'hb-vocabulary-v1',rows:(theme==='all'?rows:rows.filter(r=>r.theme===theme)).map(r=>({...r,level:'B1'}))}}};
 const context={window:w,globalThis:w,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},document:doc,location:{search:''},URLSearchParams};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../bidea/data.js'),'utf8'),context);
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../bidea/bidea.js'),'utf8'),context);
 check('welcome presents adventures without official levels',!/\b(?:A1|A2|B1|B2|C1|C2)\b/.test(w.HBBidea.gaur().replace(/<[^>]*>/g,' ')));
 w.HBBidea.setLevel('b1b2',false);await w.HBBidea.startWorldGame('words');check('guest player labels local fallback',els.get('bd-player').innerHTML.includes('Abenturako tokiko hitzak'));
 w.HBBidea.close(true);isRemote=true;await w.HBBidea.startWorldGame('words');
 check('world adventure assigns its vocabulary difficulty internally',requests.at(-1).level==='B1');
 check('student cannot choose an official vocabulary level',typeof w.HBBidea.setVocabularyLevel==='undefined'&&!w.HBBidea.gaur().includes('Hiztegiaren zailtasuna'));
 check('official levels are absent from home and map text',![w.HBBidea.gaur(),w.HBBidea.bidea()].some(html=>/\b(?:A1|A2|B1|B2|C1|C2)\b/.test(html.replace(/<[^>]*>/g,' '))));
 check('dynamic game uses existing player and source panel',w.HBBidea._player().queue.length===4&&els.get('bd-player').innerHTML.includes('Hitzen jatorria'));
 w.HBBidea.mL(0);w.HBBidea.mR(1);w.HBBidea.mL(0);w.HBBidea.mR(0);
 check('first wrong recognition and assisted recovery both retained without mastery',events.length===2&&events[0].result==='mismatch'&&events[1].assisted&&events.every(e=>e.mode==='recognition'&&e.academicState==='not_observed'&&e.resource.version===1));
 w.HBBidea.mL(1);w.HBBidea.mR(1);check('a different word retains its first-attempt status after a peer error',events[2].attempt===1&&events[2].assisted===false&&events[1].attempt===2&&events[2].telemetryVersion===2);
 w.HBBidea.close(true);w.HBBidea.setVocabularyTheme('lexiko_a');await w.HBBidea.startWorldGame('words');w.HBBidea.close(true);check('playing one topic preserves the other available topic in the menu',w.HBBidea.gaur().includes('value="lexiko_b"'));
 w.HBBidea.chooseAdventure('basorako-bidea');await w.HBBidea.startWorldGame('words');check('switching adventure changes the internal request to its assigned difficulty',requests.at(-1).level==='A1');check('out-of-adventure bank rows fall back instead of changing difficulty',w.HBBidea._player().vocabularyMode==='fallback');check('adventure choice is not proficiency certification',w.HBBidea._state().placed===false);w.HBBidea.chooseAdventure('uraren-misterioa');
 w.HBBidea.close(true);w.HBData.vocabulary=()=>new Promise(r=>resolve=r);pending=w.HBBidea.startWorldGame('words');check('loading can be closed',els.get('bd-player').innerHTML.includes('Hitzak prestatzen'));w.HBBidea.close(true);resolve({contract:'hb-vocabulary-v1',rows});await pending;check('late response never reopens player',w.HBBidea._player()===null);
 console.log(checks+' checks passed (dynamic vocabulary; synthetic fixtures, no live claim)');
}
main().catch(e=>{console.error(e);process.exit(1)});
