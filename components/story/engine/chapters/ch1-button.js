/* =========================================================================
   SOD+A STORY — Chapter 1: the button
   Five students, one big green button. Each press spins up a random three-part prompt.
   They think, scratch their heads, and wander off to work on it.

   Scene code is the approved test animatic (soda-animatic.html), unchanged except:
   the shared math and ink now come from ../core.js, the player UI is gone,
   and render() draws onto a transparent canvas wherever the player puts the frame.
   ========================================================================= */
import { W, H, GY, COL, CFG, clamp, lerp, L2, add, sstep, eInOut, eOut, eOutQ, eOutBack, trap, trapV, hash, jit, lw, segs, curve, finish, dot, circlePts, ellipsePts, circ, rectP, gearP, partial, plen, fillPoly, sync } from '../core.js';

export const DUR = 16.5;
let INK = '#141414', PAPER = '#ffffff';   // set by the player every frame: line colour, and the page colour used for knockouts

const GREEN = '#1DBF5E';                 // the only colour: the arcade button
const PED = { x: 800, gy: 740, top: 652 };   // pedestal ground line + top of slab (lowered to teen chest height)
const BTN = { x: 800, y: 626 };              // dome top, where hands aim
const CARDS = [800, 250];                    // where the prompt cards hang
const CW = 210, CH = 104;                    // prompt card size

/* ---------- ink state ----------
   Chapter-local copies; sync() hands them to core.js once per frame. */
let ctx, BS = 0, ZOOM = 1;

/* =========================================================================
   THE CAST
   Five classic stick figures. Each has a path (where they walk, with depth z
   so the group can stand "around" the button) and a list of acting beats.
   z: 0 = front of stage, 1 = back. Back figures draw smaller and higher.
   Path keys: [time, x, z]. Repeating a key = standing still.
   ========================================================================= */
const CARD_T = CARDS;
const FIGS = [
  { id: 0, size: 1.00, hr: 12.5, face0: 1,   // A: first to press
    path: [[0, 120, .2], [2.2, 690, .15], [3.3, 690, .15], [3.8, 738, .5], [6.6, 738, .5], [7.7, 280, .05]],
    faces: [[7.7, 1]],
    acts: [['bounce', 2.5, 3.3], ['press', 3.8, 4.6], ['watch', 4.55, 6.5, { o: 1 }], ['scratch', 7.7, 99]] },
  { id: 1, size: .95, hr: 12, face0: 1,      // B
    path: [[.4, 60, .85], [2.6, 620, .85], [6.9, 620, .85], [7.5, 740, .5], [9.3, 740, .5], [10.3, 1330, .35]],
    faces: [[10.3, -1]],
    acts: [['bounce', 2.6, 3.4], ['react', 4.2, 4.75], ['watch', 4.2, 6.5, { o: 1 }], ['press', 7.5, 8.1], ['watch', 8.05, 9.3, { o: 1 }], ['scratch', 10.3, 99]] },
  { id: 2, size: 1.03, hr: 12.5, face0: -1,  // C
    path: [[.1, 1480, .2], [2.3, 920, .2], [9.4, 920, .2], [9.9, 862, .5], [11.4, 862, .5], [12.2, 1130, .05]],
    faces: [[12.2, -1]],
    acts: [['bounce', 2.4, 3.3], ['react', 4.22, 4.77], ['watch', 4.22, 6.5, { o: 1 }], ['watch', 7.8, 9.3], ['press', 9.9, 10.4], ['watch', 10.35, 11.4, { o: 1 }], ['scratch', 12.2, 99]] },
  { id: 3, size: .97, hr: 13, face0: -1,     // D
    path: [[.3, 1560, .8], [2.6, 990, .8], [11.3, 990, .8], [11.8, 862, .5], [12.95, 862, .5], [13.6, 640, .25]],
    faces: [[13.6, 1]],
    acts: [['bounce', 2.6, 3.4], ['react', 4.18, 4.73], ['watch', 4.18, 6.5, { o: 1 }], ['watch', 7.8, 9.3], ['watch', 10.15, 11.2], ['press', 11.8, 12.2], ['watch', 12.15, 12.95, { o: 1 }], ['scratch', 13.6, 99]] },
  { id: 4, size: .93, hr: 12, face0: 1,      // E: smallest, last
    path: [[.2, 30, .45], [2.5, 520, .45], [12.4, 520, .45], [12.85, 738, .5], [13.95, 738, .5], [14.6, 470, .7]],
    faces: [[14.6, 1]],
    acts: [['bounce', 2.5, 3.3], ['react', 4.24, 4.8], ['watch', 4.24, 6.5, { o: 1 }], ['watch', 7.8, 9.3], ['watch', 10.15, 11.4], ['watch', 12.0, 12.4], ['press', 12.85, 13.2], ['watch', 13.15, 13.95, { o: 1 }], ['scratch', 14.6, 99]] },
];
const RAMP = { bounce: .15, press: .01, watch: .2, react: .08, scratch: .25 };

