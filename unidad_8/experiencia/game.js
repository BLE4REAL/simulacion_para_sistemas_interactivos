import { LofiAudio } from '../lofi.js';
const $ = id => document.getElementById(id);
const KEY = 'unidad8-el-atajo-conectar-v3';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const GOAL = 7;
const names = ['el motor', 'Lina', 'Nico', 'Ada', 'Ema', 'Sol', 'Teo', 'las ventanas'];
const LEVELS = [
  { people: 1, source: 1, updates: { 1: null }, chapter: 'I · Una salida', title: 'Haz que llegue.', narration: 'La señal enciende la ventana de quienes visita antes de llegar a casa.' },
  { people: 2, source: 2, updates: { 2: 0 }, chapter: 'II · El regreso', title: 'Ahora hay dos ventanas.', narration: 'La conexión que dejaste sigue ahí. Observa la salida nueva.' },
  { people: 3, source: 3, updates: { 3: GOAL }, chapter: 'III · El atajo', title: 'Llegar no es llegar a todos.', narration: 'Hay una ventana más. Mira a quién visita este recorrido.' },
  { people: 5, source: 4, updates: { 4: 2, 5: null }, chapter: 'IV · Dos ausencias', title: 'El barrio crece.', narration: 'Dos personas más. Hay un atajo y una salida que falta.' },
  { people: 6, source: 6, updates: { 6: GOAL, 5: null, 2: null }, chapter: 'V · Después del viento', title: 'Algo cambió durante la noche.', narration: 'El viento cortó dos cables. Una persona más necesita encontrar su camino.' }
];
const fresh = () => ({ version: 3, stage: 0, screen: 'play', routes: [1, null, null, null, null, null, null], lit: [], origin: null,
  stats: { connections: 0, conserved: 0, loops: 0, stops: 0, deliveries: 0 } });
let state = fresh(), packets = [], clock = 0, pointer = null, feedback = '';
let sound = null, soundEnabled = true, soundStep = 0;
function enableSound() { if (!soundEnabled) return; try { sound ||= new LofiAudio(); sound.setMuted(false); sound.resume().catch(() => {}); } catch { /* The scene remains playable without sound. */ } }
function soundPulse(voice, seed) { if (soundEnabled && sound && !document.hidden) sound.pulse({ voice, step: soundStep++, seed, velocity: 0.4 }); }
function valid(saved) {
  if (saved?.version !== 3 || !Number.isInteger(saved.stage) || saved.stage < 0 || saved.stage >= LEVELS.length) return false;
  const count = LEVELS[saved.stage].people;
  return ['play', 'between', 'ending'].includes(saved.screen) && (saved.screen !== 'ending' || saved.stage === LEVELS.length - 1) &&
    Array.isArray(saved.routes) && saved.routes.length === GOAL && saved.routes[0] === LEVELS[saved.stage].source &&
    Array.from(saved.routes).every((to, from) => from > count ? to === null : to === null || Number.isInteger(to) && to >= 0 && to <= GOAL && to !== from && (to === 0 || to === GOAL || to <= count)) &&
    (saved.origin === null || Number.isInteger(saved.origin) && saved.origin >= 1 && saved.origin <= count) &&
    Array.isArray(saved.lit) && saved.lit.length <= count && new Set(saved.lit).size === saved.lit.length && saved.lit.every(n => Number.isInteger(n) && n >= 1 && n <= count) &&
    saved.stats && Object.keys(fresh().stats).every(key => Number.isSafeInteger(saved.stats[key]) && saved.stats[key] >= 0 && saved.stats[key] <= 100000);
}

