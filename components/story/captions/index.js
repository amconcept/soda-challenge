/* =========================================================================
   SOD+A STORY — on-screen text runtime
   Real text laid over the film, driven by the film's own clock.
   Every frame is a pure function of film time, so pause, skip, seek, offscreen
   pause and speed all stay in sync with the picture and the narration.

   The text belongs to the MACHINE register (see engine/core.js): smooth motion
   at the film's full frame rate, two clean moves only.
     write  a pen wipes it on, left to right
     pop    the big word pops with a short burst
   Any line can carry a small label above it, which fades up first.
   `oneLine` stops a line wrapping; it runs past its box and only shrinks to stay in frame.
   Every line leaves the same way: erased left to right, gone by its end time.
   Each word still shivers on its own, so the text sits in the drawn world.

   Lines marked `curve` follow the ground: they are set on circles that share the
   planet's centre, read live from the camera, so they stay concentric with the
   world through zooms, the rotated side scenes and the dissolve. Where there is
   no planet the circle is so large the line is simply straight.

   Words, times, boxes and motions live in captions.data.js only.
   ========================================================================= */
import { clamp, lerp, eOut, eInOut, eOutBack, hash, paperFibres } from '../engine/core.js';
import { CAPTIONS } from './captions.data.js';

export { CAPTIONS };
export const MOTIONS = ['write', 'pop'];

const W = 1600, H = 900, U = H / 100;   // frame units; U = one cqh (1% of frame height) in units
const FPS = 24, BOIL = 8, EXIT = .3;
const SVG = 'http://www.w3.org/2000/svg';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

const CSS = `
.sc-frame{position:absolute;container-type:size;pointer-events:none;z-index:1;--sc-k:1}
.sc{position:absolute;display:none}
.sc-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.9cqh;text-align:center}
.sc-main{position:relative;font-weight:var(--sc-wt,700);font-size:calc(5.5cqh * var(--sc-k));line-height:1.08;transform-origin:center}
.sc-big{font-size:calc(8cqh * var(--sc-k));line-height:.95}
.sc-lab{font-family:${MONO};font-size:2.2cqh;letter-spacing:.26em;text-transform:uppercase}
.sc-sub{font-weight:600;font-size:calc(3.8cqh * var(--sc-k));line-height:1.1}
.sc-w{display:inline-block;transform-origin:50% 70%}
.sc-one .sc-main,.sc-one .sc-sub{white-space:nowrap}
.sc-wrap{position:relative}
.sc-plus{width:1.05em;height:1.05em;vertical-align:-.17em}
.sc-plus svg{display:block;width:100%;height:100%;overflow:visible;transform-origin:50% 50%}
.sc-lab-over{position:absolute;left:50%;bottom:100%;margin-bottom:.9cqh;transform:translateX(-50%);white-space:nowrap}
.sc-burst{position:absolute;left:50%;top:50%;width:130%;height:230%;overflow:visible;pointer-events:none;opacity:0}
.sc-arc{position:absolute;inset:0;width:100%;height:100%;overflow:visible;display:none}
.sc-tc{display:none;position:absolute;left:8px;top:8px;font:12px ${MONO};background:rgba(255,255,255,.88);color:#0e0d0c;padding:2px 9px;border-radius:999px}
.sc-debug .sc{outline:1.5px dashed rgba(190,60,36,.8)}
.sc-debug .sc-tc{display:block}
.sc-debug .sc::after{content:attr(data-id);position:absolute;left:0;top:-1.6em;font:11px ${MONO};color:rgba(190,60,36,.95)}
`;

const el = (tag, cls, parent) => { const n = document.createElement(tag); if (cls) n.className = cls; if (parent) parent.appendChild(n); return n; };
const sv = (tag, attrs, parent) => { const n = document.createElementNS(SVG, tag); for (const k in attrs || {}) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; };
// An empty translation falls back to English, so a new line shows up in every language at once.
// Older files stored some lines as a list of phrases: joined into one line now.
const pick = (v, loc) => {
  const x = v && typeof v === 'object' && !Array.isArray(v) ? ((Array.isArray(v[loc]) ? v[loc].length : v[loc]) ? v[loc] : v.en) : v;
  return Array.isArray(x) ? x.join(' ') : x;
};
const seed = s => [...String(s)].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) | 0, 7);
// Pen-wipe clip: generous margins so handwriting that leans past its box is never shaved off; once written, no clip.
const wipeIn = p => (p >= 1 ? 'none' : `inset(-40% ${((1 - p) * 112 - 6).toFixed(1)}% -40% -6%)`);
// Word breaks: any space except a no-break space, which French needs before ! ? : so the mark never wraps alone
const GAP = /[^\S\u00a0\u202f]+/;
const wipeDur = text => clamp(.12 * String(text).split(GAP).length, .45, 1);   // about 0.12 s a word
/* ---------- the plus ----------
   "+" is the one mark in the text that is drawn, not typed: two pen strokes in the same ink, a little
   bolder than the letters, landing last with a small thump. It is the plus of SOD+A, shown just before
   the balloons reveal the logo. Any "+" standing on its own gets this, in any line. */