/* ---------- prompts ----------
   One prompt per press. Each press speeds up (sp) so the repeats read as a
   montage rather than the same scene five times. */
const SPEEDS = [1, 1.3, 1.6, 2, 2.2];
const PROMPTS = FIGS.map((f, i) => {
  const pa = f.acts.find(a => a[0] === 'press'), sc = f.acts.find(a => a[0] === 'scratch');
  const m = pa[1] + .45 * (pa[2] - pa[1]);              // the moment the hand hits the button
  const sp = SPEEDS[i], d0 = m + .05;
  const stops = [.95, 1.3, 1.65].map(x => d0 + x / sp); // slot-machine stops, left to right
  const f0 = stops[2] + .25 / sp;
  return { fig: i, m, sp, d0, dd: .3 / sp, stops, f0, f1: f0 + .5 / sp, q: sc[1] + .35, seed: 17 + i * 13 };
});
// Little "ding" lines on each press and each card landing
const BURSTS = [];
PROMPTS.forEach((pr, n) => {
  BURSTS.push({ t: pr.m, x: BTN.x, y: BTN.y + 14, rx: 62, ry: 50, n: 7, a0: -Math.PI + .25, a1: -.25, sid: 7000 + n * 20 });
  pr.stops.forEach((st, i) => BURSTS.push({ t: st, x: CARD_T[0] + (i - 1) * 250, y: CARD_T[1], rx: 122, ry: 70, n: 5, a0: -2.5, a1: -.64, sid: 7000 + n * 20 + 3 + i }));
});

// Camera: [time, zoom, centre x, centre y]. One push-in on the first press, then wide for the montage.
// Base framing is already 1.25× so the figures fill the frame; kids walk in from just off screen.
const CAM = [[0, 1.3, 800, 510], [3.2, 1.3, 800, 510], [4.1, 1.5, 800, 475], [6.5, 1.5, 800, 475], [7.5, 1.3, 800, 510], [15.3, 1.3, 800, 510], [16.5, 1.36, 800, 515]];
function camAt(t) {
  for (let i = 1; i < CAM.length; i++) { const a = CAM[i - 1], b = CAM[i]; if (t <= b[0]) { const e = eInOut((t - a[0]) / (b[0] - a[0])); return [lerp(a[1], b[1], e), lerp(a[2], b[2], e), lerp(a[3], b[3], e)]; } }
  const z = CAM[CAM.length - 1]; return [z[1], z[2], z[3]];
}
// A tiny camera shake on each slam: sells the impact for almost no cost
function shakeAt(t) { for (const pr of PROMPTS) { const d = t - pr.m; if (d >= 0 && d < .2) { const a = 5 * (1 - d / .2); return [a * Math.sin(d * 110), a * .6 * Math.cos(d * 93)]; } } return [0, 0]; }

/* =========================================================================
   RIG: walking + posing a stick figure
   Limbs use two-bone IK: we say where a hand or foot should be and the
   elbow or knee finds itself. Acting is then just "put the hand here".
   ========================================================================= */
