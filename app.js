/* ════════════════════════════════════════════════════════════════════
   EndoRX · Simulador interactivo de radiología endodóntica
   SPA en vanilla JS: radiografía vectorial SVG de un molar inferior,
   capas anatómicas, filtros de imagen en vivo y quiz de diagnóstico.
   ════════════════════════════════════════════════════════════════════ */

'use strict';

/* ───────────────────────── 1. DATOS ANATÓMICOS ─────────────────────────
   Cada estructura define su geometría SVG (overlay + zona de hotspot),
   color de resaltado, densidad radiográfica y ficha clínica. */

const STRUCTURES = [
  {
    id: 'enamel',
    name: 'Esmalte',
    color: '#22d3ee',
    density: 'Radiopaco',
    shape: { type: 'path', d: 'M150,258 C146,205 144,160 163,131 C176,111 196,108 214,121 C228,130 252,130 266,121 C284,108 304,111 317,131 C336,160 334,205 330,258 L322,250 C326,205 322,170 308,148 C296,131 282,129 268,138 C252,148 228,148 212,138 C198,129 184,131 172,148 C158,170 154,205 158,250 Z' },
    hotspotStroke: 14,
    desc: 'Capa más externa y mineralizada del diente (96% mineral). Es la estructura más radiopaca del cuerpo humano: aparece blanca brillante coronando la corona.',
    endo: 'Su pérdida por caries abre la puerta de entrada bacteriana hacia la pulpa. En la radiografía, una interrupción del esmalte sugiere el punto de origen de la infección pulpar.',
  },
  {
    id: 'dentin',
    name: 'Dentina',
    color: '#a78bfa',
    density: 'Radiopaco medio',
    shape: { type: 'path', d: 'M158,250 C154,205 158,170 172,148 C184,131 198,129 212,138 C228,148 252,148 268,138 C282,129 296,131 308,148 C322,170 326,205 322,250 C330,295 326,345 320,385 C314,425 310,452 305,470 C301,475 298,472 297,466 C294,430 290,392 282,355 C276,328 264,310 252,308 C244,307 238,307 230,309 C218,312 206,330 200,358 C193,392 188,430 185,464 C184,471 179,474 175,469 C170,450 165,420 161,385 C155,345 150,295 158,250 Z' },
    hotspotStroke: 0,
    desc: 'Tejido intermedio que forma el grueso del diente, menos mineralizado que el esmalte (gris medio). Contiene túbulos que comunican con la pulpa.',
    endo: 'La caries avanza rápido en dentina. Su grosor remanente sobre la cámara pulpar determina si el diente es restaurable o requiere tratamiento de conductos.',
  },
  {
    id: 'pulp',
    name: 'Cámara Pulpar',
    color: '#f472b6',
    density: 'Radiolúcido',
    shape: { type: 'path', d: 'M205,240 C203,215 206,190 213,178 C216,172 221,176 222,184 C224,196 230,200 240,200 C250,200 256,196 258,184 C259,176 264,172 267,178 C274,190 277,215 275,240 C270,248 258,252 240,252 C222,252 210,248 205,240 Z' },
    hotspotStroke: 10,
    desc: 'Espacio central de la corona que aloja la pulpa dental (nervio y vasos). Al ser tejido blando, aparece como una zona oscura (radiolúcida) con dos cuernos pulpares.',
    endo: 'Es el punto de acceso del tratamiento de conductos: la apertura cameral se diseña sobre su anatomía. Una cámara calcificada (poco visible) anticipa un acceso difícil.',
  },
  {
    id: 'canals',
    name: 'Conductos Radiculares',
    color: '#fbbf24',
    density: 'Radiolúcido',
    shape: {
      type: 'multi',
      paths: [
        'M224,246 C214,300 206,355 196,410 C192,434 185,454 177,464 C182,442 188,410 192,378 C198,332 206,288 213,245 Z',
        'M258,246 C266,300 274,355 283,408 C287,432 294,452 302,464 C297,442 291,410 287,378 C281,332 273,288 268,245 Z',
      ],
    },
    hotspotStroke: 16,
    desc: 'Conductos estrechos y radiolúcidos que descienden por el interior de cada raíz, desde el piso de la cámara hasta el ápice. Este molar muestra conducto mesial y distal.',
    endo: 'Son el objetivo del tratamiento: deben localizarse, instrumentarse y obturarse en toda su longitud. Un conducto que «desaparece» en la imagen sugiere calcificación o bifurcación.',
  },
  {
    id: 'apex',
    name: 'El Ápice',
    color: '#34d399',
    density: 'Referencia',
    shape: {
      type: 'multi',
      circles: [
        { cx: 178, cy: 466, r: 22 },
        { cx: 303, cy: 466, r: 22 },
      ],
    },
    hotspotStroke: 8,
    desc: 'Punta terminal de cada raíz, donde el paquete vasculonervioso entra al diente por el foramen apical.',
    endo: 'Marca el límite de trabajo: la obturación debe terminar a 0.5–1 mm del ápice radiográfico. Las lesiones por infección pulpar aparecen precisamente alrededor de esta zona.',
  },
  {
    id: 'lesion',
    name: 'Lesión Periapical',
    color: '#f87171',
    density: 'Radiolúcido',
    shape: { type: 'ellipse', cx: 172, cy: 472, rx: 36, ry: 30 },
    hotspotStroke: 10,
    desc: 'Zona radiolúcida (oscura) que rodea el ápice de la raíz mesial: el hueso se ha reabsorbido por la infección de origen pulpar (periodontitis apical).',
    endo: 'Es el signo radiográfico clásico de necrosis pulpar. Confirma la indicación de endodoncia y permite monitorizar la curación ósea en los controles posteriores.',
  },
];

