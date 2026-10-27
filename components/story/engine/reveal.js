/* =========================================================================
   SOD+A STORY — the reveal
   Four balloons drift over the four parts of the page's own logo lockup and
   pop in reading order: S.o.  →  d+a.  →  CHALLENGE  →  the partners.
   Each pop is a cue. The page shows that part of the real lockup, which then
   floats exactly as it already does. The canvas never draws the logo itself:
   the site's SVG stays the one source of truth, crisp, translatable, accessible.

   Two ways in:
     'story'  the balloons arrive from the end of chapter 3, at the exact size and
              place the camera left them, so the cut is invisible.
     'rise'   the balloons float up from below the hero. Used on page load
              (logo first) and when someone skips the story.

   Based on test 04 (soda-animatic-04.html): same balloon drawing, puff, pop
   lines, confetti and the final ding. Positions now come from the page.
   ========================================================================= */
import { COL, CFG, clamp, lerp, eInOut, eOut, hash, segs, curve, ellipsePts, fillPoly, sync } from './core.js';

// Same order as chapter 3's four hero balloons, so colours carry across the cut.
const COLS = [COL.coral, COL.sky, COL.green, COL.sun];
// Test 04 drew the logo 780 units wide with 40×51 balloons. Keep that proportion
// to whatever size the page lockup is on this screen.
const LOGO_W = 780, BR = [40, 51], STRING = 95;
// Timing (seconds). Test 04: drift 1.2s, pops 0.35s apart, ding after the logo completes.
export const TIMING = { drift: 1.2, firstPop: 1.3, gap: .35, dingAfter: .45, partnersAfter: .9, riseFirstPop: 2.2, tail: 1.3 };

let P = null;   // the plan for the current reveal, built by prepare()