const UNIT_PX = 1.9, LC = 52;   // world px per rig unit (for stride), stride cycle length
function pathAt(f, t) {
  const k = f.path; let acc = 0;
  if (t <= k[0][0]) return { x: k[0][1], z: k[0][2], v: 0, dist: 0, dir: 0 };
  for (let i = 1; i < k.length; i++) {
    const a = k[i - 1], b = k[i], len = Math.hypot(b[1] - a[1], (b[2] - a[2]) * 260);
    if (t <= b[0]) { const dur = b[0] - a[0], u = (t - a[0]) / dur, e = trap(u); return { x: lerp(a[1], b[1], e), z: lerp(a[2], b[2], e), v: len * trapV(u) / dur, dist: acc + len * e, dir: Math.sign(b[1] - a[1]) }; }
    acc += len;
  }
  const z = k[k.length - 1]; return { x: z[1], z: z[2], v: 0, dist: acc, dir: 0 };
}
// Facing: last direction walked, unless a later facing key turns them around
function baseFace(f, t) {
  let fc = f.face0, ft = -1; const k = f.path;
  for (let i = 1; i < k.length; i++) { const a = k[i - 1], b = k[i]; if (a[0] <= t && b[1] !== a[1]) { fc = Math.sign(b[1] - a[1]); ft = a[0]; } }
  for (const [tt, v] of (f.faces || [])) if (tt <= t && tt >= ft) fc = v;
  return fc;
}
// Foot position through one stride. Planted foot slides back exactly as fast as the body moves (no skating).
function legPos(c) { c -= Math.floor(c); if (c < .5) return [LC / 4 - c / .5 * LC / 2, 0]; const s = (c - .5) / .5; return [-LC / 4 + s * LC / 2, -6 * Math.sin(Math.PI * s)]; }
function ik(A, T, l1, l2, pref) {
  let dx = T[0] - A[0], dy = T[1] - A[1], d = Math.hypot(dx, dy);
  const maxd = l1 + l2 - .01, mind = Math.abs(l1 - l2) + .5;
  if (d > maxd) { const k = maxd / d; dx *= k; dy *= k; d = maxd; }
  if (d < mind) { if (d < 1e-3) { dx = 0; dy = mind; } else { const k = mind / d; dx *= k; dy *= k; } d = mind; }
  const a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)), b = Math.atan2(dy, dx);
  const j1 = [A[0] + l1 * Math.cos(b + a), A[1] + l1 * Math.sin(b + a)], j2 = [A[0] + l1 * Math.cos(b - a), A[1] + l1 * Math.sin(b - a)];
  const mx = A[0] + dx / 2, my = A[1] + dy / 2;
  const s1 = (j1[0] - mx) * pref[0] + (j1[1] - my) * pref[1], s2 = (j2[0] - mx) * pref[0] + (j2[1] - my) * pref[1];
  return [s1 >= s2 ? j1 : j2, [A[0] + dx, A[1] + dy]];
}
function pressReach(u) { return u < .4 ? eOut(u / .4) : u < .75 ? 1 : 1 - eInOut((u - .75) / .25); }

