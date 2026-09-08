"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import SiteActions from "./SiteActions";
import { useLanguage } from "./LanguageProvider";
import { PARTNER_EMAIL } from "@/lib/contact";
import "./join.css";

function Field({
  id,
  label,
  type = "text",
  required = true,
  multiline = false,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  return (
    <label className="join-field" htmlFor={id}>
      <span>{label}</span>
      {multiline ? (
        <textarea id={id} name={id} rows={4} required={required} />
      ) : (
        <input id={id} name={id} type={type} required={required} />
      )}
    </label>
  );
}

export default function PartnerPage() {
  const { t } = useLanguage();
  const form = t.partnerForm;
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines: string[] = [];
    data.forEach((value, key) => {
      lines.push(`${key}: ${String(value).trim()}`);
    });

    const subject = encodeURIComponent("SOD+A Challenge — partner");
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${PARTNER_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <main className="join-page">
      <SiteActions placement="nav" />

      <article className="join-sheet">
        <Link href="/" className="join-back">
          <svg width="12" height="18" viewBox="0 0 12 18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <polyline points="11 1 1 9 11 17" />
          </svg>
          {form.back}
        </Link>
        <p className="join-kicker">{form.title}</p>
        <h1>{form.intro}</h1>

        {!sent ? (
          <form className="join-form" onSubmit={onSubmit}>
            <Field id="name" label={form.name} />
            <Field id="email" label={form.email} type="email" />
            <Field id="orgName" label={form.orgName} />
            <Field id="role" label={form.role} />
            <Field id="location" label={form.location} />
            <Field id="offer" label={form.offer} multiline />
            <Field id="questions" label={form.questions} multiline required={false} />
            <button type="submit" className="site-btn site-btn--fill">
              {form.submit}
            </button>
          </form>
        ) : (
          <p className="join-thanks">{form.thanks}</p>
        )}
      </article>
    </main>
  );
}
