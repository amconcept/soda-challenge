/* =========================================================================
   SOD+A STORY — player
   One canvas, transparent, laid over the hero. Two things it can play:

     playReveal()  logo first. Four balloons float up and pop into the page's
                   own lockup. About 4 seconds. This is the page-load moment.
     playStory()   the whole film: button → making and sharing → co-design →
                   the same balloon reveal. About 74 seconds. Played on request.

   The player owns time, size and the seams between chapters. Chapters only
   know how to draw a frame at time t. The page owns the logo, the text and
   every control; it hears about the story through cues.

   Seams
     1 → 2  a hand-drawn wipe: a pen line sweeps across, new scene behind it.
     2 → 3  a dissolve: same camera, same board, the scene changes around them.
     3 → reveal  continuous: the reveal takes over the four balloons in place.
   ========================================================================= */
import { W, H, CFG, CFG0, clamp, lerp, eInOut, segs, sync, paperFibres } from './core.js';
import * as reveal from './reveal.js';

export { CFG, CFG0 };

// Chapters 1–3 are most of the code. They load only when someone asks for the story.
const loadChaptersDefault = () => Promise.all([
  import('./chapters/ch1-button.js'),
  import('./chapters/ch2-share.js'),
  import('./chapters/ch3-codesign.js'),
]);

export const SEAMS = { wipe: .75, dissolve: .8 };
export const CHAPTERS = ['button', 'sharing', 'co-design', 'reveal'];

const val = v => (typeof v === 'function' ? v() : v);

/**
 * createStory(canvas, options)
 *   ink        line colour, string or () => string           (site: the hero line colour)
 *   paper      knockout colour, string or () => string        (site: the live page wash, read every frame)
 *   targets    () => up to 4 rects {x, y, width, height} in CSS px relative to the canvas
 *              0 S.o.   1 d+a.   2 CHALLENGE   3 partner row
 *   onCue      (name, detail) => void     'state', 'chapter', 'pop', 'ding', 'tagline', 'done', 'reset'
 *   tagline    null, { text, font }, or a function returning one: handwritten closing line (off on the site, see spec)
 *   loadChapters  () => Promise<[ch1, ch2, ch3]>   override for bundlers that need explicit imports
 *   reducedMotion  boolean; default follows the OS setting
 */
