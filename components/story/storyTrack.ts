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
/** When the picture clock last looked stopped. A single repeat is not a stop. */
let stillAt = 0;
/** Sound is starting and the picture is waiting. Don't pause it during that beat. */
let arming = false;

/** How long the picture will wait for the file, and then for sound to actually start. */
const READY_WAIT = 320;
const PLAY_WAIT = 240;

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

/** A jump is only for the start, Skip, and stopping. */
function seek(sound: HTMLAudioElement, time: number) {
  try {
    sound.currentTime = time;
  } catch {
    /* The file may not have its length yet. The next start tries again. */
  }
}

/**
 * Let the file become seekable before the picture moves.
 * A phone often ignores a seek that happens in the same moment as play.
 * Resolves as soon as it can, and never waits longer than a third of a second.
 */
export function warmStoryTrack(): Promise<void> {
  const sound = filmTrack();
  if (sound.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      sound.removeEventListener("canplay", done);
      window.clearTimeout(timer);
      resolve();
    };
    sound.addEventListener("canplay", done);
    const timer = window.setTimeout(done, READY_WAIT);
  });
}

/** Call from the button click, so the browser will allow the film. */
export function armStoryTrack() {
  const sound = filmTrack();
  // This tap unlocks sound. The film itself starts with the picture.
  const pending = sound.play();
  sound.pause();
  pending.catch(() => {});
}

/**
 * The full film has started. Play from the top, already aimed at the pops.
 * Resolves with how far the sound moved while the picture was waiting,
 * so the picture can begin on that same moment.
 */
export function startStoryTrack(): Promise<number> {
  const sound = filmTrack();
  filmOn = true;
  filmOrigin = 0;
  sawFilm = -1;
  stillAt = 0;
  arming = true;
  sound.playbackRate = 1;
  seek(sound, FILM_AHEAD);
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      sound.removeEventListener("playing", finish);
      window.clearTimeout(timer);
      // Stay armed until the picture clock is running. Otherwise the
      // one frame between this and begin() looks like a pause and stops the sound.
      const ahead = sound.currentTime - FILM_AHEAD;
      // A leftover playhead from an earlier run is not a head start.
      resolve(ahead > 0 && ahead < 0.3 ? ahead : 0);
    };
    sound.addEventListener("playing", finish);
    const timer = window.setTimeout(finish, PLAY_WAIT);
    sound.play().catch(() => finish());
  });
}

/** The picture jumped to the balloons. Move the film track to that same moment. */
export function skipStoryTrackToBalloons() {
  if (!filmOn) return;
  filmOrigin = SKIP_AT;
  sawFilm = -1;
  stillAt = 0;
  const sound = filmTrack();
  sound.playbackRate = 1;
  seek(sound, SKIP_AT + FILM_AHEAD);
  sound.play().catch(() => {});
}

/**
 * Keep the film track with the picture.
 * The picture already follows real time, so the sound stays at one speed.
 * Changing speed is what the ear hears as a check. A stalled clock means the
 * hero scrolled away or the tab is hidden. After the film ends, the tail finishes.
 */
export function followStoryTrack(time: number, paused: boolean, ended: boolean) {
  if (!filmOn || !film) return;
  if (arming) {
    if (paused) return;
    arming = false;
  }
  if (ended) return;
  if (paused) {
    if (!film.paused) film.pause();
    sawFilm = time;
    stillAt = 0;
    return;
  }
  const still = time > 0.05 && Math.abs(time - sawFilm) < 0.0005;
  sawFilm = time;
  if (still) {
    if (!stillAt) stillAt = performance.now();
    // The two clocks sometimes meet for one frame. That is not a stop.
    if (performance.now() - stillAt < 200) return;
    if (!film.paused) film.pause();
    return;
  }
  stillAt = 0;
  if (film.paused) film.play().catch(() => {});
}

export function stopStoryTrack() {
  filmOn = false;
  filmOrigin = 0;
  sawFilm = -1;
  stillAt = 0;
  arming = false;
  if (!film) return;
  film.pause();
  film.playbackRate = 1;
  seek(film, 0);
}
