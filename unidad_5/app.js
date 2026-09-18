const photoIds = {
  1: '1eWFdxUA_8md9w_QwlINZC7fX9-D9uwVu',
  2: '1qP6K1oSVATdZKAEsqZxrZIq7arORcVCU',
  3: '187mBuObBUgo_OCd1Kuhoz_0gXu1XHSP_',
  4: '1mLNs7beUpgQuNsYI2wnctn5kgh4vjYv1',
  5: '1acaWfsnsxeoLNKPnoicAkU4SCz3F-ZvJ',
  6: '1wbT2HEzbAFssmlsY7nJqGwGEWsY9g-GV',
};

const scenes = [
  { kicker: 'FUTURE LEADERS FORUM · FÓRUM UPB', title: 'RELEVO GENERACIONAL:<br>LA VENTAJA QUE NADIE ESTÁ APROVECHANDO', caption: 'Una red de personas, experiencia e ideas que aprende a florecer junta.', mode: 'seed', photo: null },
  { kicker: 'EL AUDITORIO COMO PUNTO DE PARTIDA', title: '¿UN GRAN AUDITORIO<br>SOLO PARA HACER GRADOS?', caption: 'Un espacio puede contener mucho más que una ceremonia.', mode: 'gather', photo: 1 },
  { kicker: 'UN CAMBIO DE MIRADA', title: 'LOS EVENTOS NO LLEGARON<br>A LA UNIVERSIDAD.', caption: 'La Universidad decidió encontrarse con el mundo.', mode: 'open', photo: null },
  { kicker: 'TRES FUERZAS ENCUENTRO', title: 'ACADEMIA + INDUSTRIA + CIUDAD', caption: 'Tres núcleos distintos empiezan a reconocerse.', mode: 'triad', photo: 2 },
  { kicker: 'DEL EVENTO AL IMPACTO', title: 'LOS EVENTOS NUNCA FUERON<br>EL OBJETIVO. EL IMPACTO SÍ.', caption: 'Una relación puede extenderse mucho después de que termina el evento.', mode: 'ripple', photo: 3 },
  { kicker: 'UNA RED QUE PERMANECE', title: 'UN EVENTO TRAE PERSONAS.<br>UNA COMUNIDAD TRAE TRANSFORMACIÓN.', caption: 'Cuando los vínculos permanecen, aparece una estructura nueva.', mode: 'mesh', photo: null },
  { kicker: 'CONFIANZA', title: 'EL TALENTO CRECE<br>A LA VELOCIDAD DE LA CONFIANZA.', caption: 'Las conexiones cercanas permiten que cada pétalo encuentre su ritmo.', mode: 'trust', photo: null },
  { kicker: 'EXPERIENCIA Y RUTAS NUEVAS', title: 'LA EXPERIENCIA CONSTRUYE EL CAMINO.<br>LAS NUEVAS GENERACIONES DESCUBREN NUEVAS RUTAS.', caption: 'Una rama no borra la anterior: la continúa y la desvía.', mode: 'branch', photo: 4 },
  { kicker: 'UNA VISIÓN COMPARTIDA', title: 'UNA VISIÓN.<br>DOS GENERACIONES.', caption: 'Dos tonos, dos ritmos, una misma estructura en formación.', mode: 'duet', photo: null },
  { kicker: 'COLABORACIÓN', title: 'EL CRECIMIENTO NO OCURRE<br>CUANDO UNA GENERACIÓN REEMPLAZA A OTRA.', caption: 'Ocurre cuando trabajan juntas.', mode: 'merge', photo: null },
  { kicker: 'EL PRESENTE', title: 'LOS JÓVENES NO SON EL FUTURO.', caption: 'Son el presente que muchas organizaciones aún no ven.', mode: 'foreground', photo: null },
  { kicker: 'CONSTRUIR', title: 'EL FUTURO NO SE HEREDA.<br>SE CONSTRUYE.', caption: 'La red completa florece porque cada relación aportó algo.', mode: 'bloom', photo: 5 },
  { kicker: 'FÓRUM UPB', title: 'SIGAMOS FLORECIENDO JUNTOS.', caption: 'Aquí irá el acceso a las memorias y redes de @centrodeeventosupb.', mode: 'close', photo: 6 },
];