try { const saved = JSON.parse(localStorage.getItem(KEY)); if (valid(saved)) state = saved; } catch { /* Storage is optional; the previous story key is never changed. */ }
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* Continue without storage. */ } }
function activePeople() { return Array.from({ length: LEVELS[state.stage].people }, (_, i) => i + 1); }
function visibleNodes() { return [0, ...activePeople(), GOAL]; }
function layout() {
  const mobile = innerWidth <= 700;
  if (state.stage >= 3) return mobile ? [
    { x: 80, y: 90 }, { x: 330, y: 90 }, { x: 330, y: 270 }, { x: 330, y: 450 },
    { x: 80, y: 270 }, { x: 80, y: 450 }, { x: 80, y: 630 }, { x: 330, y: 630 }
  ] : [
    { x: 100, y: 130 }, { x: 850, y: 135 }, { x: 660, y: 220 }, { x: 450, y: 160 },
    { x: 240, y: 290 }, { x: 400, y: 440 }, { x: 750, y: 450 }, { x: 920, y: 430 }
  ];
  if (mobile) return state.stage === 0 ? [{ x: 72, y: 247 }, { x: 263, y: 178 }, null, null, null, null, null, { x: 478, y: 247 }] :
    state.stage === 1 ? [{ x: 66, y: 286 }, { x: 350, y: 135 }, { x: 228, y: 305 }, null, null, null, null, { x: 484, y: 275 }] :
      [{ x: 490, y: 265 }, { x: 166, y: 143 }, { x: 316, y: 128 }, { x: 365, y: 310 }, null, null, null, { x: 65, y: 300 }];
  return state.stage === 0 ? [{ x: 125, y: 255 }, { x: 449, y: 183 }, null, null, null, null, null, { x: 790, y: 255 }] :
    state.stage === 1 ? [{ x: 102, y: 285 }, { x: 548, y: 147 }, { x: 316, y: 289 }, null, null, null, null, { x: 806, y: 275 }] :
      [{ x: 811, y: 270 }, { x: 303, y: 140 }, { x: 534, y: 155 }, { x: 640, y: 312 }, null, null, null, { x: 104, y: 290 }];
}

function curve(from, to, freePoint = null) {
  const points = layout(), a = points[from], b = freePoint || points[to];
  const length = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)), dx = (b.x - a.x) / length, dy = (b.y - a.y) / length;
  const bend = to !== null && to < from ? 40 : -19;
  if (innerWidth <= 700 && state.stage >= 3 && !freePoint) {
    if (from === 0 && to === 6) return { x1: a.x - 32, y1: a.y + 10, x2: b.x - 38, y2: b.y, cx1: 4, cy1: 230, cx2: 4, cy2: 520, duration: length / 240 };
    if (from === 1 && to === GOAL) return { x1: a.x + 32, y1: a.y, x2: b.x + 46, y2: b.y + 10, cx1: 435, cy1: 210, cx2: 435, cy2: 540, duration: length / 240 };
    if (from === 6 && to === 4) return { x1: a.x + 34, y1: a.y, x2: b.x + 34, y2: b.y, cx1: 170, cy1: 540, cx2: 170, cy2: 350, duration: length / 240 };
  }
  return { x1: a.x + dx * 39, y1: a.y + dy * 39, x2: b.x - dx * (freePoint ? 0 : 43), y2: b.y - dy * (freePoint ? 0 : 43),
    cx1: a.x + dx * length * 0.34 - dy * bend, cy1: a.y + dy * length * 0.34 + dx * bend,
    cx2: a.x + dx * length * 0.68 - dy * bend, cy2: a.y + dy * length * 0.68 + dx * bend, duration: Math.max(0.65, length / 240) };
}
function pathData(c) { return `M${c.x1} ${c.y1}C${c.cx1} ${c.cy1} ${c.cx2} ${c.cy2} ${c.x2} ${c.y2}`; }
function pointOn(c, t) { const u = 1 - t; return { x: u ** 3 * c.x1 + 3 * u * u * t * c.cx1 + 3 * u * t * t * c.cx2 + t ** 3 * c.x2,
  y: u ** 3 * c.y1 + 3 * u * u * t * c.cy1 + 3 * u * t * t * c.cy2 + t ** 3 * c.y2 }; }
