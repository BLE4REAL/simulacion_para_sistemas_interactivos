'use strict';
/* Six indivisible glyphs. Teamwork changes shared motion, never their anatomy. */
(() => {
const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),live=document.querySelector('#status'),motion=matchMedia('(prefers-reduced-motion: reduce)');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),word='adidas';
let font,pieces=[],links=new Set(),grabs=new Map(),width=0,height=0,unit=0,last=0,acc=0,raf=0,clock=0,selected=0,keyboard=false,completeUntil=0,celebrateAt=-1,wasComplete=false;
const key=(a,b)=>[a,b].sort((x,y)=>x-y).join(':');
function announce(s){live.textContent=s;}
function component(id){const ids=new Set([id]);let more=true;while(more){more=false;for(const edge of links){const [a,b]=edge.split(':').map(Number);if(ids.has(a)!==ids.has(b)){ids.add(a);ids.add(b);more=true;}}}return pieces.filter(p=>ids.has(p.id));}
function families(){const seen=new Set(),out=[];for(const p of pieces)if(!seen.has(p.id)){const f=component(p.id);f.forEach(q=>seen.add(q.id));out.push(f);}return out;}
function held(f){return [...grabs.values()].some(g=>f.some(p=>g.members.includes(p.id)));}
function geometry(char){const glyph=font.charToGlyph(char),raw=glyph.getPath(0,0,unit),b=raw.getBoundingBox(),cx=(b.x1+b.x2)/2,cy=(b.y1+b.y2)/2;return{char,path:new Path2D(glyph.getPath(-cx,-cy,unit).toPathData(4)),w:b.x2-b.x1,h:b.y2-b.y1,cy};}
function scale(p){return motion.matches?1:1+p.pulse;}
function hop(p){if(motion.matches||clock<completeUntil||clock>=(p.sprintUntil||0))return 0;const age=clock-(p.runAt||0),phase=Math.max(0,age-(p.runPhase||0)),fade=Math.min(1,age/8,((p.sprintUntil||0)-clock)/16);return Math.max(0,Math.sin(phase*.34))*unit*.035*Math.max(0,fade);}
function pose(p){return{x:p.x+(motion.matches?0:p.ox||0),y:p.y+(motion.matches?0:p.oy||0)-hop(p),angle:p.angle+(motion.matches?0:p.oa||0)};}
function soften(p,v){p.ox=motion.matches?0:v.x-p.x;p.oy=motion.matches?0:v.y-p.y;p.oa=motion.matches?0:v.angle-p.angle;p.ovx=p.ovy=p.ova=0;}
function box(p,pad=0,reserve=false){const s=reserve?1.04:scale(p),c=Math.abs(Math.cos(p.angle)),sn=Math.abs(Math.sin(p.angle)),rx=(p.shape.w*c+p.shape.h*sn)*s/2+pad,ry=(p.shape.w*sn+p.shape.h*c)*s/2+pad;return{x1:p.x-rx,x2:p.x+rx,y1:p.y-ry,y2:p.y+ry};}
function overlaps(a,b,gap=0){return a.x1<b.x2+gap&&a.x2>b.x1-gap&&a.y1<b.y2+gap&&a.y2>b.y1-gap;}
function bounds(f){const bs=f.map(p=>box(p,0,true));return{x1:Math.min(...bs.map(b=>b.x1)),x2:Math.max(...bs.map(b=>b.x2)),y1:Math.min(...bs.map(b=>b.y1)),y2:Math.max(...bs.map(b=>b.y2))};}
function move(f,dx,dy){f.forEach(p=>{p.x+=dx;p.y+=dy;});}
function keepInside(f){const b=bounds(f),dx=b.x2-b.x1>width-24?width/2-(b.x1+b.x2)/2:b.x1<12?12-b.x1:b.x2>width-12?width-12-b.x2:0,dy=b.y2-b.y1>height-24?height/2-(b.y1+b.y2)/2:b.y1<12?12-b.y1:b.y2>height-12?height-12-b.y2:0;move(f,dx,dy);if(dx||dy){const h=f[0].heading;f.forEach(p=>{p.heading=dx?Math.PI-h:-h;if(dx)p.vx=0;if(dy)p.vy=0;p.trail=[];});}}
function randomize(){
 links.clear();grabs.clear();completeUntil=0;celebrateAt=-1;wasComplete=false;canvas.classList.remove('held');
 const natural=[...word].map(c=>{const b=font.charToGlyph(c).getPath(0,0,1).getBoundingBox();return (b.x2-b.x1)*1.13;}).reduce((a,b)=>a+b,0)+.12*5;
 unit=Math.min(width*.80/natural,height*.29,320);let success=false;
 for(let pass=0;pass<12&&!success;pass++){
  pieces=[];success=true;
  for(let i=0;i<word.length;i++){
   const p={id:i,shape:geometry(word[i]),x:0,y:0,angle:(Math.random()-.5)*.65,vx:0,vy:0,heading:0,pulse:0,pv:0,delay:-1,trail:[]};let placed=false;
   const b=box(p,0,true),rx=b.x2,ry=b.y2;
   for(let attempt=0;attempt<250;attempt++){p.x=rx+22+Math.random()*Math.max(0,width-2*rx-44);p.y=ry+22+Math.random()*Math.max(0,height-2*ry-44);if(!pieces.some(q=>overlaps(box(p,0,true),box(q,0,true),Math.max(14,unit*.15)))){placed=true;break;}}
   if(!placed){success=false;break;}pieces.push(p);
  }
  if(!success)unit*=.84;
 }
 if(!success){pieces=[...word].map((c,i)=>({id:i,shape:geometry(c),x:width*(.25+.5*(i%2)),y:height*(.17+.33*Math.floor(i/2)),angle:0,vx:0,vy:0,heading:0,pulse:0,pv:0,delay:-1,trail:[]}));}
 pieces.forEach(p=>keepInside([p]));selected=0;draw();
}
function layout(){const r=canvas.getBoundingClientRect();if(Math.abs(width-r.width)<1&&Math.abs(height-r.height)<1)return;const oldW=width,oldH=height;cancelGrabs();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
 if(!oldW){randomize();return;}
 const ratio=Math.min(width/oldW,height/oldH);unit*=ratio;pieces.forEach(p=>{p.shape=geometry(p.shape.char);p.x=p.x/oldW*width;p.y=p.y/oldH*height;p.vx*=ratio;p.vy*=ratio;p.ox=(p.ox||0)*ratio;p.oy=(p.oy||0)*ratio;p.ovx=(p.ovx||0)*ratio;p.ovy=(p.ovy||0)*ratio;p.trail=[];});for(const f of families()){keepInside(f);}separateTeams();draw();
}
function paint(p,x,y,alpha,color){ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.translate(x,y);ctx.rotate(pose(p).angle);ctx.scale(scale(p),scale(p));ctx.fill(p.shape.path);ctx.restore();}
function draw(){ctx.clearRect(0,0,width,height);for(const f of families()){for(const p of f){const blend=p.ink??(f.length>1?1:0),color=f.length===6&&clock<completeUntil?'#08a878':'rgb('+Math.round(23+13*blend)+','+Math.round(25+51*blend)+','+Math.round(24+231*blend)+')',v=pose(p);if(!motion.matches&&f.length>1)for(let i=0;i<p.trail.length;i+=4){const t=p.trail[i];paint(p,t.x,t.y,.025+i/p.trail.length*.025,color);}paint(p,v.x,v.y,1,color);
 if(keyboard&&p.id===selected&&document.activeElement===canvas){ctx.save();ctx.translate(v.x,v.y);ctx.rotate(v.angle);ctx.scale(scale(p),scale(p));ctx.strokeStyle='#777';ctx.lineWidth=1;ctx.setLineDash([2,4]);ctx.stroke(p.shape.path);ctx.restore();}}}
 canvas.dataset.complete=String(isWordComplete());canvas.dataset.celebrating=String(clock<completeUntil);canvas.dataset.ready='true';canvas.dataset.pieces=String(pieces.length);canvas.dataset.links=String(links.size);canvas.dataset.active=String(grabs.size);canvas.dataset.state=JSON.stringify(pieces.map(p=>({id:p.id,char:p.shape.char,x:Math.round(p.x),y:Math.round(p.y),angle:p.angle,scale:scale(p)})));
}
function hit(q){ctx.save();ctx.setTransform(1,0,0,1,0,0);let found=null;for(let i=pieces.length-1;i>=0;i--){const p=pieces[i],v=pose(p),dx=q.x-v.x,dy=q.y-v.y,c=Math.cos(v.angle),s=Math.sin(v.angle),x=(c*dx+s*dy)/scale(p),y=(-s*dx+c*dy)/scale(p);if(Math.abs(x)<=p.shape.w/2&&Math.abs(y)<=p.shape.h/2&&ctx.isPointInPath(p.shape.path,x,y)){found=p;break;}}ctx.restore();return found;}
function pulse(p){const f=component(p.id).sort((a,b)=>a.x-b.x),start=f.indexOf(p);f.forEach((q,i)=>{q.delay=motion.matches?-1:Math.abs(i-start)*4;});}
function isWordComplete(){if(pieces.length!==6||component(0).length!==6)return false;const sorted=[...pieces].sort((a,b)=>a.x-b.x);if(sorted.map(p=>p.shape.char).join('')!==word)return false;const baseline=sorted.reduce((s,p)=>s+p.y-p.shape.cy,0)/6;
 return sorted.every((p,i)=>{if(Math.abs(p.angle)>.38||Math.abs(p.y-p.shape.cy-baseline)>unit*.20)return false;if(!i)return true;const a=box(sorted[i-1]),b=box(p),gap=b.x1-a.x2;return gap>=-unit*.025&&gap<unit*.28;});
}
function checkCompletion(){const complete=isWordComplete();if(complete&&!wasComplete){celebrateAt=clock+20;completeUntil=clock+(motion.matches?160:130);announce('Formaste adidas. El equipo está completo.');}if(!complete){completeUntil=0;celebrateAt=-1;}wasComplete=complete;}
function alignRow(team,baseline){
 const previous=new Map(team.map(p=>[p.id,pose(p)])),ordered=[...team].sort((a,b)=>a.x-b.x),gap=Math.max(3,unit*.035),total=ordered.reduce((s,p)=>s+p.shape.w*1.04,0)+gap*(ordered.length-1),center=ordered.reduce((s,p)=>s+p.x,0)/ordered.length;let x=center-total/2;
 for(const p of ordered){p.x=x+p.shape.w*.52;p.y=baseline+p.shape.cy;p.angle=0;p.sprintUntil=0;p.trail=[];x+=p.shape.w*1.04+gap;}
 keepInside(team);team.forEach(p=>soften(p,previous.get(p.id)));
}
function startRelay(p){
 const team=component(p.id),ordered=[...team].sort((a,b)=>a.x-b.x),center=team.reduce((s,q)=>s+q.x,0)/team.length,direction=p.x<=center?1:-1;
 ordered.forEach((q,i)=>{q.sprintUntil=motion.matches?0:clock+100;q.runAt=clock;q.heading=direction===1?0:Math.PI;q.runPhase=i*4;});
 announce(team.length>1?'Salida de relevos: el impulso recorre el equipo.':'Salida: acerca otra letra para formar equipo.');
}
function connect(p){
 const own=component(p.id),otherTeams=families().filter(f=>!f.some(q=>own.includes(q))&&!held(f)),threshold=clamp(unit*.16,18,40);let best=null;
 for(const other of otherTeams){
  const leftOwn=[...own].sort((a,b)=>a.x-b.x),leftOther=[...other].sort((a,b)=>a.x-b.x),ownOnLeft=own.reduce((s,q)=>s+q.x,0)/own.length<other.reduce((s,q)=>s+q.x,0)/other.length,a=ownOnLeft?leftOwn.at(-1):leftOwn[0],b=ownOnLeft?leftOther[0]:leftOther.at(-1),ab=box(a),bb=box(b),gap=ownOnLeft?bb.x1-ab.x2:ab.x1-bb.x2,baseline=Math.abs((a.y-a.shape.cy)-(b.y-b.shape.cy));
  if(gap< -unit*.20||gap>threshold||baseline>unit*.28||Math.abs(a.x-b.x)<unit*.12)continue;
  const score=Math.abs(gap)+baseline;if(!best||score<best.score)best={a,b,score,baseline:b.y-b.shape.cy};
 }
 if(!best)return false;links.add(key(best.a.id,best.b.id));const team=component(p.id);team.forEach(q=>{q.heading=p.heading;q.vx=q.vy=0;});alignRow(team,best.baseline);separateTeams();pulse(p);announce('Equipo de '+team.length+' letras en línea, con tu orden de izquierda a derecha.');checkCompletion();return true;
}
function disconnect(p){const old=component(p.id);if(old.length<2)return;completeUntil=0;celebrateAt=-1;for(const edge of [...links])if(edge.split(':').map(Number).includes(p.id))links.delete(edge);
 // Removing a middle letter splits the chain; never bridge a vacant gap.
p.vx=p.vy=0;p.trail=[];p.delay=-1;wasComplete=false;announce('Letra completa separada del equipo.');
}
function separateTeams(){
 const fs=families();
 for(let pass=0;pass<8;pass++)for(let i=0;i<fs.length;i++)for(let j=i+1;j<fs.length;j++){
  const a=fs[i],b=fs[j],pair=a.flatMap(p=>b.map(q=>[p,q])).find(([p,q])=>overlaps(box(p,0,true),box(q,0,true),2));if(!pair)continue;
  const options=[];
  for(const [target,other] of [[a,b],[b,a]]){if(held(target))continue;const t=box(pair[target===a?0:1],0,true),o=box(pair[target===a?1:0],0,true),tb=bounds(target);
   for(const [dx,dy] of [[o.x1-t.x2-6,0],[o.x2-t.x1+6,0],[0,o.y1-t.y2-6],[0,o.y2-t.y1+6]]){
    if(tb.x1+dx>=12&&tb.x2+dx<=width-12&&tb.y1+dy>=12&&tb.y2+dy<=height-12)options.push({target,dx,dy,d:Math.abs(dx)+Math.abs(dy)});
   }
  }
  options.sort((a,b)=>a.d-b.d);const best=options[0];if(best){const previous=best.target.map(p=>pose(p));move(best.target,best.dx,best.dy);best.target.forEach((p,i)=>{soften(p,previous[i]);p.vx=p.vy=0;p.trail=[];});}
 }
}
function tick(){clock++;for(const p of pieces){const target=component(p.id).length>1?1:0;p.ink=motion.matches?target:(p.ink??target)+(target-(p.ink??target))*.2;}checkCompletion();if(clock===celebrateAt&&isWordComplete()){pulse(pieces[0]);celebrateAt=-1;}for(const p of pieces){if(motion.matches){p.pulse=p.pv=0;p.delay=-1;p.trail=[];p.ox=p.oy=p.oa=0;}else{for(const [o,v] of [['ox','ovx'],['oy','ovy'],['oa','ova']]){p[v]=((p[v]||0)-(p[o]||0)*.22)*.65;p[o]=(p[o]||0)+p[v];if(Math.abs(p[o])<.001&&Math.abs(p[v])<.001)p[o]=p[v]=0;}if(p.delay===0){p.pv=-.045;p.delay=-1;}else if(p.delay>0)p.delay--;p.pv+=-p.pulse*.22;p.pv*=.65;p.pulse=clamp(p.pulse+p.pv,-.065,.025);}}
 for(const f of families()){if(held(f))continue;let vx=f.reduce((s,p)=>s+p.vx,0)/f.length*.91,vy=f.reduce((s,p)=>s+p.vy,0)/f.length*.91;if(motion.matches){vx=vy=0;}else if(f.some(p=>Math.abs(p.ox||0)+Math.abs(p.oy||0)>.5)||f.length===6&&clock<completeUntil){vx=vy=0;}else if(f.some(p=>clock<(p.sprintUntil||0))){vx+=Math.cos(f[0].heading)*.32;vy=0;}else if(f.length>1){vx+=Math.cos(f[0].heading)*.065;vy=0;}else vy+=Math.cos(clock*.035+f[0].id*1.7)*.018;
 f.forEach(p=>{if(!motion.matches&&f.length>1){p.trail.push({x:p.x,y:p.y});if(p.trail.length>14)p.trail.shift();}p.x+=vx;p.y+=vy;p.vx=vx;p.vy=vy;});keepInside(f);}separateTeams();
}
function animate(t){if(!last)last=t;acc+=Math.min(t-last,50);last=t;while(acc>=1000/60){tick();acc-=1000/60;}draw();raf=requestAnimationFrame(animate);}
function point(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;const q=point(e),p=hit(q),f=p?component(p.id):[];if(held(f))return;if(p){selected=p.id;pulse(p);}f.forEach(p=>{const v=pose(p);p.x=v.x;p.y=v.y;p.angle=v.angle;p.sprintUntil=0;p.ox=p.oy=p.oa=p.ovx=p.ovy=p.ova=0;p.vx=p.vy=0;p.trail=[];});grabs.set(e.pointerId,{id:p?.id??null,members:f.map(p=>p.id),x:q.x,y:q.y,time:e.timeStamp,start:e.timeStamp,moved:0,vx:0,vy:0});keyboard=false;canvas.setPointerCapture(e.pointerId);if(p)canvas.classList.add('held');e.preventDefault();});
canvas.addEventListener('pointermove',e=>{const q=point(e),g=grabs.get(e.pointerId);if(!g){canvas.style.cursor=hit(q)?'grab':'default';return;}const dx=q.x-g.x,dy=q.y-g.y,dt=Math.max(8,e.timeStamp-g.time),speed=Math.hypot(dx,dy)/dt;
 if(g.id!==null){const p=pieces.find(p=>p.id===g.id);if(speed>.95&&g.moved+Math.hypot(dx,dy)>28&&component(p.id).length>1){disconnect(p);g.members=[p.id];}const f=pieces.filter(p=>g.members.includes(p.id));move(f,dx,dy);keepInside(f);}
 g.x=q.x;g.y=q.y;g.moved+=Math.hypot(dx,dy);g.vx=clamp(dx/dt*16.67,-9,9);g.vy=clamp(dy/dt*16.67,-9,9);g.time=e.timeStamp;e.preventDefault();});
