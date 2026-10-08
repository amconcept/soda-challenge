# Design decisions

Choices that were not spelled out in the copy, logged instead of decided in silence.

## 2026-10-05

### Become a Partner circle

The cream circle is back in the hero, in the same row as the Fab Lab Barcelona, OCAD, and LCC logos. It reads “Become a Partner,” set in small capitals so the words fit the circle, the same treatment as before.

The circle is not a link. Partners are invited by email, so clicking it goes nowhere.

### Photo pile: the small disc is now the largest

Each photo pile had one large circle, two medium ones, and one small one. The small one is now larger than the large one, and it sits behind the others so the smaller photos stay visible. The photo band is taller so the bigger circle has room.

The large circles were then covering most of each other. They are spread apart so each smaller photo only crosses the edge of the largest one. The pile is wider to make room for that. On a phone, one of the medium circles is still hidden so three circles fit.

People who ask the browser to skip animation see the circle and the logos already in place. The fade-in is only for the animated visit.

### Challenge section sits after Schools of Discovery + Action

Participating schools & labs stays directly under What is SOD+A, with no photo pile between them. “What is the challenge?” comes after that pair. A photo pile sits between each section after that: before the challenge, before How to Participate, before Who, before Why, before the criteria, before the schedule, and before the bigger picture.

The down-arrow under the schools lockup goes to the challenge, the next section. It used to go to Who.

The challenge section now ends with “Scroll to the criteria to see what to aim for...” The word “criteria” is a link to the criteria section. The square brackets in the request were the instruction to make that link, so they are not shown on the page. The three dots at the end are kept as written.

The link lands a little below the top of the screen so the heading is not hidden under the language switch and menu.

### Intro down-arrow no longer jumps to the challenge

Superseded. The arrow now sits under the schools lockup and goes to the challenge, which is the next section again.

### Photo band between the old challenge section and Who

Removing the old challenge section would have left two photo piles in a row. That in-between photo band is no longer shown. The photos themselves are still in the shared pool. Ask before deleting any image files.

### Four steps, no existing step style

Superseded. The numbered list was replaced by three unnumbered beats: Imagine, Experiment, and Act. See the later note.

### Tagline size

Superseded. “Join a local group. Share a global process.” was removed when the challenge body was rewritten.

### Challenge body is three unnumbered beats

The section stays where it was, directly above the criteria cards. The small heading is still “What is the challenge?” which the page shows in capitals. The large line is now “See how far you can push an idea.” The tagline and the four numbered steps are gone.

The opening paragraph has no lead-in. It sits directly under “See how far you can push an idea,” in the same type as the other body paragraphs. It now starts “It can be exciting to think of something you'd love to make.” Discover and Act keep their lead-ins, and those two words are bold. The paragraphs under them are unchanged. Discover still uses the word “experiment.”

The opening paragraph also says “That is what SOD+A stands for, moving from discovery to action.” The What is SOD+A section still says SOD+A stands for Schools of Discovery + Action. Both sentences are left in place.

French and Spanish for the new opening sentence are machine drafts and need a human review. The rest of those two translations was already a draft.

“un twist” and “consignes tirées au hasard” in French, and “un giro inesperado” and “consignas al azar” in Spanish, are starting points for a native speaker. They are marked in the code.

The Imagine lead-in is gone. That text is now the opening paragraph, with the new first sentence, and it has no bold label.

“Schools of Disocovery and Action” was written with Disocovery. That spelling does not appear anywhere else. The name on the page is “Schools of Discovery and Action.” The word “and” is kept, rather than the plus sign used in the logo. Say if Disocovery was intentional.

### Redundancy left in place on purpose

Asked, not deleted:

- “share what you learn” in Discover, and the “Learn across borders” band, both talk about sharing work with other people.
- “Document it for the world to see” in Act, “showcase your efforts” under Participating Schools & Labs, and the “document their creations and attempts on our global board” sentence in How to Participate all ask students to show their work.
- “A willingness to share your process” under Participating Schools & Labs, and “share what you learn” in Discover, both ask students to share how they worked.
- “Who can join” and “Who is it for?” both name ages 14 to 18 and schools or makerspaces.
- “Who can join” says no Fab Lab is needed. Participating schools & labs, and Who is it for?, still name Fab Labs as a place students take part.

