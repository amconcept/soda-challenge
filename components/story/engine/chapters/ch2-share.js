/* =========================================================================
   SOD+A STORY — Chapter 2: making and sharing
   Ideas land, things get made, and the camera pulls out to a small planet with
   three groups far apart. Work goes up on the shared board and travels between groups.

   Scene code is the approved test animatic (soda-animatic-02.html), unchanged except:
   the shared math and ink now come from ../core.js, the player UI is gone,
   and render() draws onto a transparent canvas wherever the player puts the frame.
   ========================================================================= */
import { W, H, GY, COL, CFG, clamp, lerp, L2, add, sstep, eInOut, eOut, eOutQ, eOutBack, trap, trapV, hash, jit, lw, segs, curve, finish, dot, circlePts, ellipsePts, circ, rectP, gearP, partial, plen, fillPoly, sync, hand, handT } from '../core.js';

export const DUR = 18.8;
let INK = '#141414', PAPER = '#ffffff';   // set by the player every frame: line colour, and the page colour used for knockouts

function keyAt(keys, t) {   // piecewise-linear value over [[time, value], ...]
  if (t < keys[0][0]) return 0;   // not started yet
  for (let i = 1; i < keys.length; i++) { const a = keys[i - 1], b = keys[i]; if (t <= b[0]) return lerp(a[1], b[1], (t - a[0]) / (b[0] - a[0] || 1)); }
  return keys[keys.length - 1][1];
}

/* ---------- ink state ----------
   Chapter-local copies; sync() hands them to core.js once per frame. */
let ctx, BS = 0, ZOOM = 1, ZP = 1;

/* =========================================================================
   WORLD: a small planet
   Pulling back reveals the floor is the curve of a planet, with the other two
   groups far round it. Distance and "across borders" with zero detail.
   Each group is built at the same local spot, then rotated round the planet.
   ========================================================================= */
// A small planet: the other groups sit 55° round each side, so the wide shot reads as
// "around the world", not "down the road". Small enough that the whole curve shows.
const PLANET = { x: 800, y: GY + 2000, r: 2000 };
const CLUSTERS = [{ a: 0 }, { a: -.96 }, { a: .96 }];   // us, left group, right group
const TABLE_Y = 686, TGY = 752, KZ = .62;                // tabletop, table feet, kids' depth (behind the table)
const TABLES = [[480, 1180], [550, 1070], [550, 1070]];
/* Wrapping: every kid, object and table point stands perpendicular to the curve.
   Local x = distance along the surface, local y = height. Each element (a kid, an object)
   is drawn upright in its own frame, rotated to the angle of its spot on the planet. */
function rotAbout(p, ang) { const dx = p[0] - PLANET.x, dy = p[1] - PLANET.y, c = Math.cos(ang), s = Math.sin(ang); return [PLANET.x + dx * c - dy * s, PLANET.y + dx * s + dy * c]; }
const wrapA = (ci, x) => CLUSTERS[ci].a + (x - PLANET.x) / PLANET.r;
function toWorldAt(ci, ax, p) { return rotAbout([p[0] - ax + PLANET.x, p[1]], wrapA(ci, ax)); }   // p in the frame of an element standing at ax
function toLocalAt(ci, ax, p) { const q = rotAbout(p, -wrapA(ci, ax)); return [q[0] + ax - PLANET.x, q[1]]; }
const wrapPt = (ci, p) => toWorldAt(ci, p[0], p);
function enterAt(ci, ax) { ctx.save(); ctx.translate(PLANET.x, PLANET.y); ctx.rotate(wrapA(ci, ax)); ctx.translate(-PLANET.x, -PLANET.y); ctx.translate(PLANET.x - ax, 0); }

// The shared board (reads as an online board: a window bar with three dots), floating above the planet
const BOARD = { x0: -500, x1: 2100, y0: 40, y1: 330, t0: 8.7, t1: 9.5 };
const SLOTS = [-250, 275, 800, 1325, 1850].map(x => [x, 208]);

/* =========================================================================
   THE CAST + WHAT THEY MAKE
   Thirteen kids in three groups. Each has an object on the table that draws
   itself as they work (prog = how complete), and turns to colour at ct.
   ========================================================================= */