function nodeMarkup(id, p) {
  const isPerson = id > 0 && id < GOAL;
  const canEdit = state.screen === 'play' || state.screen === 'between';
  const clickable = canEdit && (state.origin !== null || isPerson);
  const selected = state.origin === id, destination = state.origin !== null && !selected && clickable;
  const label = selected ? `${names[id]}, origen elegido; volver a tocar cancela` : state.origin !== null ? `Conectar desde ${names[state.origin]} hacia ${names[id]}` : isPerson ? `${names[id]}, elegir como origen` : names[id];
  let content = `<g class="node ${isPerson ? 'person' : ''}${selected ? ' origin' : ''}${destination ? ' destination' : ''}" data-node="${id}" role="${clickable ? 'button' : 'img'}" tabindex="${clickable ? 0 : -1}" aria-label="${label}"><circle cx="${p.x}" cy="${p.y}" r="56" fill="transparent"/><circle class="halo" cx="${p.x}" cy="${p.y}" r="51"/>`;
  if (isPerson) content += `<path class="body" d="M${p.x - 18} ${p.y + 9}Q${p.x} ${p.y - 1} ${p.x + 18} ${p.y + 9}L${p.x + 23} ${p.y + 43}Q${p.x} ${p.y + 48} ${p.x - 23} ${p.y + 43}Z"/><path class="limb" d="M${p.x - 17} ${p.y + 18}l-17 10m51-10 17 10M${p.x - 10} ${p.y + 46}v12m20-12v12"/><circle class="head" cx="${p.x}" cy="${p.y - 13}" r="20"/><circle class="eye" cx="${p.x - 6}" cy="${p.y - 12}" r="2"/><circle class="eye" cx="${p.x + 6}" cy="${p.y - 12}" r="2"/><path class="limb" d="M${p.x - 4} ${p.y - 3}q4 3 8 0"/>`;
  else if (id === 0) content += `<rect class="machine" x="${p.x - 32}" y="${p.y - 30}" width="64" height="63" rx="7"/><path class="limb" d="M${p.x - 14} ${p.y - 6}l10 10 19-23M${p.x - 20} ${p.y + 18}h40"/>`;
  else {
    const people = activePeople(), columns = Math.min(3, people.length), rows = Math.ceil(people.length / 3), start = p.x - columns * 14 + 5;
    content += `<path class="house" d="M${p.x - 46} ${p.y - 15}l46-36 46 36v${rows > 1 ? 103 : 76}h-92Z"/>`;
    people.forEach((person, i) => { content += `<rect data-window="${person}" class="window${state.lit.includes(person) ? ' lit' : ''}" x="${start + (i % columns) * 28}" y="${p.y + 2 + Math.floor(i / columns) * 39}" width="17" height="23"/><text class="window-name" x="${start + (i % columns) * 28 + 8.5}" y="${p.y + 34 + Math.floor(i / columns) * 39}">${names[person]}</text>`; });
  }
  content += `<text class="name" x="${p.x}" y="${p.y + (id === GOAL && activePeople().length > 3 ? 110 : 78)}">${id === GOAL ? 'las ventanas' : names[id]}</text>`;
  if (selected || destination) content += `<text class="role" x="${p.x}" y="${p.y - 73}">${selected ? 'ORIGEN' : 'DESTINO'}</text>`;
  return content + '</g>';
}
function renderWorld() {
  const focus = document.activeElement?.closest?.('[data-node]')?.dataset.node;
  const mobile = innerWidth <= 700, points = layout();
  $('world').setAttribute('viewBox', mobile ? (state.stage >= 3 ? '0 0 440 760' : '0 0 550 460') : (state.stage >= 3 ? '0 0 1060 620' : '0 0 920 490'));
  let content = '<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="#171717" stroke-width="1.7"/></marker></defs>';
  content += `<path class="ground" d="M20 ${state.stage >= 3 ? (mobile ? 738 : 565) : (mobile ? 412 : 420)}H${state.stage >= 3 ? (mobile ? 420 : 1040) : (mobile ? 530 : 900)}"/>`;
  for (let from = 0; from <= LEVELS[state.stage].people; from++) {
    const to = state.routes[from];
    if (to !== null) content += `<path class="edge" d="${pathData(curve(from, to))}" marker-end="url(#arrow)"/>`;
    else if (from) content += `<circle class="stub" cx="${points[from].x + 32}" cy="${points[from].y + 20}" r="4"/>`;
  }
  content += '<path id="preview-connection" class="preview-line" marker-end="url(#arrow)"/>';
  visibleNodes().forEach(id => { content += nodeMarkup(id, points[id]); });
  content += '<g id="packets" aria-hidden="true"></g>';
  $('world').innerHTML = content;
  if (focus !== undefined) document.querySelector(`.node[data-node="${focus}"]`)?.focus({ preventScroll: true });
  updatePreview();
}
function updatePreview() {
  const line = $('preview-connection');
  if (!line) return;
  if (state.origin === null || !pointer || state.screen !== 'play') { line.removeAttribute('d'); return; }
  line.setAttribute('d', pathData(curve(state.origin, null, pointer)));
}
function renderText() {
  document.body.dataset.screen = state.screen;
  document.body.dataset.level = String(state.stage + 1);
  $('chapter').textContent = LEVELS[state.stage].chapter;
  $('title').textContent = state.screen === 'ending' ? 'Why bother?' : state.screen === 'between' ? 'Llegó.' : LEVELS[state.stage].title;
  $('narration').textContent = state.screen === 'ending' ? 'El camino funciona. Puedes dejarlo aquí o volver a probar.' : state.screen === 'between' ? 'La señal visitó a todos antes de llegar.' : LEVELS[state.stage].narration;
  $('instruction').textContent = state.screen === 'ending' ? '' : state.screen === 'between' ? 'Puedes seguir conectando o conservar este camino.' : state.origin !== null ? names[state.origin] + ' es el origen. Toca a quién llevará la señal.' : feedback || (state.stage === 0 ? 'Toca a Lina y después toca su destino.' : 'Sigue un pulso. Para cambiar una salida, toca origen y destino.');
  $('actions').innerHTML = state.screen === 'between' ? '<button data-action="continue">' + (state.stage === LEVELS.length - 1 ? 'Conservar este camino' : 'Dejarla así y seguir') + '</button>' : state.screen === 'ending' ? '<button data-action="restart">Volver a empezar</button>' : '';
  $('reflection').hidden = true;
  $('reflection').textContent = '';
}