### SOD+A provides, opening sentence

“The materials facilitators need to get started, including prompts, criteria, best practices, and four key dates” is now “The structure facilitators need to get started, including prompts, criteria, best practices, and four key dates for deliverables and feedback.” The global-board sentence and “No cost to join this pilot year” are unchanged. French and Spanish for the new opening are machine drafts.

“Four key dates” also appears in the Timeline row. Both lines are left in place.

### Last year's boards, under Connecting Students to the Challenge

Four boards from last year sit after the two paragraphs and before the colored blocks. They stay in one sideways row: Bennett, Sofia, Theo, and Abby. Choosing a name opens that board under the row. Choosing it again, or pressing Escape, closes it.

The heading “From last year” was not supplied. French and Spanish for that heading are machine drafts. Theo’s board is labeled “THEO PRE-U” on the image. The row uses “Theo”, the same first-name style as the others.

### Map: hide city names, add Monterey, join every dot

The city names are still in the page. The row of name buttons under the map, and the name that used to appear when a dot was selected, are hidden. The dots stay.

Monterey, Mexico is a new dot. It is written “Monterey”, as given. The usual spelling of that city is Monterrey. Say if that should change.

The dotted lines are curves, bowed north like flight routes. They run Mexico to Calgary, Mexico to Barcelona, Calgary to Montreal, Calgary to Barcelona, Toronto to Mexico, and Toronto to Barcelona.

### Participating Schools & Labs replaces You bring

The butter column heading is now “Participating Schools & Labs”. The paragraph starts “Include a facilitator who runs the group” instead of “A facilitator who runs the group.” The rest of that paragraph is unchanged. French and Spanish for the new heading and the new first words are machine drafts.

The logo band higher on the page is still labeled “Participating schools & labs”. The same name now appears twice. Both labels are left in place.

How to Participate still says participating schools and labs have a facilitator. That sentence and this new opening are left in place.

### You bring, last two sentences

“A documented process” is now “A willingness to share your process.” “Time to iterate, respond to feedback, and finish” is now “Investment of enough time to iterate, respond to feedback, and showcase your efforts.” The first three sentences are unchanged. French and Spanish for the changed sentences are machine drafts.

### Bigger Picture, second paragraph only

The first Bigger Picture paragraph is unchanged. The second now says the idea was tested with two schools and two partners, and that students got excited to experiment, iterate, share, and act. French and Spanish are machine drafts. The Spanish draft still uses the English word “partners”, which the previous draft already used.

The earlier note under the challenge rewrite is the current list. The old overlap between “Learn across borders” and step 3 is gone because that step was replaced.

### French and Spanish are machine drafts

Every new or rewritten French and Spanish string in `lib/copy.ts` is marked with the comment “Machine draft, needs human review.” That includes the merged challenge section, the How to Participate pilot line and closing paragraph, and both Bigger Picture paragraphs. Do not treat them as final.

### Oxford comma is English only

The English How to Participate sentence now reads “iterate, experiment, share, and document”. French and Spanish drafts keep their usual list style (“partager et documenter”, “compartir y documentar”) rather than forcing an English comma before the last item.

### Criteria title has no end punctuation

“Show us what you can do” no longer ends with a question mark. Spanish drops the opening ¿ as well. French drops the question mark and the space that French typography puts before it. The criteria cards are unchanged.

### Why: “dive deeper”

In the Why paragraph, “you’ll dive deep into” is now “you’ll dive deeper into”. Nothing else in that sentence changed. French draft: “vous irez plus au fond”. Spanish draft: “profundizarás más”. Both still need human review.

### Why skills sentence, and a shorter challenge close

The Why paragraph now ends with “the many skills the world needs, including creativity, curiosity, resilience, judgment, and collaboration.” The sentences before that ending are unchanged. The challenge section’s last line is only “The criteria below show what to aim for.” The portfolio sentence that used to share that line was removed because the new copy replaces it. Why still has its own portfolio paragraph. That overlap was already flagged and is left in place.