const OS = 1.3;   // object scale: big enough to read as "a thing" next to the kids
const OBJ_H = Object.fromEntries(Object.entries({ robot: 62, lamp: 52, video: 40, fabric: 33, gears: 44, pinwheel: 57, house: 42, tower: 54 }).map(([k, v]) => [k, v * OS]));
const IDEA = [.8, 1.45, 1.95, 2.35, 2.65];   // when each of our five gets their idea
const BUB = [0, 1, 2, 3, 4].map(i => ({ fig: i, seed: 17 + i * 13, q: -3.2 - i * .5 }));   // same prompt seeds as test 01
const FIGS = [
  // ---- our group (close-up) ----
  { id: 0, ci: 0, x: 540, face0: 1, size: 1.0, hr: 12.5, obj: { type: 'video', x: 580, col: COL.sky, ct: 15.0 },
    prog: [[1.55, 0], [4.9, .45], [6.8, .45], [9.3, .65], [14.25, .65], [14.95, 1]],
    acts: [['scratch', 0, .8], ['idea', .8, 1.35], ['build', 1.3, 4.9], ['talk', 4.9, 6.0, { to: 700 }], ['listen', 6.0, 6.8, { to: 700 }], ['build', 6.8, 9.3], ['watch', 9.3, 12.75, { at: 'board' }], ['watch', 12.75, 13.45, { at: 'X2' }], ['catch', 13.45, 14.25, { at: 'X2' }], ['build', 14.25, 15.0], ['cheer', 15.1, 18.8]] },
  { id: 1, ci: 0, x: 700, face0: -1, size: .95, hr: 12, obj: { type: 'robot', x: 660, col: COL.coral, ct: 15.12 },
    prog: [[2.2, 0], [4.9, .4], [6.8, .4], [9.3, .6], [12.0, .6], [15.07, 1]],
    acts: [['scratch', 0, 1.45], ['idea', 1.45, 2.0], ['build', 1.95, 4.9], ['listen', 4.9, 6.0, { to: 540 }], ['talk', 6.0, 6.8, { to: 540 }], ['build', 6.8, 9.3], ['watch', 9.3, 12.0, { at: 'board' }], ['build', 12.0, 15.12], ['cheer', 15.22, 18.8]] },
  { id: 2, ci: 0, x: 800, face0: 1, size: 1.03, hr: 12.5, obj: { type: 'gears', x: 840, col: COL.sun, ct: 15.24 },
    prog: [[2.7, 0], [5.1, .4], [5.9, .4], [9.3, .65], [12.0, .65], [15.19, 1]],
    acts: [['scratch', 0, 1.95], ['idea', 1.95, 2.5], ['build', 2.45, 5.1], ['give', 5.1, 5.9, { to: 960 }], ['build', 5.9, 9.3], ['watch', 9.3, 9.45, { at: 'board' }], ['toss', 9.45, 10.15, { slot: 2 }], ['watch', 10.15, 12.0, { at: 'board' }], ['build', 12.0, 15.24], ['cheer', 15.34, 18.8]] },
  { id: 3, ci: 0, x: 960, face0: -1, size: .97, hr: 13, obj: { type: 'fabric', x: 920, col: COL.violet, ct: 15.36 },
    prog: [[3.1, 0], [5.3, .35], [5.85, .35], [5.86, .45], [6.8, .45], [9.3, .65], [12.0, .65], [15.31, 1]],
    acts: [['scratch', 0, 2.35], ['idea', 2.35, 2.9], ['build', 2.85, 5.3], ['catch', 5.3, 5.95, { at: 'piece' }], ['listen', 5.95, 6.8, { to: 1080 }], ['build', 6.8, 9.3], ['watch', 9.3, 12.0, { at: 'board' }], ['build', 12.0, 15.36], ['cheer', 15.46, 18.8]] },
  { id: 4, ci: 0, x: 1080, face0: 1, size: .93, hr: 12, obj: { type: 'pinwheel', x: 1120, col: COL.green, ct: 15.48 },
    prog: [[3.4, 0], [5.9, .4], [6.8, .4], [9.3, .62], [12.0, .62], [15.43, 1]],
    acts: [['scratch', 0, 2.65], ['idea', 2.65, 3.2], ['build', 3.15, 5.9], ['talk', 5.9, 6.8, { to: 960 }], ['build', 6.8, 9.3], ['watch', 9.3, 10.35, { at: 'board' }], ['toss', 10.35, 11.05, { slot: 3 }], ['watch', 11.05, 12.0, { at: 'board' }], ['build', 12.0, 15.48], ['cheer', 15.58, 18.8]] },
  // ---- left group ----
  { id: 5, ci: 1, x: 600, face0: 1, size: .98, hr: 12.5, obj: { type: 'lamp', x: 640, col: COL.sun, ct: 15.5 },
    prog: [[0, .1], [9.5, .6], [12.0, .6], [15.45, 1]],
    acts: [['build', 0, 9.5], ['watch', 9.5, 9.75, { at: 'board' }], ['toss', 9.75, 10.45, { slot: 0 }], ['watch', 10.45, 12.0, { at: 'board' }], ['build', 12.0, 15.5], ['cheer', 15.6, 18.8]] },
  { id: 6, ci: 1, x: 760, face0: -1, size: .94, hr: 12, obj: { type: 'robot', x: 720, col: COL.sky, ct: 15.62 },
    prog: [[0, .1], [9.5, .55], [13.5, .55], [15.57, 1]],
    acts: [['build', 0, 9.5], ['watch', 9.5, 12.0, { at: 'board' }], ['watch', 12.0, 12.7, { at: 'X0' }], ['catch', 12.7, 13.5, { at: 'X0' }], ['build', 13.5, 15.62], ['cheer', 15.72, 18.8]] },
  { id: 7, ci: 1, x: 860, face0: 1, size: 1.02, hr: 12, obj: { type: 'house', x: 900, col: COL.coral, ct: 15.74 },
    prog: [[0, .15], [9.5, .6], [14.7, .6], [15.69, 1]],
    acts: [['build', 0, 9.5], ['watch', 9.5, 13.1, { at: 'board' }], ['watch', 13.1, 13.9, { at: 'X3' }], ['catch', 13.9, 14.7, { at: 'X3' }], ['build', 14.7, 15.74], ['cheer', 15.84, 18.8]] },
  { id: 8, ci: 1, x: 1020, face0: -1, size: .96, hr: 13, obj: { type: 'gears', x: 980, col: COL.green, ct: 15.86 },
    prog: [[0, .1], [9.5, .6], [12.0, .6], [15.81, 1]],
    acts: [['build', 0, 9.5], ['watch', 9.5, 10.65, { at: 'board' }], ['toss', 10.65, 11.35, { slot: 1 }], ['watch', 11.35, 12.0, { at: 'board' }], ['build', 12.0, 15.86], ['cheer', 15.96, 18.8]] },
  // ---- right group ----
  { id: 9, ci: 2, x: 600, face0: 1, size: .95, hr: 12, obj: { type: 'fabric', x: 640, col: COL.coral, ct: 15.9 },
    prog: [[0, .1], [9.5, .6], [12.0, .6], [15.85, 1]],
    acts: [['build', 0, 9.5], ['watch', 9.5, 10.05, { at: 'board' }], ['toss', 10.05, 10.75, { slot: 4 }], ['watch', 10.75, 12.0, { at: 'board' }], ['build', 12.0, 15.9], ['cheer', 16.0, 18.8]] },
  { id: 10, ci: 2, x: 760, face0: -1, size: 1.0, hr: 12.5, obj: { type: 'tower', x: 720, col: COL.violet, ct: 16.02 },
    prog: [[0, .1], [9.5, .55], [14.1, .55], [15.97, 1]],
    acts: [['build', 0, 9.5], ['watch', 9.5, 12.4, { at: 'board' }], ['watch', 12.4, 13.3, { at: 'X1' }], ['catch', 13.3, 14.1, { at: 'X1' }], ['build', 14.1, 16.02], ['cheer', 16.12, 18.8]] },
  { id: 11, ci: 2, x: 860, face0: 1, size: .93, hr: 12, obj: { type: 'pinwheel', x: 900, col: COL.sky, ct: 16.14 },
    prog: [[0, .1], [9.5, .6], [12.0, .6], [16.09, 1]],
    acts: [['build', 0, 9.5], ['watch', 9.5, 12.0, { at: 'board' }], ['build', 12.0, 16.14], ['cheer', 16.24, 18.8]] },
  { id: 12, ci: 2, x: 1020, face0: -1, size: 1.03, hr: 12.5, obj: { type: 'video', x: 980, col: COL.sun, ct: 16.26 },
    prog: [[0, .1], [9.5, .6], [12.0, .6], [16.21, 1]],
    acts: [['build', 0, 9.5], ['watch', 9.5, 12.0, { at: 'board' }], ['build', 12.0, 16.26], ['cheer', 16.36, 18.8]] },
];
const RAMP = { scratch: .25, idea: .06, build: .15, talk: .15, listen: .15, give: .15, catch: .12, toss: .05, watch: .2, cheer: .15 };

/* ---------- idea cards: thrown up to the board, then passed on ----------
   Each card carries a doodle of a part (a gear, light rays, a zigzag, a star),
   never words. A passed-on card adds that part to someone else's object. */
const TOSSES = [
  { fig: 2, slot: 2, d: 'gear' }, { fig: 5, slot: 0, d: 'rays' }, { fig: 9, slot: 4, d: 'zigzag' },
  { fig: 4, slot: 3, d: 'star' }, { fig: 8, slot: 1, d: 'gear' },
].map(K => { const a = FIGS[K.fig].acts.find(x => x[0] === 'toss'); const rel = a[1] + .55 * (a[2] - a[1]); return { ...K, rel, land: rel + .65 }; });
const XFERS = [   // board slot → someone in another group
  { slot: 2, fig: 6, d: 'gear', l0: 12.0, l1: 12.6, v0: 12.35, v1: 13.15 },
  { slot: 0, fig: 10, d: 'rays', l0: 12.35, l1: 13.05, v0: 12.75, v1: 13.75 },
  { slot: 4, fig: 0, d: 'zigzag', l0: 12.75, l1: 13.35, v0: 13.1, v1: 13.9 },
  { slot: 3, fig: 7, d: 'star', l0: 13.1, l1: 13.8, v0: 13.5, v1: 14.35 },
];
XFERS.forEach(X => { const o = FIGS[X.fig].obj; o.xt = X.v1; o.xtype = X.d; });
const TALKS = [{ fig: 0, t0: 4.95, t1: 6.0, d: 'star' }, { fig: 1, t0: 6.05, t1: 6.8, d: 'zigzag' }, { fig: 4, t0: 5.95, t1: 6.8, d: 'rays' }];
const PIECE = { t0: 5.45, t1: 5.85, a: [866, 642], b: [920, TABLE_Y - 22] };   // C hands a part to D

