/* =========================================================================
   SOD+A STORY — core
   The shared "hand" every chapter draws with: stage size, palette, tuning,
   a small math kit, and the ink functions that make a line look drawn.

   Before this file existed each test animatic carried its own copy of all of
   this. It now lives once; the chapters import it.
   ========================================================================= */

/* ---------- stage ----------
   Everything is drawn in a fixed 1600×900 "virtual frame", so timing and layout
   stay identical at any screen size. The player maps this frame onto the canvas. */
export const W = 1600, H = 900, GY = 780;

/* ---------- palette ----------
   Black ink, plus five colours that only ever appear on the students' things,
   the balloons and the board. Colour = something a student made. */
export const COL = { violet: '#8E6CFF', green: '#1DBF5E', coral: '#FF7A59', sky: '#2FA8F0', sun: '#FFC530' };

/* ---------- tuning ----------
   The same knobs as the test panels. The player reads fps and speed;
   the ink reads wobble, boil and weight. */
export const CFG0 = { wobble: 1.4, boil: 8, fps: 12, weight: 4.5, speed: 1, shadows: true };
export const CFG = { ...CFG0 };

/* ---------- small math kit ---------- */
export const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
export const lerp = (a, b, t) => a + (b - a) * t;
export const L2 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
export const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
export const sstep = t => { t = clamp(t); return t * t * (3 - 2 * t); };
export const eInOut = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const eOut = t => 1 - Math.pow(1 - clamp(t), 3);
export const eOutQ = t => 1 - Math.pow(1 - clamp(t), 4);
export const eOutBack = t => { t = clamp(t); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
// "Trapezoid" easing: quick ramp up, steady walking speed, quick ramp down.
// Keeps the walk cycle from racing in the middle of a move.
export function trap(u, a = .2) { u = clamp(u); const vm = 1 / (1 - a); if (u < a) return .5 * vm * u * u / a; if (u > 1 - a) return 1 - .5 * vm * (1 - u) * (1 - u) / a; return .5 * vm * a + vm * (u - a); }
export function trapV(u, a = .2) { if (u <= 0 || u >= 1) return 0; const vm = 1 / (1 - a); if (u < a) return vm * u / a; if (u > 1 - a) return vm * (1 - u) / a; return vm; }
// Deterministic noise: same inputs, same wobble. Makes the line boil repeatable frame to frame.
export function hash(a, b, c) { let h = Math.imul(a | 0, 0x27d4eb2d) ^ Math.imul((b | 0) + 0x9e37, 0x165667b1) ^ Math.imul((c | 0) + 0x7f4a, 0x85ebca77); h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d); h = Math.imul(h ^ (h >>> 12), 0x297a2d39); h ^= h >>> 15; return (h >>> 0) / 4294967296; }

/* =========================================================================
   INK: the hand-drawn look
   Every line is jittered by a seed (BS) that changes a few times a second.
   That flicker is "line boil", the thing that makes Hertzfeldt-style work feel
   drawn rather than generated.

   ZP keeps lines the same thickness on screen when the camera zooms:
   a zoomed-out planet shot would otherwise turn every figure into hairlines.
   Each chapter calls sync() once per frame, after its camera is known.
   ========================================================================= */
const St = { ctx: null, BS: 0, ZP: 1, wm: 1, ink: '#141414' };
export function sync(ctx, BS, ZP = 1, weightMul = 1, ink = St.ink) { St.ctx = ctx; St.BS = BS; St.ZP = ZP; St.wm = weightMul; St.ink = ink; }

export const jit = (sid, i, amp) => [amp * (hash(St.BS, sid, i * 2) - .5) * 2, amp * (hash(St.BS, sid, i * 2 + 1) - .5) * 2];
export const lw = (w, sid) => CFG.weight * St.wm * w * (.86 + .28 * hash(St.BS, sid, 991)) / St.ZP;

