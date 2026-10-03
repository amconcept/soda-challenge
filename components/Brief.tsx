"use client";

import { useLayoutEffect, useState } from "react";
import Link from "next/link";
import Bubbles from "./Bubbles";
import Ask from "./Ask";
import Schedule from "./Schedule";
import SiteActions from "./SiteActions";
import { useLanguage } from "./LanguageProvider";
import { JOIN_PATH } from "@/lib/contact";
import "./brief.css";

const partnerAsset = (file: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/partners/${file}`;

const criteriaAsset = (file: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/criteria/${file}?v=6`;

/* English files are the original vectors. ES and FR keep the marks and swap the wording. */
const CRITERIA_CARDS = [
  {
    id: "soda",
    file: "soda.svg",
    alt: {
      en: "SOD+A criteria. Embrace iteration: Show that you can test, change, and improve your work based on what you learn as you make. Design for circularity (people + planet): Show how you are learning with others and that your design choices and methods minimize waste (reuse, repair, regenerate, or redesign).",
      es: "Criterios SOD+A. Acepta la iteración: Demuestra que puedes probar, cambiar y mejorar tu trabajo según lo que aprendes mientras haces. Diseña para la circularidad (personas + planeta): Muestra cómo aprendes con otras personas y que tus decisiones y métodos de diseño reducen el desperdicio.",
      fr: "Critères SOD+A. Adoptez l'itération : Montrez que vous pouvez tester, changer et améliorer votre travail à partir de ce que vous apprenez en faisant. Concevoir pour la circularité (personnes + planète) : Montrez comment vous apprenez avec les autres et que vos choix et méthodes de design réduisent le gaspillage.",
    },
  },
  {
    id: "bcn",
    file: "bcn.svg",
    alt: {
      en: "Fab Lab BCN criteria. Fab Labs as research: Show how you combined different technologies and digital fabrication tools in prototyping ideas that can be shared digitally. Fully shareable + scalable: Publish relevant files and details so others can remake, learn from, and adapt your work.",
      es: "Criterios Fab Lab BCN. Los Fab Labs como investigación: Muestra cómo combinaste distintas tecnologías y herramientas de fabricación digital. Totalmente compartible + escalable: Publica los archivos y detalles relevantes para que otras personas puedan rehacer, aprender y adaptar tu trabajo.",
      fr: "Critères Fab Lab BCN. Les Fab Labs comme recherche : Montrez comment vous avez combiné différentes technologies et outils de fabrication numérique. Entièrement partageable + adaptable : Publiez les fichiers et détails utiles pour que d'autres puissent refaire, apprendre et adapter votre travail.",
    },
  },
  {
    id: "ocad",
    file: "ocad.svg",
    alt: {
      en: "OCAD University criteria. Make it personal: Provide enough evidence about your creative learning process in order to reveal your unique voice as a maker / designer / artist. Clarity of expression: Provide compelling documentation (photos, video, artwork) and captions that show key relevant and creative decisions.",
      es: "Criterios OCAD University. Hazlo personal: Aporta evidencia suficiente de tu proceso de aprendizaje creativo para revelar tu voz única. Claridad de expresión: Ofrece documentación convincente y pies que muestren las decisiones relevantes y creativas.",
      fr: "Critères OCAD University. Rendez-le personnel : Fournissez assez de traces de votre processus d'apprentissage créatif pour révéler votre voix unique. Clarté d'expression : Fournissez une documentation convaincante et des légendes qui montrent les décisions importantes et créatives.",
    },
  },
  {
    id: "lcc",
    file: "lcc.svg",
    alt: {
      en: "LCC Fab Lab criteria. Experiment to get ideas: Pick a few things to try and tinker with them. Show several simple ideas before locking into one. Learning through constraints: Show how your ideas evolve as a result of the creative constraints that are informing your work.",
      es: "Criterios LCC Fab Lab. Experimenta para obtener ideas: Elige algunas cosas para probar y trastear. Muestra varias ideas simples antes de fijarte en una. Aprender con restricciones: Muestra cómo evolucionan tus ideas por las restricciones creativas que orientan tu trabajo.",
      fr: "Critères LCC Fab Lab. Expérimenter pour trouver des idées : Choisissez quelques choses à essayer et à bricoler. Montrez plusieurs idées simples avant d'en choisir une. Apprendre par les contraintes : Montrez comment vos idées évoluent grâce aux contraintes créatives qui orientent votre travail.",
    },
  },
];

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

  useLayoutEffect(() => {
    setPhotos(shufflePhotos(images));
  }, [images]);

  return (
    <article className="brief">
      <section id="intro" className="brief-section brief-section--intro">
        <p className="brief-kicker">{t.soda.kicker}</p>
        <h2>{t.soda.title}</h2>
        <p>{t.soda.body}</p>
        <p className="brief-quote">{t.soda.quote}</p>

        <div className="schools" id="schools">
          <p className="schools-line">
            <span className="schools-rule" aria-hidden="true" />
            <span>{t.schools.kicker}</span>
            <span className="schools-rule" aria-hidden="true" />
          </p>
          <div className="schools-row">
            <a
              className="school-sticker"
              href="https://www.lcc.ca"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lower Canada College"
            >
              <img src={partnerAsset("lcc-crest.png")} alt="Lower Canada College" />
            </a>
            <Link href={JOIN_PATH} className="school-invite" aria-label={t.join}>
              <span>{t.joinLine1}</span>
              <span>{t.joinLine2}</span>
            </Link>
          </div>
          <div className="schools-rule schools-rule--end" aria-hidden="true" />
        </div>

        <a href="#challenge" className="scroll-cue" aria-label={t.scrollMore}>
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <polyline points="2 2 11 12 20 2" />
          </svg>
        </a>
      </section>

      <Bubbles images={photos} variant="b" slot={0} />

      <section id="challenge" className="brief-section">
        <p className="brief-kicker">{t.challenge.kicker}</p>
        <h2>{t.challenge.title}</h2>
        <p>{t.challenge.body}</p>
      </section>

      <Bubbles images={photos} variant="c" slot={1} />

      <section className="brief-section">
        <p className="brief-kicker">{t.who.kicker}</p>
        <h2>{t.who.title}</h2>
        <p>{t.who.body}</p>
      </section>

      <Bubbles images={photos} variant="a" slot={2} />

      <section className="brief-section">
        <p className="brief-kicker">{t.why.kicker}</p>
        <h2>{t.why.title}</h2>
        <p>{t.why.p1}</p>
        <p>{t.why.p2}</p>
      </section>

      <Bubbles images={photos} variant="b" slot={3} />

      <section className="brief-section">
        <p className="brief-kicker">{t.how.kicker}</p>
        <h2>{t.how.title}</h2>
        <p>{t.how.p1}</p>
        <p>{t.how.p2}</p>
        <p>{t.how.p3}</p>
        <p>{t.how.p4}</p>
      </section>

      <Bubbles images={photos} variant="c" slot={4} />

      <section id="criteria" className="brief-section">
        <p className="brief-kicker">{t.criteria.kicker}</p>
        <h2>{t.criteria.title}</h2>
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
      </section>

      <Schedule />

      <Ask variant="main" />

      <SiteActions placement="footer" />
    </article>
  );
}
