// Original vector compositions extending the existing forest palette and geometry.
// Narrative references: docs/SCENE_INVENTORY_2.14.0.json. No new story events.
const fs=require('node:fs'),path=require('node:path');
const out=path.join(__dirname,'../assets/scenes');
const rect=(x,y,w,h,c,r=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`;
const line=(d,c='#755444',w=8)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const fill=(d,c)=>`<path d="${d}" fill="${c}"/>`;
const circle=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
const paper=(x,y)=>`<g transform="translate(${x} ${y})">${rect(0,0,140,95,'#fff5d7',8)}${line('M20 24h92m-92 20h70m-70 20h85','#ad9369',5)}</g>`;
const key=(x,y)=>`<g transform="translate(${x} ${y}) rotate(-15)">${circle(0,0,22,'#d4a44b')}${circle(0,0,10,'#fff5d7')}${line('M20 0h70m-22 0v16m18-16v16','#d4a44b',12)}</g>`;
const chest=(open=false)=>rect(0,45,220,100,'#9a7056',12)+rect(18,60,184,70,'#755444',6)+rect(100,48,22,45,'#e5c16d',3)+(open?fill('M0 35 25-30 235-30 220 35Z','#b98b64')+line('M20 18h185','#e5c16d',5):rect(0,10,220,40,'#b98b64',9));
const box=(x,y,open)=>`<g transform="translate(${x} ${y})">${chest(open)}</g>`;
const mirror=(x,y)=>`<g transform="translate(${x} ${y})">${circle(0,0,43,'#c5a15b')}${circle(0,0,33,'#cce8e9')}${line('M30 32l36 43','#c5a15b',16)}${line('M-16-9 9-22m-22 39 35-35','#fff5d7',5)}</g>`;
const comb=(x,y)=>`<g transform="translate(${x} ${y}) rotate(-10)">${rect(0,0,150,18,'#c4d4d8',7)}${Array.from({length:10},(_,i)=>rect(8+i*14,12,6,43,'#c4d4d8',3)).join('')}</g>`;
const hills=rect(0,0,960,420,'#dce9dc')+circle(790,76,45,'#ffdc79')+fill('M0 235 170 60 330 235 520 35 760 235 960 100V420H0Z','#8faf9a')+fill('M0 305Q250 180 500 290T960 240V420H0Z','#668d72');
const river=fill('M0 340Q240 240 450 340T960 300V420H0Z','#79b3bf')+line('M30 367q120-35 230-10m370 25q130-25 260-15','#cce8e9',5);
const house=(x,y)=>`<g transform="translate(${x} ${y})">${rect(0,65,300,180,'#d8c5a5',6)}${fill('M-25 70 150-35 325 70Z','#8b5247')}${rect(115,135,75,110,'#705744',7)}${circle(175,191,5,'#e5c16d')}${rect(28,105,55,65,'#f4d88b',3)}${rect(220,105,55,65,'#f4d88b',3)}${line('M55 105v65m192-65v65','#a17e59',4)}</g>`;
const room=rect(0,0,960,420,'#455b59')+fill('M0 0 120 420H0M960 0 840 420H960Z','#344a48')+fill('M0 335 960 300V420H0Z','#755f50')+rect(690,35,155,145,'#f6d99c',8)+line('M768 35v145m-78-72h155','#755444',8)+fill('M690 180 390 420H900L845 180Z','#f6d99c33');
const wheel=(x,y)=>`<g transform="translate(${x} ${y})">${circle(0,0,115,'#a8bb9f')}${line('M0-115V115M-115 0H115M-82-82 82 82M82-82-82 82','#8c704e',14)}<circle r="115" fill="none" stroke="#b78e62" stroke-width="20"/>${circle(0,0,20,'#755444')}</g>`;
const pipe=(d)=>line(d,'#91a09d',30)+line(d,'#c4d4d8',8);
const bridge=line('M210 295h520M250 295v90m440-90v90M250 365q220-190 440 0','#b89b74',25);
const map=(x,y)=>`<g transform="translate(${x} ${y}) rotate(-7)">${rect(0,0,280,170,'#fff5d7',10)}${line('M25 130 90 65 160 105 245 30','#79b3bf',13)}${line('M30 30 90 65 160 105 240 130','#9a7056',5)}${circle(160,105,13,'#8b5247')}${line('M153 98l14 14m0-14-14 14','#fff5d7',3)}</g>`;
const fountain=(water)=>rect(0,130,290,45,'#a6a69b',15)+rect(60,0,165,140,'#d8c9ac',9)+pipe('M112 55h85v28h-30v30')+(water?line('M167 115q0 38 55 41','#69aab8',13):'');
const scenes={
 SHELTER:[
  hills+house(480,95)+fill('M90 420Q240 290 590 340','#d8c5a5')+line('M65 40l-20 48m110-50-20 48m100-50-20 48m520-50-20 48m110-50-20 48','#e3eff0',7),
  rect(0,0,960,420,'#d8c5a5')+rect(320,0,320,420,'#705744',20)+line('M365 20v380m50-380v380m50-380v380m50-380v380m50-380v380','#88674f',5)+circle(590,220,15,'#e5c16d')+fill('M0 340 960 325V420H0Z','#9b9985')+key(375,368),
  room+box(360,235,true)+paper(350,260)+paper(565,255),
  room+rect(35,30,220,360,'#b8cdd0',6)+fill('M35 30 135 70V390H35Z','#705744')+box(405,220,true)+paper(680,260),
  hills+house(25,115)+river+map(520,220)+paper(730,300)
 ],
 MIRROR:[
  hills+river+fill('M340 325Q365 225 490 250L540 350Z','#a6a69b')+mirror(465,260),
  hills+river+box(550,235,true)+comb(350,255),
  hills+river+fill('M590 300Q580 65 735 65T910 300Z','#7d8183')+fill('M650 300V210a85 85 0 0 1 170 0v90Z','#39474b')+`<g transform="translate(-90 0) scale(.75 1)">${bridge}</g>`,
  rect(0,0,960,420,'#39474b')+fill('M0 0 150 420H0M960 0 810 420H960Z','#586866')+fill('M0 360Q450 250 960 350V420H0Z','#69aab8')+mirror(460,230)+comb(590,255)+box(160,235,true),
  hills+river+fill('M220 335Q270 265 410 300L460 360Z','#a6a69b')+mirror(345,281)+comb(510,300)+circle(740,265,10,'#fff5d7')+line('M740 243v-9m22 31h9m-31 22v9','#fff5d7',4)
 ],
 CAUSE:[
  hills+`<g transform="translate(130 180)">${fountain(false)}</g>`+pipe('M565 355V245h125m45 0h110')+line('M695 225l22 22-22 22','#ffdc79',6),
  hills+house(430,115)+wheel(810,275)+key(195,265)+circle(195,265,5,'#8c704e'),
  room+wheel(305,210)+pipe('M505 330h255V225')+circle(760,265,30,'#756f65')+circle(743,283,20,'#a6a69b'),
  hills+river+bridge+map(30,220)+pipe('M650 385h230')+circle(775,375,25,'#7d8183')+circle(820,374,19,'#a6a69b'),
  hills+house(620,100)+wheel(905,275)+`<g transform="translate(200 180)">${fountain(true)}</g>`+river+line('M367 295q0 60 60 75','#cce8e9',12)
 ]
};
for(const [family,compositions] of Object.entries(scenes))compositions.forEach((body,i)=>{
 const id=`HB-EP-${family}-0${i+1}`;
 fs.writeFileSync(path.join(out,id+'.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 420">${body}</svg>\n`);
});