/* ─────────────────── 2. PREGUNTAS DEL QUIZ ───────────────────
   Cada pregunta apunta a una geometría de impacto generosa
   (independiente de los overlays de aprendizaje). */

const QUIZ_QUESTIONS = [
  {
    id: 'q-lesion',
    text: 'Haz clic sobre la lesión periapical (la zona de infección en el hueso).',
    target: { type: 'circle', cx: 172, cy: 472, r: 48 },
    structure: 'lesion',
    success: 'Esa zona radiolúcida alrededor del ápice mesial es una periodontitis apical: el hueso se reabsorbió por la infección que sale del conducto.',
    hint: 'Busca una «sombra» oscura y redondeada alrededor de la punta de una raíz. La pista parpadea sobre la zona.',
  },
  {
    id: 'q-canal-mesial',
    text: 'Identifica el conducto MESIAL (recuerda: en esta placa, mesial queda a la izquierda).',
    target: { type: 'poly', points: '230,238 188,470 158,470 200,238' },
    structure: 'canals',
    success: 'Correcto: es la línea radiolúcida fina que baja por la raíz mesial, desde el piso cameral hasta el ápice. Es el conducto más difícil de negociar en molares inferiores.',
    hint: 'Sigue la línea oscura y delgada dentro de la raíz izquierda, desde la cámara hacia abajo.',
  },
  {
    id: 'q-pulp',
    text: 'Señala la cámara pulpar.',
    target: { type: 'circle', cx: 240, cy: 215, r: 50 },
    structure: 'pulp',
    success: 'Exacto: el espacio radiolúcido central de la corona, con sus dos cuernos pulpares. Aquí se realiza la apertura de acceso.',
    hint: 'Está en el centro de la corona, por debajo del esmalte: una zona oscura con forma de «M» invertida.',
  },
  {
    id: 'q-apex-distal',
    text: 'Haz clic sobre el ápice de la raíz DISTAL (derecha).',
    target: { type: 'circle', cx: 303, cy: 466, r: 42 },
    structure: 'apex',
    success: 'Bien: la punta de la raíz distal. Fíjate que aquí la lámina dura está íntegra — no hay lesión, a diferencia del ápice mesial.',
    hint: 'Es la punta inferior de la raíz derecha, donde termina el conducto distal.',
  },
  {
    id: 'q-enamel',
    text: 'Identifica el esmalte (la estructura más radiopaca de la imagen).',
    target: { type: 'path', d: STRUCTURES[0].shape.d, stroke: 26 },
    structure: 'enamel',
    success: 'Correcto: la capa blanca brillante que corona el diente. Al ser el tejido más mineralizado, bloquea casi todos los rayos X.',
    hint: 'Busca lo MÁS BLANCO de toda la radiografía: el casquete que recubre la corona.',
  },
];

/* ─────────────────── 3. RADIOGRAFÍA VECTORIAL (SVG) ─────────────────── */

