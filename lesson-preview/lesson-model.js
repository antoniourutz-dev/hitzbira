/* One reviewable lesson. Preview activity never enters the production evidence ledger. */
(function(root){
  "use strict";
  const VERSION=1,KEY="hitzbira-lesson-design-preview-v1";
  const questions=Object.freeze([
    {scene:"book",prompt:"Zein da Biraren liburua?",answer:"Liburu gorria",options:["Liburu urdina","Liburu gorria","Etxe handia"],why:"Gorria da irudiko liburua. Liburu hitzak objektua adierazten du; gorria hitzak, haren ezaugarria.",hint:"Begiratu koloreari: gorria da."},
    {scene:"house",prompt:"Nolakoa da irudiko etxea?",answer:"Etxe handia",options:["Etxe handia","Etxe txikia","Liburu gorria"],why:"Irudian etxe handia dago nabarmenduta. Eredu honetan ere izena dator lehenik: etxe handia.",hint:"Bi etxeetatik handiena dago nabarmenduta."}
  ]);
  function fresh(){return {version:VERSION,stage:"model",question:0,answers:[],draft:"",transfer:null,modelSeen:false,hintUsed:false,finished:false}}
  function restore(raw){
    try{const x=typeof raw==="string"?JSON.parse(raw):raw;if(!x||x.version!==VERSION)return fresh();
      const s=fresh();s.modelSeen=x.modelSeen===true;s.hintUsed=x.hintUsed===true;s.draft=typeof x.draft==="string"?x.draft.slice(0,300):"";
      s.answers=Array.isArray(x.answers)?x.answers.slice(0,2).map((a,i)=>a&&questions[i].options.includes(a.answer)?{answer:a.answer,match:a.answer===questions[i].answer,assisted:true}:null):[];
      while(s.answers.length&&s.answers.at(-1)===null)s.answers.pop();if(s.answers.some(a=>!a))return fresh();
      if(s.answers.length&&!s.modelSeen)return fresh();
      s.question=x.question===0&&s.answers.length<2?0:Math.min(1,s.answers.length);
      if(s.answers.length===2&&x.transfer&&typeof x.transfer.answer==="string"&&x.transfer.answer.trim())s.transfer=evaluate(x.transfer.answer,s.hintUsed);
      s.finished=x.finished===true&&s.answers.length===2&&!!s.transfer;
      s.stage=s.finished?"summary":s.answers.length===2&&x.stage!=="practice"?"transfer":s.modelSeen?"practice":"model";
      return s;
    }catch{return fresh()}
  }
  function normalize(s){return String(s).normalize("NFC").toLocaleLowerCase("eu").trim().replace(/[.!?]+$/u,"").replace(/\s+/g," ")}
  function evaluate(answer,assisted){const text=String(answer).trim().slice(0,300),n=normalize(text);return {answer:text,result:["liburu gorria","liburu gorria hartu dut"].includes(n)?"model_match":"unverified",assisted:!!assisted}}
  function begin(s){if(s.stage!=="model")return false;s.modelSeen=true;s.stage="practice";return true}
  function choose(s,answer){if(s.stage!=="practice"||s.answers[s.question]||!questions[s.question].options.includes(answer))return false;s.answers[s.question]={answer,match:answer===questions[s.question].answer,assisted:true};return true}
  function advance(s){if(s.stage!=="practice"||!s.answers[s.question])return false;if(s.question===0)s.question=1;else s.stage="transfer";return true}
  function submit(s,text){if(s.stage!=="transfer"||s.transfer||!String(text).trim())return false;s.draft=String(text).trim().slice(0,300);s.transfer=evaluate(s.draft,s.hintUsed);return true}
  function finish(s){if(s.stage!=="transfer"||!s.transfer)return false;s.finished=true;s.stage="summary";return true}
  function step(s){return s.stage==="model"?0:s.stage==="practice"?1:s.stage==="transfer"?2:3}
  const api=Object.freeze({VERSION,KEY,questions,fresh,restore,normalize,evaluate,begin,choose,advance,submit,finish,step});
  if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.HBLesson=api;
})(typeof window!=="undefined"?window:globalThis);