function render() { renderText(); renderWorld(); }
function selectNode(id) {
  const canResume = state.screen === 'between';
  if (state.screen !== 'play' && !canResume || !visibleNodes().includes(id)) return;
  if (canResume) {
    if (id === 0 || id === GOAL) return;
    state.screen = 'play'; packets = []; clock = 0; feedback = '';
  }
  enableSound();
  if (state.origin === null) { if (id === 0 || id === GOAL) return; state.origin = id; pointer = null; }
  else if (state.origin === id) { state.origin = null; pointer = null; feedback = 'No cambiaste la conexión.'; }
  else {
    const origin = state.origin, old = state.routes[origin];
    state.routes[origin] = id; state.origin = null; pointer = null;
    if (old !== id) { state.stats.connections++; feedback = `${names[origin]} → ${names[id]}. Mira el próximo pulso.`; }
    else feedback = 'Elegiste el mismo destino. Esa conexión se conserva.';
    soundPulse('piano', origin);
  }
  save(); render();
  document.querySelector(`.node[data-node="${id > 0 && id < GOAL ? id : LEVELS[state.stage].source}"]`)?.focus({ preventScroll: true });
}
function continueStory() {
  if (state.screen !== 'between') return;
  enableSound(); state.stats.conserved++; packets = []; clock = 0; pointer = null; feedback = '';
  if (state.stage === LEVELS.length - 1) state.screen = 'ending';
  else {
    state.stage++; state.screen = 'play'; state.lit = []; state.origin = null;
    state.routes[0] = LEVELS[state.stage].source;
    for (const [from, to] of Object.entries(LEVELS[state.stage].updates)) state.routes[Number(from)] = to;
  }
  save(); render(); document.querySelector('.node[role="button"]')?.focus({ preventScroll: true });
}