function shapeToSvg(shape, attrs) {
  if (shape.type === 'path') return `<path d="${shape.d}" ${attrs}/>`;
  if (shape.type === 'ellipse') return `<ellipse cx="${shape.cx}" cy="${shape.cy}" rx="${shape.rx}" ry="${shape.ry}" ${attrs}/>`;
  if (shape.type === 'multi') {
    let out = '';
    (shape.paths || []).forEach((d) => (out += `<path d="${d}" ${attrs}/>`));
    (shape.circles || []).forEach((c) => (out += `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" ${attrs}/>`));
    return out;
  }
  return '';
}

function buildXraySvg() {
  const toothOutline = STRUCTURES[1].shape.d; // contorno completo del diente (dentina)

  const overlays = STRUCTURES.map((s) => {
    const attrs = `fill="${s.color}" fill-opacity="0.30" stroke="${s.color}" stroke-width="2" stroke-opacity="0.9"`;
    return `<g id="overlay-${s.id}" class="anatomy-overlay">${shapeToSvg(s.shape, attrs)}</g>`;
  }).join('');

  const hotspots = STRUCTURES.map((s) => {
    const attrs = `class="anatomy-hotspot" data-structure="${s.id}" stroke-width="${s.hotspotStroke || 0}"`;
    return shapeToSvg(s.shape, attrs);
  }).join('');

  return `
  <svg id="xray-svg" viewBox="0 0 480 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g-vignette" cx="50%" cy="48%" r="72%">
        <stop offset="60%" stop-color="black" stop-opacity="0"/>
        <stop offset="100%" stop-color="black" stop-opacity="0.55"/>
      </radialGradient>
      <linearGradient id="g-bone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#9a9a9a"/>
        <stop offset="55%" stop-color="#7e7e7e"/>
        <stop offset="100%" stop-color="#6a6a6a"/>
      </linearGradient>
      <linearGradient id="g-dentin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#cfcfcf"/>
        <stop offset="45%" stop-color="#bdbdbd"/>
        <stop offset="100%" stop-color="#a8a8a8"/>
      </linearGradient>
      <linearGradient id="g-enamel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fafafa"/>
        <stop offset="100%" stop-color="#e2e2e2"/>
      </linearGradient>
      <radialGradient id="g-lesion" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#1c1c1c"/>
        <stop offset="65%" stop-color="#333333"/>
        <stop offset="100%" stop-color="#333333" stop-opacity="0"/>
      </radialGradient>
      <filter id="f-blur1"><feGaussianBlur stdDeviation="1"/></filter>
      <filter id="f-blur2"><feGaussianBlur stdDeviation="2"/></filter>
      <filter id="f-blur5"><feGaussianBlur stdDeviation="5"/></filter>
      <filter id="f-bone-noise" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="3" seed="7" stitchTiles="stitch" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.55  0 0 0 0 0.55  0 0 0 0.35 0"/>
        <feComposite operator="in" in2="SourceGraphic"/>
      </filter>
      <filter id="f-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" stitchTiles="stitch" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0"/>
      </filter>
    </defs>

    <!-- ░ Película: este grupo recibe los filtros brillo/contraste ░ -->
    <g id="film">
      <!-- Cavidad oral (fondo radiolúcido) -->
      <rect x="0" y="0" width="480" height="600" fill="#0d0d0d"/>

      <!-- Hueso alveolar con cresta ósea -->
      <path d="M0,600 L0,338 C55,320 105,314 140,318 C145,304 149,294 153,290 L327,290 C331,296 335,306 340,318 C375,313 425,318 480,332 L480,600 Z" fill="url(#g-bone)"/>
      <path d="M0,600 L0,338 C55,320 105,314 140,318 C145,304 149,294 153,290 L327,290 C331,296 335,306 340,318 C375,313 425,318 480,332 L480,600 Z" filter="url(#f-bone-noise)" fill="#777"/>
      <!-- Trabéculas óseas sutiles -->
      <g stroke="#8f8f8f" stroke-width="1.5" opacity="0.5" filter="url(#f-blur1)">
        <path d="M30,380 q25,-10 50,4 M50,440 q30,-14 55,2 M28,510 q28,-10 56,6 M70,560 q25,-12 52,0" fill="none"/>
        <path d="M390,370 q26,-8 54,6 M400,430 q28,-12 55,2 M385,500 q30,-10 58,4 M410,556 q24,-10 50,2" fill="none"/>
        <path d="M215,540 q26,-10 52,4 M230,500 q22,-8 44,4" fill="none"/>
      </g>

      <!-- Dientes adyacentes (bordes parciales) -->
      <g filter="url(#f-blur2)">
        <path d="M-10,260 C10,230 38,225 55,250 C66,268 70,300 66,330 C62,380 58,430 52,460 C48,472 38,472 34,458 C28,420 20,360 10,320 Z" fill="#b9b9b9" opacity="0.9"/>
        <path d="M490,265 C470,235 442,230 426,255 C415,272 412,302 416,332 C420,382 424,430 430,458 C434,470 444,470 448,456 C454,418 462,362 472,322 Z" fill="#b9b9b9" opacity="0.9"/>
      </g>

      <!-- Lesión periapical (radiolúcida) sobre el ápice mesial -->
      <ellipse cx="172" cy="472" rx="44" ry="36" fill="url(#g-lesion)" filter="url(#f-blur5)"/>

      <!-- Lámina dura (línea radiopaca) + espacio del ligamento periodontal -->
      <path d="${toothOutline}" fill="none" stroke="#dedede" stroke-width="9" filter="url(#f-blur1)"/>
      <path d="${toothOutline}" fill="none" stroke="#2e2e2e" stroke-width="4" filter="url(#f-blur1)"/>

      <!-- Cuerpo del diente: dentina -->
      <path d="${toothOutline}" fill="url(#g-dentin)"/>

      <!-- Casquete de esmalte -->
      <path d="${STRUCTURES[0].shape.d}" fill="url(#g-enamel)" filter="url(#f-blur1)"/>

      <!-- Cámara pulpar y conductos (radiolúcidos) -->
      <g fill="#2b2b2b" filter="url(#f-blur1)">
        <path d="${STRUCTURES[2].shape.d}"/>
        ${STRUCTURES[3].shape.paths.map((d) => `<path d="${d}"/>`).join('')}
      </g>

      <!-- Restauración oclusal radiopaca (detalle realista) -->
      <path d="M232,128 C240,122 252,122 260,127 C262,134 261,142 256,146 C248,150 240,149 235,144 C231,139 230,133 232,128 Z" fill="#ffffff" opacity="0.95" filter="url(#f-blur1)"/>

      <!-- Grano de película + viñeta -->
      <rect x="0" y="0" width="480" height="600" filter="url(#f-grain)"/>
      <rect x="0" y="0" width="480" height="600" fill="url(#g-vignette)"/>
    </g>

    <!-- ░ Overlays educativos (fuera del grupo filtrado) ░ -->
    <g id="overlays">${overlays}</g>

    <!-- ░ Capa del quiz: pistas y marcadores ░ -->
    <g id="quiz-layer"></g>

    <!-- ░ Hotspots interactivos ░ -->
    <g id="hotspots">${hotspots}</g>
  </svg>`;
}