function release(e,cancel=false){const g=grabs.get(e.pointerId);if(!g)return;grabs.delete(e.pointerId);const p=pieces.find(p=>p.id===g.id),elapsed=(e.timeStamp??performance.now())-g.start;
 if(!cancel){if(p){if(g.moved<5){if(elapsed>550)disconnect(p);else startRelay(p);}else{const f=component(p.id),heading=Math.hypot(g.vx,g.vy)>.1?Math.atan2(g.vy,g.vx):p.heading;f.forEach(q=>{q.heading=heading;q.vx=motion.matches?0:g.vx*.12;q.vy=motion.matches?0:g.vy*.12;});connect(p);}}else if(g.moved<5&&elapsed>750){randomize();announce('Nueva distribución aleatoria.');}}
 if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(!grabs.size)canvas.classList.remove('held');if(!cancel)separateTeams();draw();}
function cancelGrabs(){for(const id of [...grabs.keys()])release({pointerId:id,timeStamp:performance.now()},true);}
canvas.addEventListener('pointerup',e=>release(e));for(const name of ['pointercancel','lostpointercapture'])canvas.addEventListener(name,e=>release(e,true));window.addEventListener('blur',cancelGrabs);
canvas.addEventListener('keydown',e=>{if(e.key==='Escape'){cancelGrabs();randomize();announce('Nueva distribución aleatoria.');e.preventDefault();return;}if(/^[1-6]$/.test(e.key)){selected=Number(e.key)-1;keyboard=true;announce('Letra '+(selected+1)+': '+word[selected]);e.preventDefault();draw();return;}const p=pieces.find(p=>p.id===selected);if(!p)return;const dir={ArrowLeft:[-14,0],ArrowRight:[14,0],ArrowUp:[0,-14],ArrowDown:[0,14]}[e.key];keyboard=true;
 if(dir){const f=component(p.id);move(f,...dir);f.forEach(q=>{q.vx=q.vy=0;});keepInside(f);connect(p);separateTeams();}else if(e.key===' '||e.key==='Enter'){pulse(p);startRelay(p);}else if(e.key.toLowerCase()==='x'){disconnect(p);separateTeams();}else return;e.preventDefault();draw();});
canvas.addEventListener('blur',()=>{keyboard=false;draw();});document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelGrabs();cancelAnimationFrame(raf);}else{last=0;acc=0;raf=requestAnimationFrame(animate);}});
try{font=opentype.parse(Uint8Array.from(atob(LETTER_FONT),c=>c.charCodeAt(0)).buffer);layout();new ResizeObserver(layout).observe(canvas);raf=requestAnimationFrame(animate);}catch(error){document.querySelector('#error').hidden=false;announce('No se pudo cargar la escena.');console.error(error);}
})();












