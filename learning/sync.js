/* Revision-checked practice checkpoints. No academic evidence; no automatic guest import. */
(function(root){
"use strict";
const STREAM="hitzbira-cycle-v1",canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==="object"?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x,same=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b)),clone=x=>JSON.parse(JSON.stringify(x)),rev=x=>Number.isSafeInteger(x)&&x>=0;
function createSync({storage,key,transport,cycle,newId}){
 if(!storage||typeof key!=="string"||!key.includes("::hb::")||!transport||typeof newId!=="function")throw Error("account-scoped storage required");
 let raw=storage.getItem(key),box=null,busy=false;
 const validSnapshot=s=>cycle.valid(s)&&s.events.every(e=>e.academicEvidence===false);
 const prefix=(a,b)=>a.revision<=b.revision&&a.events.length<=b.events.length&&a.events.every((e,i)=>same(e,b.events[i]));
 const validBox=b=>b&&b.schema===1&&rev(b.remoteRevision)&&validSnapshot(b.snapshot)&&typeof b.dirty==="boolean"&&(b.pending===null||b.pending&&typeof b.pending.id==="string"&&b.pending.expected===b.remoteRevision&&b.dirty===true&&validSnapshot(b.pending.snapshot)&&prefix(b.pending.snapshot,b.snapshot));
 if(raw!==null){box=JSON.parse(raw);if(!validBox(box))throw Error("stored checkpoint invalid; not overwritten")}
 function write(next){if(storage.getItem(key)!==raw)throw Error("local conflict");if(!validBox(next))throw Error("invalid checkpoint");const value=JSON.stringify(next);storage.setItem(key,value);raw=value;box=next}
 function remoteShape(r){if(!r||!rev(r.revision)||!(r.revision===0&&r.snapshot===null||r.revision>0&&validSnapshot(r.snapshot)))throw Error("invalid remote checkpoint");return r}
 async function open(){if(busy)throw Error("sync busy");busy=true;try{let fetched;try{fetched=await transport.load()}catch(err){if(box)return {status:"offline",snapshot:clone(box.snapshot),remoteRevision:box.remoteRevision};throw err}const r=remoteShape(fetched);
 if(box&&(box.dirty||box.pending))return {status:r.revision===box.remoteRevision?"pending":"needs_reconcile",snapshot:clone(box.snapshot),remoteRevision:r.revision};
 if(box&&(r.revision<box.remoteRevision||r.revision===box.remoteRevision&&r.snapshot!==null&&!same(r.snapshot,box.snapshot)))return {status:"needs_reconcile",snapshot:clone(box.snapshot),remoteRevision:r.revision};
 const snapshot=r.snapshot===null?cycle.fresh():r.snapshot;write({schema:1,remoteRevision:r.revision,snapshot:clone(snapshot),dirty:false,pending:null});return {status:"ready",snapshot:clone(snapshot),remoteRevision:r.revision}}finally{busy=false}}
 function save(next){if(!box)throw Error("open first");if(same(next,box.snapshot))return;if(!validSnapshot(next)||next.revision<=box.snapshot.revision||next.events.length<box.snapshot.events.length||!box.snapshot.events.every((e,i)=>same(e,next.events[i])))throw Error("invalid or regressive snapshot");write({...box,snapshot:clone(next),dirty:true})}
 async function flush(){if(busy)return {status:"busy"};if(!box)throw Error("open first");if(!box.dirty&&!box.pending)return {status:"clean",revision:box.remoteRevision};busy=true;
 try{if(!box.pending)write({...box,pending:{id:newId(),expected:box.remoteRevision,snapshot:clone(box.snapshot)}});
 const p=clone(box.pending);let a;try{a=await transport.commit(p)}catch{return {status:"pending"}}
 if(a?.ok===false&&a.reason==="conflict")return {status:"conflict",revision:a.revision};
 if(a?.ok===false)return {status:"rejected",reason:a.reason||"unknown"};
 if(!a?.ok||a.revision!==p.expected+1)return {status:"pending"};
 write({...box,remoteRevision:a.revision,pending:null,dirty:!same(box.snapshot,p.snapshot)});return {status:box.dirty?"pending":"saved",revision:a.revision};
 }finally{busy=false}}
 function inspect(){return box?clone(box):null}
 // No silent overwrite or reset. Conflict must be resolved outside this adapter.
 return Object.freeze({open,save,flush,inspect,stream:STREAM});
}
const api=Object.freeze({createSync,STREAM});if(typeof module==="object"&&module.exports)module.exports=api;else root.HitzBiraCycleSync=api;
})(typeof window==="object"?window:globalThis);