// Camera: [time, zoom, x, y]. Zoom eases in log space so the pull-back feels even.
const CAM = [[0, 1.45, 810, 600], [6.8, 1.5, 810, 596], [9.1, .4, 800, 930], [16.0, .4, 800, 930], [18.8, .4, 800, 930]];
function camAt(t) {
  for (let i = 1; i < CAM.length; i++) { const a = CAM[i - 1], b = CAM[i]; if (t <= b[0]) { const e = eInOut((t - a[0]) / (b[0] - a[0])); return [Math.exp(lerp(Math.log(a[1]), Math.log(b[1]), e)), lerp(a[2], b[2], e), lerp(a[3], b[3], e)]; } }
  const z = CAM[CAM.length - 1]; return [z[1], z[2], z[3]];
}

/* =========================================================================
   RIG (test 01's teen rig, standing in place, with new acting beats)
   ========================================================================= */
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
const objTopWorld = f => wrapPt(f.ci, [f.obj.x, TABLE_Y - OBJ_H[f.obj.type] - 8]);
const piecePos = t => { const u = eInOut((t - PIECE.t0) / (PIECE.t1 - PIECE.t0)); const c = L2(PIECE.a, PIECE.b, u); c[1] -= 40 * Math.sin(Math.PI * u); return c; };
// Where a kid is looking, in that kid's own upright frame
function targetLocal(f, at, t) {
  let w;
  if (at === 'board') { const me = toWorldAt(f.ci, f.x, [f.x, 600]); w = [clamp(me[0], BOARD.x0 + 150, BOARD.x1 - 150), (BOARD.y0 + BOARD.y1) / 2]; }
  else if (at === 'piece') w = wrapPt(0, piecePos(t));
  else if (typeof at === 'string' && at[0] === 'X') w = xferCardPos(XFERS[+at.slice(1)], t);
  else w = wrapPt(f.ci, at);
  return toLocalAt(f.ci, f.x, w);
}

function poseAt(f, t) {
  const s = f.size * 2 * (1 - .18 * KZ), gy = GY - 80 * KZ;
  const st = { hipY: -38.2 + Math.sin(t * 2.3 + f.id * 1.7) * .3, lean: 0, tilt: 0, jump: 0, mouth: null, look: [.25 * Math.sin(t * .7 + f.id * 2.1), 0], eyeK: 1 };
  let face = f.face0;
  const A = [];
  for (const a of f.acts) { const [type, t0, t1, o] = a; if (t < t0 || t > t1) continue; const r = RAMP[type]; A.push({ type, t0, t1, o: o || {}, e: sstep((t - t0) / r) * sstep((t1 - t) / r), u: clamp((t - t0) / (t1 - t0)) }); }
  const objW = toLocalAt(f.ci, f.x, wrapPt(f.ci, [f.obj.x, TABLE_Y - OBJ_H[f.obj.type] * .5]));
  let lookT = null, lookW = 0;
  // Pass 1: body
  for (const a of A) {
    const { type, e, u, o } = a;
    if (type === 'scratch') { st.tilt += (-.06 + .04 * Math.sin(t * 1.6 + f.id)) * e; st.look = L2(st.look, [.2, -.8], e); if (e > .5) st.mouth = 'flat'; }
    else if (type === 'idea') { const uq = clamp((t - a.t0) / .5); st.jump += 9 * Math.sin(Math.PI * uq); st.mouth = uq < .4 ? 'o' : 'smile'; st.eyeK = 1 + .35 * (1 - uq); st.look = L2(st.look, [.1, -.5], e); }
    else if (type === 'build') { face = Math.sign(f.obj.x - f.x) || face; st.lean += .14 * e; lookT = objW; lookW = e; }
    else if (type === 'talk') { face = Math.sign(o.to - f.x) || face; st.mouth = Math.floor(t * 7) % 2 ? 'o' : 'smile'; st.lean += .03 * e; }
    else if (type === 'listen') { face = Math.sign(o.to - f.x) || face; st.tilt += .07 * Math.sin(t * 7) * e; if (e > .4) st.mouth = 'smile'; }
    else if (type === 'give') { face = Math.sign(o.to - f.x) || face; st.lean += .08 * e; if (e > .4) st.mouth = 'smile'; }
    else if (type === 'catch') { const T = targetLocal(f, o.at, t); if (Math.abs(T[0] - f.x) > 60) face = Math.sign(T[0] - f.x); lookT = T; lookW = e; if (e > .4) st.mouth = 'o'; }
    else if (type === 'toss') { lookT = toLocalAt(f.ci, f.x, SLOTS[o.slot]); lookW = e; st.lean += (u < .4 ? -.05 : .06) * e; if (u > .45 && u < .7) st.jump += 4 * Math.sin(Math.PI * (u - .45) / .25); if (e > .4) st.mouth = 'smile'; }
    else if (type === 'watch') { const T = targetLocal(f, o.at, t); if (Math.abs(T[0] - f.x) > 120) face = Math.sign(T[0] - f.x); lookT = T; lookW = e; if (o.o && e > .5) st.mouth = 'o'; }
    else if (type === 'cheer') { st.jump += 7 * Math.abs(Math.sin(Math.PI * (t - a.t0) * 2.6)) * e; if (e > .3) st.mouth = 'smile'; st.look = L2(st.look, [.1, -.3], e); }
  }
  if (lookT) { const hy = gy - st.jump * s - 80 * s; const dx = (lookT[0] - f.x) * face, dy = lookT[1] - hy, n = Math.hypot(dx, dy) || 1; st.look = L2(st.look, [dx / n, dy / n], lookW); }
  const L = st.lean, dir = [Math.sin(L), -Math.cos(L)];
  const Hp = [0, st.hipY], Sh = add(Hp, [dir[0] * 26, dir[1] * 26]), N = add(Hp, [dir[0] * 30, dir[1] * 30]);
  const ha = L + st.tilt, C = add(N, [Math.sin(ha) * (f.hr - 1), -Math.cos(ha) * (f.hr - 1)]);
  const oy = gy - st.jump * s;
  // Pass 2: hands
  let h1 = [2.5, st.hipY + 8], h2 = [-2.5, st.hipY + 8], p1 = [-1, .3], p2 = [-1, .3], scratching = false;
  const toRig = P => [(P[0] - f.x) / s * face, (P[1] - oy) / s];
  for (const a of A) {
    const { type, e, u, o } = a;
    if (type === 'scratch') { h2 = L2(h2, [C[0] - f.hr * .5 + 1.2 * Math.sin(t * 14), C[1] - f.hr * .92 + .9 * Math.cos(t * 14)], e); if (e > .3) { p2 = [-1, -.5]; scratching = true; } }
    else if (type === 'idea') { h1 = L2(h1, [10, st.hipY - 26], e); h2 = L2(h2, [-8, st.hipY - 24], e); }
    else if (type === 'build') { const P = toRig(objW); h1 = L2(h1, [P[0], P[1] - 1 - 3 * Math.abs(Math.sin(t * 16 + f.id))], e); if (e > .3) p1 = [.2, 1]; }   // quick taps on the object
    else if (type === 'talk') h1 = L2(h1, [11 + 3 * Math.sin(t * 5 + f.id), st.hipY - 17 + 3 * Math.cos(t * 4)], e);
    else if (type === 'give') h1 = L2(h1, [22, st.hipY - 14], e);
    else if (type === 'catch') { const P = toRig(targetLocal(f, o.at, t)), v = [P[0] - Sh[0], P[1] - Sh[1]], n = Math.hypot(v[0], v[1]) || 1; h1 = L2(h1, [Sh[0] + v[0] / n * 33, Sh[1] + v[1] / n * 33], e); h2 = L2(h2, [Sh[0] + v[0] / n * 30 - 4, Sh[1] + v[1] / n * 30 + 2], e); }
    else if (type === 'toss') { let g; if (u < .4) g = L2([2.5, st.hipY + 8], [-7, st.hipY + 5], sstep(u / .4)); else if (u < .55) g = L2([-7, st.hipY + 5], [9, st.hipY - 60], (u - .4) / .15); else g = [9, st.hipY - 60]; h1 = L2(h1, g, e); }
    else if (type === 'cheer') { h1 = L2(h1, [8, st.hipY - 60 + 3 * Math.sin(t * 9)], e); h2 = L2(h2, [-8, st.hipY - 60 + 3 * Math.cos(t * 9)], e); }
  }
  const [k1, F1] = ik(Hp, [4.5, 0], 19, 19, [1, 0]), [k2, F2] = ik(Hp, [-4.5, 0], 19, 19, [1, 0]);
  const [e1, H1] = ik(Sh, h1, 16, 16, p1), [e2, H2] = ik(Sh, h2, 16, 16, p2);
  const building = A.some(a => a.type === 'build' && a.e > .5);
  return { f, x: f.x, z: KZ, s, gy, oy, face, jump: st.jump, Hp, N, Sh, C, ha, k1, F1, k2, F2, e1, H1, e2, H2, look: st.look, mouth: st.mouth, eyeK: st.eyeK, blink: ((t + f.id * 1.37) / 3.3) % 1 < .045, scratching, building };
}
const handLocal = q => [q.x + q.H1[0] * q.s * q.face, q.oy + q.H1[1] * q.s];

