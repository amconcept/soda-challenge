/* =========================================================================
   SOD+A STORY — on-screen text. THE ONE FILE TO EDIT.
   Change words, times, boxes or motions here; nothing else needs touching.

   start / end   seconds on the film timeline. Matched to the narration, so keep
                 them where the audio is. The text is fully gone by `end`.
   box           [left, top, width, height] in % of the 16:9 film frame.
   motion        'write'  a pen writes it on
                 'pop'    a small label, then the big word pops (optional `sub` line writes on after `subAt` s)
   label         optional small uppercase tag above the line, on either motion (it fades up first)
   size          optional multiplier on the main text size (1 = 5.5% of frame height, 8% for pop)
   behind        true puts the line under the drawings, so the balloons pass in front of it
   curve         true bends the line along the planet's circle (concentric with the ground under it)
   ground        with curve: rides the ground. The number is the distance below the ground line in % of the
                 frame height (minus is above). The line keeps it through zooms; box only sets left-right.
                 [from, to] glides from one distance to the other while the line is on screen.
   Drawing size: the film can draw its pictures a little smaller than the frame (CFG.stage). Boxes and
                 ground distances are in the drawing's terms and move with it; the letters keep their size.
   oneLine       true keeps the words on one line, even past the box width (it only shrinks if it would leave the frame)

   Visible copy rules: no colons, no long dashes.
   Discovery + Action is the program's name. It stays in English, even if translations are added,
   and so do Discovery and Action on their own. A "+" standing on its own is drawn, not typed (see the runtime).
   Alec's text, 2026-10-27. English only for now: every text field is { en: '...' }, and any
   other site language shows the English. Translations can be added later as es and fr keys.
   ========================================================================= */
export const CAPTIONS = [
  {"id":"prompt","start":4.3,"end":6,"box":[25,26,50,12],"motion":"write","text":{"en":"It starts with a random prompt."}},
  {"id":"ideas","start":7.7,"end":9.7,"box":[25,26,50,12],"motion":"write","text":{"en":"A set of words..."}},
  {"id":"think","start":10,"end":11.7,"box":[25,26,50,12],"motion":"write","behind":true,"text":{"en":"...THINGS to THINK with..."}},
  {"id":"line-2","start":11.9,"end":14.1,"box":[25,26,50,12],"motion":"write","behind":true,"text":{"en":"...THINGS to DISCOVER!"}},
  {"id":"phase1","start":17,"end":19,"box":[14,82,72,18],"motion":"pop","curve":true,"size":0.82,"label":{"en":"Phase 1"},"text":{"en":"DISCOVERY"},"sub":{"en":""},"subAt":0.9},
  {"id":"explore","start":19,"end":21,"box":[14,82,72,18],"motion":"pop","curve":true,"oneLine":true,"label":{"en":"EXPERIMENT"},"text":{"en":"With your PROMPTS!"}},
  {"id":"line-1","start":21,"end":23.7,"box":[14,82,72,18],"motion":"pop","curve":true,"label":{"en":"COLLABORATE"},"text":{"en":"How far can you push an IDEA?"}},
  {"id":"board","start":25.9,"end":29,"box":[24,55,52,-7],"motion":"pop","curve":true,"label":{"en":"SHARE"},"text":{"en":"Something you discover."}},
  {"id":"feedback","start":29,"end":35.8,"box":[25,55,52,-7],"motion":"pop","curve":true,"oneLine":true,"label":{"en":"WATCH"},"text":{"en":"Your ideas spread!"}},
  {"id":"phase2","start":35.8,"end":37.6,"box":[24,55,52,1],"motion":"pop","curve":true,"label":{"en":"Phase 2"},"text":{"en":"ACTION"}},
  {"id":"collide","start":37.7,"end":41.2,"box":[18,81,64,8],"motion":"pop","curve":true,"oneLine":true,"label":{"en":"WORK AS A TEAM"},"text":{"en":"Bring your ideas to the COMMUNITY."}},
  {"id":"mentors","start":41.3,"end":43,"box":[18,81,64,8],"motion":"pop","curve":true,"behind":true,"label":{"en":"DESIGN"},"text":{"en":"Useful OBJECTS."},"sub":{"en":""}},
  {"id":"line-3","start":43,"end":45,"box":[18,81,64,8],"motion":"pop","curve":true,"label":{"en":"CONSTRUCT"},"text":{"en":"A new SPACE."}},
  {"id":"line-6","start":46.9,"end":48.6,"box":[22,80,56,8],"motion":"pop","curve":true,"label":{"en":"WORK"},"text":{"en":"With the your school."}},
  {"id":"community","start":48.7,"end":51.2,"box":[22,80,56,8],"motion":"pop","curve":true,"label":{"en":"DESIGN"},"text":{"en":"A \"pop-up\" SHOP."}},
  {"id":"line-8","start":52,"end":53.4,"box":[22,80,56,10],"motion":"pop","curve":true,"label":{"en":"...OR..."},"text":{"en":""}},
  {"id":"line-4","start":53.2,"end":55.7,"box":[22,80,56,8],"motion":"pop","curve":true,"label":{"en":"CREATE"},"text":{"en":"A new EXPERIENCE!"}},
  {"id":"proud","start":56.6,"end":58.7,"box":[24,85,52,-4],"motion":"pop","curve":true,"size":0.84,"label":{"en":"OFFER"},"text":{"en":"A new SERVICE."}},
  {"id":"line-5","start":58.9,"end":62.5,"box":[24,85,52,-4],"motion":"pop","curve":true,"behind":true,"label":{"en":"DESIGN"},"text":{"en":"A new SYSTEM."}},
  {"id":"join","start":62.5,"end":65,"box":[24,55,52,22],"motion":"pop","curve":true,"label":{"en":"BUILD"},"text":{"en":"A PORTFOLIO!"}},
  {"id":"line-7","start":64.9,"end":67.2,"box":[20,40,60,97],"motion":"pop","curve":true,"ground":[22.7,7],"label":{"en":"GET RECOGNIZED"},"text":{"en":"FOR WHAT YOU DO!"},"oneLine":false,"behind":true},
  {"id":"closing","start":66.5,"end":70.3,"box":[16,12,68,73],"motion":"pop","curve":false,"behind":true,"size":1.15,"label":{"en":"THIS IS"},"text":{"en":"DISCOVERY + ACTION"}},
];