const canvas = document.querySelector('#petal-canvas');
const ctx = canvas.getContext('2d');
const photoLayer = document.querySelector('.photo-layer');
const titleEl = document.querySelector('#scene-title');
const kickerEl = document.querySelector('#scene-kicker');
const captionEl = document.querySelector('#scene-caption');
const contentEl = document.querySelector('.content');
const sceneNumberEl = document.querySelector('#scene-number');
const qrPlaceholders = document.querySelector('#qr-placeholders');
let width = 0, height = 0, sceneIndex = 0, previousIndex = -1;
let pointer = { x: 0, y: 0, active: false };
let petals = [];
let transition = 1;
let sceneStartedAt = 0;
let hasStarted = false;

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width * dpr; canvas.height = height * dpr;
  canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function makePetals() {
  const count = Math.max(110, Math.min(230, Math.floor(width * height / 7200)));
  petals = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .35, vy: Math.random() * .42 + .08,
    size: 3.5 + Math.random() * 7, angle: Math.random() * Math.PI * 2, spin: (Math.random() - .5) * .018,
    phase: Math.random() * Math.PI * 2, tone: Math.random(), seed: i,
    arrivalDelay: 0, arrivalDuration: 1, arriving: false, windCurve: 0,
  }));
}

function prepareWindArrival(direction = 1) {
  petals.forEach((p, i) => {
    const edge = Math.floor(hash(i + sceneIndex * 37) * 4);
    const margin = 45 + hash(i + 5) * 120;
    const vertical = hash(i + 11) * height;
    const horizontal = hash(i + 23) * width;

    if (edge === 0) { p.x = -margin; p.y = vertical; }
    else if (edge === 1) { p.x = width + margin; p.y = vertical; }
    else if (edge === 2) { p.x = horizontal; p.y = -margin; }
    else { p.x = horizontal; p.y = height + margin; }

    // La dirección de navegación sesga suavemente la corriente, sin uniformarla.
    if (direction > 0 && edge === 0) p.x -= width * .08;
    if (direction < 0 && edge === 1) p.x += width * .08;

    p.vx = 0; p.vy = 0;
    p.arrivalX = p.x; p.arrivalY = p.y;
    p.arrivalDelay = hash(i + 71) * 1500;
    p.arrivalDuration = 3000 + hash(i + 97) * 2600;
    p.windCurve = (hash(i + 131) - .5) * Math.min(width, height) * .32;
    p.arriving = true;
  });
}

function prepareContinuityTransition(direction = 1) {
  petals.forEach((p, i) => {
    const newcomer = hash(i + sceneIndex*53) < .18;

    // El 82 % conserva su posición: son las relaciones que continúan.
    p.arrivalX = p.x;
    p.arrivalY = p.y;

    // El 18 % entra desde fuera: nuevas personas e ideas se suman a la red.
    if (newcomer) {
      const edge = Math.floor(hash(i + sceneIndex*71 + 9)*4);
      const margin = 45 + hash(i+15)*100;
      if (edge===0) { p.arrivalX=-margin; p.arrivalY=hash(i+21)*height; }
      else if (edge===1) { p.arrivalX=width+margin; p.arrivalY=hash(i+21)*height; }
      else if (edge===2) { p.arrivalX=hash(i+21)*width; p.arrivalY=-margin; }
      else { p.arrivalX=hash(i+21)*width; p.arrivalY=height+margin; }
      p.x=p.arrivalX; p.y=p.arrivalY;
    }

    p.vx=0; p.vy=0;
    p.arrivalDelay=hash(i+sceneIndex*29)*850;
    p.arrivalDuration=2700+hash(i+sceneIndex*83)*1900;
    p.windCurve=(hash(i+sceneIndex*97)-.5)*Math.min(width,height)*.22 + direction*18;
    p.arriving=true;
  });
}

function hash(value) {
  const x = Math.sin(value * 91.417 + 17.13) * 43758.5453;
  return x - Math.floor(x);
}

