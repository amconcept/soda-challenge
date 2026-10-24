"use client";

import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import Bubbles from "./Bubbles";
import Ask from "./Ask";
import Schedule from "./Schedule";
import SiteActions from "./SiteActions";
import PromptDraw from "./PromptDraw";
import StudentBoards from "./StudentBoards";
import { useLanguage } from "./LanguageProvider";
import "./brief.css";

const criteriaAsset = (file: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/criteria/${file}?v=8`;

/* English files are the original vectors. ES and FR keep the marks and swap the wording. */
const CRITERIA_CARDS = [
  {
    id: "soda",
    file: "soda.svg",
    alt: {
      en: "SOD+A criteria. Embrace iteration: Show that you can test, change, and improve your work based on what you learn as you make. Design for circularity (people + planet): Show how you are learning with others and that your design choices and methods minimize waste (reuse, repair, regenerate, or redesign).",
      es: "Criterios SOD+A. Acepta la iteración: Demuestra que puedes probar, cambiar y mejorar tu trabajo según lo que aprendes mientras haces. Diseña para la circularidad (personas + planeta): Muestra cómo aprendes con otras personas y que tus decisiones y métodos de diseño reducen el desperdicio (reutilizar, reparar, regenerar o rediseñar).",
      fr: "Critères SOD+A. Adoptez l'itération : Montrez que vous pouvez tester, changer et améliorer votre travail à partir de ce que vous apprenez en faisant. Concevez pour la circularité (personnes + planète) : Montrez comment vous apprenez avec les autres et que vos choix et méthodes de design réduisent le gaspillage (réutiliser, réparer, régénérer ou reconcevoir).",
    },
  },
  {
    id: "bcn",
    file: "bcn.svg",
    alt: {
      en: "Fab Lab BCN criteria. Fab Labs as research: Show how you combined different technologies and digital fabrication tools in prototyping ideas that can be shared digitally. Fully shareable + scalable: Publish relevant files and details so others can remake, learn from, and adapt your work.",
      es: "Criterios Fab Lab BCN. Los Fab Labs como investigación: Muestra cómo combinaste distintas tecnologías y herramientas de fabricación digital al prototipar ideas que se pueden compartir digitalmente. Totalmente compartible + escalable: Publica los archivos y detalles relevantes para que otras personas puedan rehacer, aprender y adaptar tu trabajo.",
      fr: "Critères Fab Lab BCN. Les Fab Labs comme recherche : Montrez comment vous avez combiné différentes technologies et outils de fabrication numérique pour prototyper des idées partageables numériquement. Entièrement partageable + évolutif : Publiez les fichiers et détails utiles pour que d'autres puissent refaire, apprendre et adapter votre travail.",
    },
  },
  {
    id: "ocad",
    file: "ocad.svg",
    alt: {
      en: "OCAD University criteria. Make it personal: Provide enough evidence about your creative learning process in order to reveal your unique voice as a maker / designer / artist. Clarity of expression: Provide compelling documentation (photos, video, artwork) and captions that show key relevant and creative decisions.",
      es: "Criterios OCAD University. Hazlo personal: Aporta evidencia suficiente de tu proceso de aprendizaje creativo para revelar tu voz única como maker / diseñador/a / artista. Claridad de expresión: Ofrece documentación convincente (fotos, video, obra) y pies que muestren las decisiones relevantes y creativas.",
      fr: "Critères OCAD University. Rendez-le personnel : Fournissez assez de traces de votre processus d'apprentissage créatif pour révéler votre voix unique de maker / designer / artiste. Clarté d'expression : Fournissez une documentation convaincante (photos, vidéo, œuvre) et des légendes qui montrent les décisions importantes et créatives.",
    },
  },
  {
    id: "lcc",
    file: "lcc.svg",
    alt: {
      en: "LCC Fab Lab criteria. Experiment to get ideas: Pick a few things to try and tinker with them. Show several simple ideas before locking into one. Learning through constraints: Show how your ideas evolve as a result of the creative constraints that are informing your work.",
      es: "Criterios LCC Fab Lab. Experimenta para obtener ideas: Elige algunas cosas para probar y trastear. Muestra varias ideas simples antes de fijarte en una. Aprender con restricciones: Muestra cómo evolucionan tus ideas como resultado de las restricciones creativas que dan forma a tu trabajo.",
      fr: "Critères LCC Fab Lab. Expérimentez pour trouver des idées : Choisissez quelques choses à essayer et à bricoler. Montrez plusieurs idées simples avant d'en choisir une. Apprendre par les contraintes : Montrez comment vos idées évoluent à la suite des contraintes créatives qui nourrissent votre travail.",
    },
  },
];

type FoldId = "participate" | "who" | "why" | "criteria" | "schedule" | "ask";

const FOLDS: FoldId[] = ["participate", "who", "why", "criteria", "schedule", "ask"];

/**
 * One middle section. The row shows the section title, such as How to Participate.
 * The longer heading sits inside, with the copy and its photo pile.
 * Opening one closes the others. See DESIGN_DECISIONS.md.
 */
function Fold({
  id,
  kicker,
  title,
  open,
  onToggle,
  children,
}: {
  id: FoldId;
  kicker: string;
  title?: string;
  open: boolean;
  onToggle: (id: FoldId) => void;
  children: ReactNode;
}) {
  const panelId = `${id}-panel`;
  return (
    <section id={id} className={open ? "brief-section brief-fold is-open" : "brief-section brief-fold"}>
      <h2>
        <button
          type="button"
          className="brief-fold-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => onToggle(id)}
        >
          <span className="brief-fold-label">{kicker}</span>
          <span className="brief-fold-mark" aria-hidden="true" />
        </button>
      </h2>
      <div id={panelId} className="brief-fold-panel" hidden={!open}>
        {title ? <p className="brief-fold-title">{title}</p> : null}
        {children}
      </div>
    </section>
  );
}

/** New order each visit. Positions and sizes stay in the sticker layout. */
function shufflePhotos(images: string[]) {
  const next = [...images];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export default function Brief({ images }: { images: string[] }) {
  const { t, locale } = useLanguage();
  const [photos, setPhotos] = useState(images);
  const [openFold, setOpenFold] = useState<FoldId | null>(null);

  useLayoutEffect(() => {
    setPhotos(shufflePhotos(images));
  }, [images]);

  function toggleFold(id: FoldId) {
    setOpenFold((current) => (current === id ? null : id));
  }

  // A link to a closed section, from the page or the menu, opens that section.
  useEffect(() => {
    function openFrom(id: string) {
      if (FOLDS.includes(id as FoldId)) setOpenFold(id as FoldId);
    }
    function fromHash() {
      openFrom(window.location.hash.slice(1));
    }
    function fromMenu(event: Event) {
      const id = (event as CustomEvent<string>).detail;
      if (id) openFrom(id);
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("soda-fold", fromMenu);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener("soda-fold", fromMenu);
    };
  }, []);

  // Photo piles measure themselves on scroll. Opening a fold is not a scroll.
  useEffect(() => {
    if (!openFold) return;
    window.dispatchEvent(new Event("resize"));
  }, [openFold]);

  return (
    <article className="brief">
      <section id="intro" className="brief-section brief-section--intro">
        <p className="brief-kicker">{t.soda.kicker}</p>
        <h2>{t.soda.title}</h2>
        <p>{t.soda.body}</p>
        <p className="brief-quote">{t.soda.quote}</p>

        {/* The school crest band is gone. The arrow still leads to the challenge. See DESIGN_DECISIONS.md. */}
        <a href="#challenge" className="scroll-cue" aria-label={t.scrollMore}>
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <polyline points="2 2 11 12 20 2" />
          </svg>
        </a>
      </section>

      {/* A photo pile between each section. Slots pick different photos. See DESIGN_DECISIONS.md. */}
      <Bubbles images={photos} variant="b" slot={0} />

      {/* The draw sits under the first photo pile. See DESIGN_DECISIONS.md. */}
      <PromptDraw />

      <section id="challenge" className="brief-section">
        <p className="brief-kicker">{t.challenge.kicker}</p>
        <h2>{t.challenge.title}</h2>
        {/* Opening paragraph, no lead-in. Discover and Act keep a bold lead-in. See DESIGN_DECISIONS.md. */}
        <p>{t.challenge.intro}</p>
        <div className="challenge-beats">
          {t.challenge.beats.map((beat) => (
            <div key={beat.title}>
              <p className="challenge-step-title">{beat.title}</p>
              <p>{beat.detail}</p>
            </div>
          ))}
        </div>
        {/* "criteria" links to the criteria section. See DESIGN_DECISIONS.md. */}
        <p>
          {t.challenge.closeBefore}
          <a className="challenge-close-link" href="#criteria" onClick={() => setOpenFold("criteria")}>{t.challenge.closeLink}</a>
          {t.challenge.closeAfter}
        </p>
      </section>

      {/* This pile stays out. The challenge above it stays open. */}
      <Bubbles images={photos} variant="c" slot={1} />

      <Fold
        id="participate"
        kicker={t.involve.kicker}
        title={t.involve.title}
        open={openFold === "participate"}
        onToggle={toggleFold}
      >
        <div className="involve">
          <p>{t.involve.pilot}</p>
          <p>{t.involve.body}</p>
          {/* Last year's boards, one row, opened on request. See DESIGN_DECISIONS.md. */}
          <StudentBoards />
          {/* At a glance replaces the cost paragraph. Palette is local to this block. See DESIGN_DECISIONS.md. */}
          <div className="glance">
            <div className="glance-lead">
              <p className="glance-heading">{t.glance.leadTitle}</p>
              <p>{t.glance.lead}</p>
            </div>
            <div className="glance-rows">
              <div className="glance-row">
                <p className="glance-heading">{t.glance.fitTitle}</p>
                <p>{t.glance.fit}</p>
              </div>
              <div className="glance-row">
                <p className="glance-heading">{t.glance.timelineTitle}</p>
                <p>{t.glance.timeline}</p>
              </div>
              <div className="glance-row">
                <p className="glance-heading">{t.glance.whoTitle}</p>
                <p>{t.glance.who}</p>
              </div>
            </div>
            <div className="glance-split">
              <div className="glance-bring">
                <p className="glance-heading">{t.glance.bringTitle}</p>
                <p>{t.glance.bring}</p>
              </div>
              <div className="glance-provides">
                <p className="glance-heading">{t.glance.providesTitle}</p>
                <p>{t.glance.provides}</p>
              </div>
            </div>
          </div>
        </div>
        {/* The pile that followed this section. It opens with the copy. */}
        <Bubbles images={photos} variant="a" slot={2} />
      </Fold>

      <Fold
        id="who"
        kicker={t.who.kicker}
        title={t.who.title}
        open={openFold === "who"}
        onToggle={toggleFold}
      >
        <p>{t.who.body}</p>
        <Bubbles images={photos} variant="b" slot={3} />
      </Fold>

      <Fold
        id="why"
        kicker={t.why.kicker}
        title={t.why.title}
        open={openFold === "why"}
        onToggle={toggleFold}
      >
        <p>{t.why.p1}</p>
        <p>{t.why.p2}</p>
        <Bubbles images={photos} variant="c" slot={4} />
      </Fold>

      <Fold
        id="criteria"
        kicker={t.criteria.kicker}
        title={t.criteria.title}
        open={openFold === "criteria"}
        onToggle={toggleFold}
      >
        <p>{t.criteria.intro}</p>
        <div className="criteria-grid">
          {CRITERIA_CARDS.map((card) => (
            <article key={card.id} className="criteria-card">
              <img
                src={criteriaAsset(
                  locale === "en" ? card.file : `${locale}/${card.file}`,
                )}
                alt={card.alt[locale]}
              />
            </article>
          ))}
        </div>
        <Bubbles images={photos} variant="a" slot={5} />
      </Fold>

      <Fold
        id="schedule"
        kicker={t.schedule.kicker}
        title={t.schedule.title}
        open={openFold === "schedule"}
        onToggle={toggleFold}
      >
        <Schedule />
        <Bubbles images={photos} variant="b" slot={6} />
      </Fold>

      <Fold
        id="ask"
        kicker={t.ask.kicker}
        open={openFold === "ask"}
        onToggle={toggleFold}
      >
        <Ask />
      </Fold>

      <SiteActions placement="footer" />
    </article>
  );
}
