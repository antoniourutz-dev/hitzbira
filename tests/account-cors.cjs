'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../supabase/functions/hitzbira-pilot-account/index.ts'),'utf8');
let handler,backendCalls=0;
vm.runInNewContext(source,{Deno:{env:{get:()=> 'configured'},serve:f=>{handler=f}},fetch:()=>{backendCalls++;throw Error('Unexpected backend call')},Response,URLSearchParams,TextDecoder,Uint8Array,atob,Date});
(async()=>{
 let count=0;
 for(const origin of ['https://hitzbira.vercel.app','https://hitzbira-gramatika.vercel.app']){
  const preflight=await handler(new Request('https://example.test',{method:'OPTIONS',headers:{Origin:origin}}));
  assert.equal(preflight.status,204);assert.equal(preflight.headers.get('Access-Control-Allow-Origin'),origin);
  assert.match(preflight.headers.get('Access-Control-Allow-Headers'),/authorization/);
  const denied=await handler(new Request('https://example.test',{method:'POST',headers:{Origin:origin},body:JSON.stringify({action:'check'})}));
  assert.equal(denied.status,403);assert.equal(denied.headers.get('Access-Control-Allow-Origin'),origin);count+=2;
 }
 for(const origin of ['https://evil.test','https://hitzbira.vercel.app.evil.test','http://hitzbira.vercel.app','https://hitzbira-other.vercel.app','https://hitzbira-evil-antoniourutz-devs-projects.vercel.app']){
  const denied=await handler(new Request('https://example.test',{method:'OPTIONS',headers:{Origin:origin}}));
  assert.equal(denied.status,403);assert.equal(denied.headers.get('Access-Control-Allow-Origin'),null);count++;
 }
 assert.equal(backendCalls,0);console.log(count+' CORS and unauthenticated access checks passed');
})().catch(e=>{console.error(e);process.exit(1)});