/* ─────────────────────────── 4. ESTADO Y DOM ─────────────────────────── */

const $ = (sel) => document.querySelector(sel);

const state = {
  mode: 'learn',
  litStructure: null,
  pinned: false,
  brightness: 100,
  contrast: 100,
  inverted: false,
  quiz: { active: false, order: [], index: 0, score: 0, failsOnCurrent: 0, locked: false },
};

document.getElementById('xray-container').innerHTML = buildXraySvg();
const svg = document.getElementById('xray-svg');
const film = document.getElementById('film');
const frame = document.getElementById('xray-frame');
const tooltip = document.getElementById('tooltip');
$('#hud-date').textContent = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

/* ─────────────── 5. MODO APRENDIZAJE: capas + tooltip ─────────────── */

const structureList = document.getElementById('structure-list');
STRUCTURES.forEach((s) => {
  const btn = document.createElement('button');
  btn.className = 'structure-btn';
  btn.dataset.structure = s.id;
  btn.style.setProperty('--sc', s.color);
  btn.innerHTML = `<span class="dot"></span><span>${s.name}</span><span class="ml-auto text-[9px] font-mono uppercase tracking-wider text-slate-500">${s.density}</span>`;
  btn.addEventListener('click', () => {
    if (state.pinned && state.litStructure === s.id) {
      unlight();
    } else {
      light(s.id, { pin: true });
      positionTooltipNearFrame();
    }
  });
  structureList.appendChild(btn);
});

