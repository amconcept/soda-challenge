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
   Discovery + Action is the program's name. It stays in English, even in Spanish and French,
   and so do Discovery and Action on their own. A "+" standing on its own is drawn, not typed (see the runtime).
   Film lines, 2026-10-28. English, Spanish, and French. The page language chooses the line.
   ========================================================================= */
export const CAPTIONS = [
  {"id":"prompt","start":4.3,"end":6,"box":[25,26,50,12],"motion":"write","text":{"en":"It starts with a random prompt.","es":"Empieza con una consigna al azar.","fr":"On part d’une consigne au hasard."}},
  {"id":"ideas","start":7.7,"end":9.7,"box":[25,26,50,12],"motion":"write","text":{"en":"A set of words...","es":"Unas palabras...","fr":"Quelques mots..."}},
  {"id":"think","start":10,"end":11.7,"box":[25,26,50,12],"motion":"write","behind":true,"text":{"en":"THINGS to THINK with...","es":"COSAS para PENSAR...","fr":"CHOSES pour PENSER..."}},
  {"id":"line-2","start":11.9,"end":14.1,"box":[25,26,50,12],"motion":"write","behind":true,"text":{"en":"+ THINGS to DISCOVER!","es":"+ ¡COSAS por DESCUBRIR!","fr":"+ CHOSES à DÉCOUVRIR !"}},
  {"id":"phase1","start":17,"end":19,"box":[14,82,72,18],"motion":"pop","curve":true,"size":0.82,"label":{"en":"Phase 1","es":"Fase 1","fr":"Phase 1"},"text":{"en":"DISCOVERY","es":"DISCOVERY","fr":"DISCOVERY"},"sub":{"en":"","es":"","fr":""},"subAt":0.9},
  {"id":"explore","start":19,"end":21,"box":[14,82,72,18],"motion":"pop","curve":true,"oneLine":true,"label":{"en":"EXPERIMENT","es":"EXPERIMENTA","fr":"EXPÉRIMENTE"},"text":{"en":"With your PROMPTS!","es":"¡Con tus CONSIGNAS!","fr":"Avec tes CONSIGNES !"}},
  {"id":"line-1","start":21,"end":23.7,"box":[14,82,72,18],"motion":"pop","curve":true,"label":{"en":"","es":"","fr":""},"text":{"en":"How far can you push an IDEA?","es":"¿Hasta dónde llevas una IDEA?","fr":"Jusqu’où pousser une IDÉE ?"}},
  {"id":"board","start":25.9,"end":29,"box":[24,55,52,-7],"motion":"pop","curve":true,"ground":null,"oneLine":true,"label":{"en":"SHARE","es":"COMPARTE","fr":"PARTAGE"},"text":{"en":"What you discover.","es":"Lo que descubres.","fr":"Ce que tu découvres."}},
  {"id":"feedback","start":29,"end":35.8,"box":[25,55,52,-7],"motion":"pop","curve":true,"oneLine":true,"label":{"en":"WATCH","es":"MIRA","fr":"REGARDE"},"text":{"en":"Your ideas spread!","es":"¡Tus ideas viajan!","fr":"Tes idées voyagent !"}},
  {"id":"phase2","start":35.8,"end":37.6,"box":[24,55,52,1],"motion":"pop","curve":true,"label":{"en":"Phase 2","es":"Fase 2","fr":"Phase 2"},"text":{"en":"ACTION","es":"ACTION","fr":"ACTION"}},
  {"id":"collide","start":37.7,"end":41.2,"box":[18,81,64,8],"motion":"pop","curve":true,"oneLine":true,"label":{"en":"CO-DESIGN","es":"CO-DISEÑA","fr":"CO-CRÉE"},"text":{"en":"In a COMMUNITY.","es":"En COMUNIDAD.","fr":"En COMMUNAUTÉ."}},
  {"id":"mentors","start":41.2,"end":43,"box":[18,81,64,8],"motion":"pop","curve":true,"behind":true,"label":{"en":"MAKE","es":"FABRICA","fr":"FABRIQUE"},"text":{"en":"Useful OBJECTS.","es":"OBJETOS útiles.","fr":"OBJETS utiles."},"sub":{"en":"","es":"","fr":""}},
  {"id":"line-3","start":43,"end":45,"box":[18,81,64,8],"motion":"pop","curve":true,"label":{"en":"DEVELOP","es":"DESARROLLA","fr":"DÉVELOPPE"},"text":{"en":"Sustainable PRODUCTS.","es":"PRODUCTOS sostenibles.","fr":"Des PRODUITS durables."}},
  {"id":"line-10","start":45,"end":46.9,"box":[18,81,64,8],"motion":"write","curve":true,"label":{"en":"WHY NOT...","es":"¿POR QUÉ NO...?","fr":"POURQUOI PAS..."},"text":{"en":"","es":"","fr":""}},
  {"id":"line-6","start":46.9,"end":48.6,"box":[22,80,56,8],"motion":"pop","curve":true,"label":{"en":"COLLABORATE","es":"COLABORA","fr":"COLLABORE"},"text":{"en":"With other SCHOOLS.","es":"Con otras ESCUELAS.","fr":"Avec d’autres ÉCOLES."}},
  {"id":"community","start":48.7,"end":51.5,"box":[22,80,56,8],"motion":"pop","curve":true,"label":{"en":"CONSTRUCT","es":"CONSTRUYE","fr":"CONSTRUIS"},"text":{"en":"A common SPACE.","es":"Un ESPACIO común.","fr":"Un ESPACE commun."}},
  {"id":"line-8","start":51.5,"end":55.4,"box":[22,80,56,10],"motion":"pop","curve":true,"label":{"en":"CREATE","es":"CREA","fr":"CRÉE"},"text":{"en":"A \"pop-up\" EXPERIENCE!","es":"¡Una EXPERIENCIA \"pop-up\"!","fr":"Une EXPÉRIENCE éphémère !"}},
  {"id":"line-9","start":55.4,"end":56.6,"box":[22,80,56,8],"motion":"write","curve":true,"label":{"en":"MAYBE...","es":"QUIZÁS...","fr":"PEUT-ÊTRE..."},"text":{"en":"","es":"","fr":""}},
  {"id":"proud","start":56.6,"end":58.7,"box":[24,85,52,-4],"motion":"pop","curve":true,"size":0.84,"label":{"en":"OFFER","es":"OFRECE","fr":"OFFRE"},"text":{"en":"A new SERVICE.","es":"Un SERVICIO nuevo.","fr":"Un nouveau SERVICE."}},
  {"id":"line-5","start":58.7,"end":62.5,"box":[24,85,52,-4],"motion":"pop","curve":true,"behind":true,"label":{"en":"INVENT","es":"INVENTA","fr":"INVENTE"},"text":{"en":"A new SYSTEM.","es":"Un SISTEMA nuevo.","fr":"Un nouveau SYSTÈME."}},
  {"id":"join","start":62.5,"end":65,"box":[24,55,52,22],"motion":"pop","curve":true,"label":{"en":"FIND YOUR VOICE","es":"ENCUENTRA TU VOZ","fr":"TROUVE TA VOIX"},"text":{"en":"BUILD a PORTFOLIO!","es":"¡ARMA tu PORTAFOLIO!","fr":"BÂTIS ton PORTFOLIO !"}},
  {"id":"line-7","start":64.9,"end":67.2,"box":[20,40,60,97],"motion":"pop","curve":true,"ground":[22.7,7],"oneLine":false,"behind":true,"label":{"en":"GET RECOGNIZED","es":"QUE RECONOZCAN","fr":"FAIS RECONNAÎTRE"},"text":{"en":"FOR WHAT YOU DO!","es":"¡LO QUE HACES!","fr":"TON TRAVAIL !"}},
  {"id":"closing","start":66.5,"end":70.3,"box":[16,12,68,73],"motion":"pop","curve":false,"behind":true,"size":1.15,"label":{"en":"THIS IS","es":"ESTO ES","fr":"C’EST"},"text":{"en":"DISCOVERY + ACTION","es":"DISCOVERY + ACTION","fr":"DISCOVERY + ACTION"}},
];