const PLUS_DRAW = .26, PLUS_POP = .3;
// line time when a plus starts drawing: once its line is written, or once the big word has popped
const plusStart = (it, role) => role === 'sub' ? (it.c.subAt ?? .9) + .85 : it.pop ? .3 : wipeDur(it.text) + .05;
// the two strokes (across, then down) and the thump after them, at line time lt
function plusAt(lt, t0) {
  const u = (lt - t0) / PLUS_DRAW, after = clamp((lt - t0 - PLUS_DRAW) / PLUS_POP);
  return { h: clamp(u * 2), v: clamp(u * 2 - 1), k: 1 + .24 * Math.sin(Math.PI * after) };
}
function plusLines(parent, attrs) {
  const a = { 'pathLength': 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1, 'stroke-linecap': 'round', stroke: 'currentColor', ...attrs };
  return [sv('line', { ...a, x1: -3.6, y1: 0, x2: 3.6, y2: 0 }, parent), sv('line', { ...a, x1: 0, y1: -3.6, x2: 0, y2: 3.6 }, parent)];
}
// Each word is its own little drawing: its own span, so it can boil on its own.
function words(parent, text, list) {
  String(text).split(/([^\S\u00a0\u202f]+)/).forEach(part => {
    if (!part) return;
    if (GAP.test(part) && !part.replace(GAP, '')) { parent.append(' '); return; }
    const w = el('span', 'sc-w', parent); list.push(w);
    if (part !== '+') { w.textContent = part; return; }
    w.classList.add('sc-plus');   // drawn, not typed
    const s = sv('svg', { viewBox: '-5 -5 10 10', 'aria-hidden': 'true' }, w);
    const [h, v] = plusLines(s, { 'stroke-width': 1.45 });   // about half as heavy again as the letters
    w._plus = { s, h, v };
  });
}
// Short ink ticks fanned over the top of a word, the same mark as the film's final ding.
function burst(parent, ink) {
  const s = sv('svg', { viewBox: '-50 -50 100 100', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
  s.classList.add('sc-burst');
  for (let k = 0; k < 7; k++) {
    const a = Math.PI * (1.1 + .8 * k / 6);
    sv('line', { x1: (Math.cos(a) * 38).toFixed(1), y1: (Math.sin(a) * 38).toFixed(1), x2: (Math.cos(a) * 48).toFixed(1), y2: (Math.sin(a) * 48).toFixed(1), stroke: ink, 'stroke-width': 1.8, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke' }, s);
  }
  parent.appendChild(s);
  return s;
}
let measureCtx = null;
function measure(text, px, weight, family, spacing = 0) {
  measureCtx = measureCtx || document.createElement('canvas').getContext('2d');
  measureCtx.font = `${weight} ${px}px ${family}`;
  return measureCtx.measureText(text).width + spacing * px * [...text].length;
}
let uid = 0;
// `oneLine` lines may run wider than their box; they only shrink if they would leave the frame.
const FIT_W = W * .94;
const EDGE = 14;   // frame units every line keeps clear of the frame's edges
const fitOne = (text, px, weight, family) => Math.min(1, FIT_W / Math.max(1, measure(text, px, weight, family)));

/* ---------- ink grain ----------
   The film's paper is drawn on the canvas, under this layer, so without this the words
   would sit flat black on top of the paper, like a sticker. This mask lets the paper show
   through the letters as fine hairs, the same fibres as the film's paper (core.js
   paperFibres), so text and drawings read as one printed sheet.
   One tile per strength step (10%), drawn at the screen's density so the hairs stay crisp,
   encoded off the main thread (toBlob), then cached. */
const GRAIN_N = 320;   // tile side in css px, the same as the film's paper tile
const grainMasks = new Map();   // strength -> 'url(...)' when ready, true while it is being made
function grainMask(s, ready) {
  const hit = grainMasks.get(s);
  if (typeof hit === 'string') return hit;
  if (!hit) {
    grainMasks.set(s, true);
    const dpr = Math.min(2, (typeof devicePixelRatio === 'number' && devicePixelRatio) || 1);
    const c = document.createElement('canvas'); c.width = c.height = Math.round(GRAIN_N * dpr);
    const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
    g.scale(dpr, dpr); g.globalCompositeOperation = 'destination-out';   // each fibre cuts a hair-thin window in the ink
    paperFibres(g, GRAIN_N, (dark, a) => `rgba(0,0,0,${Math.min(1, s * a * (dark ? .5 : .75)).toFixed(3)})`, 7);
    c.toBlob(b => { grainMasks.set(s, b ? `url(${URL.createObjectURL(b)})` : 'none'); ready && ready(); });
  }
  return null;   // still being made: keep what is on screen
}

/**
 * createCaptions(host, options)
 *   host        element laid exactly over the story canvas (same box)
 *   behindHost  optional element over the same box but UNDER the canvas, for lines marked `behind`
 *   getTime     () => film seconds, or null when the film is not playing (text hidden)
 *   getArc      () => the planet's circle on screen {cx, cy, r} in 1600 x 900 frame units, or null
 *   captions    the list to show (default: captions.data.js)
 *   locale      'en' | 'es' | 'fr'
 *   ink         text colour (site: --hero-line)
 *   font        font stack for the text (default: Caveat handwriting)
 *   fontScale   size multiplier for that face; the site's monospace is wider, about 0.72 fits the same boxes
 *   fontWeight  main text weight (default 700)
 *   getGrain    () => the film's paper grain now (story.grainLevel()); the letters take the same grain
 *   textGrain   how strongly the letters take it (default 1, 0 = clean ink)
 *   getStage    () => the drawing size (story.stage()): lines move with the drawings, letters keep their size
 */
export function createCaptions(host, options = {}) {
  const o = {
    getTime: () => null, getArc: () => null, captions: CAPTIONS, locale: 'en', ink: '#0e0d0c',
    font: 'Caveat, "Segoe Print", "Bradley Hand", cursive', fontScale: 1, fontWeight: 700, debug: false,
    getGrain: () => 0, textGrain: 1, getStage: () => null,
    reducedMotion: typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
    ...options,
  };
  if (!document.getElementById('soda-captions-css')) { const st = el('style'); st.id = 'soda-captions-css'; st.textContent = CSS; document.head.appendChild(st); }

  // aria-hidden: visual reinforcement of the narration; captions for the audio are a separate track
  const frame = el('div', 'sc-frame', host); frame.setAttribute('aria-hidden', 'true');
  const frameB = o.behindHost ? el('div', 'sc-frame', o.behindHost) : null;
  if (frameB) frameB.setAttribute('aria-hidden', 'true');
  const frames = frameB ? [frame, frameB] : [frame];
  const tc = el('div', 'sc-tc', frame);
  const inst = 'sc' + (++uid);
  let items = [], raf = 0, last = null, data = o.captions, grainOn = -1;
  // Drawing size: the film can draw its pictures a little smaller than the frame (story.stage()).
  // Every line's place moves the same way, so text keeps its spot against the drawings; letters keep their size.
  let stK = 1, stY = .25;
  const stX = x => 50 + stK * (x - 50), stYp = y => stY * 100 + stK * (y - stY * 100);   // in % of the frame
  function placeZone(it) {
    const [x, y, w, h] = it.c.box, cx = stX(x + w / 2) + (it.shift || 0), cy = stYp(y + h / 2);
    Object.assign(it.zone.style, { left: (cx - w / 2).toFixed(2) + '%', top: (cy - h / 2).toFixed(2) + '%', width: w + '%', height: h + '%' });
  }

  // Follows the film's grain: fades in with it, and is gone wherever the film has none.
  // The 0.6 divisor is the film's default strength, so textGrain 1 = the tuned look.
  function applyGrain() {
    const s = Math.round(clamp(o.textGrain * (o.getGrain() || 0) / .6, 0, 2) * 10) / 10;
    if (s === grainOn) return;
    const m = s > 0 ? grainMask(s, () => { grainOn = -1; last = null; }) : 'none';
    if (m === null) return;
    grainOn = s;
    frames.forEach(f => { f.style.webkitMaskImage = f.style.maskImage = m; f.style.webkitMaskSize = f.style.maskSize = `${GRAIN_N}px`; });
  }
  // make the usual tile while the browser is idle, so it is ready before the first line writes on
  (typeof requestIdleCallback === 'function' ? requestIdleCallback : f => setTimeout(f, 200))(() => grainMask(clamp(o.textGrain, 0, 2)));

  /* ---------- the 16:9 frame, fitted exactly like the canvas ---------- */
  function layout() {
    const r = host.getBoundingClientRect(), s = Math.min(r.width / W, r.height / H);
    const box = { left: (r.width - W * s) / 2 + 'px', top: (r.height - H * s) / 2 + 'px', width: W * s + 'px', height: H * s + 'px' };
    frames.forEach(f => Object.assign(f.style, box));
  }
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(layout) : null;
  ro && ro.observe(host);

  /* ---------- flat lines: HTML, centred in their box ---------- */
  function buildFlat(it, inner, loc) {
    const { c, pop } = it;
    const label = pick(c.label, loc);   // optional small tag above any line
    // pop: the label is part of the stack (as tuned). write: it hangs above the sentence, so adding one never moves the sentence
    const host = label && !pop ? el('div', 'sc-wrap', inner) : inner;
    if (label) words(it.lab = el('div', pop ? 'sc-lab' : 'sc-lab sc-lab-over', host), label, it.words);
    const main = it.main = el('div', 'sc-main' + (pop ? ' sc-big' : ''), host);
    const base = (pop ? 8 : 5.5) * (c.size || 1), sub = pop && pick(c.sub, loc);
    let fit = 1, subFit = 1;
    it.ov = 0;
    if (c.oneLine) {   // no wrapping: the line keeps its length, centred on the box
      it.zone.classList.add('sc-one');
      const k = o.fontScale, px = base * k * U, boxW = c.box[2] * W / 100;
      fit = fitOne(it.text, px, o.fontWeight, o.font);
      if (sub) subFit = fitOne(sub, 3.8 * k * U, 600, o.font);
      const w = Math.min(measure(it.text, px, o.fontWeight, o.font), FIT_W);
      it.ov = Math.max(0, (w - boxW) / 2) / boxW * 100;   // how far it runs past each side of the box, in % of the box
      // a long line in a box near the side slides inward rather than run off the frame
      const bx = stX(c.box[0] + c.box[2] / 2) * W / 100, shift = Math.max(0, EDGE - (bx - w / 2)) - Math.max(0, bx + w / 2 - (W - EDGE));
      it.shift = shift / W * 100;   // placeZone adds it
    }
    if (c.size || fit < 1) main.style.fontSize = `calc(${(base * fit).toFixed(3)}cqh * var(--sc-k))`;
    words(main, it.text, it.words);
    if (pop) it.burst = burst(main, o.ink);
    if (sub) { words(it.sub = el('div', 'sc-sub', inner), sub, it.words); if (subFit < 1) it.sub.style.fontSize = `calc(${(3.8 * subFit).toFixed(3)}cqh * var(--sc-k))`; }
  }

  /* ---------- curved lines: SVG text on circles concentric with the planet ----------
     The block of lines keeps its centre on the box centre; each line sits on its own
     circle, outer lines above, so the stack bends with the ground. */
  function buildCurved(it, parent, loc) {
    const { c, pop } = it, k = o.fontScale, fam = o.font, box = c.box;
    const maxW = box[2] * W / 100;
    const lines = [];   // { role, text, px, h, weight, family, spacing }
    const label = pick(c.label, loc);   // optional small tag above any line
    if (label) lines.push({ role: 'lab', text: label.toUpperCase(), px: 2.2 * U, h: 2.2 * U * 1.4, weight: 400, family: MONO, spacing: .26 });
    let mpx = (pop ? 8 : 5.5) * (c.size || 1) * k * U;
    // wrap to the box width, then balance: the narrowest width that keeps the same number of
    // lines, so a two-line sentence splits evenly instead of leaving one word on its own
    const wordsOf = String(it.text).split(GAP).filter(Boolean);
    const wrap = width => { const out = []; let cur = ''; for (const w of wordsOf) { const t2 = cur ? cur + ' ' + w : w; if (cur && measure(t2, mpx, o.fontWeight, fam) > width) { out.push(cur); cur = w; } else cur = t2; } if (cur) out.push(cur); return out; };
    if (c.oneLine) mpx *= fitOne(wordsOf.join(' '), mpx, o.fontWeight, fam);
    let rows = c.oneLine ? [wordsOf.join(' ')] : wrap(maxW);   // oneLine: no wrapping, the arc just runs longer
    if (rows.length > 1) { let lo = 0, hi = maxW; for (let i = 0; i < 18; i++) { const mid = (lo + hi) / 2; if (wrap(mid).length > rows.length) lo = mid; else hi = mid; } rows = wrap(hi); }
    rows.forEach(r => lines.push({ role: 'main', text: r, px: mpx, h: mpx * (pop ? .95 : 1.08), weight: o.fontWeight, family: fam }));
    const sub = pop && pick(c.sub, loc);
    if (sub) { const spx = 3.8 * k * U * (c.oneLine ? fitOne(sub, 3.8 * k * U, 600, fam) : 1); lines.push({ role: 'sub', text: sub, px: spx, h: spx * 1.1, weight: 600, family: fam }); }
    const gap = .9 * U;
    it.blockH = lines.reduce((a, l) => a + l.h, 0) + gap * (lines.length - 1);
    // where the block's centre sits: its middle, or for a written line with a label, the middle of the sentence
    // (the label stacks on top, so adding one never moves the sentence)
    const labH = label && !pop ? lines[0].h + gap : 0;
    it.anchor = labH + (it.blockH - labH) / 2;
    let off = 0;
    lines.forEach(l => { l.w = measure(l.text, l.px, l.weight, l.family, l.spacing || 0); l.drop = off + l.h * .78; off += l.h + gap; });   // baseline depth from the block top
    it.textW = Math.max(...lines.map(l => l.w));

    it.plusMarks = [];
    const svg = it.svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none', 'aria-hidden': 'true' }, parent);
    svg.classList.add('sc-arc');
    const defs = sv('defs', {}, svg), id = `${inst}-${it.cid >>> 0}`;
    it.clipAll = sv('rect', { x: 0, y: -H, width: W, height: 3 * H }, sv('clipPath', { id: id + '-all', clipPathUnits: 'userSpaceOnUse' }, defs));
    it.clipSub = sv('rect', { x: 0, y: -H, width: W, height: 3 * H }, sv('clipPath', { id: id + '-sub', clipPathUnits: 'userSpaceOnUse' }, defs));
    it.clipLab = sv('rect', { x: 0, y: -H, width: W, height: 3 * H }, sv('clipPath', { id: id + '-lab', clipPathUnits: 'userSpaceOnUse' }, defs));
    const gAll = sv('g', { 'clip-path': `url(#${id}-all)` }, svg);
    it.gLab = sv('g', { 'clip-path': `url(#${id}-lab)` }, svg); it.gMain = sv('g', {}, gAll); it.gSub = sv('g', { 'clip-path': `url(#${id}-sub)` }, gAll);
    it.lines = lines.map((l, i) => {
      const path = sv('path', { id: `${id}-p${i}`, fill: 'none' }, defs);
      const g = l.role === 'lab' ? it.gLab : l.role === 'sub' ? it.gSub : it.gMain;
      const text = sv('text', { 'font-size': l.px.toFixed(2), 'font-weight': l.weight, 'text-anchor': 'middle', fill: 'currentColor' }, g);
      text.style.fontFamily = l.family;
      if (l.spacing) text.setAttribute('letter-spacing', (l.spacing * l.px).toFixed(2));
      const tp = sv('textPath', { href: `#${id}-p${i}`, startOffset: '50%' }, text);
      const ws = l.text.split(GAP).filter(Boolean), spans = [];
      let ch = 0;
      ws.forEach((w, j) => {
        const span = sv('tspan', {}, tp); span.textContent = w; spans.push(span);
        if (w === '+' && l.role !== 'lab') {   // the plus is drawn: the glyph only holds its place
          span.setAttribute('fill-opacity', 0);
          const mark = sv('g', {}, g), [h, v] = plusLines(mark, { stroke: o.ink, 'stroke-width': 1.45 });
          it.plusMarks.push({ text, idx: ch, mark, h, v, px: l.px, role: l.role });
        }
        ch += w.length + 1;
        if (j < ws.length - 1) { const sp = sv('tspan', {}, tp); sp.textContent = ' '; span._space = sp; }
      });
      it.words.push(...spans);
      return { ...l, path, spans };
    });
    if (pop && lines.some(l => l.role === 'main')) {   // the burst, drawn in frame units above the big word
      it.burstG = sv('g', { opacity: 0 }, gAll);
      for (let q = 0; q < 7; q++) { const a = Math.PI * (1.1 + .8 * q / 6); sv('line', { x1: Math.cos(a) * 38, y1: Math.sin(a) * 38, x2: Math.cos(a) * 48, y2: Math.sin(a) * 48, stroke: o.ink, 'stroke-width': 1.8, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke' }, it.burstG); }
    }
    it.arcKey = '';
  }

  // Would the ends of any line, on circles around A, be cut off by the frame? Only the ends are
  // checked: easing the curve moves the ends, never the middle, which stays where it was placed.
  // A line placed low keeps its curve as long as its ends still show (baseline just above the edge).
  function fitsFrame(it, A, R0, th) {
    return it.lines.every(l => {
      const R = R0 + it.anchor - l.drop; if (R < 10) return false;
      const h = l.w / R / 2; if (h > Math.PI * .9) return false;   // half the line's angle
      return [th - h, th + h].every(a => {
        const x = A.cx + R * Math.sin(a), y = A.cy - R * Math.cos(a);
        return x > 6 && x < W - 6 && y > 6 + l.px * .8 && y < H - 2 - l.px * .05;   // room for the letters above the baseline
      });
    });
  }

  // Distance below the ground line at line time lt. `ground: [from, to]` glides from one to the other
  // over the line's time on screen (easing in and out), so a line can take over another line's spot
  // and travel to its own resting place through a zoom.
  function groundDist(c, lt) {
    const g = c.ground;
    if (!Array.isArray(g)) return g;
    return lerp(g[0], g[1], eInOut(clamp(lt / Math.max(.01, c.end - EXIT - c.start))));
  }

  // Lay the lines on circles concentric with the ground (or a huge circle: a straight line).
  // A line bends with the ground only as far as it stays in the frame. Mid-zoom the planet can be
  // small and close, and its tight circle would carry the ends of a long line off the frame (cut off,
  // as if matted). Then the curve eases: same middle, a wider circle further away, just until it fits.
  function placeArcs(it, arc, lt = 0) {
    const b = it.c.box, gd = it.c.ground != null && arc && arc.r > 0 ? groundDist(it.c, lt) : null;
    let bx = stX(b[0] + b[2] / 2) * W / 100, by = stYp(b[1] + b[3] / 2) * H / 100;   // moved with the drawings
    // `ground`: ride the ground. The sentence keeps the same distance from the ground line (in % of the
    // frame height, + below the line), at the box's left-right position, so it travels with the planet
    // through zooms instead of staying put on the screen while the ground slides past.
    if (gd != null) {
      // the distance is measured in the drawing, so it shrinks with it
      const R = Math.max(20, arc.r - gd * U * stK), a = Math.asin(clamp((bx - arc.cx) / R, -1, 1));
      bx = arc.cx + R * Math.sin(a); by = arc.cy - R * Math.cos(a);
    }
    const A0 = arc && arc.r > 0 ? arc : { cx: bx, cy: by + 1e5, r: 1e5 };
    const key = `${A0.cx.toFixed(1)},${A0.cy.toFixed(1)},${A0.r.toFixed(1)},${gd == null ? '' : gd.toFixed(2)}`;
    if (key === it.arcKey) return; it.arcKey = key;
    const r0 = Math.hypot(bx - A0.cx, by - A0.cy), th = Math.atan2(bx - A0.cx, A0.cy - by);   // block centre: radius and angle from "up"
    let A = A0, R0 = r0;
    if (!fitsFrame(it, A0, r0, th)) {
      const base = Math.max(r0, 50), ux = Math.sin(th), uy = -Math.cos(th);   // from the circle's centre out through the block
      const at = k => ({ cx: bx - ux * base * k, cy: by - uy * base * k });   // the centre pushed further back, k times as far
      let lo = 0, hi = 1;
      for (let i = 0; i < 12; i++) { const mid = (lo + hi) / 2; if (fitsFrame(it, at(Math.pow(1000, mid)), base * Math.pow(1000, mid), th)) hi = mid; else lo = mid; }
      const k = Math.pow(1000, hi); A = at(k); R0 = base * k;
    }
    it.center = [bx, by];
    it.lines.forEach(l => {
      const R = Math.max(10, R0 + it.anchor - l.drop), d = Math.min(Math.PI * .95, l.w / R / 2 + .12);
      const p = a => [A.cx + R * Math.sin(a), A.cy - R * Math.cos(a)], s = p(th - d), e = p(th + d);
      // large-arc flag: a path that wraps more than half the circle has to say so, or SVG draws the short way round
      l.path.setAttribute('d', `M${s[0].toFixed(1)} ${s[1].toFixed(1)}A${R.toFixed(1)} ${R.toFixed(1)} 0 ${2 * d > Math.PI ? 1 : 0} 1 ${e[0].toFixed(1)} ${e[1].toFixed(1)}`);
    });
    if (it.burstG) {   // above the middle of the big word, on its own circle
      const m = it.lines.find(l => l.role === 'main'), R = R0 + it.anchor - m.drop + m.px * .9, p = [A.cx + R * Math.sin(th), A.cy - R * Math.cos(th)];
      it.burstAt = p; it.burstSize = [m.w * .65, m.px * 1.15];
    }
  }

  /* ---------- build the DOM for the current language ---------- */
  function build() {
    items.forEach(it => { it.zone.remove(); it.svg && it.svg.remove(); });
    frames.forEach(f => { f.style.color = o.ink; f.style.fontFamily = o.font; f.style.setProperty('--sc-k', o.fontScale); f.style.setProperty('--sc-wt', o.fontWeight); f.classList.toggle('sc-debug', !!o.debug); });
    items = data.map(c => {
      const loc = o.locale, pop = c.motion === 'pop', it = { c, pop, cid: seed(c.id), words: [], text: pick(c.text, loc) || '' };
      const parent = c.behind && frameB ? frameB : frame;
      const zone = it.zone = el('div', 'sc', parent);
      zone.dataset.id = c.id;
      it.inner = el('div', 'sc-in', zone);
      if (c.curve) buildCurved(it, parent, loc); else buildFlat(it, it.inner, loc);
      placeZone(it);
      return it;
    });
    layout();
  }

  /* ---------- one frame ---------- */
  function update(time) {
    if (time == null) { if (last !== null) { items.forEach(it => { it.zone.style.display = 'none'; if (it.svg) it.svg.style.display = 'none'; }); last = null; } return; }
    const t = Math.floor(time * FPS + 1e-6) / FPS;
    const st = o.getStage && o.getStage();
    if (st && (st.k !== stK || st.y !== stY)) { stK = st.k; stY = st.y; items.forEach(it => { placeZone(it); it.arcKey = ''; }); last = null; }
    if (t === last) return; last = t;
    if (data.some(c => t >= c.start && t < c.end)) applyGrain();   // only while text is on screen
    const step = Math.floor(t * BOIL), arc = o.getArc && o.getArc();
    tc.textContent = `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
    for (const it of items) {
      const { c, zone } = it, on = t >= c.start && t < c.end;
      zone.style.display = on ? 'block' : 'none';
      if (it.svg) it.svg.style.display = on ? 'block' : 'none';
      if (!on) continue;
      const lt = t - c.start, d = c.end - c.start, e = clamp((lt - (d - EXIT)) / EXIT);
      if (it.svg) curvedFrame(it, lt, e, step, arc); else flatFrame(it, lt, e, step);
    }
  }

  function flatFrame(it, lt, e, step) {
    const { c, zone, inner, main } = it;
    if (o.reducedMotion) { inner.style.opacity = Math.min(clamp(lt / .2), 1 - e); if (it.sub) it.sub.style.visibility = 'visible'; it.words.forEach(w => w._plus && [w._plus.h, w._plus.v].forEach(x => x.setAttribute('stroke-dashoffset', 0))); return; }
    // every word gets its own tiny offset and tilt 8 times a second, like each stroke of the drawings
    it.words.forEach((w, k) => {
      const x = (hash(step, it.cid, k * 3 + 11) - .5) * .24, y = (hash(step, it.cid, k * 3 + 12) - .5) * .24, r = (hash(step, it.cid, k * 3 + 13) - .5) * 2.4;
      w.style.transform = `translate(${x.toFixed(3)}cqh, ${y.toFixed(3)}cqh) rotate(${r.toFixed(2)}deg)`;
    });
    it.words.forEach(w => {   // the drawn plus: strokes, then a thump
      if (!w._plus) return;
      const P = w._plus, st = plusAt(lt, plusStart(it, w.closest('.sc-sub') ? 'sub' : 'main'));
      P.h.setAttribute('stroke-dashoffset', (1 - st.h).toFixed(3)); P.v.setAttribute('stroke-dashoffset', (1 - st.v).toFixed(3));
      P.s.style.transform = `scale(${st.k.toFixed(3)})`;
    });
    if (it.lab) it.lab.style.opacity = clamp(lt / .15);   // the label fades up first, whatever the motion
    if (it.pop) {   // the word pops with a burst, an optional second line writes on
      main.style.opacity = clamp(lt / .08);
      main.style.transform = `scale(${lerp(.8, 1, eOutBack(lt / .3)).toFixed(3)})`;
      const u = lt / .32;
      if (u < 0 || u > 1) it.burst.style.opacity = 0;
      else { it.burst.style.opacity = 1; it.burst.style.transform = `translate(-50%, -50%) scale(${(.9 + .5 * eOut(u)).toFixed(3)})`; }
      if (it.sub) { const ls = lt - (c.subAt ?? .9); it.sub.style.visibility = ls > 0 ? 'visible' : 'hidden'; it.sub.style.clipPath = wipeIn(eInOut(ls / .8)); }
    } else main.style.clipPath = wipeIn(eInOut(lt / wipeDur(it.text)));
    // exit: erased left to right, like the film's closing line
    const ov = it.ov || 0;
    zone.style.clipPath = e > 0 ? `inset(-40% ${(-10 - ov).toFixed(1)}% -40% ${(e * (100 + 2 * ov) - ov).toFixed(1)}%)` : 'none';
  }

  function placePluses(it, lt) {
    it.plusMarks.forEach(P => {   // over the hidden glyph, along the curve, then strokes and a thump
      try {
        const a = P.text.getStartPositionOfChar(P.idx), b = P.text.getEndPositionOfChar(P.idx);
        const ang = Math.atan2(b.y - a.y, b.x - a.x), up = P.px * .36, cx = (a.x + b.x) / 2 + Math.sin(ang) * up, cy = (a.y + b.y) / 2 - Math.cos(ang) * up;
        const st = o.reducedMotion ? { h: 1, v: 1, k: 1 } : plusAt(lt, plusStart(it, P.role)), sc = P.px * 1.05 / 10 * st.k;   // a little taller than the capitals
        P.mark.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${(ang * 180 / Math.PI).toFixed(1)}) scale(${sc.toFixed(3)})`);
        P.h.setAttribute('stroke-dashoffset', (1 - st.h).toFixed(3)); P.v.setAttribute('stroke-dashoffset', (1 - st.v).toFixed(3));
      } catch (err) { /* not laid out yet: next frame */ }
    });
  }

  function curvedFrame(it, lt, e, step, arc) {
    const { c } = it;
    placeArcs(it, arc, lt);
    const [bx, by] = it.center, x0 = bx - it.textW / 2 - 30, span = it.textW + 60;
    const clip = (rect, from, to) => { rect.setAttribute('x', from.toFixed(1)); rect.setAttribute('width', Math.max(0, to - from).toFixed(1)); };
    if (o.reducedMotion) { it.svg.style.opacity = Math.min(clamp(lt / .2), 1 - e); clip(it.clipAll, -W, 2 * W); clip(it.clipSub, -W, 2 * W); clip(it.clipLab, -W, 2 * W); placePluses(it, lt); return; }
    it.svg.style.opacity = 1;
    // per-word boil: a tilt and a lift that the next space cancels, so words shiver independently
    it.words.forEach((w, k) => {
      const y = ((hash(step, it.cid, k * 3 + 12) - .5) * 2.2).toFixed(2), r = ((hash(step, it.cid, k * 3 + 13) - .5) * 2.4).toFixed(2);
      w.setAttribute('dy', y); w.setAttribute('rotate', r); if (w._space) w._space.setAttribute('dy', (-y).toFixed(2));
    });
    placePluses(it, lt);
    let from = x0, to = x0 + span;
    it.gLab.setAttribute('opacity', clamp(lt / .15).toFixed(3));   // the label fades up first, whatever the motion
    if (it.pop) {
      const k = lerp(.8, 1, eOutBack(lt / .3));
      it.gMain.setAttribute('opacity', clamp(lt / .08).toFixed(3));
      it.gMain.setAttribute('transform', `translate(${bx} ${by}) scale(${k.toFixed(3)}) translate(${-bx} ${-by})`);
      const u = lt / .32;
      if (!it.burstG) { /* label only: nothing pops */ } else if (u < 0 || u > 1) it.burstG.setAttribute('opacity', 0);
      else { const s = .9 + .5 * eOut(u), [px, py] = it.burstAt, [sx, sy] = it.burstSize; it.burstG.setAttribute('opacity', 1); it.burstG.setAttribute('transform', `translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(${(sx / 48 * s).toFixed(3)} ${(sy / 48 * s).toFixed(3)})`); }
      const ls = lt - (c.subAt ?? .9);
      clip(it.clipSub, x0, ls <= 0 ? x0 : x0 + span * eInOut(ls / .8));
    } else to = x0 + span * eInOut(lt / wipeDur(it.text));   // the pen writes along the curve
    if (e > 0) from = x0 + span * e;                         // exit: erased left to right
    clip(it.clipAll, from, to);
    clip(it.clipLab, from, x0 + span);
  }

  function loop() { raf = requestAnimationFrame(loop); update(o.getTime()); }

  build();
  // the real face changes the measured widths: re-lay the curved lines once fonts have loaded
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { last = null; build(); });
  return {
    start() { if (!raf) loop(); },
    stop() { cancelAnimationFrame(raf); raf = 0; update(null); },
    update,
    setLocale(l) { o.locale = l; last = null; build(); },
    /** Change the typeface live, e.g. handwriting vs the site's own monospace. */
    setFont(font, scale = 1, weight = 700) { o.font = font; o.fontScale = scale; o.fontWeight = weight; last = null; build(); },
    /** Swap in edited text, times, boxes or motions and redraw at once. */
    setCaptions(list) { data = list; last = null; build(); },
    refresh() { last = null; },
    /** How strongly the letters take the film's grain (0 = clean ink, 1 = tuned, 2 = heavy). */
    setGrain(v) { o.textGrain = v; last = null; },
    setDebug(v) { o.debug = v; frames.forEach(f => f.classList.toggle('sc-debug', !!v)); last = null; },
    destroy() { cancelAnimationFrame(raf); ro && ro.disconnect(); frames.forEach(f => f.remove()); },
  };
}
