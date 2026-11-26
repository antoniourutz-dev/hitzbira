"use strict";
// Internal editorial reference only. No production route, no learner state, no keys.
const manifest=Object.freeze({
  "id": "HB-GOLD-C1-001",
  "version": "0.1",
  "title": "Kontrako argudioa onartu, iritzia mantendu",
  "status": "review_candidate",
  "publicationAllowed": false,
  "objectives": [
    {
      "node": "KON-3",
      "capabilityVersionId": "b509c9df-6d95-45c6-87ac-31ced9f61215"
    },
    {
      "node": "KON-2",
      "capabilityVersionId": "f40f6b54-9e34-4226-b45b-de7374b21c70"
    },
    {
      "node": "JOS-2",
      "capabilityVersionId": "bc6ba2bb-94b7-4a49-93d8-50f57b9603a1"
    },
    {
      "node": "LOK-2",
      "capabilityVersionId": "5307c1a3-0ff6-493b-b774-dcb3d50aef88"
    }
  ],
  "practiceRefs": [
    {
      "bank": "bank07",
      "id": "HB07-kon-1",
      "node": "KON-2",
      "criterion": "KON-2.01"
    },
    {
      "bank": "bank07",
      "id": "HB07-kon-2",
      "node": "KON-2",
      "criterion": "KON-2.01"
    },
    {
      "bank": "bank07",
      "id": "HB07-kon-4",
      "node": "KON-2",
      "criterion": "KON-2.02"
    },
    {
      "bank": "bank07",
      "id": "HB07-kon-6",
      "node": "KON-3",
      "criterion": "KON-3.01"
    },
    {
      "bank": "bank08",
      "id": "HB08-jos-02",
      "node": "JOS-2",
      "criterion": "JOS-2.01"
    },
    {
      "bank": "bank08",
      "id": "HB08-jos-04",
      "node": "JOS-2",
      "criterion": "JOS-2.01"
    },
    {
      "bank": "bank08",
      "id": "HB08-lok-06",
      "node": "LOK-2",
      "criterion": "LOK-2.01"
    }
  ],
  "editorialActivityCode": "DRAFT-HB-GOLD-C1-001-PARA-01"
});
async function loadReview({curriculum,readBank,readEditorialDraft}){
 if(typeof readBank!=="function"||typeof readEditorialDraft!=="function")throw Error("review providers required");
 for(const o of manifest.objectives)if(curriculum.get(o.node)?.vid!==o.capabilityVersionId)throw Error("capability version mismatch: "+o.node);
 const banks=new Map();for(const name of new Set(manifest.practiceRefs.map(x=>x.bank)))banks.set(name,await readBank(name));
 const items=manifest.practiceRefs.map(r=>{
 const matches=banks.get(r.bank)?.cards?.filter(x=>x.id===r.id)||[];
 if(matches.length!==1||typeof matches[0].prompt!=="string")throw Error("missing or duplicate source: "+r.id);
 const card=matches[0];return {sourceBank:r.bank,sourceId:r.id,sourceStatus:card.status??null,node:r.node,capabilityVersionId:manifest.objectives.find(o=>o.node===r.node).capabilityVersionId,criterion:r.criterion,prompt:card.prompt,mechanism:"guided_review",academicEvidence:false,publicationAllowed:false};
 });
 const draft=await readEditorialDraft(manifest.editorialActivityCode);
 if(!draft||draft.code!==manifest.editorialActivityCode||draft.revision!==1||draft.status!=="draft"||draft.publicationAllowed!==false||draft.pilotReleases!==0||typeof draft.itemId!=="string"||typeof draft.versionId!=="string")throw Error("editorial draft unavailable or changed");
 return {id:manifest.id,version:manifest.version,status:"review_candidate",publicationAllowed:false,academicEvidence:false,items,editorial:{code:draft.code,revision:draft.revision,versionId:draft.versionId,itemId:draft.itemId,reviewMode:"human_review_pending",publicationAllowed:false,academicEvidence:false},routes:Object.fromEntries(manifest.objectives.map(o=>[o.node,items.filter(i=>i.node===o.node).map(i=>i.sourceId)]))};
}
// HBData.grammar already resolves the existing remote bank with local fallback.
// This adapter deliberately does not claim remote provenance from isRemote().
function legacyProvider(data){if(typeof data?.grammar!=="function")throw Error("HBData unavailable");return name=>data.grammar(name)}
module.exports={manifest,loadReview,legacyProvider};
