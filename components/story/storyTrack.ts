/**
 * The film soundtrack. It starts with the picture, from the Watch button.
 * The balloons that rise when the page loads stay quiet: a phone will not
 * play sound that starts by itself. See DESIGN_DECISIONS.md.
 */

const FILM = "/story/soda-animation.m4a";
/** The film stays quieter than the recording. 1 is full volume. */
const FILM_VOLUME = 0.4;
/**
 * The pops in the file sit 0.08s after the balloons, and the player
 * runs a little behind the picture. Aiming this far ahead lands the pops.
 */
const FILM_AHEAD = 0.15;
/** Skip's first balloon is at 1s. The matching pop in the file is at 71.18s. */
const SKIP_AT = 71.18 - 1 - FILM_AHEAD;

let film: HTMLAudioElement | null = null;
let filmOn = false;
let filmOrigin = 0;
let sawFilm = -1;
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

/** A phone treats every jump as a new download. Only jump when that moment is already in hand. */
function phoneSync() {
  return window.matchMedia("(pointer: coarse), (max-width: 900px)").matches;
}

function hasReach(sound: HTMLAudioElement, time: number) {
  if (sound.readyState < 1) return false;
  try {
    const ranges = sound.buffered;
    for (let i = 0; i < ranges.length; i++) {
      if (time >= ranges.start(i) - 0.05 && time <= ranges.end(i) + 0.4) return true;
    }
  } catch {
    /* The length is not known yet. */
  }
  return false;
}

function seek(sound: HTMLAudioElement, time: number, force = false) {
  const now = performance.now();
  // A jump that is still settling must finish. Another jump on top of it clicks.
  if (!force && sound.seeking) return;
  if (!force && now - seekAt < (phoneSync() ? 1200 : 200)) return;
  if (!force && !hasReach(sound, time)) return;
  seekAt = now;
  try {
    sound.currentTime = time;
  } catch {
    /* The file may not have its length yet. The next frame tries again. */
  }
}

/** Call from the button click, so the browser will allow the film. */
export function armStoryTrack() {
  const sound = filmTrack();
  filmOn = true;
  filmOrigin = 0;
  sawFilm = -1;
  seek(sound, 0, true);
  const pending = sound.play();
  sound.pause();
  seek(sound, 0, true);
  pending.catch(() => {});
}

/** The full film has started. Play from the top. */
export function startStoryTrack() {
  const sound = filmTrack();
  filmOn = true;
  filmOrigin = 0;
  sawFilm = -1;
  sound.playbackRate = 1;
  seek(sound, 0, true);
  sound.play().catch(() => {});
}

/** The picture jumped to the balloons. Move the film track to that same moment. */
export function skipStoryTrackToBalloons() {
  if (!filmOn) return;
  filmOrigin = SKIP_AT;
  sawFilm = -1;
  const sound = filmTrack();
  seek(sound, SKIP_AT + FILM_AHEAD, true);
  sound.playbackRate = 1;
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
    film.playbackRate = 1;
    sawFilm = time;
    return;
  }
  const stalled = time > 0.05 && Math.abs(time - sawFilm) < 0.0005;
  sawFilm = time;
  if (stalled) {
    if (!film.paused) film.pause();
    film.playbackRate = 1;
    return;
  }
  const target = time + filmOrigin + FILM_AHEAD;
  const drift = target - film.currentTime;
  // A little fast or slow closes a small gap without a jump. A jump is
  // only for a real hole, and only forward: rewinding is what clicks.
  if (!film.seeking) {
    const rate = drift > 0.05 ? 1.02 : drift < -0.05 ? 0.98 : 1;
    if (Math.abs(film.playbackRate - rate) > 0.001) film.playbackRate = rate;
  }
  const limit = phoneSync() ? 0.6 : 0.45;
  if (drift > limit) seek(film, target);
  if (film.paused) film.play().catch(() => {});
}

export function stopStoryTrack() {
  filmOn = false;
  filmOrigin = 0;
  sawFilm = -1;
  if (!film) return;
  film.pause();
  film.playbackRate = 1;
  seek(film, 0, true);
}
