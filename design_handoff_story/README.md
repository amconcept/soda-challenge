# SOD+A CHALLENGE — story film handoff (Cursor)

## What's here
```
components/story/engine/          The engine. Production code, ships as is.
design/story/STORY_SPEC.md        Timeline, API, lockup regrouping, CSS, behaviour, decisions
design/story/SODA Story.reference.html   Open in a browser: hero mock + full behaviour
design/story/reference/           What the reference is built from
design/story/animatics/           The four approved tests (provenance)
.cursor/rules/soda-story.mdc      Project rule, auto-loads on hero and story files
```

## Setup
1. Unzip at the repo root. Every file lands in its final place; nothing to copy twice.
2. Open `design/story/SODA Story.reference.html`. Watch the load, press Watch the story,
   try Skip. The timing is the design.
3. Paste the prompt below into Cursor.

## Suggested first prompt
> Read @design/story/STORY_SPEC.md and @.cursor/rules/soda-story.mdc, and open
> @design/story/SODA Story.reference.html as the behaviour reference. Integrate the story
> engine from @components/story/engine/index.js into the hero:
> 1. Regroup @components/hero/HeroLockup.tsx into data-reveal parts 0 to 2 exactly as
>    @design/story/reference/lockup-reveal.svg, keeping all path data verbatim. Put
>    data-reveal="3" on the partner row.
> 2. Add a client component components/story/StoryLayer.tsx: a transparent canvas over the
>    hero that creates the engine on mount, measures the four targets, and maps cues to
>    classList and dataset on refs (no hero re-render). Destroy on unmount.
> 3. Replace the string-in draw with the balloon reveal on load: keep the hook line, call
>    playReveal({ firstPop: 2.2 }) 1.7 s after ready, no lockupRise, no 20 s replay loop,
>    CAD layer hidden. Port the hand-off CSS from the spec into hero.css.
> 4. Add a Watch the story pill beside DISCOVER, plus Pause and Skip during the film, with
>    the keyboard, focus, fullscreen and reduced-motion behaviour in the spec.
> 5. Add the copy keys from the spec to lib/copy.ts (es and fr marked machine drafts).
> 6. Log the six flagged decisions and anything else you decide in DESIGN_DECISIONS.md.
> Do not edit files in components/story/engine/. Run npm run build and check the static
> export at desktop and 390 px wide against the reference.

## Fidelity
High for the film, seams, balloon reveal and timings. Open: the six flagged decisions in
the spec, and copy translations.