function getStructure(id) {
  return STRUCTURES.find((s) => s.id === id);
}

function light(id, { pin = false } = {}) {
  unlight(true);
  state.litStructure = id;
  state.pinned = pin;
  document.getElementById(`overlay-${id}`).classList.add('lit');
  const btn = structureList.querySelector(`[data-structure="${id}"]`);
  if (btn) btn.classList.add('active');
  fillTooltip(getStructure(id));
  tooltip.classList.remove('hidden');
}

function unlight(keepTooltip = false) {
  if (state.litStructure) {
    document.getElementById(`overlay-${state.litStructure}`).classList.remove('lit');
    const btn = structureList.querySelector(`[data-structure="${state.litStructure}"]`);
    if (btn) btn.classList.remove('active');
  }
  state.litStructure = null;
  state.pinned = false;
  if (!keepTooltip) tooltip.classList.add('hidden');
}

function fillTooltip(s) {
  $('#tooltip-title').textContent = s.name;
  $('#tooltip-desc').textContent = s.desc;
  $('#tooltip-endo').textContent = s.endo;
  $('#tooltip-density').textContent = s.density;
  $('#tooltip-dot').style.background = s.color;
  $('#tooltip-dot').style.boxShadow = `0 0 8px ${s.color}`;
}

function positionTooltipAt(clientX, clientY) {
  const main = document.querySelector('main');
  const r = main.getBoundingClientRect();
  let x = clientX - r.left + 18;
  let y = clientY - r.top + 18;
  const tw = 300, th = tooltip.offsetHeight || 180;
  if (x + tw > r.width - 12) x = clientX - r.left - tw - 18;
  if (y + th > r.height - 12) y = clientY - r.top - th - 18;
  tooltip.style.left = `${Math.max(12, x)}px`;
  tooltip.style.top = `${Math.max(12, y)}px`;
}

function positionTooltipNearFrame() {
  const main = document.querySelector('main').getBoundingClientRect();
  const fr = frame.getBoundingClientRect();
  const x = Math.min(fr.right - main.left + 16, main.width - 312);
  tooltip.style.left = `${Math.max(12, x)}px`;
  tooltip.style.top = `${fr.top - main.top + 8}px`;
}

// Hover sobre los hotspots de la radiografía
svg.addEventListener('pointermove', (e) => {
  if (state.mode === 'quiz') return;
  const hs = e.target.closest('.anatomy-hotspot');
  if (hs) {
    const id = hs.dataset.structure;
    if (state.litStructure !== id) light(id);
    else state.pinned = false;
    positionTooltipAt(e.clientX, e.clientY);
  } else if (!state.pinned && state.litStructure) {
    unlight();
  }
});
svg.addEventListener('pointerleave', () => {
  if (state.mode !== 'quiz' && !state.pinned) unlight();
});

/* ─────────────── 6. SIMULADOR DE FILTROS (brillo/contraste) ─────────────── */

const sliderB = $('#slider-brightness');
const sliderC = $('#slider-contrast');

function applyFilters() {
  const inv = state.inverted ? ' invert(1)' : '';
  film.style.filter = `brightness(${state.brightness}%) contrast(${state.contrast}%)${inv}`;
  $('#val-brightness').textContent = `${state.brightness}%`;
  $('#val-contrast').textContent = `${state.contrast}%`;
  $('#hud-brightness').textContent = state.brightness;
  $('#hud-contrast').textContent = state.contrast;
}

sliderB.addEventListener('input', () => { state.brightness = +sliderB.value; applyFilters(); });
sliderC.addEventListener('input', () => { state.contrast = +sliderC.value; applyFilters(); });
$('#btn-invert').addEventListener('click', () => { state.inverted = !state.inverted; applyFilters(); });
$('#btn-reset-filters').addEventListener('click', () => {
  state.brightness = 100; state.contrast = 100; state.inverted = false;
  sliderB.value = 100; sliderC.value = 100;
  applyFilters();
});

/* ─────────────────────────── 7. QUIZ ─────────────────────────── */

