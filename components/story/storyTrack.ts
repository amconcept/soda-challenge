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
/** How fast the picture has been moving, measured over a short span. */
let pictureRate = 1;
let spanAt = 0;
let spanTime = 0;
let ratedAt = 0;

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
    // A change of speed must not change the pitch.
    film.preservesPitch = true;
    const webkit = film as HTMLAudioElement & { webkitPreservesPitch?: boolean };
    webkit.webkitPreservesPitch = true;
  }
  film.volume = FILM_VOLUME;
  return mount(film);
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

/** A jump is only for the start, Skip, and stopping. Catching up never jumps. */
function seek(sound: HTMLAudioElement, time: number) {
  try {
    sound.currentTime = time;
  } catch {
    /* The file may not have its length yet. The next start tries again. */
  }
}

function resetPace() {
  pictureRate = 1;
  spanAt = 0;
  spanTime = 0;
  ratedAt = 0;
}

/**
 * Match the soundtrack to the picture without moving the playhead.
 * The rate eases, so a late frame does not click.
 */
function easeRate(sound: HTMLAudioElement, rate: number) {
  const next = clamp(rate, 0.84, 1.16);
  const now = performance.now();
  if (Math.abs(sound.playbackRate - next) < 0.01) return;
  if (now - ratedAt < 160) return;
  ratedAt = now;
  sound.playbackRate = next;
}

/** Picture speed over the last half second. One frame is too noisy to follow. */
function notePicture(time: number) {
  const now = performance.now();
  if (!spanAt) {
    spanAt = now;
    spanTime = time;
    return;
  }
  const wall = (now - spanAt) / 1000;
  if (wall < 0.45) return;
  const moved = time - spanTime;
  if (moved >= 0) pictureRate = clamp(moved / wall, 0.84, 1.08);
  spanAt = now;
  spanTime = time;
}

/** Call from the button click, so the browser will allow the film. */
export function armStoryTrack() {
  const sound = filmTrack();
  // This tap unlocks sound. The film itself starts with the picture.
  const pending = sound.play();
  sound.pause();
  pending.catch(() => {});
}

/** The full film has started. Play from the top, already aimed at the pops. */
export function startStoryTrack() {
  const sound = filmTrack();
  filmOn = true;
  filmOrigin = 0;
  sawFilm = -1;
  resetPace();
  sound.playbackRate = 1;
  seek(sound, FILM_AHEAD);
  sound.play().catch(() => {});
}

/** The picture jumped to the balloons. Move the film track to that same moment. */
export function skipStoryTrackToBalloons() {
  if (!filmOn) return;
  filmOrigin = SKIP_AT;
  sawFilm = -1;
  resetPace();
  const sound = filmTrack();
  sound.playbackRate = 1;
  seek(sound, SKIP_AT + FILM_AHEAD);
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
    resetPace();
    return;
  }
  const stalled = time > 0.05 && Math.abs(time - sawFilm) < 0.0005;
  sawFilm = time;
  if (stalled) {
    if (!film.paused) film.pause();
    film.playbackRate = 1;
    resetPace();
    return;
  }
  notePicture(time);
  const target = time + filmOrigin + FILM_AHEAD;
  const drift = target - film.currentTime;
  // A few frames either way is finer than the ear. Past that, speed
  // follows the picture and eases toward it. The playhead stays put.
  const nudge = Math.abs(drift) < 0.04 ? 0 : clamp(drift * 0.45, -0.12, 0.14);
  if (!film.seeking) easeRate(film, pictureRate + nudge);
  if (film.paused) film.play().catch(() => {});
}

export function stopStoryTrack() {
  filmOn = false;
  filmOrigin = 0;
  sawFilm = -1;
  resetPace();
  if (!film) return;
  film.pause();
  film.playbackRate = 1;
  seek(film, 0);
}
