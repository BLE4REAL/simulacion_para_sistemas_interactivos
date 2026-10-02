'use strict';
const canvas=document.querySelector('#stage'),ctx=canvas.getContext('2d');
const $=s=>document.querySelector(s),TAU=Math.PI*2,N=360;
const network=typeof LivingNetwork==='undefined'?null:new LivingNetwork();
let W=Math.max(1,innerWidth||1280),H=Math.max(1,innerHeight||720),agents=[],mode=0,energy=.58,tick=0,pulse=null;
let pointer={x:W*.55,y:H*.48,down:false,inside:false},playing=false,elapsed=0,last=0,acc=0,objectURL=null;
let forceStats={neighbors:0,maxSpeed:0};
let modeMix=[1,0,0];
const overlay=document.querySelector('#perception'),overlayCtx=overlay.getContext('2d');
let inspect=false,inspectedAgent=0,session=null,audioReady=false,audioName='',starting=false,runToken=0,recordURL=null;
const modes=[['Corriente','Filamentos vivos exploran y refuerzan sus rastros.'],['Compresión','Los agentes convergen hacia filamentos cercanos y engrosan la red.'],['Ruptura','La red pierde memoria y libera corrientes de chispas.']];
const heldGestures=new Set(),gestureNames=['Vórtice','Repulsión','Cortar','Contr giro','Reunir','Agitar','Abrir caminos'];
let trailMemory=0;
function refreshGestures(){document.querySelectorAll('[data-gesture]').forEach(b=>{const active=heldGestures.has(Number(b.dataset.gesture));b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});$('#gestureStatus').textContent=(heldGestures.size?[...heldGestures].map(i=>gestureNames[i]).join(' + '):'Mantén Q/W/E/T/G/Z/X y mueve el cursor')+' · memoria '+(trailMemory>0?'larga':trailMemory<0?'corta':'normal');}
function applyGesture(index,active=true){if(active===heldGestures.has(index))return;if(active)heldGestures.add(index);else heldGestures.delete(index);refreshGestures();record(active?'gesto_inicio':'gesto_fin',{valor:gestureNames[index]});}
function setMemory(value){trailMemory=value;refreshGestures();record('memoria',{valor:value});}
function clearGestures(){for(const i of [...heldGestures])applyGesture(i,false);}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function setEnergy(value,log=true){energy=clamp(Math.round(value*100)/100,0,1);$('#energy').value=String(Math.round(energy*100));$('#energyValue').textContent=`${Math.round(energy*100)} %`;if(log)record('energia',{valor:energy});}
function resize(){
 const width=innerWidth,height=innerHeight;
 // Docked browser panels can briefly report 0x0 while moving or collapsing.
 // Keep the last valid coordinate system instead of taking a modulo by zero.
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)return;
 W=width;H=height;const d=Math.min(1,1600/Math.max(W,H));canvas.width=W*d;canvas.height=H*d;overlay.width=W*d;overlay.height=H*d;ctx.setTransform(d,0,0,d,0,0);overlayCtx.setTransform(d,0,0,d,0,0);ctx.fillStyle='#08090d';ctx.fillRect(0,0,W,H);
 for(const a of agents){
  a.x=Number.isFinite(a.x)?(a.x%W+W)%W:W*(.3+Math.random()*.4);
  a.y=Number.isFinite(a.y)?(a.y%H+H)%H:H*(.3+Math.random()*.4);
  if(!Number.isFinite(a.vx)||!Number.isFinite(a.vy)){const angle=Math.random()*TAU;a.vx=Math.cos(angle)*2;a.vy=Math.sin(angle)*2;}
 }
}
function reset(){clearGestures();trailMemory=0;cancelCharge();cameraKick=0;stop('reinicio');if(network)network.reset(W,H);agents=Array.from({length:N},(_,i)=>{const a=Math.random()*TAU,r=Math.sqrt(Math.random())*Math.min(W,H)*.36;return{x:W*.57+Math.cos(a)*r,y:H*.47+Math.sin(a)*r,vx:Math.cos(a+1.4)*2,vy:Math.sin(a+1.4)*2,group:i%3};});tick=0;pulse=null;modeMix=[1,0,0];pointer.down=false;setMode(0);setEnergy(.4);elapsed=0;$('#clock').textContent='00:00';$('#timeProgress').style.width='0%';$('#sessionStatus').textContent='LISTO / 01:00';resize();}
function setMode(m){document.querySelectorAll('[data-gesture]').forEach(b=>{b.classList.toggle('active',false);b.setAttribute('aria-pressed','false');});$('#gestureStatus').textContent='Haz clic dentro de la visual y pulsa Q, W o E.';refreshGestures();mode=m;$('#modeName').textContent=modes[m][0];$('#modeDesc').textContent=modes[m][1];document.querySelectorAll('[data-mode]').forEach(b=>{b.classList.toggle('active',Number(b.dataset.mode)===m);b.setAttribute('aria-pressed',String(Number(b.dataset.mode)===m));});record('modo',{valor:modes[m][0]});}
let chargeStart=null,cameraKick=0;
document.addEventListener('keyup',e=>{if(e.code==='Space'||e.key===' '){e.preventDefault();releaseCharge();}});
window.addEventListener('blur',cancelCharge);
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelCharge();});
function beginCharge(){if(chargeStart===null)chargeStart=performance.now();}
$('#burst').addEventListener('pointerdown',e=>{beginCharge();e.currentTarget.setPointerCapture(e.pointerId);});
$('#burst').addEventListener('pointerup',releaseCharge);
$('#burst').addEventListener('pointercancel',cancelCharge);
function cancelCharge(){chargeStart=null;canvas.style.transform='';}
function releaseCharge(){if(chargeStart===null)return;const strength=1+Math.min(1,(performance.now()-chargeStart)/1400);chargeStart=null;burst(strength);$('#gestureStatus').textContent=`Descarga · ${Math.round(strength*100)} % de impulso`;}
function burst(strength=1){if(typeof strength!=='number')strength=1;strength=clamp(strength,1,2);cameraKick=strength;pulse={x:pointer.inside?pointer.x:W*.57,y:pointer.inside?pointer.y:H*.47,age:0,strength};record('estallido',{x:pulse.x/W,y:pulse.y/H,intensidad:strength});}
function steer(dx,dy,a,speed){const n=Math.hypot(dx,dy);return n>1e-6?[dx/n*speed-a.vx,dy/n*speed-a.vy]:[0,0];}
function step(transitionDt=1/60){
 const blend=1-Math.exp(-Math.min(transitionDt,.05)/.4);
 for(let k=0;k<3;k++)modeMix[k]+=((k===mode?1:0)-modeMix[k])*blend;
 const current=modeMix[0],compression=modeMix[1],rupture=modeMix[2];
 tick+=1/60;if(pulse){pulse.age+=1/60;if(pulse.age>1.25)pulse=null;}
 const cell=64,cols=Math.ceil(W/cell),rows=Math.ceil(H/cell),grid=new Map();
 const key=(x,y)=>y*cols+x;
 for(let i=0;i<N;i++){const a=agents[i],k=key(Math.floor(a.x/cell),Math.floor(a.y/cell));if(!grid.has(k))grid.set(k,[]);grid.get(k).push(i);}
 const next=new Array(N),speed=1.5+energy*4.4,radius=48+compression*14;let totalNeighbors=0,maxObserved=0;
 for(let i=0;i<N;i++){
  const a=agents[i],cx=Math.floor(a.x/cell),cy=Math.floor(a.y/cell);let sx=0,sy=0,ax=0,ay=0,px=0,py=0,count=0;
  // Only neighbors inside the perception radius contribute. Snapshot updates avoid ordering bias.
  for(let gy=Math.max(0,cy-1);gy<=Math.min(rows-1,cy+1);gy++)for(let gx=Math.max(0,cx-1);gx<=Math.min(cols-1,cx+1);gx++){
   for(const j of grid.get(key(gx,gy))||[]){if(i===j)continue;const b=agents[j],dx=b.x-a.x,dy=b.y-a.y,d2=dx*dx+dy*dy;if(d2>0&&d2<radius*radius){ax+=b.vx;ay+=b.vy;px+=dx;py+=dy;count++;if(d2<24*24){sx-=dx/d2;sy-=dy/d2;}}}
  }
  let fx=0,fy=0;
  function add(v,weight){fx+=v[0]*weight;fy+=v[1]*weight;}
  if(count){totalNeighbors+=count;add(steer(ax/count,ay/count,a,speed),.72-rupture*.50);add(steer(px/count,py/count,a,speed),.30+compression*1.35);if(sx||sy)add(steer(sx,sy,a,speed),1.25+rupture*1.55);}
  // Each agent samples the direction field only at its own position.
  const dx=(a.x-W*.57)/Math.min(W,H),dy=(a.y-H*.47)/Math.min(W,H);
  const theta=Math.atan2(dy,dx)+Math.PI/2+.48*Math.sin(a.x*.005+tick*.25)*Math.cos(a.y*.005-tick*.18);
  add(steer(Math.cos(theta),Math.sin(theta),a,speed),current*1.9+compression*.22+rupture*.5);
  if(pointer.down||heldGestures.size){const cx=pointer.inside?pointer.x:W*.57,cy=pointer.inside?pointer.y:H*.47,dx=cx-a.x,dy=cy-a.y,d=Math.hypot(dx,dy);if(d<420&&d>25){const weight=2*(1-d/420);if(pointer.down||heldGestures.has(4))add(steer(dx,dy,a,speed),weight*(heldGestures.has(4)?3:1));if(heldGestures.has(0))add(steer(-dy,dx,a,speed),weight*2.5);if(heldGestures.has(3))add(steer(dy,-dx,a,speed),weight*2.5);if(heldGestures.has(1))add(steer(-dx,-dy,a,speed),weight*3);if(heldGestures.has(5))add(steer(Math.sin(tick*21+i*1.7),Math.cos(tick*29+i*2.3),a,speed),weight*4);if(heldGestures.has(6))add(steer(sx,sy,a,speed),weight*3);}}
  let impulse=0;
  if(pulse){const dx=a.x-pulse.x,dy=a.y-pulse.y,d=Math.hypot(dx,dy),wave=pulse.age*560;if(Math.abs(d-wave)<115&&d>1){impulse=(1-Math.abs(d-wave)/115)*(pulse.strength||1);add(steer(dx,dy,a,speed*(1+impulse)),9*impulse);}}
  // Soft walls: each agent only reacts within a 65px margin.
  if(a.x<65)fx+=(65-a.x)*.16;if(a.x>W-65)fx-=(a.x-W+65)*.16;if(a.y<65)fy+=(65-a.y)*.16;if(a.y>H-65)fy-=(a.y-H+65)*.16;
  const f=Math.hypot(fx,fy),limit=(.10+energy*.22)*(1+3*impulse);if(f>limit){fx*=limit/f;fy*=limit/f;}
  const localSpeed=speed*(1+impulse);
  let vx=a.vx+fx,vy=a.vy+fy;const v=Math.hypot(vx,vy);if(v>localSpeed){vx*=localSpeed/v;vy*=localSpeed/v;}
  let x=a.x+vx,y=a.y+vy;if(x<0||x>W){vx=-vx;x=clamp(x,0,W);}if(y<0||y>H){vy=-vy;y=clamp(y,0,H);}
  next[i]={x,y,vx,vy,group:a.group,impulse};maxObserved=Math.max(maxObserved,Math.hypot(vx,vy));
 }
 // The luminous structure is the deposited trail, not drawn connections.
 if(network)network.update(mode,energy,pulse,{...pointer,x:pointer.inside?pointer.x:W*.57,y:pointer.inside?pointer.y:H*.47,vortex:heldGestures.has(0),repel:heldGestures.has(1),erase:heldGestures.has(2),reverse:heldGestures.has(3),gather:heldGestures.has(4),shake:heldGestures.has(5),explore:heldGestures.has(6),phase:tick,memory:trailMemory},W,H,transitionDt);
 cameraKick*=Math.exp(-transitionDt*9);
 const charge=chargeStart===null?0:Math.min(1,(performance.now()-chargeStart)/1400);
 canvas.style.transform=`translate(${Math.sin(tick*113)*cameraKick*3}px,${Math.cos(tick*137)*cameraKick*3}px) scale(${1+cameraKick*.018+charge*.012})`;
 if(chargeStart!==null)$('#gestureStatus').textContent=`Presión: ${Math.round(charge*100)} % · suelta Espacio`;
 ctx.globalCompositeOperation='source-over';ctx.fillStyle='#03060c';ctx.fillRect(0,0,W,H);
 if(network)network.draw(ctx,W,H,mode);
 ctx.globalCompositeOperation='lighter';const cool=[[238,250,255],[83,223,255],[117,138,255]],warm=[[255,243,189],[255,155,82],[255,79,46]];
 const palette=cool.map((c,i)=>`rgb(${c.map((v,k)=>Math.round(v*(1-rupture)+warm[i][k]*rupture)).join(',')})`);
 for(let group=0;group<3;group++){ctx.beginPath();ctx.strokeStyle=palette[group];ctx.globalAlpha=group===0?.78:.48;ctx.lineWidth=group===0?1.35:.85;for(let i=group;i<N;i+=3){ctx.moveTo(agents[i].x,agents[i].y);ctx.lineTo(next[i].x,next[i].y);}ctx.stroke();}
 ctx.beginPath();ctx.strokeStyle='#f0ffd3';ctx.globalAlpha=.85;ctx.lineWidth=2.3;for(let i=0;i<N;i++)if(next[i].impulse>.35){ctx.moveTo(agents[i].x,agents[i].y);ctx.lineTo(next[i].x,next[i].y);}ctx.stroke();
 ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';agents=next;forceStats={neighbors:totalNeighbors/N,maxSpeed:maxObserved};
}
function durationLimit(){return $('#durationMode').value==='full'&&Number.isFinite($('#audio').duration)&&$('#audio').duration>0?$('#audio').duration:60;}
function formatTime(t){return `${Math.floor(t/60).toString().padStart(2,'0')}:${Math.floor(t%60).toString().padStart(2,'0')}`;}
function updateDuration(){if(!playing)$('#sessionStatus').textContent='LISTO / '+formatTime(durationLimit());$('#trackRange').textContent='BLACK EYED PEAS · 00:00—'+formatTime(durationLimit());}
function readTime(){return Math.min(durationLimit(),$('#audio').src?$('#audio').currentTime:elapsed);}
function record(action,details={}){if(!playing||!session)return;session.eventos.push({segundo:Number(readTime().toFixed(3)),accion:action,...details});}
function stop(reason='manual'){
 runToken++;starting=false;$('#rehearse').disabled=false;
 if(playing&&session){elapsed=readTime();record('fin',{motivo:reason});session.duracion=Number(elapsed.toFixed(3));session.estado=reason;$('#export').disabled=false;$('#sessionStatus').textContent=reason==='minuto completo'?'MINUTO COMPLETO':`DETENIDO / ${Math.floor(elapsed)} s`;}
 playing=false;$('#durationMode').disabled=false;$('#audio').pause();$('#rehearse').textContent='Iniciar ensayo · P';
}
async function rehearse(){
 if(playing){stop();return;}if(starting)return;
 const audio=$('#audio');if(audio.src&&!audioReady){$('#audioStatus').textContent='Espera a que termine de cargar o elige otro audio';return;}
 const token=++runToken;starting=true;$('#rehearse').disabled=true;
 if(audio.src){audio.currentTime=0;try{await audio.play();}catch{if(token===runToken){starting=false;$('#rehearse').disabled=false;$('#audioStatus').textContent='No se pudo reproducir: elige un archivo MP3 o WAV válido';}return;}}
 if(token!==runToken)return;
 starting=false;$('#rehearse').disabled=false;elapsed=0;$('#clock').textContent='00:00';
 session={instrumento:'Sobrecarga',version:4,musica:audio.src?audioName:'Sin audio: ensayo de controles',objetivoSegundos:durationLimit(),inicio:new Date().toISOString(),pantalla:{ancho:W,alto:H},eventos:[]};
 playing=true;$('#durationMode').disabled=true;$('#export').disabled=true;record('inicio',{modo:modes[mode][0],energia:energy,agentes:N,agentesPhysarum:network?network.count:0});$('#rehearse').textContent='Detener ensayo · P';$('#sessionStatus').textContent=(audio.src?'ENSAYANDO / ':'SIN AUDIO / ')+formatTime(durationLimit());
}
function exportSession(){if(!session||playing)return;const text=JSON.stringify(session,null,2);if(recordURL)URL.revokeObjectURL(recordURL);recordURL=URL.createObjectURL(new Blob([text],{type:'application/json'}));$('#downloadRecord').href=recordURL;$('#downloadRecord').download=`sobrecarga-ensayo-${session.inicio.replace(/[:.]/g,'-')}.json`;$('#recordText').value=text;$('#recordSummary').textContent=`${session.duracion} s · ${session.eventos.length} eventos · ${session.musica}`;$('#recordDialog').showModal();}
function toggleInspect(){inspect=!inspect;$('#inspect').setAttribute('aria-pressed',String(inspect));$('#inspect').textContent=inspect?'Ocultar percepción · D':'Ver percepción · D';if(inspect){let distance=Infinity;agents.forEach((a,i)=>{const d=Math.hypot(a.x-W*.55,a.y-H*.5);if(d<distance){distance=d;inspectedAgent=i;}});}}
function drawPerception(){
 overlayCtx.clearRect(0,0,W,H);if(!inspect)return;const a=agents[inspectedAgent],r=48+modeMix[1]*14;
 overlayCtx.strokeStyle='#ffffff9a';overlayCtx.lineWidth=1;overlayCtx.setLineDash([3,4]);overlayCtx.beginPath();overlayCtx.arc(a.x,a.y,r,0,TAU);overlayCtx.stroke();overlayCtx.setLineDash([]);
 let n=0;overlayCtx.strokeStyle='#dfff76a0';overlayCtx.beginPath();for(const b of agents){if(b===a||Math.hypot(b.x-a.x,b.y-a.y)>=r)continue;n++;overlayCtx.moveTo(a.x,a.y);overlayCtx.lineTo(b.x,b.y);}overlayCtx.stroke();
 overlayCtx.fillStyle='#fff';overlayCtx.beginPath();overlayCtx.arc(a.x,a.y,4,0,TAU);overlayCtx.fill();overlayCtx.font='11px Arial';overlayCtx.fillText(`${n} vecinos · ${Math.round(r)} px`,clamp(a.x+r+8,10,W-135),clamp(a.y,20,H-20));
}
function frame(now){const realDt=last?Math.max(0,(now-last)/1000):1/60,dt=Math.min(realDt,.1);last=now;acc+=dt;if(!document.hidden&&acc>=1/60){step(dt);acc%=1/60;drawPerception();}if(playing){elapsed=Math.min(durationLimit(),$('#audio').src?$('#audio').currentTime:elapsed+realDt);$('#clock').textContent=`${Math.floor(elapsed/60).toString().padStart(2,'0')}:${Math.floor(elapsed%60).toString().padStart(2,'0')}`;$('#timeProgress').style.width=`${elapsed/durationLimit()*100}%`;if(elapsed>=durationLimit())stop($('#durationMode').value==='full'?'canción completa':'minuto completo');else if($('#audio').ended)stop('archivo terminado');}requestAnimationFrame(frame);}
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('#audioStatus').textContent='Usa F11 para pantalla completa';}}
function toggleUI(){document.body.classList.toggle('clean');$('#showUI').hidden=!document.body.classList.contains('clean');}
canvas.addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY;pointer.inside=true;});canvas.addEventListener('pointerdown',e=>{pointer.x=e.clientX;pointer.y=e.clientY;pointer.down=true;pointer.inside=true;canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointerup',()=>pointer.down=false);canvas.addEventListener('pointercancel',()=>pointer.down=false);canvas.addEventListener('pointerleave',()=>pointer.inside=false);window.addEventListener('blur',()=>pointer.down=false);
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(Number(b.dataset.mode)));document.querySelectorAll('[data-gesture]').forEach(b=>{b.addEventListener('pointerdown',e=>{applyGesture(Number(b.dataset.gesture));b.setPointerCapture(e.pointerId);});b.addEventListener('pointerup',()=>applyGesture(Number(b.dataset.gesture),false));b.addEventListener('pointercancel',()=>applyGesture(Number(b.dataset.gesture),false));});$('#burst').onclick=e=>{if(e.detail===0)burst();};$('#energy').oninput=e=>setEnergy(Number(e.target.value)/100,false);$('#energy').onchange=()=>record('energia',{valor:energy});$('#rehearse').onclick=rehearse;$('#full').onclick=fullscreen;$('#showUI').onclick=toggleUI;$('#inspect').onclick=toggleInspect;$('#export').onclick=exportSession;
$('#closeRecord').onclick=()=>$('#recordDialog').close();
$('#audioFile').onchange=e=>{const file=e.target.files[0];if(!file)return;stop('cambio de audio');audioReady=false;audioName=file.name;if(objectURL)URL.revokeObjectURL(objectURL);objectURL=URL.createObjectURL(file);$('#audio').src=objectURL;$('#audioStatus').textContent='Cargando audio…';};
$('#audio').addEventListener('loadedmetadata',()=>{audioReady=Number.isFinite($('#audio').duration)&&$('#audio').duration>0;$('#audioStatus').textContent=audioReady?(audioName+($('#audio').duration<60?' · menos de 60 s':'')):'Duración de audio no válida';});
$('#audio').addEventListener('error',()=>{audioReady=false;stop('error de audio');$('#audioStatus').textContent='Audio no válido. Elige otro archivo.';});
$('#audio').addEventListener('ended',()=>{if(playing)stop('archivo terminado');});
canvas.addEventListener('pointerdown',()=>record('atraer',{x:pointer.x/W,y:pointer.y/H}));canvas.addEventListener('pointerup',()=>record('soltar'));
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.altKey||e.metaKey)return;const k=String(e.key||'').toLowerCase();const code=({q:'KeyQ',w:'KeyW',e:'KeyE',a:'KeyA',s:'KeyS',t:'KeyT',g:'KeyG',z:'KeyZ',x:'KeyX'}[k])||e.code;if($('#recordDialog').open||e.target.matches('textarea,select,input[type=text],[contenteditable=true]'))return;if(['Space','Digit1','Digit2','Digit3','KeyR','KeyH','KeyF','KeyD','KeyP','KeyQ','KeyW','KeyE','KeyT','KeyG','KeyZ','KeyX','KeyA','KeyS'].includes(code))e.preventDefault();if(['ArrowUp','ArrowDown'].includes(code)&&!e.target.matches('input[type=range]')){e.preventDefault();setEnergy(energy+(code==='ArrowUp'?.1:-.1));return;}if(e.repeat)return;if(['KeyQ','KeyW','KeyE','KeyT','KeyG','KeyZ','KeyX'].includes(code))applyGesture(['KeyQ','KeyW','KeyE','KeyT','KeyG','KeyZ','KeyX'].indexOf(code));if(code==='KeyA')setMemory(trailMemory===1?0:1);if(code==='KeyS')setMemory(trailMemory===-1?0:-1);if(code==='Space')beginCharge();if(/^Digit[123]$/.test(code))setMode(Number(code.slice(-1))-1);if(code==='KeyR')reset();if(code==='KeyH')toggleUI();if(code==='KeyF')fullscreen();if(code==='KeyD')toggleInspect();if(code==='KeyP')rehearse();});
window.addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{last=0;acc=0;if(document.hidden)stop('pestaña oculta');});
// Read-only diagnostics for behavior and numerical stability checks.
window.instrument={getState:()=>({mode,energy,elapsed,playing,count:agents.length,modeMix:[...modeMix],networkMix:network?[...network.mix]:null,...forceStats,finite:agents.every(a=>[a.x,a.y,a.vx,a.vy].every(Number.isFinite))})};
resize();reset();
if(!window.SOBRECARGA_PUBLIC){audioName='Pump It · archivo compartido';$('#audioStatus').textContent='Cargando Pump It…';$('#audio').src=window.SOBRECARGA_AUDIO||'assets/pump-it.m4a';}else $('#audioStatus').textContent='Carga tu archivo de Pump It para ensayar';
requestAnimationFrame(frame);








$('#durationMode').addEventListener('change',updateDuration);$('#audio').addEventListener('loadedmetadata',updateDuration);

document.addEventListener('keyup',e=>{const i=['q','w','e','t','g','z','x'].indexOf(String(e.key||'').toLowerCase());const j=['KeyQ','KeyW','KeyE','KeyT','KeyG','KeyZ','KeyX'].indexOf(e.code);if(i>=0||j>=0)applyGesture(i>=0?i:j,false);});window.addEventListener('blur',clearGestures);document.addEventListener('visibilitychange',()=>{if(document.hidden)clearGestures();});$('#memoryLong').onclick=()=>setMemory(trailMemory===1?0:1);$('#memoryShort').onclick=()=>setMemory(trailMemory===-1?0:-1);


