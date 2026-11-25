'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../supabase/functions/hitzbira-pilot-account/index.ts'),'utf8');
const uid='11111111-1111-4111-8111-111111111111';
const base={id:uid,email:'student@hitzbira.app',role:'hitzbira_isolated',email_confirmed_at:'2026-01-01T00:00:00Z',app_metadata:{hitzbira_pilot:true}};
const record={user_id:uid,username:'student',email:base.email,enabled:true};
async function scenario({user={},verified={},claims={},rows=[],invalid=false,raceDisabled=false,action='check'}={}){
 let handler,inserts=0,authReads=0,learningReads=0;
 const current={...base,...user},validated={...current,...verified};
 const payload={sub:uid,role:base.role,...claims};
 const token='header.'+Buffer.from(JSON.stringify(payload)).toString('base64url')+'.signature';
 const response=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
 const fetch=async(url,options={})=>{
  const p=new URL(url).pathname;
  if(p==='/auth/v1/user')return invalid?response({},401):response(validated);
  if(p==='/auth/v1/admin/users/'+uid){authReads++;return response(current)}
  if(p==='/rest/v1/hb_registered_accounts'){
   if(options.method==='POST'){
    inserts++;assert.equal(options.headers.Prefer,'resolution=ignore-duplicates,return=minimal');
    assert.equal(new URL(url).searchParams.get('on_conflict'),'user_id');
    assert.deepEqual(JSON.parse(options.body),record);
    rows=[{...record,enabled:!raceDisabled}];return new Response(null,{status:204});
   }
   assert.equal(new URL(url).searchParams.get('user_id'),'eq.'+uid);
   return response(rows);
  }
  if(p==='/rest/v1/hb_learning_state'){learningReads++;assert.equal(new URL(url).searchParams.get('user_id'),'eq.'+uid);return response([])}
  if(p==='/rest/v1/rpc/hb_learning_overview'){assert.equal(JSON.parse(options.body).p_user,uid);return response({total:0})}
  throw Error('Unexpected access: '+url);
 };
 vm.runInNewContext(source,{Deno:{env:{get:k=>({SUPABASE_URL:'https://example.test',SUPABASE_SERVICE_ROLE_KEY:'private',SUPABASE_ANON_KEY:'public'})[k]},serve:f=>{handler=f}},fetch,Response,URLSearchParams,TextDecoder,Uint8Array,atob,Date});
 const result=await handler(new Request('https://example.test/functions/v1/hitzbira-pilot-account',{method:'POST',headers:{Origin:'https://hitzbira-gramatika.vercel.app',Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({action})}));
 return {status:result.status,body:await result.json(),inserts,authReads,learningReads};
}
(async()=>{
 let count=0;
 async function check(name,options,status,inserts=0){const r=await scenario(options);assert.equal(r.status,status,name);assert.equal(r.inserts,inserts,name);console.log('PASS '+name);count++;return r}
 await check('confirmed domain account enrolls on first login',{},200,1);
 await check('existing account is not recreated',{rows:[record]},200);
 await check('disabled account stays disabled',{rows:[{...record,enabled:false}]},403);
 await check('concurrent disabled account is not re-enabled',{raceDisabled:true},403,1);
 await check('invalid token never enrolls',{invalid:true},403);
 await check('different domain rejected',{user:{email:'student@other.test'}},403);
 await check('domain suffix spoof rejected',{user:{email:'student@hitzbira.app.other.test'}},403);
 await check('unconfirmed account rejected',{user:{email_confirmed_at:null}},403);
 await check('banned account with existing token rejected',{user:{banned_until:'2099-01-01T00:00:00Z'}},403);
 await check('expired ban permits access',{user:{banned_until:'2020-01-01T00:00:00Z'},rows:[record]},200);
 await check('deleted account rejected',{user:{deleted_at:'2026-01-01T00:00:00Z'}},403);
 await check('anonymous user rejected',{user:{is_anonymous:true}},403);
 await check('untrusted token identity rejected',{claims:{sub:'someone-else'}},403);
 await check('wrong role rejected',{user:{role:'authenticated'}},403);
 await check('missing server-managed domain permission rejected',{user:{app_metadata:{}}},403);
 await check('changed email between validation and lookup rejected',{verified:{email:'another@hitzbira.app'}},403);
 await check('mismatched stored account rejected',{rows:[{...record,email:'other@hitzbira.app'}]},403);
 const loaded=await check('first login can load only its own learning state',{action:'learning_load'},200,1);assert.equal(loaded.learningReads,1);
 console.log(count+' account admission checks passed');
})().catch(e=>{console.error(e);process.exit(1)});
