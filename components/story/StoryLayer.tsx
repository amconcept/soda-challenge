"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { createStory, type Story } from "@/components/story/engine/index.js";
import { createCaptions } from "@/components/story/captions/index.js";
import { useLanguage } from "@/components/LanguageProvider";
import {
  armStoryTrack,
  followStoryTrack,
  skipStoryTrackToBalloons,
  startStoryTrack,
  stopStoryTrack,
} from "@/components/story/storyTrack";

type StoryApi = {
  preload: () => void;
  play: () => void;
};

const StoryContext = createContext<StoryApi | null>(null);

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Transparent film over the hero. Cues change classes on the lockup.
 * The hero itself does not re-render for each pop. See DESIGN_DECISIONS.md.
 */
export default function StoryLayer({
  heroRef,
  ready,
  children,
}: {
  heroRef: RefObject<HTMLElement | null>;
  ready: boolean;
  children: ReactNode;
}) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pauseRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<Story | null>(null);
  const captionsRef = useRef<HTMLDivElement>(null);
  const behindRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<StoryApi>({ preload() {}, play() {} });

  useEffect(() => {
    if (!ready) return;
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;

    const parts = [0, 1, 2, 3].map((i) =>
      hero.querySelector<HTMLElement>(`[data-reveal="${i}"]`),
    );
    const aim = [0, 1, 2]
      .map((i) => parts[i])
      .concat([hero.querySelector<HTMLElement>("[data-reveal-target]")]);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function exitFullscreen() {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }

    const story = createStory(canvas, {
      ink: () => cssVar("--hero-line") || "#0e0d0c",
      paper: () => cssVar("--page-bg") || "#dfe9e6",
      targets: () => {
        const box = canvas.getBoundingClientRect();
        return aim.map((el) => {
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return {
            x: rect.left - box.left,
            y: rect.top - box.top,
            width: rect.width,
            height: rect.height,
          };
        });
      },
      onCue(name, detail) {
        if (name === "reset") {
          parts.forEach((part) => part?.classList.remove("is-in", "instant"));
        }
        if (name === "pop" && detail.i != null) {
          parts[detail.i]?.classList.add("is-in", ...(detail.instant ? ["instant"] : []));
        }
        if (name === "chapter" && detail.chapter) {
          hero.dataset.chapter = detail.chapter;
        }
        if (name === "state") {
          if (detail.state === "story") {
            hero.dataset.mode = "story";
            startStoryTrack();
          }
          if (detail.state === "loading") {
            hero.dataset.mode = "story";
          }
          // Skip leaves the full film and jumps to the balloons. The track jumps with it.
          if (detail.state === "reveal" && hero.dataset.mode === "story") {
            skipStoryTrackToBalloons();
          }
          if (detail.state === "reveal" && hero.dataset.mode !== "story") {
            hero.dataset.mode = "intro";
          }
          if (detail.state === "done") {
            hero.dataset.mode = "rest";
            exitFullscreen();
            hero.querySelector<HTMLButtonElement>(".hero-watch")?.focus();
          }
        }
        if (name === "done") {
          parts.forEach((part) => part?.classList.add("is-in"));
          hero.dataset.mode = "rest";
          exitFullscreen();
        }
      },
    });
    storyRef.current = story;

    const captions = captionsRef.current
      ? createCaptions(captionsRef.current, {
          behindHost: behindRef.current,
          getTime: () => (story.state === "story" ? story.time : null),
          getArc: () => story.groundArc(),
          getStage: () => story.stage(),
          getGrain: () => story.grainLevel(),
          ink: cssVar("--hero-line") || "#0e0d0c",
          locale: "en",
          font: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontScale: 0.72,
          fontWeight: 600,
        })
      : null;
    captions?.start();

    function togglePause() {
      const button = pauseRef.current;
      if (!button) return;
      if (story.paused) story.resume();
      else story.pause();
      button.setAttribute("aria-pressed", String(story.paused));
    }

    apiRef.current.preload = () => {
      story.preload();
    };
    apiRef.current.play = () => {
      armStoryTrack();
      const small = window.matchMedia("(max-width: 700px) and (orientation: portrait)");
      if (small.matches && hero.requestFullscreen) {
        hero.requestFullscreen().then(() => {
          const orientation = screen.orientation as ScreenOrientation & {
            lock?: (value: string) => Promise<void>;
          };
          orientation.lock?.("landscape").catch(() => {});
        }).catch(() => {});
      }
      story.playStory();
      pauseRef.current?.focus();
    };

    const startId = window.setTimeout(
      () => story.playReveal({ firstPop: 2.2 }),
      reduced ? 0 : 1700,
    );

    let frame = 0;
    const paintProgress = () => {
      frame = window.requestAnimationFrame(paintProgress);
      if (story.duration && progressRef.current) {
        progressRef.current.style.setProperty("--p", String(story.time / story.duration));
      }
      followStoryTrack(story.time, story.paused, story.state === "done");
    };
    frame = window.requestAnimationFrame(paintProgress);

    const onKey = (event: KeyboardEvent) => {
      if (hero.dataset.mode !== "story") return;
      if (event.key === "Escape") story.skip();
      if (event.code === "Space") {
        const target = event.target;
        if (target instanceof HTMLElement && target.closest("button")) return;
        event.preventDefault();
        togglePause();
      }
    }
    document.addEventListener("keydown", onKey);
    pauseRef.current?.addEventListener("click", togglePause);

    return () => {
      window.clearTimeout(startId);
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      pauseRef.current?.removeEventListener("click", togglePause);
      stopStoryTrack();
      captions?.destroy();
      story.destroy();
      storyRef.current = null;
    };
  }, [ready, heroRef]);

  return (
    <StoryContext.Provider value={apiRef.current}>
      {/* Lines marked behind sit under the drawings. The rest sit over the film. */}
      <div ref={behindRef} className="story-captions story-captions-behind" />
      <canvas ref={canvasRef} className="story-canvas" aria-hidden="true" />
      <div ref={captionsRef} className="story-captions" />
      {children}
      <div className="story-controls">
        <button
          ref={pauseRef}
          type="button"
          className="hero-discover story-pill"
          aria-pressed="false"
        >
          <span className="story-when-playing">{t.pause}</span>
          <span className="story-when-paused">{t.play}</span>
        </button>
        <button
          type="button"
          className="hero-discover story-pill"
          onClick={() => storyRef.current?.skip()}
        >
          {t.skip}
        </button>
      </div>
      <div ref={progressRef} className="story-progress" />
    </StoryContext.Provider>
  );
}

