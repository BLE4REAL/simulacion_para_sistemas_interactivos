'use strict';
// Three local sensors, deposition, diffusion and evaporation; no target shape.
class LivingNetwork {
 constructor(count=6000){
  this.count=count;this.width=640;this.height=270;
  this.surface=document.createElement('canvas');this.paint=this.surface.getContext('2d');
  this.glow=document.createElement('canvas');this.glow.width=320;this.glow.height=180;this.glowPaint=this.glow.getContext('2d');
  this.reset(1280,720);
 }
 reset(w,h){
  this.mix=[1,0,0];this.liveEnergy=.4;
  this.height=Math.max(120,Math.min(640,Math.round(this.width*h/w)));
  this.surface.width=this.width;this.surface.height=this.height;this.glow.height=Math.round(this.height/2);
  this.field=new Float32Array(this.width*this.height);this.buffer=new Float32Array(this.field.length);
  this.pixels=this.paint.createImageData(this.width,this.height);
  this.x=new Float32Array(this.count);this.y=new Float32Array(this.count);this.angle=new Float32Array(this.count);
  this.impact=new Float32Array(this.count);
  for(let i=0;i<this.count;i++){this.x[i]=Math.random()*this.width;this.y[i]=Math.random()*this.height;this.angle[i]=Math.random()*Math.PI*2;}
  for(let i=0;i<12;i++)this.update(0,.4,null,null,w,h);
 }
 sample(x,y){const w=this.width,h=this.height;return this.field[((Math.floor(y)%h+h)%h)*w+(Math.floor(x)%w+w)%w];}
 update(mode,energy,pulse,pointer,W,H,dt=1/60){
  const w=this.width,h=this.height,f=this.field,b=this.buffer;
  const blend=1-Math.exp(-Math.min(dt,.05)/.4);
  for(let k=0;k<3;k++)this.mix[k]+=((k===mode?1:0)-this.mix[k])*blend;
  this.liveEnergy+=(energy-this.liveEnergy)*blend;
  const compression=this.mix[1],rupture=this.mix[2];
  // Read the old trail for every agent; deposits go to a separate buffer.
  b.fill(0);
  const sensor=6+compression*10,spread=.8-compression*.3,turn=.65-compression*.35;
  const baseSpeed=(1.05+this.liveEnergy*1.45)*(1-compression*.1+rupture*.65);
  const memory=pointer?.memory||0;
  const depositScale=14000/this.count,retention=Math.min(.995,.97+compression*.008-rupture*.11+(memory>0?.014:memory<0?-.04:0));
  // A local brush removes trail before all sensors read it, never a global target.
  if(pointer?.erase){const cx=pointer.x/W*w,cy=pointer.y/H*h,rx=160/W*w,ry=160/H*h;for(let yy=Math.max(0,Math.floor(cy-ry));yy<Math.min(h,cy+ry);yy++)for(let xx=Math.max(0,Math.floor(cx-rx));xx<Math.min(w,cx+rx);xx++){if(((xx-cx)/rx)**2+((yy-cy)/ry)**2<1)f[yy*w+xx]*=.25;}}
  // Saturation makes crowded knots less attractive than their connecting strands.
  const sensed=value=>value/(1+compression*value*value/576);
  let speedSum=0;
  for(let i=0;i<this.count;i++){
   let x=this.x[i],y=this.y[i],a=this.angle[i];
   const front=sensed(this.sample(x+Math.cos(a)*sensor,y+Math.sin(a)*sensor));
   const left=sensed(this.sample(x+Math.cos(a-spread)*sensor,y+Math.sin(a-spread)*sensor));
   const right=sensed(this.sample(x+Math.cos(a+spread)*sensor,y+Math.sin(a+spread)*sensor));
   if(this.impact[i]<.12){
    let follow=0,avoid=0;
    if(front<left&&front<right)follow=(Math.random()<.5?-1:1)*turn;
    else if(front<left||front<right)follow=(left>right?-1:1)*turn;
    if(front>left||front>right)avoid=(left<right?-1:1)*turn;
    a+=follow*(1-rupture)+avoid*rupture;
   }
   if(rupture>.01)a+=Math.sin(i*12.9898+x*.12+y*.08)*.24*rupture;
   let hit=0;const px=x/w*W,py=y/h*H;
   if(pulse){const dx=px-pulse.x,dy=py-pulse.y,d=Math.hypot(dx,dy);hit=Math.max(0,1-Math.abs(d-pulse.age*560)/115)*(pulse.strength||1);if(hit>0){const desired=Math.atan2(dy* h/H,dx*w/W);a+=Math.atan2(Math.sin(desired-a),Math.cos(desired-a))*hit*.9;}}
   if(pointer&&pointer.down){const dx=pointer.x-px,dy=pointer.y-py,d=Math.hypot(dx,dy);if(d<420&&d>20){const desired=Math.atan2(dy*h/H,dx*w/W);a+=Math.atan2(Math.sin(desired-a),Math.cos(desired-a))*.12*(1-d/420);}}
   if(pointer&&(pointer.vortex||pointer.reverse||pointer.repel||pointer.gather||pointer.shake||pointer.explore)){const dx=pointer.x-px,dy=pointer.y-py,d=Math.hypot(dx,dy);if(d<420&&d>20){const weight=1-d/420;let ux=0,uy=0;if(pointer.vortex){ux-=dy;uy+=dx;}if(pointer.reverse){ux+=dy;uy-=dx;}if(pointer.repel){ux-=dx;uy-=dy;}if(pointer.gather){ux+=dx*1.5;uy+=dy*1.5;}if(ux!==0||uy!==0){const desired=Math.atan2(uy*h/H,ux*w/W);a+=Math.atan2(Math.sin(desired-a),Math.cos(desired-a))*.5*weight;}if(pointer.shake)a+=Math.sin((pointer.phase||0)*27+i*2.399)*1.1*weight;if(pointer.explore){const l=this.sample(x+Math.cos(a-spread)*sensor,y+Math.sin(a-spread)*sensor),r=this.sample(x+Math.cos(a+spread)*sensor,y+Math.sin(a+spread)*sensor);a+=(l<r?-1:1)*turn*1.8*weight;}}}
   const shock=Math.max(hit,this.impact[i]*.90);
   const speed=baseSpeed*(1+shock*9);
   speedSum+=speed;
   x=(x+Math.cos(a)*speed+w)%w;y=(y+Math.sin(a)*speed+h)%h;
   this.x[i]=x;this.y[i]=y;this.angle[i]=a;this.impact[i]=shock;
   // Preserve total deposited signal with fewer independent agents.
   const density=compression>.02?this.sample(x,y):0;
   const deposit=(shock>.1?.7:1.4+compression*1.8)*depositScale/(1+compression*density/40);
   b[Math.floor(y)*w+Math.floor(x)]+=deposit;
  }
  for(let y=0;y<h;y++){const row=y*w,up=(y===0?h-1:y-1)*w,down=(y===h-1?0:y+1)*w;for(let x=0;x<w;x++){
   const i=row+x,l=row+(x===0?w-1:x-1),r=row+(x===w-1?0:x+1),u=up+x,d=down+x;
   const diffusion=.1+compression*.07;
   b[i]+=(f[i]*(1-4*diffusion)+(f[l]+f[r]+f[u]+f[d])*diffusion)*retention;
  }
  }
  this.field=b;this.buffer=f;this.meanSpeed=speedSum/this.count;
 }
 draw(ctx,W,H,mode){
  const rgba=this.pixels.data,f=this.field;
  const compression=this.mix[1],rupture=this.mix[2],current=this.mix[0];
  for(let i=0;i<f.length;i++){
   const v=Math.max(0,f[i]-.8),t=Math.min(1,v/(24-compression*5)),hot=Math.max(0,(t-.5)*2),k=i*4;
   rgba[k]=(25*t+215*hot)*current+(165*t+80*hot)*compression+255*t*rupture;
   rgba[k+1]=(150*t+95*hot)*current+(55*t+190*hot)*compression+(60*t+170*hot)*rupture;
   rgba[k+2]=255*t*(current+compression)+(25*t+200*hot)*rupture;
   rgba[k+3]=255;
  }
  this.paint.putImageData(this.pixels,0,0);
  this.glowPaint.clearRect(0,0,this.glow.width,this.glow.height);this.glowPaint.filter='blur(2px)';this.glowPaint.drawImage(this.surface,0,0,this.glow.width,this.glow.height);
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.4;ctx.drawImage(this.glow,0,0,W,H);
  ctx.filter='none';ctx.globalAlpha=.95;ctx.drawImage(this.surface,0,0,W,H);
  ctx.strokeStyle='#fff1ce';ctx.lineWidth=1.4;ctx.beginPath();
  for(let i=0;i<this.count;i++)if(this.impact[i]>.15){const x=this.x[i]/this.width*W,y=this.y[i]/this.height*H,a=this.angle[i],len=8+this.impact[i]*65;ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(a)*len,y-Math.sin(a)*len);}
  ctx.stroke();
  if(rupture>.01){ctx.globalAlpha=rupture;ctx.beginPath();for(let i=0;i<this.count;i+=3){const x=this.x[i]/this.width*W,y=this.y[i]/this.height*H,a=this.angle[i];ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(a)*8,y-Math.sin(a)*8);}ctx.stroke();}
  ctx.restore();
 }
}



