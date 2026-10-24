/**
 * Balloon pop and confetti crackle, made in the browser.
 * No sound file. A click has to come first, or the browser stays quiet.
 * See DESIGN_DECISIONS.md.
 */

let ctx: AudioContext | null = null;
let quiet = false;

function audio(): AudioContext | null {
  if (quiet) return null;
  const Ctx = window.AudioContext;
  if (!Ctx) return null;
  if (!ctx) ctx = new Ctx();
  return ctx;
}

/** Call this from a click or a key, so later pops are allowed to play. */
export function unlockStorySound() {
  quiet = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sound = audio();
  if (sound && sound.state === "suspended") {
    sound.resume().catch(() => {});
  }
}

function noiseBurst(sound: AudioContext, when: number, seconds: number, volume: number, fromHz: number, toHz: number) {
  const length = Math.max(1, Math.floor(sound.sampleRate * seconds));
  const buffer = sound.createBuffer(1, length, sound.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    const fade = Math.pow(1 - i / length, 1.6);
    data[i] = (Math.random() * 2 - 1) * fade;
  }
  const source = sound.createBufferSource();
  source.buffer = buffer;
  const filter = sound.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(fromHz, when);
  filter.frequency.exponentialRampToValueAtTime(Math.max(80, toHz), when + seconds);
  filter.Q.value = 0.6;
  const gain = sound.createGain();
  gain.gain.setValueAtTime(volume, when);
  gain.gain.exponentialRampToValueAtTime(0.001, when + seconds);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(sound.destination);
  source.start(when);
  source.stop(when + seconds + 0.02);
}

/** One balloon, then the paper bits that fall with it. seed keeps each pop a little different. */
export function playBalloonPop(seed = 0) {
  const sound = audio();
  if (!sound || sound.state !== "running") return;
  const now = sound.currentTime;
  const pitch = 140 + (seed % 4) * 36;

  noiseBurst(sound, now, 0.16, 0.42, 2200 + seed * 80, 320);

  const thump = sound.createOscillator();
  thump.type = "sine";
  thump.frequency.setValueAtTime(pitch, now);
  thump.frequency.exponentialRampToValueAtTime(48, now + 0.12);
  const thumpGain = sound.createGain();
  thumpGain.gain.setValueAtTime(0.32, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  thump.connect(thumpGain);
  thumpGain.connect(sound.destination);
  thump.start(now);
  thump.stop(now + 0.16);

  // Confetti: a handful of tiny snaps over the next second.
  const bits = 12;
  for (let i = 0; i < bits; i++) {
    const when = now + 0.04 + Math.random() * 0.85;
    const seconds = 0.018 + Math.random() * 0.035;
    noiseBurst(sound, when, seconds, 0.08 + Math.random() * 0.06, 2800 + Math.random() * 2200, 900);
  }
}