export function createStory(canvas, options = {}) {
  const o = {
    ink: '#141414', paper: '#ffffff', targets: null, onCue: () => {}, tagline: null,
    loadChapters: loadChaptersDefault, maxDpr: 2,
    reducedMotion: typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
    ...options,
  };
  const ctx = canvas.getContext('2d');
  let mods = null, loading = null;
  let timeline = [], cues = [], dur = 0, kind = 'idle';
  let T = 0, playing = false, last = 0, lastKey = -1, raf = 0, dirty = true, cueAt = 0;
  let onscreen = true, pageHidden = typeof document !== 'undefined' && document.hidden;
  let bufA = null, bufB = null, revealStart = 0, revealFrom = 'rise', revealFirstPop;
  let grainFade = null, grainPat = null, grainDpr = 0;   // paper grain: story only, see grainAt()

  const emit = (name, detail = {}) => { try { o.onCue(name, detail); } catch (e) { console.error(e); } };
  const setKind = k => { kind = k; emit('state', { state: k }); };

  /* ---------- size ----------
     The canvas fills whatever box the page gives it. The 16:9 story frame is
     fitted inside (contain) and centred; outside it the canvas stays clear. */
  let dpr = 1;
  function size() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(o.maxDpr, (typeof devicePixelRatio === 'number' && devicePixelRatio) || 1);
    const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
    if (canvas.width === w && canvas.height === h) return;
    // A new bitmap starts blank. Draw again in this same turn, before the browser paints.
    canvas.width = w;
    canvas.height = h;
    dirty = true;
    if (kind !== 'idle' && kind !== 'done') draw(Math.floor(T * CFG.fps + 1e-6) / CFG.fps);
  }
  /* Drawing size. In the story the drawings sit a little smaller than the 16:9 frame (CFG.stage),
     shrinking toward a point centred a quarter of the way down, so the earth line rises and the text
     under it clears the bottom of the hero on wide screens. The text keeps its size: its positions
     move the same way (stage()), its letters do not shrink. The logo-first reveal is the page itself,
     so it is always full size; the balloons still land on the logo because they aim through this view. */
  const STAGE_Y = .25;
  const stageK = () => (kind === 'story' ? clamp(CFG.stage ?? 1, .5, 1) : 1);
  function view() {
    const s = Math.min(canvas.width / W, canvas.height / H), k = stageK();
    const ox = (canvas.width - W * s) / 2, oy = (canvas.height - H * s) / 2;
    return { s: s * k, ox: ox + W * s * (1 - k) / 2, oy: oy + H * s * STAGE_Y * (1 - k), ink: val(o.ink), paper: val(o.paper) };
  }
  // Page rects (CSS px) → story frame units, so balloons can aim at real elements.
  function frameRects(v) {
    const rs = (o.targets && o.targets()) || [];
    return rs.filter(Boolean).map(r => ({ x: (r.x * dpr - v.ox) / v.s, y: (r.y * dpr - v.oy) / v.s, w: (r.width ?? r.w) * dpr / v.s, h: (r.height ?? r.h) * dpr / v.s }));
  }

  /* ---------- timelines ---------- */
  function buildReveal(t0, from, firstPop) {
    revealStart = t0; revealFrom = from; revealFirstPop = firstPop;
    const v = view(), targets = frameRects(v);
    if (!targets.length) targets.push({ x: 500, y: 250, w: 280, h: 250 }, { x: 800, y: 250, w: 300, h: 250 }, { x: 500, y: 520, w: 600, h: 120 });
    const fromList = from === 'story' ? mods[2].heroBalloons(mods[2].DUR) : 'rise';
    const plan = reveal.prepare({ targets, from: fromList, bottom: (canvas.height - v.oy) / v.s, firstPop, tagline: val(o.tagline) });
    return plan;
  }
  function setRevealTimeline(firstPop) {
    const plan = buildReveal(0, 'rise', firstPop);
    timeline = [{ a: 0, b: plan.dur, n: 3, draw: (c, t, v) => reveal.render(c, t, v) }];
    grainFade = null;   // the logo-first reveal is the page itself: no grain, ever
    cues = [{ t: 0, name: 'chapter', n: 3, chapter: CHAPTERS[3] }, ...plan.cues];
    dur = plan.dur;
  }
  function setStoryTimeline() {
    const [m1, m2, m3] = mods, d1 = m1.DUR, d2 = m2.DUR, d3 = m3.DUR;
    const r0 = d1 + d2 + d3, plan = buildReveal(r0, 'story');
    timeline = [
      { a: 0, b: d1, n: 0, draw: (c, t, v) => m1.render(c, t, v) },
      { a: d1, b: d1 + SEAMS.wipe, n: 1, draw: (c, t, v) => wipe(m1, d1 - 1e-3, m2, t - d1, (t - d1) / SEAMS.wipe, v), arc: t => m2.groundArc(t - d1) },
      { a: d1 + SEAMS.wipe, b: d1 + d2, n: 1, draw: (c, t, v) => m2.render(c, t - d1, v), arc: t => m2.groundArc(t - d1) },
      { a: d1 + d2, b: d1 + d2 + SEAMS.dissolve, n: 2, draw: (c, t, v) => dissolve(m2, d2 - 1e-3, m3, t - d1 - d2, (t - d1 - d2) / SEAMS.dissolve, v), arc: t => m3.groundArc(t - d1 - d2) },
      { a: d1 + d2 + SEAMS.dissolve, b: r0, n: 2, draw: (c, t, v) => m3.render(c, t - d1 - d2, v), arc: t => m3.groundArc(t - d1 - d2) },
      { a: r0, b: r0 + plan.dur, n: 3, draw: (c, t, v) => reveal.render(c, t - r0, v) },
    ];
    cues = [
      { t: 0, name: 'chapter', n: 0, chapter: CHAPTERS[0] }, { t: d1, name: 'chapter', n: 1, chapter: CHAPTERS[1] },
      { t: d1 + d2, name: 'chapter', n: 2, chapter: CHAPTERS[2] }, { t: r0, name: 'chapter', n: 3, chapter: CHAPTERS[3] },
      ...plan.cues.map(c => ({ ...c, t: c.t + r0 })),
    ];
    dur = r0 + plan.dur;
    grainFade = { out0: r0, out1: r0 + reveal.TIMING.firstPop };   // gone by the time the first balloon pops into the logo
  }

  /* ---------- seams ---------- */
  // 1 → 2: a pen line sweeps right to left. Old scene on its left, new scene on its right.
  function wipe(mA, tA, mB, tB, p, v) {
    const cw = canvas.width, ch = canvas.height, e = eInOut(p), slant = ch * .12;
    const xt = lerp(cw + slant + 20, -20, e), xb = xt - slant;
    const clipTo = poly => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); poly.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip(); };
    clipTo([[-1, -1], [xt, -1], [xb, ch + 1], [-1, ch + 1]]); mA.render(ctx, tA, v); ctx.restore();
    clipTo([[xt, -1], [cw + 1, -1], [cw + 1, ch + 1], [xb, ch + 1]]); mB.render(ctx, tB, v); ctx.restore();
    ctx.setTransform(v.s, 0, 0, v.s, v.ox, v.oy); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    sync(ctx, Math.floor((tB + 100) * CFG.boil), 1, 1, v.ink, tB + 100);
    const pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8, y = lerp(-1, ch + 1, u); pts.push([(lerp(xt, xb, u) - v.ox) / v.s, (y - v.oy) / v.s]); }
    segs(pts, 7100, { w: 1.15, wob: 1.6 });
  }
  // 2 → 3: cross-dissolve. 'lighter' adds the two frames, so lines both share
  // (the planet, the board) stay solid instead of dipping to half strength.
  function dissolve(mA, tA, mB, tB, p, v) {
    const cw = canvas.width, ch = canvas.height, e = eInOut(p);
    for (const b of [bufA, bufB]) if (b.width !== cw || b.height !== ch) { b.width = cw; b.height = ch; }
    const a = bufA.getContext('2d'), b = bufB.getContext('2d');
    a.setTransform(1, 0, 0, 1, 0, 0); a.clearRect(0, 0, cw, ch); mA.render(a, tA, v);
    b.setTransform(1, 0, 0, 1, 0, 0); b.clearRect(0, 0, cw, ch); mB.render(b, tB, v);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1 - e; ctx.drawImage(bufA, 0, 0);
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = e; ctx.drawImage(bufB, 0, 0);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }

  /* ---------- frame ---------- */
  function draw(t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (kind === 'idle' || kind === 'done') return;
    const seg = timeline.find(s => t < s.b) || timeline[timeline.length - 1];
    if (!seg) return;
    // The reveal re-aims at the live page each time it starts, in case the layout moved.
    if (seg.n === 3 && seg === timeline[timeline.length - 1] && !seg.aimed) { buildReveal(revealStart, revealFrom, revealFirstPop); seg.aimed = true; }
    seg.draw(ctx, t, view());
    const g = grainAt(t);
    if (g > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = g; ctx.fillStyle = grain(); ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.globalAlpha = 1; }
  }

  /* ---------- paper grain ----------
     The film is drawn on paper; the website is not. Grain fades in as the story
     starts and fades out while the balloons carry the film into the logo, so the
     hand-off to the page is seamless. One cached tile of paper fibres, one fill per frame. */
  function grainAt(t) {
    if (!grainFade || !CFG.grain) return 0;
    return CFG.grain * clamp(t / .6) * (1 - clamp((t - grainFade.out0) / (grainFade.out1 - grainFade.out0)));
  }
  function grain() {
    if (grainPat && grainDpr === dpr) return grainPat;
    // drawn at the screen's own density so the hairs stay crisp; large enough that the repeat is not noticed
    const N = 320, c = document.createElement('canvas'); c.width = c.height = Math.round(N * dpr);
    const g = c.getContext('2d'); g.scale(c.width / N, c.width / N);
    paperFibres(g, N, (dark, a) => dark ? `rgba(30,30,30,${(a * .26).toFixed(3)})` : `rgba(255,255,255,${(a * .4).toFixed(3)})`);
    grainPat = ctx.createPattern(c, 'repeat'); grainDpr = dpr;
    return grainPat;
  }
  function fireCues(t, instant = false) {
    while (cueAt < cues.length && cues[cueAt].t <= t + 1e-6) { const c = cues[cueAt++]; emit(c.name, { ...c, instant }); }
  }
  function tick(now) {
    raf = 0;
    if (!playing || !onscreen || pageHidden) { last = now; return; }
    // Stay with the wall clock. Holding each frame to 1/24s made a busy page
    // run the picture slower than the soundtrack, so the sound drifted ahead.
    // A tenth of a second only stops one very late frame from leaping.
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    T = Math.min(dur, T + dt * CFG.speed);
    const tq = Math.floor(T * CFG.fps + 1e-6) / CFG.fps;
    if (tq !== lastKey || dirty) { draw(tq); lastKey = tq; dirty = false; }
    fireCues(T);
    if (T >= dur) { finish(); return; }
    raf = requestAnimationFrame(tick);
  }
  function loop() { if (!raf && playing && onscreen && !pageHidden) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  function finish() {
    playing = false; fireCues(Infinity); setKind('done');
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  function start(k, hold) {
    T = 0; lastKey = -1; dirty = true; cueAt = 0; timeline.forEach(s => { s.aimed = false; });
    emit('reset');
    // Kind is set before the draw so the first frame has the film's own size.
    // The page is told after, so the logo steps aside onto a picture that is already there.
    kind = k;
    size();
    draw(0);
    lastKey = 0;
    emit('state', { state: k });
    // A held start draws that frame and waits. The page starts the clock
    // with begin(), once the soundtrack is actually playing.
    playing = !hold;
    if (!hold) loop();
  }
  function begin(offset) {
    if (kind !== 'story' && kind !== 'reveal') return;
    const ahead = Math.max(0, +offset || 0);
    if (ahead > 0.001) {
      T = Math.min(dur, ahead);
      const tq = Math.floor(T * CFG.fps + 1e-6) / CFG.fps;
      draw(tq);
      lastKey = tq;
      fireCues(T);
    }
    playing = true;
    loop();
  }

  /* ---------- page awareness ----------
     Pause when the hero scrolls away or the tab is hidden; carry on where it was. */
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { size(); }) : null;
  ro && ro.observe(canvas);
  const io = typeof IntersectionObserver === 'function' ? new IntersectionObserver(es => { onscreen = es[es.length - 1].isIntersecting; loop(); }, { threshold: .2 }) : null;
  io && io.observe(canvas);
  const onVis = () => { pageHidden = document.hidden; loop(); };
  typeof document !== 'undefined' && document.addEventListener('visibilitychange', onVis);
  size();

  function ensureChapters() {
    if (mods) return Promise.resolve(mods);
    if (!loading) loading = o.loadChapters().then(ms => { mods = ms; bufA = document.createElement('canvas'); bufB = document.createElement('canvas'); return ms; });
    return loading;
  }

  return {
    /** Logo first: balloons rise and pop into the lockup. firstPop = seconds until the first pop. */
    playReveal({ firstPop } = {}) {
      setRevealTimeline(firstPop);
      if (o.reducedMotion) { setKind('reveal'); cueAt = 0; emit('reset'); fireCues(Infinity, true); setKind('done'); return; }
      start('reveal');
    },
    /** The whole film, ending in the same reveal. Loads chapters 1–3 on first use.
        hold: draw the first frame and wait. begin() starts the clock. */
    async playStory(hold = false) {
      setKind('loading');
      await ensureChapters();
      setStoryTimeline(); start('story', hold);
    },
    /** Start a held film. offset is how far the soundtrack already is, in seconds. */
    begin(offset) { begin(offset); },
    /** Warm the chapter download early (e.g. on hover or focus of the Watch button). */
    preload() { return ensureChapters(); },
    /** From the story: go straight to the balloons rising into the logo. */
    skip() { if (kind === 'story' || kind === 'loading') { setRevealTimeline(1.0); start('reveal'); } },
    pause() { playing = false; },
    resume() { if (kind === 'story' || kind === 'reveal') { playing = true; loop(); } },
    get paused() { return !playing; },
    /** Jump to t seconds (scrubbing). Cues up to t are replayed with detail.instant = true. */
    seek(t) {
      T = clamp(t, 0, dur); lastKey = -1; dirty = true;
      timeline.forEach(s => { s.aimed = false; });
      cueAt = 0; emit('reset'); fireCues(T, true);
      draw(Math.floor(T * CFG.fps + 1e-6) / CFG.fps);
    },
    /** Redraw the current frame (after changing CFG or colours while paused). */
    redraw() { dirty = true; draw(Math.floor(T * CFG.fps + 1e-6) / CFG.fps); },
    /** The planet's circle on screen right now, in 16:9 frame units {cx, cy, r}, or null where there is no planet. */
    groundArc(t = T) {
      if (kind !== 'story') return null;
      const s = timeline.find(x => t < x.b), a = s && s.arc ? s.arc(t) : null; if (!a) return null;
      const k = stageK();   // the circle as it is drawn, after the drawing size
      return { cx: W / 2 + k * (a.cx - W / 2), cy: STAGE_Y * H + k * (a.cy - STAGE_Y * H), r: a.r * k };
    },
    /** The drawing size now: k (1 = full) toward the point at the frame's centre, y of its height down. */
    stage() { return { k: stageK(), y: STAGE_Y }; },
    /** The paper grain on screen now (0 = none). The text layer uses it so its letters fade in and out with the film's grain. */
    grainLevel() { return kind === 'story' ? grainAt(T) : 0; },
    /** Chapter start times on the current timeline, for a progress bar or beat labels. */
    get chapters() { return cues.filter(c => c.name === 'chapter').map(c => ({ name: c.chapter, t: c.t })); },
    get time() { return T; },
    get duration() { return dur; },
    get state() { return kind; },
    /** Stop, clear the canvas, and leave the page as it is. */
    stop() { playing = false; setKind('idle'); draw(0); },
    destroy() { playing = false; if (raf) cancelAnimationFrame(raf); ro && ro.disconnect(); io && io.disconnect(); typeof document !== 'undefined' && document.removeEventListener('visibilitychange', onVis); },
  };
}