function targetFor(p, mode, i, time) {
  const total = petals.length;
  const cx = width * .76, cy = height * .51;
  const t = i / total;

  // 1. Semillas independientes: no hay trayectoria común ni línea implícita.
  if (mode === 'seed') {
    const angle = hash(i + 2) * Math.PI * 2;
    const radius = Math.sqrt(hash(i + 19)) * Math.min(width * .16, height * .27);
    return { x: cx + Math.cos(angle) * radius * 1.25, y: cy + Math.sin(angle) * radius };
  }

  // 2. Auditorio: un perímetro cerrado y estable.
  if (mode === 'gather') {
    const angle = t * Math.PI * 2;
    return { x: cx + Math.cos(angle) * Math.min(width*.15, 215), y: cy + Math.sin(angle) * Math.min(height*.20, 155) };
  }

  // 3. Apertura: el círculo conserva su memoria, pero una sección se desprende.
  if (mode === 'open') {
    const ringCount = Math.floor(total * .78);
    if (i < ringCount) {
      const u = i / Math.max(1, ringCount - 1);
      const angle = .22 * Math.PI + u * Math.PI * 1.56;
      return { x: cx + Math.cos(angle) * 178, y: cy + Math.sin(angle) * 132 };
    }
    const u = (i - ringCount) / Math.max(1, total - ringCount - 1);
    return { x: cx + 166 + u * width*.12, y: cy - 52 - u * height*.22 + Math.sin(u*Math.PI)*28 };
  }

  if (mode === 'triad') {
    const centers = [[width*.66,height*.38],[width*.84,height*.42],[width*.75,height*.68]];
    const c = centers[i%3];
    const u = Math.floor(i/3) / Math.max(1, Math.ceil(total/3)-1);
    return { x:c[0]+Math.cos(u*Math.PI*2)*66, y:c[1]+Math.sin(u*Math.PI*2)*52 };
  }

  // 5. Impacto: tres ondas concéntricas que respiran desde el mismo centro.
  if (mode === 'ripple') {
    const impactCount = Math.min(14, Math.floor(total*.08));
    if (i < impactCount) {
      const angle = i/impactCount*Math.PI*2;
      const radius = 7 + hash(i+41)*12 + Math.sin(time*.004)*3;
      return { x:cx+Math.cos(angle)*radius, y:cy+Math.sin(angle)*radius };
    }
    const local = i-impactCount;
    const ring = local % 3;
    const u = Math.floor(local/3) / Math.max(1, Math.ceil((total-impactCount)/3)-1);
    const pulse = Math.sin(time*.0026 - ring*.9) * 8;
    const radius = 58 + ring * 67 + pulse;
    const angle = u * Math.PI * 2;
    return { x: cx + Math.cos(angle)*radius, y: cy + Math.sin(angle)*radius*.72 };
  }

  // 6. Comunidad: soma central, axones y dendritas; las conexiones conducen señales.
  if (mode === 'mesh') {
    const somaCount = Math.min(34, Math.floor(total*.18));
    if (i < somaCount) {
      const angle = i/somaCount*Math.PI*2;
      return { x:cx+Math.cos(angle)*42, y:cy+Math.sin(angle)*34 };
    }
    const branches = 9;
    const local = i - somaCount;
    const branch = local % branches;
    const level = Math.floor(local/branches) / Math.max(1, Math.ceil((total-somaCount)/branches)-1);
    const angle = branch/branches*Math.PI*2 + Math.sin(level*Math.PI*2+branch)*.16;
    const radius = 48 + level * Math.min(width*.18, 245);
    return { x:cx+Math.cos(angle)*radius, y:cy+Math.sin(angle)*radius*.72 + Math.sin(level*12+branch)*8 };
  }

  // 7. Confianza: una red sincronizada, regular y respirando al mismo ritmo.
  if (mode === 'trust') {
    const rings = 4;
    const ring = i % rings;
    const u = Math.floor(i/rings) / Math.max(1, Math.ceil(total/rings)-1);
    const angle = u*Math.PI*2 + ring*.22;
    const breath = Math.sin(time*.0018)*5;
    const radius = 52 + ring*48 + breath;
    return { x:cx+Math.cos(angle)*radius, y:cy+Math.sin(angle)*radius*.72 };
  }

  // 8. Experiencia: árbol legible; raíces, tronco y ramas que abren nuevas rutas.
  if (mode === 'branch') {
    const rootCount = Math.floor(total*.16);
    const trunkCount = Math.floor(total*.18);
    if (i < rootCount) {
      const u = i/Math.max(1,rootCount-1), side = i%2 ? 1 : -1;
      return { x:cx + side*u*145, y:height*.78 + u*35 + Math.sin(u*Math.PI)*18 };
    }
    if (i < rootCount+trunkCount) {
      const u = (i-rootCount)/Math.max(1,trunkCount-1);
      return { x:cx+Math.sin(u*6)*7, y:height*.79-u*height*.38 };
    }
    const local = i-rootCount-trunkCount;
    const branches = 8, branch = local%branches;
    const u = Math.floor(local/branches)/Math.max(1,Math.ceil((total-rootCount-trunkCount)/branches)-1);
    const side = branch%2 ? 1 : -1;
    const tier = Math.floor(branch/2);
    const originY = height*(.47 + tier*.065);
    return { x:cx+side*(18+u*(95+tier*22)), y:originY-u*(80-tier*10)+Math.sin(u*Math.PI)*(-28) };
  }

  if (mode === 'duet') {
    const side = i%2, u = Math.floor(i/2)/Math.max(1,Math.ceil(total/2)-1);
    const c = side ? [width*.83,height*.48] : [width*.64,height*.55];
    return { x:c[0]+Math.cos(u*Math.PI*2)*82, y:c[1]+Math.sin(u*Math.PI*2)*67 };
  }

  // 10. Colaboración: seis pétalos completos comparten el mismo centro.
  if (mode === 'merge') {
    const lobes = 6, lobe = i%lobes;
    const u = Math.floor(i/lobes)/Math.max(1,Math.ceil(total/lobes)-1);
    const angle = lobe/lobes*Math.PI*2;
    const radial = 24 + Math.sin(u*Math.PI)*145;
    const tangent = (u-.5)*92;
    return { x:cx+Math.cos(angle)*radial-Math.sin(angle)*tangent, y:cy+Math.sin(angle)*radial*.76+Math.cos(angle)*tangent*.76 };
  }

  // 11. Presente: una flor frontal, sostenida por una base visible, no dos infinitos.
  if (mode === 'foreground') {
    const flowerCount = Math.floor(total*.72);
    if (i < flowerCount) {
      const angle = i/flowerCount*Math.PI*8;
      const radius = 32 + (i/flowerCount)*105 + Math.sin(angle*2.5)*24;
      return { x:cx+Math.cos(angle)*radius, y:cy-height*.04+Math.sin(angle)*radius*.78 };
    }
    const u = (i-flowerCount)/Math.max(1,total-flowerCount-1);
    const angle = Math.PI*.12 + u*Math.PI*.76;
    return { x:cx+Math.cos(angle)*210, y:cy+height*.18+Math.sin(angle)*58 };
  }

  // 12. Construcción: el árbol anterior llega a una copa en flor.
  if (mode === 'bloom') {
    const structure = Math.floor(total*.30);
    if (i < structure) {
      const u = i/Math.max(1,structure-1);
      const side = i%2 ? 1 : -1;
      if (u < .42) return { x:cx+Math.sin(u*13)*6, y:height*.78-u*height*.54 };
      const v = (u-.42)/.58;
      return { x:cx+side*v*150, y:height*.55-v*120-Math.sin(v*Math.PI)*50 };
    }
    const local=i-structure, clusters=7, cluster=local%clusters;
    const u=Math.floor(local/clusters)/Math.max(1,Math.ceil((total-structure)/clusters)-1);
    const centers=[[-145,-95],[-80,-155],[0,-180],[82,-155],[150,-90],[-48,-80],[55,-78]];
    const c=centers[cluster], a=u*Math.PI*2, r=28+hash(local)*28;
    return { x:cx+c[0]+Math.cos(a)*r, y:cy+c[1]+Math.sin(a)*r*.72 };
  }

  // 13. Cierre: dos marcos vivos reservan los accesos QR sin repetir el árbol.
  if (mode === 'close') {
    const frame = i%2;
    const u = Math.floor(i/2)/Math.max(1,Math.ceil(total/2)-1);
    const perimeter = Math.min(u*4, 3.9999), side=Math.floor(perimeter), offset=perimeter-side;
    const half=Math.min(width*.07,75), centerX=frame?width*.86:width*.70, centerY=height*.49;
    const points=[[-half,-half],[half,-half],[half,half],[-half,half],[-half,-half]];
    return { x:centerX+points[side][0]+(points[side+1][0]-points[side][0])*offset, y:centerY+points[side][1]+(points[side+1][1]-points[side][1])*offset };
  }

  return { x:p.x, y:p.y };
}