function poseAt(f, t) {
  const pp = pathAt(f, t);
  const s = f.size * 2 * (1 - .18 * pp.z), gy = GY - 80 * pp.z;
  const w = sstep(pp.v / 90);                              // 0 standing → 1 walking
  const cyc = pp.dist / UNIT_PX / LC + f.id * .13;
  const l1 = legPos(cyc), l2 = legPos(cyc + .5);
  const st = {
    // Teen proportions: shorter legs and torso, so the head reads bigger. Standing hip sits just past
    // full leg reach, so the knees lock straight. Walking lowers the hip a touch so knees can bend.
    hipY: -38.2 + w * (2.6 + .9 * (1 - Math.cos(4 * Math.PI * cyc))) + (1 - w) * Math.sin(t * 2.3 + f.id * 1.7) * .3,
    lean: .045 * w, tilt: 0, jump: 0, mouth: null,   // upright when standing, a slight lean only when walking
    look: [.28 * Math.sin(t * .7 + f.id * 2.1), 0],
  };
  let face = (pp.v > 6 && pp.dir) ? pp.dir : baseFace(f, t);

  // Which acting beats are live right now, and how strongly (e = 0..1 envelope)
  const A = [];
  for (const a of f.acts) {
    const [type, t0, t1, o] = a; if (t < t0 || t > t1) continue;
    const r = RAMP[type], e = type === 'press' ? 1 : sstep((t - t0) / r) * sstep((t1 - t) / r);
    A.push({ type, t0, t1, o: o || {}, e, u: clamp((t - t0) / (t1 - t0)) });
  }
  // Pass 1: body (lean, hop, facing, eyes, mouth)
  let lookT = null, lookW = 0;
  for (const a of A) {
    const { type, e, u, o } = a;
    if (type === 'bounce') { st.jump += e * 3.5 * Math.abs(Math.sin(Math.PI * (t - a.t0) * 3.4)); lookT = [BTN.x, BTN.y]; lookW = e; }
    else if (type === 'press') { const r = pressReach(u); st.lean += .18 * r; lookT = [BTN.x, BTN.y]; lookW = r; }
    else if (type === 'watch') { const T = o.at || CARD_T; if (Math.abs(T[0] - pp.x) > 25 && e > .4) face = Math.sign(T[0] - pp.x); st.lean -= .04 * e; st.tilt -= .12 * e; lookT = T; lookW = e; if (o.o && e > .5) st.mouth = 'o'; }
    else if (type === 'react') { const uq = clamp((t - a.t0) / .42); st.jump += 10 * Math.sin(Math.PI * uq); st.lean -= .16 * e; if (e > .3) st.mouth = 'o'; }
    else if (type === 'scratch') {
      // Calm thinking, not panic: stay facing one way, eyes up toward the bubble,
      // head drifting back slightly while the ideas reshuffle above.
      st.tilt += (-.06 + .04 * Math.sin(t * 1.6 + f.id)) * e;
      st.look = L2(st.look, [.2, -.8], e);
      if (e > .5) st.mouth = 'flat';
    }
  }
  if (lookT) { const hx = pp.x, hy = gy - st.jump * s - 96 * s; const dx = (lookT[0] - hx) * face, dy = lookT[1] - hy, n = Math.hypot(dx, dy) || 1; st.look = L2(st.look, [dx / n, dy / n], lookW); }

  // Body geometry in rig units (feet at 0,0; +x = the way they face)
  const L = st.lean, dir = [Math.sin(L), -Math.cos(L)];
  const Hp = [0, st.hipY], Sh = add(Hp, [dir[0] * 26, dir[1] * 26]), N = add(Hp, [dir[0] * 30, dir[1] * 30]);
  const ha = L + st.tilt, C = add(N, [Math.sin(ha) * (f.hr - 1), -Math.cos(ha) * (f.hr - 1)]);
  const oy = gy - st.jump * s;

  // Pass 2: hands
  // Arms hang straight and close to the body (targets sit just past arm reach).
  // Bent elbows held out from the body read as adult and swaggering, so they only bend when acting.
  let h1 = [2.5, st.hipY + 8], h2 = [-2.5, st.hipY + 8];
  if (w > 0) { h1 = L2(h1, [-l1[0] * .5 + 1, st.hipY + 6], w); h2 = L2(h2, [-l2[0] * .5 - 1, st.hipY + 6], w); }
  let p1 = [-1, .3], p2 = [-1, .3];   // elbows bend back by default
  let scratching = false;
  for (const a of A) {
    if (a.type === 'bounce') { /* the little hops carry the excitement; arms stay down */ }
    else if (a.type === 'press') {
      const u = a.u, r = pressReach(u);
      let wy = u < .4 ? BTN.y - 16 : u < .5 ? lerp(BTN.y - 16, BTN.y + 12, (u - .4) / .1) : BTN.y + 12;
      if (u >= .75) wy = BTN.y - 6;
      h1 = L2(h1, [(BTN.x - pp.x) / s * face, (wy - oy) / s], r); if (r > .25) p1 = [.1, 1];
    }
    else if (a.type === 'react') { h1 = L2(h1, [15, st.hipY - 30], a.e); h2 = L2(h2, [-13, st.hipY - 28], a.e); }
    else if (a.type === 'scratch') {
      // Side-on scratch: the BACK arm reaches up to the back-top of the head, elbow out behind,
      // so nothing crosses the face. The front arm just hangs.
      h2 = L2(h2, [C[0] - f.hr * .5 + 1.2 * Math.sin(t * 14), C[1] - f.hr * .92 + .9 * Math.cos(t * 14)], a.e);
      if (a.e > .3) { p2 = [-1, -.5]; scratching = true; }
    }
  }
  const f1 = L2([4.5, 0], l1, w), f2 = L2([-4.5, 0], l2, w);   // narrow, neutral stance
  const [k1, F1] = ik(Hp, f1, 19, 19, [1, 0]), [k2, F2] = ik(Hp, f2, 19, 19, [1, 0]);
  const [e1, H1] = ik(Sh, h1, 16, 16, p1), [e2, H2] = ik(Sh, h2, 16, 16, p2);
  const blink = ((t + f.id * 1.37) / 3.3) % 1 < .045;
  return { f, x: pp.x, z: pp.z, s, gy, oy, face, jump: st.jump, Hp, N, Sh, C, ha, k1, F1, k2, F2, e1, H1, e2, H2, look: st.look, mouth: st.mouth, blink, scratching };
}

