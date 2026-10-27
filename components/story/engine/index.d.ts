/* Types for the SOD+A story engine (index.js). The engine is plain JS so the
   reference page can bundle it as is; these types let the site's TSX use it strictly. */

export type Rect = { x: number; y: number; width: number; height: number };

export type StoryState = 'idle' | 'loading' | 'reveal' | 'story' | 'done';

export type CueName = 'state' | 'chapter' | 'pop' | 'ding' | 'tagline' | 'done' | 'reset';

export type CueDetail = {
  /** Seconds on the current timeline. */
  t?: number;
  /** pop: which part. 0 S.o.  1 d+a.  2 CHALLENGE  3 partner row */
  i?: number;
  /** chapter: 0 button, 1 sharing, 2 co-design, 3 reveal */
  n?: number;
  chapter?: 'button' | 'sharing' | 'co-design' | 'reveal';
  /** state: the new state */
  state?: StoryState;
  /** True when replayed by seek() or reduced motion: show the result without animating. */
  instant?: boolean;
};

export type Tagline = { text: string; font?: string } | null;

export type StoryOptions = {
  /** Line colour. Site: the hero line colour (--hero-line). */
  ink?: string | (() => string);
  /** Knockout colour, read every drawn frame. Site: the live page wash (--page-bg). */
  paper?: string | (() => string);
  /** Up to four rects in CSS px relative to the canvas: S.o., d+a., CHALLENGE, partner row. */
  targets?: () => Array<Rect | null | undefined>;
  onCue?: (name: CueName, detail: CueDetail) => void;
  /** Handwritten closing line under CHALLENGE. Off on the site by default. */
  tagline?: Tagline | (() => Tagline);
  /** Override how chapters 1–3 load (default: dynamic import, split into its own chunk). */
  loadChapters?: () => Promise<[ChapterModule, ChapterModule, ChapterModule]>;
  /** Cap on device pixel ratio for the canvas. Default 2. */
  maxDpr?: number;
  /** Default: follows prefers-reduced-motion. When true, playReveal() shows the result at once. */
  reducedMotion?: boolean;
};

export type ChapterModule = {
  DUR: number;
  render: (ctx: CanvasRenderingContext2D, t: number, view: { s: number; ox: number; oy: number; ink: string; paper: string }) => void;
};

export type Story = {
  /** Logo first: balloons rise and pop into the lockup. firstPop = seconds until the first pop (default 2.2). */
  playReveal(options?: { firstPop?: number }): void;
  /** The whole film (about 74 s), ending in the same reveal. */
  playStory(): Promise<void>;
  /** Start downloading chapters 1–3 early, e.g. on hover of the Watch button. */
  preload(): Promise<unknown>;
  /** During the story: jump straight to the balloon reveal. */
  skip(): void;
  pause(): void;
  resume(): void;
  readonly paused: boolean;
  seek(t: number): void;
  /** The planet's circle on screen at film time t (default now), in 16:9 frame units (1600 x 900), or null. */
  groundArc(t?: number): { cx: number; cy: number; r: number } | null;
  /** Drawing size now: the story's drawings are scaled by k toward the frame's centre, y of its height down (1 outside the story). */
  stage(): { k: number; y: number };
  /** The film's paper grain on screen now: 0 outside the story, up to CFG.grain while it plays. */
  grainLevel(): number;
  redraw(): void;
  readonly chapters: Array<{ name: string; t: number }>;
  readonly time: number;
  readonly duration: number;
  readonly state: StoryState;
  stop(): void;
  destroy(): void;
};

export function createStory(canvas: HTMLCanvasElement, options?: StoryOptions): Story;

/** Live tuning (same knobs as the test panels): wobble, boil, fps, weight, speed. */
export const CFG: { wobble: number; boil: number; fps: number; weight: number; speed: number; shadows: boolean; grain: number; stage: number };
export const CFG0: Readonly<typeof CFG>;
export const SEAMS: { wipe: number; dissolve: number };
export const CHAPTERS: readonly ['button', 'sharing', 'co-design', 'reveal'];