function drawFigure(q) {
  const { s, face, x, oy } = q, sid = 1000 + q.f.id * 100;
  const T = p => [x + p[0] * s * face, oy + p[1] * s];
  { const sh = 1 - clamp(q.jump / 20) * .4; segs([[x - 12 * s * sh, q.gy + 2 * s], [x + 12 * s * sh, q.gy + 2 * s]], sid + 90, { w: .7, alpha: .22, wob: .6 }); }
  segs([T(q.Hp), T(q.k2), T(q.F2)], sid + 1);
  segs([T(q.Hp), T(q.k1), T(q.F1)], sid + 2);
  if (!q.scratching) segs([T(q.Sh), T(q.e2), T(q.H2)], sid + 3);
  segs([T(q.Hp), T(q.N)], sid + 4);
  const c = T(q.C), r = q.f.hr * s;
  curve(circlePts(c[0], c[1], r, sid + 5), sid + 5, { fill: PAPER });
  const ha = q.ha, hs = q.f.hr / 12, rot = v => [v[0] * Math.cos(ha) - v[1] * Math.sin(ha), v[0] * Math.sin(ha) + v[1] * Math.cos(ha)];
  const off = [q.look[0] * 2.5 * hs, q.look[1] * 2.3 * hs];
  [[1.2, -2.4], [6.4, -2.4]].forEach(([ex, ey], i) => {
    const pw = T(add(q.C, rot([ex * hs + off[0], ey * hs + off[1]])));
    if (q.blink) segs([[pw[0] - 1.7 * s, pw[1]], [pw[0] + 1.7 * s, pw[1]]], sid + 40 + i, { w: .8, wob: .3 });
    else dot(pw[0], pw[1], 1.75 * s * hs * q.eyeK, sid + 40 + i);
  });
  if (q.mouth === 'o') { const pw = T(add(q.C, rot([4.6 * hs, 5.2 * hs]))); curve(circlePts(pw[0], pw[1], 1.8 * s * hs, sid + 50, 10, .15), sid + 50, { w: .7, wob: .3 }); }
  else if (q.mouth === 'flat') segs([T(add(q.C, rot([2.4 * hs, 5.6 * hs]))), T(add(q.C, rot([6.8 * hs, 4.8 * hs])))], sid + 51, { w: .75, wob: .4 });
  else if (q.mouth === 'smile') curve([[2.2, 4.2], [4.6, 6.6], [7.2, 4.0]].map(v => T(add(q.C, rot([v[0] * hs, v[1] * hs])))), sid + 52, { w: .75, wob: .4 });
  if (q.scratching) segs([T(q.Sh), T(q.e2), T(q.H2)], sid + 3);
  segs([T(q.Sh), T(q.e1), T(q.H1)], sid + 6);
}

/* =========================================================================
   OBJECTS: random things the kids make
   Each is a list of strokes that draw themselves in order as prog rises,
   plus the areas that fill with colour when it's finished.
   ========================================================================= */