function drawFigure(q) {
  const { s, face, x, oy } = q, sid = 1000 + q.f.id * 100;
  const T = p => [x + p[0] * s * face, oy + p[1] * s];
  const w = .85 + .15 * (1 - q.z);
  if (CFG.shadows) { const sh = 1 - clamp(q.jump / 20) * .4; segs([[x - 13 * s * sh, q.gy + 2 * s], [x + 13 * s * sh, q.gy + 2 * s]], sid + 90, { w: .7 * w, alpha: .22, wob: .6 }); }
  segs([T(q.Hp), T(q.k2), T(q.F2)], sid + 1, { w });
  segs([T(q.Hp), T(q.k1), T(q.F1)], sid + 2, { w });
  if (!q.scratching) segs([T(q.Sh), T(q.e2), T(q.H2)], sid + 3, { w });
  segs([T(q.Hp), T(q.N)], sid + 4, { w });
  // Head: filled with paper so it hides lines behind it
  const c = T(q.C), r = q.f.hr * s;
  curve(circlePts(c[0], c[1], r, sid + 5), sid + 5, { fill: PAPER, w });
  // Face: two dot eyes, mouth only when acting
  const ha = q.ha, hs = q.f.hr / 12, rot = v => [v[0] * Math.cos(ha) - v[1] * Math.sin(ha), v[0] * Math.sin(ha) + v[1] * Math.cos(ha)];
  const off = [q.look[0] * 2.5 * hs, q.look[1] * 2.3 * hs];
  [[1.2, -2.4], [6.4, -2.4]].forEach(([ex, ey], i) => {
    const v = rot([ex * hs + off[0], ey * hs + off[1]]), pw = T(add(q.C, v));
    if (q.blink) segs([[pw[0] - 1.7 * s, pw[1]], [pw[0] + 1.7 * s, pw[1]]], sid + 40 + i, { w: .8, wob: .3 });
    else dot(pw[0], pw[1], 1.75 * s * hs, sid + 40 + i);
  });
  if (q.mouth === 'o') { const pw = T(add(q.C, rot([4.6 * hs, 5.2 * hs]))); curve(circlePts(pw[0], pw[1], 1.8 * s * hs, sid + 50, 10, .15), sid + 50, { w: .7, wob: .3 }); }
  else if (q.mouth === 'flat') { segs([T(add(q.C, rot([2.4 * hs, 5.6 * hs]))), T(add(q.C, rot([6.8 * hs, 4.8 * hs])))], sid + 51, { w: .75, wob: .4 }); }
  // A scratching back arm draws after the head so the hand sits on its outline
  if (q.scratching) segs([T(q.Sh), T(q.e2), T(q.H2)], sid + 3, { w });
  segs([T(q.Sh), T(q.e1), T(q.H1)], sid + 6, { w });
}

/* =========================================================================
   THE BUTTON: a game-show pedestal with the SOD+A plus on the front
   ========================================================================= */
function buttonDown(t) {
  let d = 0;
  for (const f of FIGS) for (const a of f.acts) if (a[0] === 'press') {
    const dur = a[2] - a[1], m = a[1] + .45 * dur, rel = a[1] + .75 * dur;
    d = Math.max(d, sstep((t - (m - .035)) / .035) * (1 - sstep((t - rel) / .1)));
  }
  return d;
}
function drawPedestal(t) {
  const { x, gy, top } = PED, sid = 50;
  if (CFG.shadows) segs([[x - 62, gy + 3], [x + 62, gy + 3]], sid + 9, { w: .7, alpha: .22, wob: .6 });
  segs([[x - 42, top + 11], [x + 42, top + 11], [x + 50, gy], [x - 50, gy]], sid, { closed: true, fill: PAPER });
  segs([[x - 54, top], [x + 54, top], [x + 54, top + 11], [x - 54, top + 11]], sid + 1, { closed: true, fill: PAPER });
  segs([[x, top + 28], [x, top + 60]], sid + 2, { w: .9 });
  segs([[x - 15, top + 44], [x + 15, top + 44]], sid + 3, { w: .9 });
  // ring + dome
  const d = buttonDown(t), hgt = lerp(22, 8, d), cy = top - 4;
  curve(ellipsePts(x, top - 2, 36, 7), sid + 4, { fill: PAPER });
  const dome = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; dome.push([x + Math.cos(a) * 27, cy + Math.sin(a) * hgt]); }
  dome.push([x - 27, cy]);
  curve(dome, sid + 5, { fill: GREEN });
  const hl = []; for (let i = 0; i <= 6; i++) { const a = Math.PI * 1.18 + i / 6 * Math.PI * .26; hl.push([x + Math.cos(a) * 18, cy + Math.sin(a) * hgt * .68]); }
  curve(hl, sid + 6, { w: .6, color: '#ffffff', alpha: .85, wob: .3 });
}

/* =========================================================================
   PROMPT CARDS
   The wording is never readable, like the teacher's voice in Charlie Brown.
   Each card spins slot-machine style and lands on a scribble "word".
   Three cards with plus signs = "you have to mix three things".
   ========================================================================= */
