/* Shared authenticated account gateway; only entrypoints choose origins/releases. */
export function createAccountGateway(allowedOrigin, vocabularyRelease=null){
const BASE=Deno.env.get("SUPABASE_URL"), SERVICE=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), ANON=Deno.env.get("SUPABASE_ANON_KEY"), ROLE="hitzbira_isolated", RELEASE="hb-1.2-e461f43";
const adminHeaders={apikey:SERVICE,Authorization:"Bearer "+SERVICE,"Content-Type":"application/json"};
function response(status,data,origin){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json","Cache-Control":"no-store","Vary":"Origin",...(origin&&allowedOrigin(origin)?{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Headers":"authorization,apikey,content-type,x-client-info","Access-Control-Allow-Methods":"POST,OPTIONS"}:{})}})}
function params(x){return new URLSearchParams(x).toString()}
async function admin(path,method="GET",body,prefer){const r=await fetch(BASE+path,{method,headers:{...adminHeaders,...(prefer?{Prefer:prefer}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});if(!r.ok)throw Error("backend_failure");if(r.status===204)return null;const t=await r.text();return t?JSON.parse(t):null}
function jwtClaims(token){try{const part=token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(atob(part.padEnd(Math.ceil(part.length/4)*4,"=")))}catch{return {}}}
async function userFor(req){
 const token=req.headers.get("authorization")||"";
 if(!/^Bearer [A-Za-z0-9_.-]{20,4096}$/.test(token))return null;
 // The Auth server validates the token; decoded claims alone never authorize access.
 const r=await fetch(BASE+"/auth/v1/user",{headers:{apikey:ANON,Authorization:token}});
 if(!r.ok)return null;
 const verified=await r.json(),claims=jwtClaims(token.slice(7));
 if(!verified.id||claims.sub!==verified.id||claims.role!==ROLE)return null;
 // Check current administrative status too: a ban must apply to existing tokens.
 const u=await admin("/auth/v1/admin/users/"+encodeURIComponent(verified.id));
 if(u.id!==verified.id||u.email!==verified.email||u.role!==ROLE||u.app_metadata?.hitzbira_pilot!==true||u.is_anonymous||!u.email_confirmed_at||u.deleted_at||(u.banned_until&&(!Number.isFinite(Date.parse(u.banned_until))||Date.parse(u.banned_until)>Date.now()))||!/^[a-z0-9][a-z0-9._-]{2,23}@hitzbira[.]app$/.test(u.email||""))return null;
 const path="/rest/v1/hb_registered_accounts?"+params({select:"user_id,username,email,enabled",user_id:"eq."+u.id,limit:"1"});
 let rows=await admin(path);
 if(!rows?.length){
  // Idempotent first-login enrollment. Never re-enable an existing disabled account.
  await admin("/rest/v1/hb_registered_accounts?on_conflict=user_id","POST",{user_id:u.id,username:u.email.split("@")[0],email:u.email,enabled:true},"resolution=ignore-duplicates,return=minimal");
  rows=await admin(path);
 }
 const account=rows?.[0];
 return account?.enabled===true&&account.email===u.email&&account.username===u.email.split("@")[0]?account:null;
}
async function read(b,req,origin){
 const u=await userFor(req);if(!u)return response(403,{error:"Kontu piloturako baimenik ez."},origin);
 if(b.action==="check")return response(200,{ok:true,username:u.username,release:RELEASE},origin);
 const f=b.filter&&typeof b.filter==="object"&&!Array.isArray(b.filter)?b.filter:{};
 const kind=b.kind,offset=b.offset;
 if(!["aux","synthetic","grammar_bank"].includes(kind)||!Number.isInteger(offset)||offset<0||offset>2000)return response(400,{error:"Kontsulta ez da baliozkoa."},origin);
 const q={select:"ordinal,payload",release_code:"eq."+RELEASE,kind:"eq."+kind,order:"ordinal.asc",limit:"100",offset:String(offset)};
 if(kind==="aux"){
  if(f.partition_key!==undefined){if(!/^eq\.[0-3]$/.test(f.partition_key))return response(400,{error:"Sistema baliogabea."},origin);q.partition_key=f.partition_key}
  if(f["payload->>m"]!==undefined){if(!/^eq\.(?:[0-9]|10)$/.test(f["payload->>m"]))return response(400,{error:"Aldia baliogabea."},origin);q["payload->>m"]=f["payload->>m"]}
 }else if(kind==="grammar_bank"){if(!/^eq\.(?:decl|bank0[5-8])$/.test(f.record_id||""))return response(400,{error:"Banku baliogabea."},origin);q.record_id=f.record_id}
 const releases=await admin("/rest/v1/hb_runtime_pilot_releases?"+params({select:"release_code",release_code:"eq."+RELEASE,ready:"eq.true",limit:"1"}));
 if(!releases?.length)return response(503,{error:"Banku pilotua ez dago prest."},origin);
 return response(200,await admin("/rest/v1/hb_runtime_pilot_records?"+params(q)),origin);
}
/* Fixed read-only lexical projection. Publication, review and rights are separate gates.
   No generic table/filter passthrough and no raw metadata leaves this gateway. */
async function vocabulary(b,req,origin){
 const u=await userFor(req);if(!u)return response(403,{error:"Kontua ez dago gaituta."},origin);
 const level=b.level,theme=b.theme??"all";
 if(!["A1","A2","B1","B2","C1","C2"].includes(level)||typeof theme!=="string"||!(/^(?:all|[a-z0-9_-]{1,100})$/).test(theme))return response(400,{error:"Hautaketa baliogabea."},origin);
 const gates={status:"eq.published",review_status:"eq.approved",needs_review:"eq.false",level:"eq."+level};
 const groups=await admin("/rest/v1/editorial_lexical_groups?"+params({...gates,select:"id,slug,current_content_hash,last_reviewed_hash",...(theme!=="all"?{slug:"eq."+theme}:{}),order:"id.asc",limit:"100"}));
 const approved=new Map((groups||[]).filter(g=>g.current_content_hash&&g.current_content_hash===g.last_reviewed_hash).map(g=>[g.id,g]));
 if(!approved.size)return response(200,{contract:"hb-vocabulary-v1",rows:[]},origin);
 const grants=new Map((vocabularyRelease?.rows||[]).map(r=>[r.id,r]));
 const entries=await admin("/rest/v1/editorial_lexical_entries?"+params({...gates,select:"id,group_id,term_eu,nuance_eu,level,version,current_content_hash,last_reviewed_hash,knowledge_metadata",group_id:"in.("+[...approved.keys()].join(",")+")",...(vocabularyRelease?{id:"in.("+[...grants.keys()].join(",")+")"}:{"knowledge_metadata->hitzbira_vocab->>rights_status":"eq.approved","knowledge_metadata->hitzbira_vocab->>matching_review":"eq.approved"}),order:"id.asc",limit:"200"}));
 const rows=[];
 for(const e of entries||[]){
  const g=approved.get(e.group_id),grant=grants.get(e.id);
  let m=e.knowledge_metadata?.hitzbira_vocab;
  // A release can attest only the exact approved entry AND group versions.
  // Explicit metadata revocation always wins over this bounded release.
  if(!m&&g&&grant&&grant.version===e.version&&grant.fingerprint===e.current_content_hash&&grant.groupId===e.group_id&&grant.groupFingerprint===g.current_content_hash)m={rights_status:"approved",rights_basis:vocabularyRelease.rights,source_ref:vocabularyRelease.source,matching_review:"approved",reviewed_fingerprint:grant.fingerprint};
  if(!g||!m||m.rights_status!=="approved"||m.matching_review!=="approved"||m.reviewed_fingerprint!==e.current_content_hash||typeof m.rights_basis!=="string"||!m.rights_basis.trim()||m.rights_basis.length>300||typeof m.source_ref!=="string"||!(/^[a-zA-Z0-9][a-zA-Z0-9 ._:@/-]{0,199}$/).test(m.source_ref)||!e.current_content_hash||e.current_content_hash!==e.last_reviewed_hash||!Number.isInteger(e.version)||e.version<1||typeof e.term_eu!=="string"||!e.term_eu.trim()||e.term_eu.length>120||typeof e.nuance_eu!=="string"||!e.nuance_eu.trim()||e.nuance_eu.length>1200)continue;
  rows.push({id:e.id,term:e.term_eu,meaning:e.nuance_eu,level:e.level,theme:g.slug,version:e.version,fingerprint:e.current_content_hash,source:m.source_ref,rights:m.rights_basis});
 }
 return response(200,{contract:"hb-vocabulary-v1",rows},origin);
}
async function learning(b,req,origin){
 const u=await userFor(req);if(!u)return response(403,{error:"Kontua ez dago gaituta."},origin);
 if(b.action==="learning_load"){
  const state=await admin("/rest/v1/hb_learning_state?"+params({select:"stream,payload,revision",user_id:"eq."+u.user_id}));
  const streak=await admin("/rest/v1/rpc/hb_learning_overview","POST",{p_user:u.user_id});
  return response(200,{state,streak},origin);
 }
 if(b.action==="learning_push"){
  const e=b.event;
  if(!e||typeof e!=="object"||!(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(e.id||""))||!["hitzbira-unified-09","hitzbira-goal-v1","hitzbira-assessment-v1","hitzbira-journey-v1","sustrai-aditzak-v1","hitzbira-path-v1","activity"].includes(e.stream)||!e.patch||typeof e.patch!=="object"||JSON.stringify(e.patch).length>340000||JSON.stringify(e.details||{}).length>15000)return response(400,{error:"Gertaera baliogabea."},origin);
  const ack=await admin("/rest/v1/rpc/hb_apply_learning_event","POST",{p_user:u.user_id,p_event:e.id,p_stream:e.stream,p_patch:e.patch,p_details:e.details||{},p_client_at:e.at||null});
  if(!ack?.ok)return response(503,{error:"Ez da gordetzea baieztatu."},origin);
  const streak=await admin("/rest/v1/rpc/hb_learning_overview","POST",{p_user:u.user_id});
  return response(200,{ok:true,streak},origin);
 }
 return response(400,{error:"Ekintza ezezaguna."},origin);
}
return async req=>{
 const origin=req.headers.get("origin")||"";
 if(origin&&!allowedOrigin(origin))return response(403,{error:"Jatorria ez dago baimenduta."},"");
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Headers":"authorization,apikey,content-type,x-client-info","Access-Control-Allow-Methods":"POST,OPTIONS","Cache-Control":"no-store","Vary":"Origin"}});
 if(req.method!=="POST")return response(405,{error:"POST beharrezkoa da."},origin);
 if(!BASE||!SERVICE||!ANON)return response(503,{error:"Zerbitzua ez dago prest."},origin);
 try{
  if(Number(req.headers.get("content-length")||0)>400000)return response(413,{error:"Eskaera handiegia."},origin);
  // Bounded stream: no unbounded body allocation, including chunked requests.
  const reader=req.body?.getReader();if(!reader)return response(400,{error:"Eskaera hutsa."},origin);
  let parts=[],size=0;for(;;){const r=await reader.read();if(r.done)break;size+=r.value.byteLength;if(size>400000){await reader.cancel();return response(413,{error:"Eskaera handiegia."},origin)}parts.push(r.value)}
  const buf=new Uint8Array(size);let pos=0;for(const part of parts){buf.set(part,pos);pos+=part.byteLength}const b=JSON.parse(new TextDecoder().decode(buf));
  if(!b||typeof b!=="object")return response(400,{error:"Eskaera baliogabea."},origin);
  if(b.action==="register")return response(403,{error:"Kontuak administratzaileak sortzen ditu."},origin);
  if(b.action==="check"||b.action==="read")return await read(b,req,origin);
  if(b.action==="vocabulary")return await vocabulary(b,req,origin);
  if(b.action==="learning_load"||b.action==="learning_push")return await learning(b,req,origin);
  return response(400,{error:"Ekintza ezezaguna."},origin);
 }catch{return response(503,{error:"Ezin izan da eskaera burutu."},origin)}
};
}