const centre = r => [r.x + r.w / 2, r.y + r.h / 2];
function union(rs) {
  const x0 = Math.min(...rs.map(r => r.x)), y0 = Math.min(...rs.map(r => r.y));
  const x1 = Math.max(...rs.map(r => r.x + r.w)), y1 = Math.max(...rs.map(r => r.y + r.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/* Build the plan.
   targets: up to four rects {x, y, w, h} in frame units (the player converts from page px).
            0 S.o.   1 d+a.   2 CHALLENGE   3 the partner row (or any fourth thing).
   from:    'rise', or chapter 3's heroBalloons() list.
   bottom:  frame y of the canvas bottom, where rising balloons start.
   tagline: optional { text, font } handwritten under CHALLENGE (off on the site, see spec).
   Returns { dur, cues } with cue times relative to the start of the reveal. */
export function prepare({ targets, from = 'rise', bottom = 1000, firstPop, tagline = null }) {
  const T = TIMING, logo = union(targets.slice(0, 3)), sc = clamp(logo.w / LOGO_W, .45, 2.6);
  const rise = from === 'rise';
  const p0 = firstPop ?? (rise ? T.riseFirstPop : T.firstPop);
  const pops = [p0, p0 + T.gap, p0 + 2 * T.gap];
  const ding = pops[2] + T.dingAfter;
  let tag = null;
  if (tagline && tagline.text) {
    // Written under CHALLENGE like test 04, then cleared before the partners land in that space.
    const y = targets[2].y + targets[2].h + 82 * sc;
    tag = { ...tagline, y, size: 70 * sc, t0: ding + .1, t1: ding + 1.1, out0: ding + 2.6, out1: ding + 3.0 };
  }
  pops.push(tag ? tag.out1 + .3 : pops[2] + T.partnersAfter);

  const balloons = COLS.map((col, i) => {
    const tg = targets[i];
    const to = tg ? centre(tg) : [logo.x + logo.w * (.2 + .2 * i), logo.y - 900];   // no target: let it go, up and away
    const r1 = [BR[0] * sc, BR[1] * sc], len1 = STRING * sc;
    let start;
    if (rise) start = { x: to[0] + [-1, 1, -1, 1][i] * 70 * sc, y: bottom + (120 + i * 55) * sc, rx: r1[0], ry: r1[1], len: len1 };
    else start = from[i] || from[from.length - 1];
    // Path keys [t, x, y]. Rising balloons arrive just before their pop and hover there.
    const arrive = rise ? Math.max(.6, pops[Math.min(i, 2)] - .15) : T.drift;
    const keys = [[rise ? i * .1 : 0, start.x, start.y], [arrive, to[0], to[1]]];
    if (tag && i === 3) {
      // Waits beside CHALLENGE while the line is written, then drops into the partner row.
      const wait = [logo.x + logo.w + 70 * sc, targets[2].y + targets[2].h / 2];
      keys[1] = [arrive, wait[0], wait[1]]; keys.push([tag.out1 - .1, wait[0], wait[1]], [pops[3] - .05, to[0], to[1]]);
    }
    return { i, col, start, r1, len1, keys, pop: tg ? pops[i] : Infinity, rise };
  });

  const end = Math.max(...balloons.filter(b => b.pop < Infinity).map(b => b.pop)) + T.tail;
  const cues = [];
  balloons.forEach(b => { if (b.pop < Infinity) cues.push({ t: b.pop, name: 'pop', i: b.i }); });
  cues.push({ t: ding, name: 'ding' });
  if (tag) cues.push({ t: tag.t0, name: 'tagline' });
  cues.push({ t: end, name: 'done' });
  cues.sort((a, b) => a.t - b.t);
  P = { sc, logo, balloons, ding, tag, dur: end };
  return { dur: end, cues };
}

// Where a balloon is, and how big. Sway fades in from zero so the hand-off from chapter 3 has no jump.
function balloonAt(b, t) {
  const k = b.keys;
  let x = k[k.length - 1][1], y = k[k.length - 1][2], u = 1;
  if (t <= k[0][0]) { x = k[0][1]; y = k[0][2]; u = 0; }
  else for (let j = 1; j < k.length; j++) {
    if (t <= k[j][0]) {
      const e = (b.rise ? eOut : eInOut)((t - k[j - 1][0]) / (k[j][0] - k[j - 1][0] || 1));
      x = lerp(k[j - 1][1], k[j][1], e); y = lerp(k[j - 1][2], k[j][2], e); if (j === 1) u = e; break;
    }
  }
  const sw = P.sc * u;
  return { x: x + Math.sin(t * 1.6 + b.i) * 6 * sw, y: y + Math.sin(t * 2.1 + b.i * 1.7) * 5 * sw,
           rx: lerp(b.start.rx, b.r1[0], u), ry: lerp(b.start.ry, b.r1[1], u), len: lerp(b.start.len, b.len1, u) };
}

function drawBalloon(b, t) {
  const sid = 300 + b.i * 10, c = balloonAt(b, t), puff = 1 + .18 * eOut(clamp((t - (b.pop - .12)) / .12)), rx = c.rx * puff, ry = c.ry * puff;
  if (t < b.pop) {
    const sp = []; for (let j = 0; j <= 8; j++) { const u = j / 8; sp.push([c.x + Math.sin(u * Math.PI * 2 + t * 3 + b.i) * 7 * P.sc * u, c.y + ry + u * c.len]); }
    curve(sp, sid, { w: .7, wob: .4 });
    const shape = ellipsePts(c.x, c.y, rx, ry, 26);
    fillPoly(shape, b.col); curve(shape, sid + 1, { w: 1, wob: .4 });
    const k = rx / BR[0];
    segs([[c.x - 7 * k, c.y + ry + 9 * k], [c.x, c.y + ry], [c.x + 7 * k, c.y + ry + 9 * k]], sid + 2, { w: .9, wob: .3, closed: true });
    curve([[c.x - rx * .5, c.y - ry * .3], [c.x - rx * .4, c.y - ry * .55], [c.x - rx * .15, c.y - ry * .7]], sid + 3, { w: .7, color: '#ffffff', alpha: .85, wob: .2 });
  } else if (t < b.pop + .7) {   // the string drops after the pop
    const dt = t - b.pop, top = [c.x, c.y + c.ry + 380 * P.sc * dt * dt], sp = [];
    for (let j = 0; j <= 8; j++) { const u = j / 8; sp.push([top[0] + Math.sin(u * 5 + dt * 9) * 9 * P.sc * u, top[1] + u * c.len * (1 - dt * .4)]); }
    curve(sp, sid + 4, { w: .7, wob: .4, alpha: 1 - dt / .7 });
  }
}

// Confetti from each pop, in the balloon's colour plus friends.
function drawPuffs(ctx, t) {
  const s = P.sc;
  P.balloons.forEach(b => {
    const d = t - b.pop; if (d < 0 || d > 1.3) return;
    const c = balloonAt(b, b.pop), cols = [b.col, COL.violet, COL.sun, COL.sky, COL.coral];
    for (let k = 0; k < 14; k++) {
      const a = hash(b.i, k, 1) * Math.PI * 2, sp = (260 + hash(b.i, k, 2) * 360) * s, g = (1 - Math.exp(-2.4 * d)) / 2.4;
      const x = c.x + Math.cos(a) * sp * g, y = c.y + Math.sin(a) * sp * g + 160 * s * d * d, ang = d * 8 + k;
      const w = (16 * Math.abs(Math.cos(d * 10 + k)) + 4) * s, h = 8 * s, co = Math.cos(ang), si = Math.sin(ang);
      ctx.globalAlpha = 1 - clamp((d - .8) / .5); ctx.fillStyle = cols[k % 5]; ctx.beginPath();
      [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].forEach(([u, v], j) => { const px = x + u * co - v * si, py = y + u * si + v * co; j ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
      ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    }
  });
}

// "Pop" lines at each balloon, and one big ding over the finished logo (upper arc only, clear of the text).
function drawBursts(t) {
  const s = P.sc, L = P.logo;
  const list = P.balloons.filter(b => b.pop < Infinity).map(b => { const c = balloonAt(b, b.pop); return { t: b.pop, c: [c.x, c.y], r: [70 * s, 80 * s], n: 9, a0: 0, a1: Math.PI * 2, sid: 600 + b.i * 20 }; });
  list.push({ t: P.ding, c: [L.x + L.w / 2, L.y + L.h * .49], r: [L.w * .603, L.h * .587], n: 11, a0: Math.PI * 1.08, a1: Math.PI * 1.92, sid: 700 });
  for (const B of list) {
    const u = (t - B.t) / .32; if (u < 0 || u > 1) continue;
    const outer = 1 + .6 * eOut(clamp(u * 2.2)), inner = 1 + .6 * Math.pow(u, 1.6);
    for (let j = 0; j < B.n; j++) { const a = lerp(B.a0, B.a1, (j + .5) / B.n), c = Math.cos(a), sn = Math.sin(a); segs([[B.c[0] + c * B.r[0] * inner, B.c[1] + sn * B.r[1] * inner], [B.c[0] + c * B.r[0] * outer, B.c[1] + sn * B.r[1] * outer]], B.sid + j, { w: .9, wob: .5 }); }
  }
}

// The closing line, handwritten: revealed left to right like a pen moving, later wiped away.
function drawTagline(ctx, t, ink) {
  const g = P.tag; if (!g || t < g.t0 || t > g.out1) return;
  const p = eInOut((t - g.t0) / (g.t1 - g.t0)), q = eInOut((t - g.out0) / (g.out1 - g.out0)), cx = P.logo.x + P.logo.w / 2;
  ctx.save(); ctx.font = `600 ${g.size}px ${g.font || 'Caveat, "Segoe Print", "Bradley Hand", cursive'}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(g.text).width, x0 = cx - w / 2 - 10 * P.sc;
  ctx.beginPath(); ctx.rect(x0 + (w + 20 * P.sc) * q, g.y - g.size, (w + 20 * P.sc) * (p - q), g.size * 2); ctx.clip();
  ctx.fillStyle = ink; ctx.fillText(g.text, cx, g.y);
  ctx.restore();
}

export function render(ctx, t, view) {
  if (!P) return;
  const BS = Math.floor(t * CFG.boil + 1e-6);
  ctx.setTransform(view.s, 0, 0, view.s, view.ox, view.oy);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  sync(ctx, BS, 1, 1, view.ink, t);
  P.balloons.forEach(b => drawBalloon(b, t));
  drawPuffs(ctx, t);
  drawBursts(t);
  drawTagline(ctx, t, view.ink);
}