const scribCache = new Map();
// Cursive-looking loops: a prolate cycloid with random letter heights
function scrib(seed) {
  if (scribCache.has(seed)) return scribCache.get(seed);
  const n = 4 + Math.floor(hash(seed, 1, 7) * 3), W0 = 140, r = W0 / (n * 2 * Math.PI), steps = n * 14, pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps * n * 2 * Math.PI, k = Math.min(n - 1, Math.floor(t / (2 * Math.PI)));
    const amp = 11 + 22 * hash(seed, k, 3), d = 3 + 6 * hash(seed, k, 5);
    const yy = -amp * (.5 - .5 * Math.cos(t)), xx = r * t + d * Math.sin(t) - yy * .22;
    pts.push([xx - W0 / 2, yy + 14]);
  }
  scribCache.set(seed, pts); return pts;
}
function cardFrame(cx, cy, kx, ky, sid, wob) {
  const k = Math.min(kx, ky), hw = CW / 2 * kx, hh = CH / 2 * ky, o = 6 * k;
  ctx.beginPath(); ctx.rect(cx - hw, cy - hh, hw * 2, hh * 2); ctx.fillStyle = PAPER; ctx.fill();
  const ww = lerp(.6, .95, clamp(k));
  segs([[cx - hw - o, cy - hh], [cx + hw + o * .4, cy - hh]], sid, { w: ww, wob });
  segs([[cx + hw, cy - hh - o * .5], [cx + hw, cy + hh + o]], sid + 1, { w: ww, wob });
  segs([[cx + hw + o * .6, cy + hh], [cx - hw - o * .3, cy + hh]], sid + 2, { w: ww, wob });
  segs([[cx - hw, cy + hh + o * .4], [cx - hw, cy - hh - o]], sid + 3, { w: ww, wob });
}
function drawCard(pr, i, t, cx, cy, k) {
  const sid = 3000 + pr.fig * 50 + i * 10, spin0 = pr.d0, stop = pr.stops[i], R = 8 + i * 3;
  const pAt = tt => { const u = clamp((tt - spin0) / (stop - spin0)); let v = R * eOutQ(u); if (u > .82) { const s = (u - .82) / .18; v += .16 * Math.sin(s * Math.PI) * (1 - s); } return v; };
  const p = pAt(t), speed = Math.abs(pAt(t + .01) - p) / .01;
  const pop = t > stop && t < stop + .2 ? 1 + .08 * Math.sin((t - stop) / .2 * Math.PI) : 1;
  const kk = k * pop, wob = lerp(.45, 1, clamp((k - .15) / .85));
  cardFrame(cx, cy, kk, kk, sid, wob);
  ctx.save(); ctx.beginPath(); ctx.rect(cx - CW / 2 * kk + 2, cy - CH / 2 * kk + 2, CW * kk - 4, CH * kk - 4); ctx.clip();
  const base = Math.floor(p);
  for (let r = base - 1; r <= base + 1; r++) {
    const dy = (p - r) * CH; if (Math.abs(dy) > CH * 1.1) continue;
    const pts = scrib(pr.seed * 101 + r).map(q => [cx + q[0] * kk, cy + (q[1] + dy) * kk]);
    if (speed > 3) { const g = Math.min(22, speed * 1.6) * kk; [-1, 1].forEach(sg => curve(pts.map(q => [q[0], q[1] + sg * g]), sid + 200 + r, { w: .8, alpha: .25, wob: .6 * wob })); }
    curve(pts, sid + 100 + r, { w: lerp(.55, .85, clamp(k)), wob: .7 * wob });
  }
  ctx.restore();
}
/* ---------- thinking: the ideas in the bubble rearrange ----------
   While a student scratches their head, the three mini prompts swap order every
   beat, and one or two of them change shape (new scribble, new card proportions).
   It shows them trying combinations, which is the whole point of the prompt. */