function livingTarget(target, p, mode, i, time) {
  const amplitude = {
    seed: 15, gather: 6, open: 9, triad: 8, ripple: 5, mesh: 10,
    trust: 8, branch: 11, duet: 9, merge: 7, foreground: 8,
    bloom: 12, close: 5,
  }[mode] || 7;
  const slowWind = Math.sin(time*.00062 + p.phase*.45);
  const flutter = Math.sin(time*.00135 + i*.31 + p.phase);
  let x = target.x + slowWind*amplitude + flutter*amplitude*.28;
  let y = target.y + Math.cos(time*.00074 + p.phase*.55)*amplitude*.58;

  // Troncos y ramas se inclinan de forma coherente, como una sola estructura al viento.
  if (mode === 'branch' || mode === 'bloom') {
    const canopyFactor = Math.max(0, 1 - target.y/height);
    x += Math.sin(time*.00048)*amplitude*2.1*canopyFactor;
  }
  // Las formas colectivas respiran sin perder su silueta.
  if (['gather','trust','merge','foreground'].includes(mode)) {
    const cx=width*.76, cy=height*.51;
    const breath=1+Math.sin(time*.0007)*.018;
    x=cx+(x-cx)*breath; y=cy+(y-cy)*breath;
  }
  return { x, y };
}