function shape(type, t, spin) {
  const S = [], F = []; let anc = [0, -20];
  const sg = p => S.push({ p, m: 0 }), cv = p => S.push({ p, m: 1 });
  switch (type) {
    case 'robot': sg(rectP(-15, -32, 15, 0)); sg([[0, -32], [0, -35]]); sg(rectP(-10, -47, 10, -35)); sg([[0, -47], [0, -55]]); cv(circ(0, -58, 3, 10)); cv(circ(-4, -41, 1.4, 8)); cv(circ(4, -41, 1.4, 8)); sg([[-15, -24], [-22, -15]]); sg([[15, -24], [22, -15]]); F.push(rectP(-15, -32, 15, 0)); anc = [0, -16]; break;
    case 'lamp': sg(rectP(-14, -5, 14, 0)); sg([[0, -5], [-9, -27], [4, -41]]); sg([[0, -44], [21, -52], [17, -30], [0, -44]]); cv(circ(12, -34, 2.5, 10)); F.push([[0, -44], [21, -52], [17, -30]]); anc = [14, -22]; break;
    case 'video': sg(rectP(-22, -40, 22, -10)); sg([[-5, -31], [-5, -19], [7, -25], [-5, -31]]); sg([[0, -10], [0, 0]]); sg([[-10, 0], [10, 0]]); F.push(rectP(-22, -40, 22, -10)); anc = [0, -14]; break;
    case 'fabric': { const top = []; for (let x = -20; x <= 20; x += 5) top.push([x, -30 - 2.5 * Math.sin(x * .6)]); sg([[-20, 0]].concat(top, [[20, 0], [-20, 0]])); [-9, -20].forEach(y => sg([[-15, y], [-10, y - 5], [-5, y], [0, y - 5], [5, y], [10, y - 5], [15, y]])); F.push([[-20, 0]].concat(top, [[20, 0]])); anc = [0, -15]; break; }
    case 'gears': { const r1 = spin ? t * 1.4 : 0; sg(gearP(-8, -14, 11, 8, r1)); sg(gearP(12, -31, 7, 6, -r1 * 1.6 + .3)); cv(circ(-8, -14, 2.5, 8)); cv(circ(12, -31, 2, 8)); F.push(gearP(-8, -14, 11, 8, r1)); anc = [13, -31]; break; }
    case 'pinwheel': { sg([[0, 0], [0, -42]]); const r = spin ? t * 3 : 0; for (let k = 0; k < 4; k++) { const a = r + k * Math.PI / 2, b = [[0, -44], [Math.cos(a) * 14, -44 + Math.sin(a) * 14], [Math.cos(a + .9) * 6, -44 + Math.sin(a + .9) * 6], [0, -44]]; sg(b); F.push(b); } anc = [0, -44]; break; }
    case 'house': sg(rectP(-16, -24, 16, 0)); sg([[-20, -24], [0, -42], [20, -24], [-20, -24]]); sg(rectP(-4, -12, 4, 0)); sg(rectP(7, -19, 13, -13)); F.push([[-20, -24], [0, -42], [20, -24]]); anc = [0, -52]; break;
    case 'tower': sg(rectP(-14, -12, 14, 0)); sg(rectP(-10, -24, 10, -12)); sg(rectP(-6, -36, 6, -24)); sg([[0, -36], [0, -50]]); sg([[0, -50], [9, -46], [0, -42]]); F.push(rectP(-14, -12, 14, 0), rectP(-10, -24, 10, -12), rectP(-6, -36, 6, -24)); anc = [0, -56]; break;
  }
  return { S, F, anc };
}
// Part doodles, used on idea cards, in speech bubbles, and as the part that gets added
function doodle(type, cx, cy, r, sid, t, w = .8) {
  if (r <= .5) return;
  if (type === 'gear') { segs(gearP(cx, cy, r * .6, 6, t * 1.5), sid, { w, wob: .5 }); dot(cx, cy, r * .14, sid + 1); }
  else if (type === 'rays') { curve(circ(cx, cy, r * .3, 10), sid, { w, wob: .5 }); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + .3; segs([[cx + Math.cos(a) * r * .5, cy + Math.sin(a) * r * .5], [cx + Math.cos(a) * r * .95, cy + Math.sin(a) * r * .95]], sid + 2 + i, { w, wob: .4 }); } }
  else if (type === 'zigzag') segs([[cx - r, cy + r * .2], [cx - r * .5, cy - r * .3], [cx, cy + r * .2], [cx + r * .5, cy - r * .3], [cx + r, cy + r * .2]], sid, { w: w * 1.1, wob: .5 });
  else if (type === 'star') { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i / 10 * Math.PI * 2, rr = i % 2 ? r * .42 : r; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } segs(p, sid, { w, wob: .4, closed: true }); }
}
function drawObject(f, t) {
  const o = f.obj, p = keyAt(f.prog, t); if (p <= 0) return;
  const sh = shape(o.type, t, p > .5), sid = 5000 + f.id * 40;
  let pop = 1;
  if (t > o.ct && t < o.ct + .3) pop *= 1 + .2 * Math.sin((t - o.ct) / .3 * Math.PI);
  if (o.xt && t > o.xt && t < o.xt + .3) pop *= 1 + .12 * Math.sin((t - o.xt) / .3 * Math.PI);
  const P = q => [o.x + q[0] * pop * OS, TABLE_Y + q[1] * pop * OS];
  if (t >= o.ct) {   // colour goes on slightly off-register, like a quick hand-coloured fill
    ctx.globalAlpha = clamp((t - o.ct) / .2); ctx.fillStyle = o.col;
    const dx = 1.6 / ZP, dy = 1.2 / ZP;
    sh.F.forEach(poly => { ctx.beginPath(); poly.forEach((q, i) => { const w = P(q); i ? ctx.lineTo(w[0] + dx, w[1] + dy) : ctx.moveTo(w[0] + dx, w[1] + dy); }); ctx.closePath(); ctx.fill(); });
    ctx.globalAlpha = 1;
  }
  const lens = sh.S.map(s => plen(s.p)), tot = lens.reduce((a, b) => a + b, 0);
  let budget = tot * p;
  sh.S.forEach((s, i) => {
    if (budget <= 0) return;
    const frac = Math.min(1, budget / (lens[i] || 1)); budget -= lens[i];
    const pts = partial(s.p.map(P), frac);
    (s.m ? curve : segs)(pts, sid + i, { w: .8, wob: .6 });
  });
  if (o.xt && t >= o.xt) { const a = P(sh.anc); doodle(o.xtype, a[0], a[1], 9 * OS * pop * eOutBack(clamp((t - o.xt) / .3)), sid + 30, t); }
}
// The table follows the curve, drawn point by point in world space
function drawTable(ci) {
  const [x0, x1] = TABLES[ci], sid = 60 + ci * 10, xs = [];
  for (let i = 0; i <= 14; i++) xs.push(lerp(x0, x1, i / 14));
  segs([x0 - 10].concat(xs, [x1 + 10]).map(x => wrapPt(ci, [x, TGY + 2])), sid + 5, { w: .7, alpha: .22, wob: .4 });
  [x0 + 18, x1 - 18].forEach((lx, i) => segs([wrapPt(ci, [lx, TABLE_Y + 8]), wrapPt(ci, [lx, TGY])], sid + 1 + i, { w: .9 }));
  segs(xs.map(x => wrapPt(ci, [x, TABLE_Y])).concat(xs.slice().reverse().map(x => wrapPt(ci, [x, TABLE_Y + 8]))), sid, { closed: true, fill: PAPER, w: .95, wob: .4 });
}

/* =========================================================================
   OUR GROUP'S MOMENTS (close-up)
   ========================================================================= */
