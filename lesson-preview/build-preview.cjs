'use strict';
const fs=require('node:fs'),path=require('node:path');
const here=__dirname,root=path.join(here,'..'),read=p=>fs.readFileSync(path.join(here,p),'utf8');
let html=read('index.html').replace('<link rel="stylesheet" href="lesson.css">',`<style>${read('lesson.css')}</style>`).replace('<script src="lesson-model.js"></script>',`<script>${read('lesson-model.js')}</script>`).replace('<script src="lesson.js"></script>',`<script>${read('lesson.js')}</script>`);
// Replace the relative images in the application source too, so the deployed preview has no external dependencies.
for(const name of ['bira_00_ongietorria_v02.svg','bira_02_jakin-mina_v02.svg','bira_08_poztasun-lasaia_v02.svg']){
 const data='data:image/svg+xml;base64,'+fs.readFileSync(path.join(root,'assets/bira',name)).toString('base64');
 html=html.replaceAll(`"${name}"`,JSON.stringify(data));
}
html=html.replace('src="../assets/bira/${poses[pose]}"','src="${poses[pose]}"');
html=html.replace('../favicon.svg','data:image/svg+xml;base64,'+fs.readFileSync(path.join(root,'favicon.svg')).toString('base64'));
// Optional local font is deliberately removed: system fonts work offline on all target devices.
html=html.replace(/@font-face\{[^}]+\}/,'');
const worker=`const HTML=${JSON.stringify(html)};\nexport default {async fetch(request){const url=new URL(request.url);if(url.pathname!=="/"&&url.pathname!=="/index.html")return new Response("Not found",{status:404});return new Response(request.method==="HEAD"?null:HTML,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer","Content-Security-Policy":"default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'"}})}};\n`;
fs.writeFileSync(path.join(here,'preview-worker.mjs'),worker);console.log(JSON.stringify({htmlBytes:Buffer.byteLength(html),workerBytes:Buffer.byteLength(worker)}));