### At a glance replaces the cost paragraph

The long “Right now there is no cost to joining…” paragraph is gone. Its only remaining cost line is the last sentence of “SOD+A provides”: “No cost to join this pilot year.” The same is true in French and Spanish. No other cost sentence is on the page.

The block has three parts: a mint lead band, three rows on lavender with a peach divider, and two columns (butter for “Participating Schools & Labs”, sky for “SOD+A provides”). On a narrow screen the columns stack, with Participating Schools & Labs first.

Baloo 2 and Nunito are not loaded anywhere on the site. The page type is the existing monospace. Loading two new fonts for one block would make it look pasted in, so this block uses the same type as the rest of the page. Headings are the same face, a little heavier, with no colon added.

Lavender, mint, peach, sky, and butter were not existing color names in the stylesheet. They are used only inside this block, as pale tints, so they can sit on the scrolling page wash. The peach line between the three rows is a little stronger than the other tints so it stays visible on the lavender.

### Redundancy left in place on purpose

The earlier note under the challenge rewrite is the current list. The old overlap between “Learn across borders” and step 3 is gone because that step was replaced.

## 2026-10-06

### Hero line follows the language

The three words that draw across the hero, Creativity, Curiosity, and Collaboration, now switch with the language. Spanish is Creatividad, Curiosidad, Colaboración. French is Créativité, Curiosité, Collaboration. The dots between the words stay as they are. The English spacing is unchanged. A longer word gets a wider slot so it does not collide with the dots.

### Translations lined up with the English

French and Spanish lines that said something different from the English were brought back in line. “Facilitator” is named again under Participating Schools & Labs. French “SOD+A provides” says structure and facilitators, and uses consignes for prompts. The criteria heading is a request again: show us what you can do. “Learn across borders” uses “across,” and the Spanish sentence addresses “you” all the way through. “Co-curricular” stays co-curricular rather than becoming an after-school activity. “What you’re curious about” stays about curiosity. Spanish “talents” is plural. The French thank-you says we will be back in touch. Spanish “a twist” no longer adds “unexpected.” On the French criteria cards, “Design for circularity” and “Experiment to get ideas” are requests, matching the English. The read-aloud text on the cards now includes the lines already printed on the cards.

Still waiting on a word choice: the Spanish word for partner, the French word for twist, and “scalable” plus “informing your work” on the criteria cards.

The choices are now in. Spanish “partner” is “aliado”: the circle reads “Hazte aliado,” and the bigger picture says “dos aliados” and “nuestros aliados.” French “a twist” is “un détour.” The French Fab Lab card says “évolutif” for scalable. The LCC cards use the supplied sentences about constraints nourishing the work in French and giving shape to the work in Spanish.

### How it fits, the timeline, and who it is for

How it fits keeps the co-curricular, class, or collaboration sentence. A last sentence was added: projects can build on work students are already doing for other school initiatives. The “not another club” line was left off, because the row already offers a co-curricular activity.

The Timeline row now names what the four dates include: deadlines, showcases, and group meetups. The sentence about smaller shared moments stays.

Who is it for keeps its one list of fields. “Engineering” is now “creative engineering,” and “media” sits after “digital and product design.” A second sentence listing design, media, and creative engineering was not added, because design and engineering were already in the list.

French and Spanish for these three edits are machine drafts. French “présentations” and Spanish “muestras” stand in for showcases.

### Timeline cells can carry bullets and bold

A detail cell keeps its line breaks. When every line starts with a bullet character, including a cell with only one line, the timeline shows a list. Words wrapped in asterisks, in a title or a detail, as in `*Discovery Experiments*`, are bold. The timeline typeface draws a medium weight as regular, so those marked words use a true bold. The bold button in the spreadsheet does not come through the public sheet feed, so the asterisks are the mark that does.

### A longer read under At a Glance

Tried, then removed. Who and Why were put behind buttons under At a Glance. That made the page feel shorter, but pressing a button did not feel clear, and opening one section while the other stayed open made it seem like nothing had happened. Who and Why are sections again, with a photo pile between them and a photo pile before the criteria.
