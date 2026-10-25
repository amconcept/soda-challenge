/**
 * Two recordings.
 * The film soundtrack starts with the picture. Its balloon pops sit just after
 * 71 seconds, on the same beats as the ending balloons.
 * The short clip is only the pops, with no music after them. It plays when the
 * logo balloons rise on load. Its first pop is at 3.22s in the file, and the
 * page's first pop is at 2.2s, so the clip starts 1.02s in.
 * See DESIGN_DECISIONS.md.
 */

const FILM = "/story/soda-animation.m4a";
const POPS = "/story/balloon-pops.m4a";
/** Clip time when the on-load reveal clock is at 0. Lines the pops up. */
const INTRO_HEAD = 1.02;
/** The film stays quieter. The opening pops stay louder so they read. */
const FILM_VOLUME = 0.4;
const OPEN_VOLUME = 0.85;
/**
 * The pops in the file sit 0.08s after the balloons, and the player
 * runs a little behind the picture. Aiming this far ahead lands the pops.
 */
const FILM_AHEAD = 0.15;
/** Skip's first balloon is at 1s. The matching pop in the file is at 71.18s. */
const SKIP_AT = 71.18 - 1 - FILM_AHEAD;

let film: HTMLAudioElement | null = null;
let pops: HTMLAudioElement | null = null;
let filmOn = false;
let popsOn = false;
/** True while the rising balloons are still on screen. A late click does not replay them. */
let introLive = false;
/** The browser refused sound without a click. Do not ask again on every frame. */
let introBlocked = false;
let filmOrigin = 0;
let sawFilm = -1;
let sawIntro = -1;
let unlockBound = false;
let seekAt = 0;

function basePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

function mount(sound: HTMLAudioElement): HTMLAudioElement {
  // Kept in the page so the browser treats it as part of the document.
  if (typeof document !== "undefined" && !sound.isConnected) {
    sound.setAttribute("aria-hidden", "true");
    document.body.appendChild(sound);
  }
  return sound;
}

function filmTrack(): HTMLAudioElement {
  if (!film) {
    film = new Audio(`${basePath()}${FILM}`);
    film.preload = "auto";
  }
  film.volume = FILM_VOLUME;
  return mount(film);
}

function popTrack(): HTMLAudioElement {
  if (!pops) {
    pops = new Audio(`${basePath()}${POPS}`);
    pops.preload = "auto";
  }
  pops.volume = OPEN_VOLUME;
  return mount(pops);
}

function seek(sound: HTMLAudioElement, time: number, force = false) {
  const now = performance.now();
  if (!force && now - seekAt < 200) return;
  seekAt = now;
  try {
    sound.currentTime = time;
  } catch {
    /* The file may not have its length yet. The next frame tries again. */
  }
}

/** A browser only blocks sound that has not been allowed. A seek is not that. */
function playSound(sound: HTMLAudioElement, markBlocked: () => void) {
  const pending = sound.play();
  pending?.catch((err: { name?: string }) => {
    if (err?.name === "NotAllowedError") markBlocked();
  });
}

/** Warm the short clip during the wait before the logo balloons rise. */
export function preloadIntroPops() {
  popTrack();
  bindUnlock();
}

/**
 * The rising balloons have started. Play the short clip in step with them.
 * If the browser blocks sound until a click, the first click catches up.
 */
export function startIntroPops() {
  if (filmOn) return;
  const sound = popTrack();
  popsOn = true;
  introLive = true;
  sawIntro = -1;
  seek(sound, INTRO_HEAD, true);
  introBlocked = false;
  playSound(sound, () => {
    introBlocked = true;
  });
  bindUnlock();
}

function bindUnlock() {
  if (unlockBound || typeof document === "undefined") return;
  unlockBound = true;
  const go = (event: Event) => {
    if (filmOn || !pops) return;
    const target = event.target;
    if (target instanceof Element && target.closest(".hero-watch")) return;
    // A click before the balloons lets the later play through.
    if (!introLive) {
      const pending = pops.play();
      pops.pause();
      pending?.catch(() => {});
      return;
    }
    if (!popsOn || !pops.paused) return;
    introBlocked = false;
    playSound(pops, () => {
      introBlocked = true;
    });
  };
  document.addEventListener("pointerdown", go);
}

/** Keep the short clip on the rising-balloon clock. After it ends, the tail finishes. */
export function followIntroPops(time: number, paused: boolean, ended: boolean) {
  if (!popsOn || !pops || filmOn) return;
  if (ended) {
    introLive = false;
    return;
  }
  if (paused) {
    if (!pops.paused) pops.pause();
    sawIntro = time;
    return;
  }
  const stalled = time > 0.05 && Math.abs(time - sawIntro) < 0.0005;
  sawIntro = time;
  if (stalled) {
    if (!pops.paused) pops.pause();
    return;
  }
  const target = time + INTRO_HEAD;
  if (Math.abs(pops.currentTime - target) > 0.05) seek(pops, target);
  if (pops.paused && !introBlocked) {
    playSound(pops, () => {
      introBlocked = true;
    });
  }
}

export function stopIntroPops() {
  popsOn = false;
  introLive = false;
  sawIntro = -1;
  if (!pops) return;
  pops.pause();
  seek(pops, 0);
}

/** Call from the button click, so the browser will allow the film. */
export function armStoryTrack() {
  stopIntroPops();
  const sound = filmTrack();
  filmOn = true;
  filmOrigin = 0;
  sawFilm = -1;
  seek(sound, 0);
  const pending = sound.play();
  sound.pause();
  seek(sound, 0);
  pending.catch(() => {});
}

/** The full film has started. Play from the top. */
export function startStoryTrack() {
  stopIntroPops();
  const sound = filmTrack();
  filmOn = true;
  filmOrigin = 0;
  sawFilm = -1;
  seek(sound, 0);
  sound.play().catch(() => {});
}

/** The picture jumped to the balloons. Move the film track to that same moment. */
export function skipStoryTrackToBalloons() {
  if (!filmOn) return;
  filmOrigin = SKIP_AT;
  sawFilm = -1;
  const sound = filmTrack();
  seek(sound, SKIP_AT + FILM_AHEAD, true);
  sound.play().catch(() => {});
}

/**
 * Keep the film track on the picture clock.
 * A stalled clock means the hero scrolled away or the tab is hidden.
 * After the film ends, the short tail is allowed to finish.
 */
export function followStoryTrack(time: number, paused: boolean, ended: boolean) {
  if (!filmOn || !film) return;
  if (ended) return;
  if (paused) {
    if (!film.paused) film.pause();
    sawFilm = time;
    return;
  }
  const stalled = time > 0.05 && Math.abs(time - sawFilm) < 0.0005;
  sawFilm = time;
  if (stalled) {
    if (!film.paused) film.pause();
    return;
  }
  const target = time + filmOrigin + FILM_AHEAD;
  if (Math.abs(film.currentTime - target) > 0.05) seek(film, target);
  if (film.paused) film.play().catch(() => {});
}

export function stopStoryTrack() {
  filmOn = false;
  filmOrigin = 0;
  sawFilm = -1;
  stopIntroPops();
  if (!film) return;
  film.pause();
  seek(film, 0);
}