function drawPetal(p, alpha) {
  ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
  ctx.globalAlpha = alpha; ctx.fillStyle = p.tone > .72 ? '#a83d65' : p.tone > .35 ? '#e96f92' : '#f4a6b9';
  ctx.beginPath(); ctx.moveTo(0, -p.size); ctx.bezierCurveTo(p.size*1.15, -p.size*.45, p.size*1.05, p.size*.65, 0, p.size); ctx.bezierCurveTo(-p.size*1.05, p.size*.65, -p.size*1.15, -p.size*.45, 0, -p.size); ctx.fill();
  ctx.restore();
}

function drawRelations(mode, time) {
  const settings = {
    mesh: [78, .15], trust: [72, .11], branch: [58, .16], merge: [52, .10],
    foreground: [48, .08], bloom: [62, .13], close: [38, .10],
  }[mode];
  if (!settings) return;
  const [limit, alpha] = settings;
  const links = [];
  ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = `rgba(168,61,101,${alpha})`;
  ctx.beginPath();
  for (let i=0; i<petals.length; i+=2) {
    if (petals[i].arriving) continue;
    let nearest=-1, best=limit*limit;
    for (let j=0; j<petals.length; j++) {
      if (i===j || petals[j].arriving) continue;
      const dx=petals[j].x-petals[i].x, dy=petals[j].y-petals[i].y, d2=dx*dx+dy*dy;
      if (d2<best) { best=d2; nearest=j; }
    }
    if (nearest>=0) {
      ctx.moveTo(petals[i].x,petals[i].y); ctx.lineTo(petals[nearest].x,petals[nearest].y);
      if (i%14===0) links.push([i,nearest]);
    }
  }
  ctx.stroke();
  if (mode==='mesh' || mode==='trust') {
    ctx.fillStyle='rgba(255,245,247,.95)';
    links.forEach(([a,b],k)=>{
      const phase=(time*.00042+k*.19)%1;
      const x=petals[a].x+(petals[b].x-petals[a].x)*phase;
      const y=petals[a].y+(petals[b].y-petals[a].y)*phase;
      ctx.beginPath(); ctx.arc(x,y,2.6,0,Math.PI*2); ctx.fill();
    });
  }
  ctx.restore();
}