function reset() { state = fresh(); packets = []; clock = 0; pointer = null; feedback = ''; save(); render(); }
document.addEventListener('click', event => {
  if (event.target.closest('#sound-toggle')) return;
  const node = event.target.closest('[data-node]'); if (node) { selectNode(Number(node.dataset.node)); return; }
  const action = event.target.closest('[data-action]'); if (action) { if (action.dataset.action === 'continue') continueStory(); else reset(); }
});
$('world').addEventListener('keydown', event => { const node = event.target.closest('[data-node][role="button"]'); if (node && ['Enter', ' '].includes(event.key)) { event.preventDefault(); selectNode(Number(node.dataset.node)); } else if (event.key === 'Escape' && state.origin !== null) { state.origin = null; pointer = null; save(); render(); } });
$('world').addEventListener('pointermove', event => { if (state.origin === null) return; const matrix = $('world').getScreenCTM(); if (matrix) { const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse()); pointer = { x: point.x, y: point.y }; updatePreview(); } });
$('world').addEventListener('focusin', event => { const node = event.target.closest('[data-node]'); if (state.origin !== null && node && Number(node.dataset.node) !== state.origin) { pointer = layout()[Number(node.dataset.node)]; updatePreview(); } });
$('world').addEventListener('pointerleave', () => { pointer = null; updatePreview(); });
$('restart').addEventListener('click', reset);
$('sound-toggle').addEventListener('click', () => { soundEnabled = !soundEnabled; if (sound) sound.setMuted(!soundEnabled); if (soundEnabled) enableSound(); $('sound-toggle').setAttribute('aria-pressed', String(soundEnabled)); $('sound-toggle').setAttribute('aria-label', soundEnabled ? 'Silenciar sonido' : 'Activar sonido'); $('sound-toggle').textContent = soundEnabled ? '♪' : '♩'; });
document.addEventListener('visibilitychange', () => { if (sound) sound.setMuted(!soundEnabled || document.hidden); });
addEventListener('resize', render);
function traceRoute() { const visited = [], seen = new Set(); let node = 0; while (node !== null && node !== GOAL && !seen.has(node)) { visited.push(node); seen.add(node); node = state.routes[node]; } return { visited, reachesGoal: node === GOAL, includesEveryone: node === GOAL && activePeople().every(person => visited.includes(person)) }; }
function tick(dt) {
  if (state.screen !== 'play' || document.hidden) return;
  clock += dt;
  if (clock >= 1.15 && packets.length < 7) { clock %= 1.15; soundPulse('bass', 0); packets.push({ from: 0, to: state.routes[0], t: 0, visited: [0], hops: 0 }); }
  let changed = false, transitioned = false;
  packets = packets.filter(packet => {
    if (transitioned) return false;
    packet.t += dt / curve(packet.from, packet.to).duration;
    if (packet.t < 1) return true;
    const arrived = packet.to; packet.hops++; soundPulse(arrived === GOAL ? 'piano' : arrived === 2 ? 'synth' : 'piano', arrived);
    if (arrived === GOAL) {
      state.stats.deliveries++; state.lit = activePeople().filter(person => packet.visited.includes(person)); changed = true;
      if (state.origin === null && state.lit.length === activePeople().length && traceRoute().includesEveryone) { state.screen = 'between'; state.origin = null; feedback = ''; transitioned = true; }
      else { const missing = activePeople().filter(person => !state.lit.includes(person)); feedback = `La ventana de ${missing.map(person => names[person]).join(' y ')} sigue a oscuras.`; }
      return false;
    }
    if (packet.visited.includes(arrived)) { state.stats.loops++; feedback = 'La señal volvió a un lugar por el que ya pasó.'; changed = true; return false; }
    packet.visited.push(arrived);
    const next = state.routes[arrived];
    if (next === null) { state.stats.stops++; feedback = `${names[arrived]} recibió la señal. Falta una salida.`; changed = true; return false; }
    if (packet.hops > LEVELS[state.stage].people + 2) return false;
    packet.from = arrived; packet.to = next; packet.t = 0; return true;
  });
  if (changed) {
    save(); renderText();
    document.querySelectorAll('[data-window]').forEach(window => window.classList.toggle('lit', state.lit.includes(Number(window.dataset.window))));
    if (transitioned) { packets = []; renderWorld(); $('actions').querySelector('button')?.focus({ preventScroll: true }); }
  }
  const layer = $('packets');
  if (layer) layer.innerHTML = reduced.matches ? '' : packets.map(packet => { const p = pointOn(curve(packet.from, packet.to), packet.t); return `<circle class="packet" cx="${p.x}" cy="${p.y}" r="5.5"/>`; }).join('');
}
let last = performance.now();
function frame(now) { const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; tick(dt); requestAnimationFrame(frame); }
render(); requestAnimationFrame(frame);
window.shortcutStory = { getState: () => JSON.parse(JSON.stringify({ ...state, round: state.stage + 1 })), getSimulation: () => ({ activePackets: packets.length, ...traceRoute() }) };