/** The pill beside Discover. It shares the engine without re-rendering the hero. */
export function WatchStoryButton() {
  const { t } = useLanguage();
  const api = useContext(StoryContext);
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      type="button"
      className="hero-discover hero-watch"
      onMouseEnter={() => api?.preload()}
      onFocus={() => api?.preload()}
      onClick={() => api?.play()}
    >
      {/* Black pen line around a white pill. See DESIGN_DECISIONS.md. */}
      <svg className="hero-watch-ring" viewBox="0 0 300 86" preserveAspectRatio="none" aria-hidden="true">
        <path
          className="hero-watch-line hero-watch-line-a"
          vectorEffect="non-scaling-stroke"
          d="M48 16C28 9 14 24 16 42C18 58 30 70 52 66C96 74 148 58 196 68C236 76 274 62 276 42C278 22 258 8 220 14C168 6 92 20 48 16Z"
          fill="none"
          stroke="#0e0d0c"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="hero-watch-line hero-watch-line-b"
          vectorEffect="non-scaling-stroke"
          d="M46 18C32 8 12 28 18 40C22 56 26 72 56 64C100 72 144 60 200 66C240 78 270 58 274 44C280 24 254 6 216 16C164 8 88 22 46 18Z"
          fill="none"
          stroke="#0e0d0c"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {t.watchStory}
    </button>
  );
}