function render(time = 0) {
  ctx.clearRect(0, 0, width, height);
  const mode = scenes[sceneIndex].mode;
  const attract = pointer.active ? .35 : 0;
  transition = Math.min(1, transition + .012);
  petals.forEach((p, i) => {
    const baseTarget = targetFor(p, mode, i, time);
    const target = livingTarget(baseTarget, p, mode, i, time);
    const arrivalTime = time - sceneStartedAt - p.arrivalDelay;

    if (p.arriving && arrivalTime < p.arrivalDuration) {
      const progress = Math.max(0, arrivalTime / p.arrivalDuration);
      const eased = 1 - Math.pow(1-progress, 3);
      const arc = Math.sin(progress*Math.PI);
      const dx = target.x-p.arrivalX, dy = target.y-p.arrivalY;
      const distance = Math.max(1, Math.hypot(dx,dy));
      const normalX = -dy/distance, normalY = dx/distance;
      const gust = Math.sin(progress*Math.PI*3+p.phase)*12*(1-progress);
      const nextX = p.arrivalX+dx*eased+normalX*(p.windCurve*arc+gust);
      const nextY = p.arrivalY+dy*eased+normalY*(p.windCurve*arc+gust);
      p.vx = nextX-p.x; p.vy = nextY-p.y; p.x=nextX; p.y=nextY;
    } else {
      if (p.arriving) { p.arriving=false; p.vx*=.18; p.vy*=.18; }
      const force = .0038 + transition * .0018;
      p.vx += (target.x - p.x) * force; p.vy += (target.y - p.y) * force;
      if (pointer.active) { const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx*dx+dy*dy; if (d2 < 180000) { p.vx += dx / (d2 + 500) * attract * 11; p.vy += dy / (d2 + 500) * attract * 11; } }
      p.vx *= .972; p.vy *= .972; p.x += p.vx; p.y += p.vy;
    }
    p.angle += p.spin + Math.sin(time*.001+p.phase)*.0018;
  });
  drawRelations(mode, time);
  petals.forEach((p) => drawPetal(p, .34 + Math.min(.58, Math.abs(p.vx)+Math.abs(p.vy))));
  requestAnimationFrame(render);
}

function setScene(next) {
  previousIndex = sceneIndex;
  const direction = next >= sceneIndex ? 1 : -1;
  sceneIndex = (next + scenes.length) % scenes.length; transition = 0; sceneStartedAt = performance.now();
  const s = scenes[sceneIndex];
  kickerEl.textContent = s.kicker; titleEl.innerHTML = s.title; captionEl.textContent = s.caption; sceneNumberEl.textContent = String(sceneIndex + 1).padStart(2, '0');
  contentEl.classList.remove('scene-enter');
  void contentEl.offsetWidth;
  contentEl.classList.add('scene-enter');
  qrPlaceholders.classList.toggle('visible', s.mode === 'close');
  qrPlaceholders.setAttribute('aria-hidden', s.mode === 'close' ? 'false' : 'true');
  const id = s.photo && photoIds[s.photo];
  photoLayer.classList.remove('visible');
  if (id) { photoLayer.style.backgroundImage = `url('assets/foto-${s.photo}.jpg')`; requestAnimationFrame(() => photoLayer.classList.add('visible')); }
  else photoLayer.style.backgroundImage = 'none';
  if (hasStarted) prepareContinuityTransition(direction);
  else { prepareWindArrival(direction); hasStarted=true; }
}

document.querySelector('#next').addEventListener('click', () => setScene(sceneIndex + 1));
document.querySelector('#prev').addEventListener('click', () => setScene(sceneIndex - 1));
document.querySelector('#restart').addEventListener('click', () => setScene(0));
document.querySelector('#fullscreen').addEventListener('click', () => document.documentElement.requestFullscreen?.());
window.addEventListener('keydown', (e) => { if (['ArrowRight',' '].includes(e.key)) { e.preventDefault(); setScene(sceneIndex+1); } if (e.key === 'ArrowLeft') setScene(sceneIndex-1); if (e.key.toLowerCase() === 'r') setScene(0); if (e.key.toLowerCase() === 'f') document.documentElement.requestFullscreen?.(); });
window.addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; });
window.addEventListener('pointerleave', () => { pointer.active = false; });
window.addEventListener('resize', () => { resize(); makePetals(); sceneStartedAt=performance.now(); prepareWindArrival(1); });

resize(); makePetals(); setScene(0); requestAnimationFrame(render);