const CW = 210, CH = 104;
const scribCache = new Map();
function scrib(seed) {
  if (scribCache.has(seed)) return scribCache.get(seed);
  const n = 4 + Math.floor(hash(seed, 1, 7) * 3), W0 = 140, r = W0 / (n * 2 * Math.PI), steps = n * 14, pts = [];
  for (let i = 0; i <= steps; i++) { const t = i / steps * n * 2 * Math.PI, k = Math.min(n - 1, Math.floor(t / (2 * Math.PI))); const amp = 11 + 22 * hash(seed, k, 3), d = 3 + 6 * hash(seed, k, 5); const yy = -amp * (.5 - .5 * Math.cos(t)), xx = r * t + d * Math.sin(t) - yy * .22; pts.push([xx - W0 / 2, yy + 14]); }
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
function drawMini(pr, i, cx, cy, kx, ky, seed) {
  const sid = 3000 + pr.fig * 50 + i * 10;
  cardFrame(cx, cy, kx, ky, sid, .45);
  ctx.save(); ctx.beginPath(); ctx.rect(cx - CW / 2 * kx + 1.5, cy - CH / 2 * ky + 1.5, CW * kx - 3, CH * ky - 3); ctx.clip();
  curve(scrib(seed).map(q => [cx + q[0] * kx, cy + q[1] * ky]), sid + 150 + (seed % 50), { w: .55, wob: .5 });
  ctx.restore();
}
const SHUF_STEP = 1.15, SHUF_MOVE = .4;
const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
function shuffleAt(pr, n) {
  let order = [0, 1, 2], gen = [0, 0, 0], prev = { order: order.slice(), gen: gen.slice() };
  for (let s = 1; s <= n; s++) {
    prev = { order: order.slice(), gen: gen.slice() };
    const pi = Math.floor(hash(pr.seed, s, 61) * 6); let o = PERMS[pi];
    if (o.join() === order.join()) o = PERMS[(pi + 1 + Math.floor(hash(pr.seed, s, 62) * 5)) % 6];
    order = o.slice(); let changed = 0;
    for (let i = 0; i < 3; i++) if (hash(pr.seed, s, 70 + i) < .55) { gen[i]++; changed++; }
    if (!changed) gen[Math.floor(hash(pr.seed, s, 75) * 3)]++;
  }
  return { order, gen, prev };
}
// Every other bubble floats higher so neighbouring bubbles don't pile on top of each other
function bubbleOf(q) { const sb = q.s / 2, top = [q.x + q.C[0] * q.s * q.face, q.oy + (q.C[1] - q.f.hr) * q.s], lift = q.f.id % 2 ? 48 * sb : 0; return { sb, top, lift, c: [top[0], top[1] - 64 * sb - lift], rx: 74 * sb, ry: 33 * sb }; }
function cloudPts(B, seed) { const n = 56, pts = []; for (let i = 0; i <= n; i++) { const th = i / n * Math.PI * 2, rr = (1 + .12 * Math.abs(Math.sin(th * 3.5 + .7))) * (1 + .03 * (hash(seed, i % n, 8) - .5)); pts.push([B.c[0] + Math.cos(th) * B.rx * rr * .95, B.c[1] + Math.sin(th) * B.ry * rr]); } return pts; }
const QPTS = (() => { const p = []; for (let i = 0; i <= 14; i++) { const a = Math.PI * 1.05 + i / 14 * Math.PI * 1.45; p.push([Math.cos(a) * .42, -.62 + Math.sin(a) * .36]); } p.push([.03, .02]); return p; })();
function plus(x, y, h, sid, w = 1) { segs([[x - h, y], [x + h, y]], sid, { w, wob: .6 }); segs([[x, y - h], [x, y + h]], sid + 1, { w, wob: .6 }); }

// The "aha": the three shuffling prompts slide together, merge into one card,
// the thought bubble pops, and the card drops onto the table where making begins.
function drawIdea(fi, t, q) {
  const ti = IDEA[fi]; if (t >= ti + .8) return;
  const pr = BUB[fi], B = bubbleOf(q), sb = B.sb, sidB = 4000 + fi * 100;
  const tc = Math.min(t, ti), el = tc - (pr.q + .4), n = Math.floor(el / SHUF_STEP) + 1;
  const u = eInOut(clamp((el - (n - 1) * SHUF_STEP) / SHUF_MOVE));
  const S = shuffleAt(pr, n), base = .165 * sb, slotX = j => B.c[0] + (j - 1) * 46 * sb;
  const ce = eInOut(clamp((t - ti) / .25)), pop = clamp((t - (ti + .25)) / .17);
  if (pop < 1) {
    const g = 1 + .25 * pop; ctx.globalAlpha = 1 - pop;
    [[B.top[1] - 9 * sb - B.lift * .3, 3.2 * sb], [B.top[1] - 21 * sb - B.lift * .7, 5.4 * sb]].forEach(([cy, r], i) => curve(circlePts(B.top[0], cy, r, sidB + i, 12, .2), sidB + i, { w: .8, wob: .5, fill: PAPER }));
    curve(cloudPts({ ...B, rx: B.rx * g, ry: B.ry * g }, pr.seed), sidB + 5, { w: .9, fill: PAPER });
    ctx.globalAlpha = 1;
  }
  if (t < ti + .25) {
    const asp = (i, g) => g === 0 ? 1 : lerp(.75, 1.22, hash(pr.seed, i, 50 + g));
    for (let i = 0; i < 3; i++) {
      const j0 = S.prev.order.indexOf(i), j1 = S.order.indexOf(i), g0 = S.prev.gen[i], g1 = S.gen[i];
      const x0 = lerp(slotX(j0), slotX(j1), u), y0 = B.c[1] + 2 * sb - Math.sign(j1 - j0) * 8 * sb * Math.sin(Math.PI * u);
      const a = lerp(asp(i, g0), asp(i, g1), u), g = g1 !== g0 && u < .5 ? g0 : g1;
      const seed = g === 0 ? pr.seed * 101 + 8 + i * 3 : pr.seed * 101 + 500 + i * 37 + g * 11;
      drawMini(pr, i, lerp(x0, B.c[0], ce), lerp(y0, B.c[1], ce), base * a, base / a, seed);
    }
    ctx.globalAlpha = 1 - ce;
    plus(B.c[0] - 23 * sb, B.c[1] + 2 * sb, 4.5 * sb, sidB + 34, .6); plus(B.c[0] + 23 * sb, B.c[1] + 2 * sb, 4.5 * sb, sidB + 36, .6);
    const s0 = 30 * sb, qy = B.c[1] - B.ry * 1.12 - 12 * sb - .3 * s0;
    curve(QPTS.map(p => [B.c[0] + p[0] * s0, qy + p[1] * s0]), sidB + 20, { w: 1.05 }); dot(B.c[0] + .03 * s0, qy + .25 * s0, 2.6 * sb, sidB + 21);
    ctx.globalAlpha = 1;
  } else {
    const d = clamp((t - (ti + .42)) / .33), de = eInOut(d); if (d >= 1) return;
    const swell = t < ti + .42 ? 1 + .25 * Math.sin(Math.PI * clamp((t - ti - .25) / .17)) : 1;
    const k = lerp(base * 1.7, base, de) * swell;
    const ob = toLocalAt(0, FIGS[fi].x, wrapPt(0, [FIGS[fi].obj.x, TABLE_Y - 14]));   // drawn in the kid's frame
    drawMini(pr, 3, lerp(B.c[0], ob[0], de), lerp(B.c[1], ob[1], de) - 40 * sb * Math.sin(Math.PI * de), k, k, pr.seed * 101 + 999);
  }
}
function drawTalk(T, t, q) {
  if (t < T.t0 || t > T.t1) return;
  const k = eOutBack(clamp((t - T.t0) / .15)) * sstep(clamp((T.t1 - t) / .12)); if (k <= .02) return;
  const sb = q.s / 2, head = [q.x + q.C[0] * q.s * q.face, q.oy + q.C[1] * q.s], f = q.face, sid = 8000 + T.fig * 20;
  const cx = head[0] + f * 40 * sb, cy = head[1] - 42 * sb, rx = 26 * sb * k, ry = 19 * sb * k;
  segs([[cx - f * rx * .55, cy + ry * .6], [head[0] + f * 14 * sb, head[1] - 10 * sb], [cx - f * rx * .05, cy + ry * .85]], sid, { w: .8, wob: .5, fill: PAPER });
  curve(ellipsePts(cx, cy, rx, ry, 22), sid + 1, { w: .85, fill: PAPER });
  doodle(T.d, cx, cy, 12 * sb * k, sid + 3, t, .7);
}
function drawPiece(t) {
  if (t < PIECE.t0 || t > PIECE.t1) return;
  const u = (t - PIECE.t0) / (PIECE.t1 - PIECE.t0), c = wrapPt(0, piecePos(t));
  const a = u * Math.PI * 1.5, r = 5, p = [0, 1, 2, 3].map(i => [c[0] + Math.cos(a + i * Math.PI / 2) * r, c[1] + Math.sin(a + i * Math.PI / 2) * r]);
  segs(p, 8100, { closed: true, fill: PAPER, w: .8, wob: .4 });
}

/* =========================================================================
   SHARING: board, throws, dotted lines
   ========================================================================= */
const memo = new Map();
function launchPos(K) { if (!memo.has('L' + K.fig)) { const f = FIGS[K.fig]; memo.set('L' + K.fig, toWorldAt(f.ci, f.x, handLocal(poseAt(f, K.rel)))); } return memo.get('L' + K.fig); }
// Dotted route: out from under the board, along beneath it, then down to the receiver.
// Hugging the board keeps every line clear of our group's heads in the middle.
function xferPath(X) {
  const key = 'P' + X.slot; if (memo.has(key)) return memo.get(key);
  const a = [SLOTS[X.slot][0], BOARD.y1 + 12], b = objTopWorld(FIGS[X.fig]);
  const c1 = [lerp(a[0], b[0], .6), BOARD.y1 + 60], c2 = [b[0], lerp(BOARD.y1 + 60, b[1], .45)];
  const pts = []; for (let i = 0; i <= 200; i++) { const u = i / 200, v = 1 - u; pts.push([v * v * v * a[0] + 3 * v * v * u * c1[0] + 3 * v * u * u * c2[0] + u * u * u * b[0], v * v * v * a[1] + 3 * v * v * u * c1[1] + 3 * v * u * u * c2[1] + u * u * u * b[1]]); }
  const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const P = { pts, cum, len: cum[cum.length - 1] }; memo.set(key, P); return P;
}
function pathAt(P, d) { let i = 1; while (i < P.cum.length - 1 && P.cum[i] < d) i++; const u = (d - P.cum[i - 1]) / (P.cum[i] - P.cum[i - 1] || 1); return L2(P.pts[i - 1], P.pts[i], clamp(u)); }
function xferCardPos(X, t) { const P = xferPath(X); return pathAt(P, P.len * eInOut((t - X.v0) / (X.v1 - X.v0))); }
/* ---------- the platform and the partners ----------
   The board's top bar is yellow with a search field: a nod to Miro, and an open door.
   Above it, partner organisations who award credit: rosettes with an institution icon. */
const MIRO = '#FFD02F';
const PARTNER_X = [500, 800, 1100], PARTNER_Y = -112, PR = 72, RIBBON = [COL.coral, COL.violet, COL.sky];
function pillPts(cx, cy, w, h) { const r = h / 2, p = []; for (let i = 0; i <= 10; i++) { const a = Math.PI / 2 + i / 10 * Math.PI; p.push([cx - w / 2 + r + Math.cos(a) * r, cy + Math.sin(a) * r]); } for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i / 10 * Math.PI; p.push([cx + w / 2 - r + Math.cos(a) * r, cy + Math.sin(a) * r]); } p.push(p[0]); return p; }
function drawBar(x0, x1, y0, a = 1) {
  fillPoly([[x0, y0], [x1, y0], [x1, y0 + 46], [x0, y0 + 46]], MIRO, a);
  if (a < 1) return;
  const cx = (x0 + x1) / 2, pill = pillPts(cx, y0 + 23, 560, 28);
  ctx.beginPath(); pill.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fillStyle = PAPER; ctx.fill();
  curve(pill, 9010, { w: .75, wob: .4 });
  curve(circ(cx - 252, y0 + 21, 6.5, 10), 9011, { w: .7, wob: .3 }); segs([[cx - 247, y0 + 26], [cx - 241, y0 + 32]], 9012, { w: .7, wob: .3 });
}
function drawPartners(t, appear) {
  PARTNER_X.forEach((x, i) => {
    const k = appear == null ? 1 : eOutBack(clamp((t - appear - i * .12) / .3)); if (k <= 0) return;
    const R = PR * k, y = PARTNER_Y, sid = 9300 + i * 20;
    [-1, 1].forEach((s, j) => { const rib = [[x + s * .05 * R, y + .6 * R], [x + s * .42 * R, y + 1.7 * R], [x + s * .28 * R, y + 1.55 * R], [x + s * .12 * R, y + 1.75 * R], [x - s * .12 * R, y + .75 * R]]; fillPoly(rib, RIBBON[i]); segs(rib, sid + j, { w: .8, wob: .4, closed: true }); });
    const edge = []; for (let n = 0; n <= 48; n++) { const a = n / 48 * Math.PI * 2, r = R * (1 + .07 * Math.cos(12 * a)); edge.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
    curve(edge, sid + 3, { w: .9, wob: .4, fill: PAPER });
    curve(circ(x, y, R * .74, 24), sid + 4, { w: .7, wob: .3 });
    segs([[x - .4 * R, y - .1 * R], [x, y - .4 * R], [x + .4 * R, y - .1 * R], [x - .4 * R, y - .1 * R]], sid + 5, { w: .75, wob: .3 });   // a little institution: pediment, columns, steps
    [-.26, 0, .26].forEach((cx, n) => segs([[x + cx * R, y - .04 * R], [x + cx * R, y + .3 * R]], sid + 6 + n, { w: .7, wob: .3 }));
    segs([[x - .42 * R, y + .34 * R], [x + .42 * R, y + .34 * R]], sid + 9, { w: .75, wob: .3 });
  });
}
function drawBoard(t) {
  if (t < BOARD.t0) return;
  const p = clamp((t - BOARD.t0) / (BOARD.t1 - BOARD.t0)), { x0, x1, y0, y1 } = BOARD;
  const r = [[x0, y1], [x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  segs(partial(r, p), 9000, { w: 1.05, fill: p >= 1 ? PAPER : null });
  if (p > .7) { const q = (p - .7) / .3; if (q >= 1) drawBar(x0, x1, y0, clamp((t - BOARD.t1) / .25)); segs(partial([[x0, y0 + 46], [x1, y0 + 46]], q), 9001, { w: .8 }); if (q >= 1) [0, 1, 2].forEach(i => curve(circ(x0 + 40 + i * 38, y0 + 23, 9, 10), 9002 + i, { w: .7 })); }
  drawPartners(t, BOARD.t1 + .1);
}
function drawToss(K, t) {
  if (t < K.rel) return;
  const L = launchPos(K), S = SLOTS[K.slot], sid = 9100 + K.fig * 10;
  let x, y, k, ang = 0;
  if (t < K.land) { const u = (t - K.rel) / (K.land - K.rel); x = lerp(L[0], S[0], u); y = lerp(L[1], S[1], 1 - (1 - u) * (1 - u)); k = lerp(.2, .72, u); ang = (1 - eOut(u)) * Math.PI * 2; }
  else { x = S[0]; y = S[1]; k = .72 * (t < K.land + .2 ? 1 + .08 * Math.sin((t - K.land) / .2 * Math.PI) : 1); }
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  cardFrame(0, 0, k, k, sid, .8); doodle(K.d, 0, 0, 34 * k, sid + 5, t, .9);
  ctx.restore();
}
function drawXfer(X, t) {
  if (t < X.l0) return;
  const P = xferPath(X), shown = P.len * clamp((t - X.l0) / (X.l1 - X.l0));
  const gap = 15 / ZP, r = CFG.weight * .42 / ZP;
  for (let d = gap * .5, i = 0; d < shown; d += gap, i++) { const p = pathAt(P, d); dot(p[0], p[1], r, 9500 + X.slot * 300 + i); }
  if (t >= X.v0 && t < X.v1) { const p = xferCardPos(X, t), sid = 9400 + X.slot * 10, k = .36 * (1 - .5 * sstep((t - X.v1 + .25) / .25)); cardFrame(p[0], p[1], k, k, sid, .6); doodle(X.d, p[0], p[1], 34 * k, sid + 5, t, .8); }
}

// Bursts: little "ding" lines for every key moment, in world coordinates
const BURSTS = [];
function addBurst(t, p, rx, ry, n = 7, a0 = 0, a1 = Math.PI * 2) { BURSTS.push({ t, x: p[0], y: p[1], rx, ry, n, a0, a1, sid: 7000 + BURSTS.length * 13 }); }
function initBursts() {
  IDEA.forEach((ti, i) => { const B = bubbleOf(poseAt(FIGS[i], ti + .25)); addBurst(ti + .25, toWorldAt(0, FIGS[i].x, B.c), 95 * B.sb, 58 * B.sb, 9); addBurst(ti + .75, wrapPt(0, [FIGS[i].obj.x, TABLE_Y - 14]), 30, 22, 6, -Math.PI + .3, -.3); });
  addBurst(PIECE.t1, wrapPt(0, PIECE.b), 24, 18, 5, -Math.PI + .3, -.3);
  TOSSES.forEach(K => addBurst(K.land, SLOTS[K.slot], 125, 82, 7));
  XFERS.forEach(X => addBurst(X.v1, objTopWorld(FIGS[X.fig]), 46, 34, 7));
  FIGS.forEach(f => addBurst(f.obj.ct, wrapPt(f.ci, [f.obj.x, TABLE_Y - OBJ_H[f.obj.type] * .5]), 50, 44, 8));
}
function drawBursts(t) {
  for (const b of BURSTS) {
    const u = (t - b.t) / .3; if (u < 0 || u > 1) continue;
    const outer = 1 + .7 * eOut(clamp(u * 2.2)), inner = 1 + .7 * Math.pow(clamp(u), 1.6);
    for (let j = 0; j < b.n; j++) { const a = lerp(b.a0, b.a1, (j + .5) / b.n), c = Math.cos(a), s = Math.sin(a); segs([[b.x + c * b.rx * inner, b.y + s * b.ry * inner], [b.x + c * b.rx * outer, b.y + s * b.ry * outer]], b.sid * 10 + j, { w: .9, wob: .5 }); }
  }
}
function drawPlanet() {
  const pts = []; for (let i = 0; i <= 240; i++) { const a = -1.75 + i / 240 * 3.5;   // past the sides of the planet, so the earth always runs off the frame's edges
    pts.push([PLANET.x + Math.sin(a) * PLANET.r, PLANET.y - Math.cos(a) * PLANET.r]); }
  curve(pts, 20, { w: .95, wob: .8 });
}
// Night over the left group, day over the right: the quickest way to say
// "the other side of the world" without drawing a map. Ink only, no colour.
function drawSky(t) {
  const at = a => rotAbout([PLANET.x, GY - 420], a);
  const m = at(-.87), r = 58;   // crescent moon + twinkling stars
  const outer = [], inner = [];
  for (let i = 0; i <= 18; i++) { const a = Math.PI * .32 + i / 18 * Math.PI * 1.36; outer.push([m[0] + Math.cos(a) * r, m[1] + Math.sin(a) * r]); }
  for (let i = 18; i >= 0; i--) { const a = Math.PI * .42 + i / 18 * Math.PI * 1.16; inner.push([m[0] + 26 + Math.cos(a) * r * .86, m[1] + Math.sin(a) * r * .86]); }
  curve(outer.concat(inner, [outer[0]]), 9700, { w: .9, fill: PAPER });
  [[-95, -70, 0], [70, -95, 1.3], [-40, 95, 2.4], [105, 40, 3.1]].forEach(([dx, dy, ph], i) => {
    const k = 13 * (.75 + .25 * Math.sin(t * 3 + ph)), c = [m[0] + dx, m[1] + dy];
    segs([[c[0] - k, c[1]], [c[0] + k, c[1]]], 9710 + i * 2, { w: .7, wob: .3 }); segs([[c[0], c[1] - k], [c[0], c[1] + k]], 9711 + i * 2, { w: .7, wob: .3 });
  });
  const s = at(.87), rot = t * .25;   // sun
  curve(circlePts(s[0], s[1], 46, 9720, 20, .3), 9720, { w: .9, fill: PAPER });
  for (let i = 0; i < 10; i++) { const a = rot + i / 10 * Math.PI * 2; segs([[s[0] + Math.cos(a) * 62, s[1] + Math.sin(a) * 62], [s[0] + Math.cos(a) * 92, s[1] + Math.sin(a) * 92]], 9730 + i, { w: .8, wob: .4 }); }
}

/* =========================================================================
   FRAME
   ========================================================================= */
initBursts();

export function render(c, t, view) {
  ctx = c; INK = view.ink; PAPER = view.paper;
  BS = Math.floor(t * CFG.boil + 1e-6);
  const k = view.s, ox = view.ox, oy = view.oy;   // device px per frame unit, and where the frame sits
  // no background fill: the canvas stays transparent so the page colour shows through
  const cam = camAt(t); ZOOM = cam[0]; ZP = Math.pow(ZOOM, .65);
  sync(ctx, BS, ZP, 1, INK, t);
  ctx.setTransform(k * ZOOM, 0, 0, k * ZOOM, ox + k * (W / 2 - cam[1] * ZOOM), oy + k * (H / 2 - cam[2] * ZOOM));
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  drawPlanet();
  const poses = FIGS.map(f => poseAt(f, handT(t)));   // figures on twos
  for (let ci = 0; ci < 3; ci++) {
    if (ci > 0 && ZOOM > 1.1) continue;   // the far groups are off screen in the close-up
    poses.filter(q => q.f.ci === ci).forEach(q => {
      enterAt(ci, q.f.x);
      hand(true); drawFigure(q); hand(false);
      if (ZOOM > .9 && q.building) {   // little work lines at the hand
        const h = handLocal(q), fl = Math.floor(t * 8) % 2 ? 1 : -1, sid = 8500 + q.f.id * 4;
        segs([[h[0] + 9 * fl, h[1] - 9], [h[0] + 15 * fl, h[1] - 15]], sid, { w: .7, wob: .4 });
        segs([[h[0] + 12 * fl, h[1] - 2], [h[0] + 19 * fl, h[1] - 3]], sid + 1, { w: .7, wob: .4 });
      }
      ctx.restore();
    });
    drawTable(ci);
    FIGS.filter(f => f.ci === ci).forEach(f => { enterAt(ci, f.obj.x); drawObject(f, t); ctx.restore(); });
  }
  hand(true);   // thought and talk bubbles: hand
  for (let i = 0; i < 5; i++) { enterAt(0, FIGS[i].x); drawIdea(i, handT(t), poses[i]); ctx.restore(); }
  TALKS.forEach(T => { enterAt(0, FIGS[T.fig].x); drawTalk(T, handT(t), poses[T.fig]); ctx.restore(); });
  hand(false);
  drawPiece(t);
  drawBoard(t);
  XFERS.forEach(X => drawXfer(X, t));
  TOSSES.forEach(K => drawToss(K, t));
  drawBursts(t);
}

/* ---------- the ground, as the viewer sees it ----------
   Centre and radius of the planet on screen (16:9 frame units) at time t, so the
   on-screen text can curve along the same circle as the ground under it. */
export function groundArc(t) {
  const cam = camAt(t), z = cam[0], rot = cam[3] || 0, c = Math.cos(rot), s = Math.sin(rot), dx = PLANET.x - cam[1], dy = PLANET.y - cam[2];
  return { cx: W / 2 + z * (dx * c - dy * s), cy: H / 2 + z * (dx * s + dy * c), r: PLANET.r * z };
}
