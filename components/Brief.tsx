"use client";

import Bubbles from "./Bubbles";
import SiteActions from "./SiteActions";
import { useLanguage } from "./LanguageProvider";
import "./brief.css";

const partnerAsset = (file: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/partners/${file}`;

export default function Brief() {
  const { t } = useLanguage();

  return (
    <article className="brief">
      <section id="intro" className="brief-section brief-section--intro">
        <p className="brief-kicker">{t.soda.kicker}</p>
        <h2>{t.soda.title}</h2>
        <p>{t.soda.body}</p>
        <p className="brief-quote">{t.soda.quote}</p>

        <div className="schools" id="schools">
          <p className="brief-kicker">{t.schools.kicker}</p>
          <div className="schools-row">
            <span className="school-sticker">
              <img src={partnerAsset("soda-18.svg")} alt="LCC Fab Lab" />
            </span>
            <span className="school-invite" aria-label={t.join}>
              <span>{t.joinLine1}</span>
              <span>{t.joinLine2}</span>
            </span>
          </div>
        </div>

        <a href="#challenge" className="scroll-cue" aria-label={t.scrollMore}>
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <polyline points="2 2 11 12 20 2" />
          </svg>
        </a>
      </section>

      <Bubbles variant="b" slot={0} />

      <section id="challenge" className="brief-section">
        <p className="brief-kicker">{t.challenge.kicker}</p>
        <h2>{t.challenge.title}</h2>
        <p>{t.challenge.body}</p>
      </section>

      <Bubbles variant="c" slot={1} />

      <section className="brief-section">
        <p className="brief-kicker">{t.who.kicker}</p>
        <h2>{t.who.title}</h2>
        <p>{t.who.body}</p>
      </section>

      <Bubbles variant="a" slot={2} />

      <section className="brief-section">
        <p className="brief-kicker">{t.why.kicker}</p>
        <h2>{t.why.title}</h2>
        <p>{t.why.p1}</p>
        <p>{t.why.p2}</p>
      </section>

      <Bubbles variant="b" slot={3} />

      <section className="brief-section">
        <p className="brief-kicker">{t.how.kicker}</p>
        <h2>{t.how.title}</h2>
        <p>{t.how.p1}</p>
        <p>{t.how.p2}</p>
        <p>{t.how.p3}</p>
        <p>{t.how.p4}</p>
      </section>

      <Bubbles variant="c" slot={4} />

      <SiteActions placement="footer" />
    </article>
  );
}