const quizLayer = document.getElementById('quiz-layer');
const qText = $('#quiz-question');
const qFeedback = $('#quiz-feedback');
const qProgress = $('#quiz-progress');
const qScore = $('#quiz-score');
const btnStart = $('#btn-quiz-start');
const btnSkip = $('#btn-quiz-skip');

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clientToSvgPoint(e) {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

// Geometría de impacto temporal (invisible) para isPointInFill/Stroke
function buildTargetEl(target) {
  const NS = 'http://www.w3.org/2000/svg';
  let el;
  if (target.type === 'circle') {
    el = document.createElementNS(NS, 'circle');
    el.setAttribute('cx', target.cx); el.setAttribute('cy', target.cy); el.setAttribute('r', target.r);
  } else if (target.type === 'poly') {
    el = document.createElementNS(NS, 'polygon');
    el.setAttribute('points', target.points);
  } else {
    el = document.createElementNS(NS, 'path');
    el.setAttribute('d', target.d);
    if (target.stroke) el.setAttribute('stroke-width', target.stroke);
  }
  el.setAttribute('fill', 'none');
  el.setAttribute('visibility', 'hidden');
  return el;
}

function hitTest(target, svgPt) {
  const el = buildTargetEl(target);
  quizLayer.appendChild(el);
  const pt = svg.createSVGPoint();
  pt.x = svgPt.x; pt.y = svgPt.y;
  let hit = false;
  try {
    hit = el.isPointInFill(pt) || (target.stroke ? el.isPointInStroke(pt) : false);
  } catch {
    const b = el.getBBox();
    hit = svgPt.x >= b.x && svgPt.x <= b.x + b.width && svgPt.y >= b.y && svgPt.y <= b.y + b.height;
  }
  el.remove();
  return hit;
}

function clearQuizLayer() {
  quizLayer.innerHTML = '';
}

function currentQuestion() {
  return state.quiz.order[state.quiz.index];
}

function showQuestion() {
  clearQuizLayer();
  state.quiz.failsOnCurrent = 0;
  state.quiz.locked = false;
  const q = currentQuestion();
  qProgress.textContent = `Pregunta ${state.quiz.index + 1}/${state.quiz.order.length}`;
  qText.textContent = q.text;
  qFeedback.textContent = 'Haz clic directamente sobre la radiografía.';
  qFeedback.className = 'text-[12px] mt-3 leading-relaxed text-slate-400';
}

function startQuiz() {
  state.quiz.active = true;
  state.quiz.order = shuffled(QUIZ_QUESTIONS);
  state.quiz.index = 0;
  state.quiz.score = 0;
  qScore.textContent = '✓ 0';
  btnStart.textContent = 'Reiniciar quiz';
  btnSkip.classList.remove('hidden');
  frame.classList.add('quiz-active');
  unlight();
  showQuestion();
}

function endQuiz() {
  state.quiz.active = false;
  clearQuizLayer();
  frame.classList.remove('quiz-active');
  btnSkip.classList.add('hidden');
  const total = state.quiz.order.length;
  const pct = Math.round((state.quiz.score / total) * 100);
  qProgress.textContent = `Completado`;
  qText.textContent = `Resultado: ${state.quiz.score}/${total} aciertos (${pct}%).`;
  qFeedback.textContent =
    pct === 100 ? '¡Diagnóstico impecable! Nivel: endodoncista.'
    : pct >= 60 ? 'Buen ojo radiográfico. Repasa las estructuras que fallaste en el Modo Aprendizaje.'
    : 'Te recomendamos volver al Modo Aprendizaje y repasar la anatomía antes de reintentar.';
  btnStart.textContent = 'Reintentar quiz';
}

function nextQuestion() {
  state.quiz.index++;
  if (state.quiz.index >= state.quiz.order.length) endQuiz();
  else showQuestion();
}

function drawClickMarker(pt, ok) {
  const NS = 'http://www.w3.org/2000/svg';
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('class', 'quiz-click-marker');
  const color = ok ? '#34d399' : '#f87171';
  g.innerHTML = `
    <circle cx="${pt.x}" cy="${pt.y}" r="10" fill="none" stroke="${color}" stroke-width="2.5"/>
    <line x1="${pt.x - 16}" y1="${pt.y}" x2="${pt.x - 6}" y2="${pt.y}" stroke="${color}" stroke-width="2"/>
    <line x1="${pt.x + 6}" y1="${pt.y}" x2="${pt.x + 16}" y2="${pt.y}" stroke="${color}" stroke-width="2"/>
    <line x1="${pt.x}" y1="${pt.y - 16}" x2="${pt.x}" y2="${pt.y - 6}" stroke="${color}" stroke-width="2"/>
    <line x1="${pt.x}" y1="${pt.y + 6}" x2="${pt.x}" y2="${pt.y + 16}" stroke="${color}" stroke-width="2"/>`;
  quizLayer.appendChild(g);
  setTimeout(() => g.remove(), 1300);
}

function drawHintRing(target) {
  const el = buildTargetEl(target);
  quizLayer.appendChild(el);
  const b = el.getBBox();
  el.remove();
  const NS = 'http://www.w3.org/2000/svg';
  const ring = document.createElementNS(NS, 'ellipse');
  ring.setAttribute('class', 'quiz-hint-ring');
  ring.setAttribute('cx', b.x + b.width / 2);
  ring.setAttribute('cy', b.y + b.height / 2);
  ring.setAttribute('rx', b.width / 2 + 8);
  ring.setAttribute('ry', b.height / 2 + 8);
  ring.dataset.hint = '1';
  quizLayer.appendChild(ring);
}

function fireConfetti() {
  const layer = document.getElementById('confetti-layer');
  const colors = ['#22d3ee', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#ffffff'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.background = colors[i % colors.length];
    const ang = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 220;
    p.style.setProperty('--cx', `${Math.cos(ang) * dist}px`);
    p.style.setProperty('--cy', `${Math.sin(ang) * dist + 120}px`);
    p.style.setProperty('--cr', `${(Math.random() * 720 - 360).toFixed(0)}deg`);
    p.style.animationDelay = `${Math.random() * 0.12}s`;
    layer.appendChild(p);
    setTimeout(() => p.remove(), 1700);
  }
}

svg.addEventListener('click', (e) => {
  if (state.mode !== 'quiz' || !state.quiz.active || state.quiz.locked) return;
  const q = currentQuestion();
  const pt = clientToSvgPoint(e);
  const ok = hitTest(q.target, pt);
  drawClickMarker(pt, ok);

  if (ok) {
    state.quiz.locked = true;
    state.quiz.score++;
    qScore.textContent = `✓ ${state.quiz.score}`;
    frame.classList.remove('flash-error');
    frame.classList.add('flash-success');
    setTimeout(() => frame.classList.remove('flash-success'), 1000);
    fireConfetti();
    qFeedback.textContent = `✅ ${q.success}`;
    qFeedback.className = 'text-[12px] mt-3 leading-relaxed text-emerald-300';
    // Ilumina brevemente la estructura como refuerzo educativo
    const ov = document.getElementById(`overlay-${q.structure}`);
    ov.classList.add('lit');
    setTimeout(() => ov.classList.remove('lit'), 2200);
    setTimeout(nextQuestion, 2500);
  } else {
    state.quiz.failsOnCurrent++;
    frame.classList.remove('flash-success');
    frame.classList.add('flash-error');
    setTimeout(() => frame.classList.remove('flash-error'), 900);
    qFeedback.textContent = `❌ Ahí no. ${q.hint}`;
    qFeedback.className = 'text-[12px] mt-3 leading-relaxed text-red-300';
    if (state.quiz.failsOnCurrent >= 1 && !quizLayer.querySelector('[data-hint]')) {
      drawHintRing(q.target);
    }
  }
});

btnStart.addEventListener('click', startQuiz);
btnSkip.addEventListener('click', () => {
  if (state.quiz.active && !state.quiz.locked) nextQuestion();
});

/* ─────────────────── 8. NAVEGACIÓN ENTRE MÓDULOS ─────────────────── */

const MODE_LABELS = {
  learn: 'Modo Aprendizaje',
  filters: 'Simulador de Filtros',
  quiz: 'Quiz de Diagnóstico',
};

document.querySelectorAll('.mode-btn').forEach((btn) => {
  btn.addEventListener('click', () => setMode(btn.dataset.mode));
});

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll('.mode-btn').forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
  document.querySelectorAll('.mode-panel').forEach((p) => p.classList.add('hidden'));
  document.getElementById(`panel-${mode}`).classList.remove('hidden');
  $('#mode-label').textContent = MODE_LABELS[mode];

  const inQuiz = mode === 'quiz';
  document.getElementById('hotspots').style.display = inQuiz ? 'none' : '';
  frame.classList.toggle('quiz-active', inQuiz && state.quiz.active);
  unlight();
  if (!inQuiz) clearQuizLayer();
  else if (state.quiz.active) showQuestion();
}

applyFilters();
