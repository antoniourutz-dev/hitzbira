/* No real learner data or answer keys. Run with npm test. */
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const api={...require("../learning/cycle.js"),...require("../learning/sync.js")};
const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,"../core.js"),"utf8")+"\nwindow.__deps={base:window.HitzBiraCurriculum,createAdaptive,createSpaced};",context);
const units=[
  {
    "id": "HB-GOLD-A1-001",
    "version": "0.2",
    "node": "V-0",
    "level": "A1",
    "status": "lab_candidate",
    "publicationAllowed": false,
    "enrollment": "auto",
    "objectives": [
      {
        "node": "V-0",
        "capabilityVersionId": "6e018414-539a-4322-9a3f-dff8e5b88c50"
      }
    ],
    "lesson": [
      "Synthetic fixture only"
    ],
    "items": [
      {
        "id": "D01",
        "version": "0.2",
        "phase": "diagnostic",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "D02",
        "version": "0.2",
        "phase": "diagnostic",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "D03",
        "version": "0.2",
        "phase": "diagnostic",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P01",
        "version": "0.2",
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P02",
        "version": "0.2",
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P03",
        "version": "0.2",
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P04",
        "version": "0.2",
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P05",
        "version": "0.2",
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P06",
        "version": "0.2",
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P07",
        "version": "0.2",
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P08",
        "version": "0.2",
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P09",
        "version": "0.2",
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P10",
        "version": "0.2",
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P11",
        "version": "0.2",
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P12",
        "version": "0.2",
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      }
    ]
  },
  {
    "id": "HB-LAB-IZE-001",
    "version": "0.1",
    "node": "IZE-1",
    "level": "A1 hautagaia",
    "status": "lab_candidate",
    "publicationAllowed": false,
    "enrollment": "auto",
    "objectives": [
      {
        "node": "IZE-1",
        "capabilityVersionId": "24fddc4f-7cfb-4495-b305-114d4cc121dd"
      }
    ],
    "lesson": [
      "Synthetic fixture only"
    ],
    "items": [
      {
        "id": "GB-ize-01",
        "version": "0.5",
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "GB-ize-02",
        "version": "0.5",
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "GB-ize-03",
        "version": "0.5",
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      }
    ]
  },
  {
    "id": "HB-GOLD-B1-001",
    "version": "0.2",
    "level": "B1 hautagaia",
    "status": "lab_candidate",
    "publicationAllowed": false,
    "enrollment": "manual",
    "objectives": [
      {
        "node": "V-1",
        "capabilityVersionId": "4b74f423-0c4c-4567-ba87-0c1a8eab638a",
        "coverage": "partial_past_aspect_no_future_dative"
      },
      {
        "node": "DEN-1",
        "capabilityVersionId": "2d7dfa06-0b1d-40a2-9dd0-910a43740bb9",
        "coverage": "candidate_practice_only"
      },
      {
        "node": "KAU-1",
        "capabilityVersionId": "36176776-6175-4e24-a83d-ba423d0caac9",
        "coverage": "candidate_practice_only"
      }
    ],
    "lesson": [
      "Synthetic fixture only"
    ],
    "items": [
      {
        "id": "D01",
        "version": "0.2",
        "node": "V-1",
        "capabilityVersionId": "4b74f423-0c4c-4567-ba87-0c1a8eab638a",
        "criteria": [
          "V-1.01"
        ],
        "phase": "diagnostic",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "D02",
        "version": "0.2",
        "node": "DEN-1",
        "capabilityVersionId": "2d7dfa06-0b1d-40a2-9dd0-910a43740bb9",
        "criteria": [
          "DEN-1.03"
        ],
        "phase": "diagnostic",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "D03",
        "version": "0.2",
        "node": "KAU-1",
        "capabilityVersionId": "36176776-6175-4e24-a83d-ba423d0caac9",
        "criteria": [
          "KAU-1.01"
        ],
        "phase": "diagnostic",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P01",
        "version": "0.2",
        "node": "V-1",
        "capabilityVersionId": "4b74f423-0c4c-4567-ba87-0c1a8eab638a",
        "criteria": [
          "V-1.01"
        ],
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P02",
        "version": "0.2",
        "node": "V-1",
        "capabilityVersionId": "4b74f423-0c4c-4567-ba87-0c1a8eab638a",
        "criteria": [
          "V-1.01"
        ],
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P03",
        "version": "0.2",
        "node": "V-1",
        "capabilityVersionId": "4b74f423-0c4c-4567-ba87-0c1a8eab638a",
        "criteria": [
          "V-1.01"
        ],
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P04",
        "version": "0.2",
        "node": "V-1",
        "capabilityVersionId": "4b74f423-0c4c-4567-ba87-0c1a8eab638a",
        "criteria": [
          "V-1.01"
        ],
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P05",
        "version": "0.2",
        "node": "DEN-1",
        "capabilityVersionId": "2d7dfa06-0b1d-40a2-9dd0-910a43740bb9",
        "criteria": [
          "DEN-1.01",
          "DEN-1.03"
        ],
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P06",
        "version": "0.2",
        "node": "DEN-1",
        "capabilityVersionId": "2d7dfa06-0b1d-40a2-9dd0-910a43740bb9",
        "criteria": [
          "DEN-1.01",
          "DEN-1.03"
        ],
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P07",
        "version": "0.2",
        "node": "DEN-1",
        "capabilityVersionId": "2d7dfa06-0b1d-40a2-9dd0-910a43740bb9",
        "criteria": [
          "DEN-1.02"
        ],
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P08",
        "version": "0.2",
        "node": "DEN-1",
        "capabilityVersionId": "2d7dfa06-0b1d-40a2-9dd0-910a43740bb9",
        "criteria": [
          "DEN-1.01",
          "DEN-1.03"
        ],
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P09",
        "version": "0.2",
        "node": "KAU-1",
        "capabilityVersionId": "36176776-6175-4e24-a83d-ba423d0caac9",
        "criteria": [
          "KAU-1.02"
        ],
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P10",
        "version": "0.2",
        "node": "KAU-1",
        "capabilityVersionId": "36176776-6175-4e24-a83d-ba423d0caac9",
        "criteria": [
          "KAU-1.01"
        ],
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P11",
        "version": "0.2",
        "node": "KAU-1",
        "capabilityVersionId": "36176776-6175-4e24-a83d-ba423d0caac9",
        "criteria": [
          "KAU-1.03",
          "KAU-1.01"
        ],
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      },
      {
        "id": "P12",
        "version": "0.2",
        "node": "KAU-1",
        "capabilityVersionId": "36176776-6175-4e24-a83d-ba423d0caac9",
        "criteria": [
          "KAU-1.02",
          "KAU-1.03"
        ],
        "phase": "practice",
        "kind": "choice",
        "prompt": "Synthetic test only",
        "keys": [
          "TEST_MATCH"
        ],
        "options": [
          "TEST_MISMATCH",
          "TEST_MATCH"
        ],
        "writePrompt": null
      }
    ]
  },
  {
    "id": "HB-GOLD-C1-001",
    "version": "0.1",
    "node": "KON-3",
    "level": "C1",
    "status": "content_pending",
    "publicationAllowed": false,
    "enrollment": "auto",
    "objectives": [
      {
        "node": "KON-3",
        "capabilityVersionId": "b509c9df-6d95-45c6-87ac-31ced9f61215"
      }
    ],
    "lesson": [
      "Synthetic fixture only"
    ],
    "items": []
  }
];
const suite=async function(api,deps,units){
 const g=api.createCycle(units,deps.base,deps),results=[],ck=(name,value)=>results.push({name,pass:!!value});
 ck("57 nodes",deps.base.nodes.length===57);ck("33 practice/diagnostic items",g.all.size===33);ck("B1 three routes",g.G.get("HB-GOLD-B1-001").routes.size===3);ck("C1 blocked",!g.G.has("HB-GOLD-C1-001"));ck("no reserved",![...g.all.values()].some(x=>/^[RT]\d/.test(x.x.id)));
 let invalid=false;try{api.createCycle(units.map(u=>({...u,enrollment:undefined})),deps.base,deps)}catch{invalid=true}ck("explicit enrollment required",invalid);
 const now=1795680000000;let id=0,s=g.start(g.fresh(),{id:"synthetic-session",now,budget:6});
 ck("default starts A1",s.session.primary==="HB-GOLD-A1-001");ck("B1 voluntary",g.start(g.fresh(),{id:"synthetic-b1",now,budget:6,focus:"HB-GOLD-B1-001"}).session.primary==="HB-GOLD-B1-001");
 for(let i=0;i<3;i++){const x=g.all.get(s.session.current.key).x;const z=g.submit(s,{id:"event-"+(++id),at:now+id,response:x.keys[0]});s=g.close(z.s,now+id)}
 s=g.learn(s,now);let x=g.all.get(s.session.current.key).x;s=g.close(g.submit(s,{id:"event-"+(++id),at:now+id,response:x.keys[0]}).s,now+id);
 ck("A1 practice",g.profile(s,"HB-GOLD-A1-001",now).worked===1);ck("no academic evidence",s.events.every(e=>e.academicEvidence===false));ck("valid snapshot",g.valid(s));
 const memory=()=>{let m=new Map();return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,v)}};let remote={revision:0,snapshot:null},acks=new Map(),fail=false,loseAck=false,seq=0,reject=false;
 const transport={load:async()=>{if(fail)throw Error("offline");return JSON.parse(JSON.stringify(remote))},commit:async p=>{if(fail)throw Error("offline");if(reject)return {ok:false,reason:"invalid"};if(acks.has(p.id))return acks.get(p.id);if(p.expected!==remote.revision)return {ok:false,reason:"conflict",revision:remote.revision};remote={revision:p.expected+1,snapshot:JSON.parse(JSON.stringify(p.snapshot))};const ack={ok:true,revision:remote.revision};acks.set(p.id,ack);if(loseAck){loseAck=false;throw Error("lost ack")}return ack}};
 const store=memory(),key="hitzbira-cycle-v1::hb::synthetic-account",syncer=()=>api.createSync({storage:store,key,transport,cycle:g,newId:()=>"checkpoint-"+(++seq)});
 let c=syncer();ck("initial open",(await c.open()).status==="ready");c.save(s);fail=true;ck("offline durable",(await c.flush()).status==="pending"&&c.inspect().pending!==null);
 ck("offline open retains history",(await c.open()).status==="offline");const oldPending=c.inspect().pending.id,paused=g.pause(s);c.save(paused);
 ck("latest separate from frozen pending",c.inspect().snapshot.session.paused&&!c.inspect().pending.snapshot.session.paused);c=syncer();ck("reload pending retained",c.inspect().pending.id===oldPending);fail=false;loseAck=true;
 ck("lost ack retained",(await c.flush()).status==="pending"&&remote.revision===1);ck("retry same id",(await c.flush()).status==="pending"&&remote.revision===1);ck("next checkpoint saved",(await c.flush()).status==="saved"&&remote.revision===2&&remote.snapshot.session.paused);
 const otherStore=memory(),other=api.createSync({storage:otherStore,key,transport,cycle:g,newId:()=>"checkpoint-"+(++seq)});ck("other device load",(await other.open()).snapshot.session.paused===true);const resumed=g.resume(paused);other.save(resumed);
 reject=true;ck("permanent rejection separate",(await other.flush()).status==="rejected"&&other.inspect().pending!==null);reject=false;ck("other device commit",(await other.flush()).status==="saved"&&remote.revision===3);
 c.save(g.end(paused));ck("stale conflict",(await c.flush()).status==="conflict"&&remote.revision===3);ck("local conflicting history preserved",c.inspect().pending!==null&&c.inspect().snapshot.session===null);ck("open conflict no overwrite",(await c.open()).status==="needs_reconcile");
 invalid=false;try{c.save(g.fresh())}catch{invalid=true}ck("regression blocked",invalid);invalid=false;try{api.createSync({storage:store,key:"guest",transport,cycle:g,newId:()=>""})}catch{invalid=true}ck("guest key blocked",invalid);
 const saved=JSON.parse(JSON.stringify(remote));remote={revision:0,snapshot:null};ck("remote reset cannot erase clean local",(await other.open()).status==="needs_reconcile"&&other.inspect().snapshot.session.paused===false);remote=saved;
 const reordered=JSON.parse(JSON.stringify(other.inspect().snapshot));reordered.events=reordered.events.map(e=>Object.fromEntries(Object.entries(e).reverse()));other.save(reordered);ck("semantic key order ignored",!other.inspect().dirty);
 return results;
};
suite(api,context.window.__deps,units).then(r=>{for(const c of r)if(!c.pass)throw Error(c.name);console.log("common-cycle: "+r.length+" checks passed")}).catch(e=>{console.error(e);process.exitCode=1});