// Straight segments with a slight bow, sharp joints. For limbs, bodies, frames.
export function segs(pts, sid, o = {}) {
  if (!pts || pts.length < 2) return;
  if (o.closed) pts = pts.concat([pts[0]]);
  const ctx = St.ctx, amp = CFG.wobble * (o.wob ?? 1) / St.ZP;
  const q = pts.map((p, i) => { const j = jit(sid, o.closed && i === pts.length - 1 ? 0 : i, amp); return [p[0] + j[0], p[1] + j[1]]; });
  ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]);
  for (let i = 1; i < q.length; i++) {
    const a = q[i - 1], b = q[i], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
    const bow = amp * 1.2 * (hash(St.BS, sid, 500 + i) - .5) * 2;
    ctx.quadraticCurveTo((a[0] + b[0]) / 2 - dy / len * bow, (a[1] + b[1]) / 2 + dx / len * bow, b[0], b[1]);
  }
  finish(sid, o);
}
// Smooth curve through points. For heads, scribble writing, clouds, balloons.
export function curve(pts, sid, o = {}) {
  if (!pts || pts.length < 2) return;
  const ctx = St.ctx, amp = CFG.wobble * (o.wob ?? 1) * .6 / St.ZP;
  const q = pts.map((p, i) => { const j = jit(sid, i, amp); return [p[0] + j[0], p[1] + j[1]]; });
  ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]);
  if (q.length === 2) ctx.lineTo(q[1][0], q[1][1]);
  else {
    for (let i = 1; i < q.length - 1; i++) ctx.quadraticCurveTo(q[i][0], q[i][1], (q[i][0] + q[i + 1][0]) / 2, (q[i][1] + q[i + 1][1]) / 2);
    const z = q[q.length - 1]; ctx.lineTo(z[0], z[1]);
  }
  finish(sid, o);
}
// fill: a knockout (usually PAPER) that hides whatever is behind, the way ink on paper would.
export function finish(sid, o) {
  const ctx = St.ctx, ga = ctx.globalAlpha;
  if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
  if (o.noStroke) return;
  ctx.globalAlpha = ga * (o.alpha ?? 1); ctx.strokeStyle = o.color || St.ink;
  ctx.lineWidth = lw(o.w ?? 1, sid); ctx.stroke(); ctx.globalAlpha = ga;
}
export function dot(x, y, r, sid) { const ctx = St.ctx, j = jit(sid, 0, CFG.wobble * .35 / St.ZP); ctx.beginPath(); ctx.arc(x + j[0], y + j[1], r, 0, Math.PI * 2); ctx.fillStyle = St.ink; ctx.fill(); }
// Colour lands slightly off-register, like quick hand colouring inside a drawn line.
export function fillPoly(poly, col, alpha = 1) {
  if (alpha <= 0) return; const ctx = St.ctx, dx = 1.6 / St.ZP, dy = 1.2 / St.ZP;
  ctx.globalAlpha = alpha; ctx.fillStyle = col; ctx.beginPath(); poly.forEach((q, i) => i ? ctx.lineTo(q[0] + dx, q[1] + dy) : ctx.moveTo(q[0] + dx, q[1] + dy)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
}

/* ---------- shapes ---------- */
// A hand-drawn circle overshoots its start a little, the way a pen does.
export function circlePts(cx, cy, r, sid, n = 22, over = .35) {
  const a0 = hash(sid, 3, 9) * Math.PI * 2, tot = Math.PI * 2 + over, pts = [];
  for (let i = 0; i <= n; i++) { const a = a0 + tot * i / n; const rr = r * (1 + .03 * (hash(sid, i % n, 4) - .5) * 2) * (i > n * .93 ? .97 : 1); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  return pts;
}
export function ellipsePts(cx, cy, rx, ry, n = 26) { const pts = []; for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return pts; }
export const circ = (cx, cy, r, n = 12) => ellipsePts(cx, cy, r, r, n);
export const rectP = (x0, y0, x1, y1) => [[x0, y1], [x0, y0], [x1, y0], [x1, y1], [x0, y1]];
export function gearP(cx, cy, r, n, rot) { const pts = [], N = n * 4; for (let i = 0; i <= N; i++) { const a = rot + i / N * Math.PI * 2, k = (i % 4 === 1 || i % 4 === 2) ? 1.28 : 1; pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]); } return pts; }
// The first fraction f of a polyline, by length. How anything "draws itself on".
export function partial(pts, f) {
  if (!pts) return null; if (f >= 1) return pts; if (f <= 0) return null;
  let tot = 0; const d = [0];
  for (let i = 1; i < pts.length; i++) { tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); d.push(tot); }
  const target = tot * f, out = [pts[0]];
  for (let i = 1; i < pts.length; i++) { if (d[i] <= target) out.push(pts[i]); else { out.push(L2(pts[i - 1], pts[i], (target - d[i - 1]) / (d[i] - d[i - 1] || 1))); break; } }
  return out;
}
export const plen = pts => { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; };