const SHUF_STEP = 1.15, SHUF_MOVE = .4;
const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
function shuffleAt(pr, n) {
  let order = [0, 1, 2], gen = [0, 0, 0], prev = { order: order.slice(), gen: gen.slice() };
  for (let s = 1; s <= n; s++) {
    prev = { order: order.slice(), gen: gen.slice() };
    const pi = Math.floor(hash(pr.seed, s, 61) * 6);
    let o = PERMS[pi];
    if (o.join() === order.join()) o = PERMS[(pi + 1 + Math.floor(hash(pr.seed, s, 62) * 5)) % 6];   // always a visible swap
    order = o.slice();
    let changed = 0;
    for (let i = 0; i < 3; i++) if (hash(pr.seed, s, 70 + i) < .55) { gen[i]++; changed++; }
    if (!changed) gen[Math.floor(hash(pr.seed, s, 75) * 3)]++;
  }
  return { order, gen, prev };
}
function drawMini(pr, i, cx, cy, kx, ky, seed) {
  const sid = 3000 + pr.fig * 50 + i * 10;
  cardFrame(cx, cy, kx, ky, sid, .45);
  ctx.save(); ctx.beginPath(); ctx.rect(cx - CW / 2 * kx + 1.5, cy - CH / 2 * ky + 1.5, CW * kx - 3, CH * ky - 3); ctx.clip();
  curve(scrib(seed).map(q => [cx + q[0] * kx, cy + q[1] * ky]), sid + 150 + (seed % 50), { w: .55, wob: .5 });
  ctx.restore();
}
function drawShuffle(pr, t, B) {
  const el = t - (pr.q + .4), n = Math.floor(el / SHUF_STEP) + 1;
  const u = eInOut(clamp((el - (n - 1) * SHUF_STEP) / SHUF_MOVE));
  const S = shuffleAt(pr, n), sb = B.sb, base = .165 * sb;
  const slotX = j => B.c[0] + (j - 1) * 46 * sb;
  const asp = (i, g) => g === 0 ? 1 : lerp(.75, 1.22, hash(pr.seed, i, 50 + g));
  for (let i = 0; i < 3; i++) {
    const j0 = S.prev.order.indexOf(i), j1 = S.order.indexOf(i);
    const x = lerp(slotX(j0), slotX(j1), u);
    const y = B.c[1] + 2 * sb - Math.sign(j1 - j0) * 8 * sb * Math.sin(Math.PI * u);   // cards hop over each other
    const g0 = S.prev.gen[i], g1 = S.gen[i], changing = g1 !== g0;
    const a = lerp(asp(i, g0), asp(i, g1), u);
    let kx = base * a, ky = base / a;
    if (changing) ky *= 1 - .4 * Math.sin(Math.PI * u);   // squash as the idea changes
    const g = changing && u < .5 ? g0 : g1;
    const seed = g === 0 ? pr.seed * 101 + 8 + i * 3 : pr.seed * 101 + 500 + i * 37 + g * 11;
    drawMini(pr, i, x, y, kx, ky, seed);
  }
}
function cloudPts(B, seed) {
  const n = 56, pts = [];
  for (let i = 0; i <= n; i++) { const th = i / n * Math.PI * 2; const rr = (1 + .12 * Math.abs(Math.sin(th * 3.5 + .7))) * (1 + .03 * (hash(seed, i % n, 8) - .5)); pts.push([B.c[0] + Math.cos(th) * B.rx * rr * .95, B.c[1] + Math.sin(th) * B.ry * rr]); }
  return pts;
}
function bubbleOf(q) {
  const sb = q.s / 2, top = [q.x + q.C[0] * q.s * q.face, q.oy + (q.C[1] - q.f.hr) * q.s];
  return { sb, top, c: [top[0], top[1] - 64 * sb], rx: 74 * sb, ry: 33 * sb };
}
// Handwritten question mark, in unit coordinates
const QPTS = (() => { const p = []; for (let i = 0; i <= 14; i++) { const a = Math.PI * 1.05 + i / 14 * Math.PI * 1.45; p.push([Math.cos(a) * .42, -.62 + Math.sin(a) * .36]); } p.push([.03, .02]); return p; })();
function plus(x, y, h, sid, prog = 1, w = 1) {
  segs(partial([[x - h, y], [x + h, y]], clamp(prog * 2)), sid, { w, wob: .6 });
  segs(partial([[x, y - h], [x, y + h]], clamp(prog * 2 - 1)), sid + 1, { w, wob: .6 });
}
function drawPrompts(t, poses) {
  for (const pr of PROMPTS) {
    if (t < pr.d0) continue;
    const q = poses[pr.fig], B = bubbleOf(q), sb = B.sb, sidB = 4000 + pr.fig * 100;
    const flyDur = pr.f1 - pr.f0;
    // thought bubble draws itself while the cards fly in
    if (t >= pr.f0) {
      const prog = clamp((t - pr.f0) / flyDur * 1.25);
      [[B.top[1] - 9 * sb, 3.2 * sb, 0], [B.top[1] - 21 * sb, 5.4 * sb, .15]].forEach(([cy, r, st], i) => {
        const pr2 = clamp((prog - st) / .25); if (pr2 > 0) curve(partial(circlePts(B.top[0], cy, r, sidB + i, 12, .2), pr2), sidB + i, { w: .8, wob: .5, fill: pr2 >= 1 ? PAPER : null });
      });
      const cp = cloudPts(B, pr.seed), cprog = clamp((prog - .2) / .8);
      if (cprog > 0) curve(partial(cp, cprog), sidB + 5, { w: .9, fill: cprog >= 1 ? PAPER : null });
    }
    // overhead plus signs, fading as the cards leave
    if (t < pr.f0 + .15) {
      const pp = clamp((t - pr.d0 - .15 / pr.sp) / (.2 / pr.sp));
      ctx.globalAlpha = 1 - clamp((t - pr.f0) / .15);
      plus(CARD_T[0] - 125, CARD_T[1], 13, sidB + 30, pp); plus(CARD_T[0] + 125, CARD_T[1], 13, sidB + 32, pp);
      ctx.globalAlpha = 1;
    }
    let landed = true;
    for (let i = 0; i < 3; i++) {
      const ox = CARD_T[0] + (i - 1) * 250, oyy = CARD_T[1];
      const du = (t - (pr.d0 + i * .06 / pr.sp)) / pr.dd; if (du < 0) { landed = false; continue; }
      let cx = ox, cy = lerp(-140, oyy, eOutBack(du)), k = 1;
      const fu = eInOut((t - pr.f0 - i * .05 / pr.sp) / (flyDur - .1 / pr.sp));
      if (fu < 1) landed = false;
      if (t > pr.f0 && fu > 0) { const mx = B.c[0] + (i - 1) * 46 * sb, my = B.c[1] + 2 * sb; cx = lerp(ox, mx, fu); cy = lerp(oyy, my, fu) - 80 * Math.sin(Math.PI * fu) * (1 - fu * .3); k = lerp(1, .165 * sb, fu); }
      if (fu >= 1 && t >= pr.q + .4) continue;   // handed over to the thinking shuffle below
      drawCard(pr, i, t, cx, cy, k);
    }
    if (landed && t >= pr.q + .4) drawShuffle(pr, t, B);
    if (landed) { plus(B.c[0] - 23 * sb, B.c[1] + 2 * sb, 4.5 * sb, sidB + 34, 1, .6); plus(B.c[0] + 23 * sb, B.c[1] + 2 * sb, 4.5 * sb, sidB + 36, 1, .6); }
    // the question mark writes itself once they start scratching
    if (t >= pr.q) {
      // centred above the bubble, floating gently
      const qp = clamp((t - pr.q) / .35), s0 = 30 * sb, qx = B.c[0], qy = B.c[1] - B.ry * 1.12 - 12 * sb - .3 * s0 + Math.sin(t * 3 + pr.fig) * 1.5 * sb;
      curve(partial(QPTS.map(p => [qx + p[0] * s0, qy + p[1] * s0]), qp), sidB + 20, { w: 1.05 });
      if (qp >= 1) dot(qx + .03 * s0, qy + .25 * s0, 2.6 * sb, sidB + 21);
    }
  }
}
function drawBursts(t) {
  for (const b of BURSTS) {
    const u = (t - b.t) / .28; if (u < 0 || u > 1) continue;
    const outer = 1 + .7 * eOut(clamp(u * 2.2)), inner = 1 + .7 * Math.pow(clamp(u), 1.6);   // tail lags the head so each line flicks out
    for (let j = 0; j < b.n; j++) {
      const a = lerp(b.a0, b.a1, (j + .5) / b.n), c = Math.cos(a), s = Math.sin(a);
      segs([[b.x + c * b.rx * inner, b.y + s * b.ry * inner], [b.x + c * b.rx * outer, b.y + s * b.ry * outer]], b.sid * 10 + j, { w: .9, wob: .5 });
    }
  }
}

/* =========================================================================
   FRAME
   ========================================================================= */

export function render(c, t, view) {
  ctx = c; INK = view.ink; PAPER = view.paper;
  BS = Math.floor(t * CFG.boil + 1e-6);
  const k = view.s, ox = view.ox, oy = view.oy;   // device px per frame unit, and where the frame sits
  // no background fill: the canvas stays transparent so the page colour shows through
  const cam = camAt(t); ZOOM = cam[0];
  sync(ctx, BS, ZOOM, 5 / 4.5, INK);   // this chapter was tuned at weight 5 with lines scaled by the full zoom
  const sh = shakeAt(t);
  ctx.setTransform(k * ZOOM, 0, 0, k * ZOOM, ox + k * (W / 2 - cam[1] * ZOOM + sh[0]), oy + k * (H / 2 - cam[2] * ZOOM + sh[1]));
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const poses = FIGS.map(f => poseAt(f, t));
  const items = poses.map(q => ({ z: q.z, fn: () => drawFigure(q) }));
  items.push({ z: .501, fn: () => drawPedestal(t) });   // just behind whoever is pressing
  items.sort((a, b) => b.z - a.z).forEach(i => i.fn());  // back to front
  drawBursts(t);
  drawPrompts(t, poses);
}
