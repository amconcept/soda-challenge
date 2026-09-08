"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import SiteActions from "./SiteActions";
import { useLanguage } from "./LanguageProvider";
import { JOIN_EMAIL } from "@/lib/contact";
import "./join.css";

type Role = "student" | "facilitator";

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
            <input id={id} name={id} type={type} required={required} min={type === "number" ? 0 : undefined} />
      )}
    </label>
  );
}

export default function JoinPage() {
  const { t } = useLanguage();
  const form = t.joinForm;
  const [role, setRole] = useState<Role | null>(null);
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!role) return;

    const data = new FormData(event.currentTarget);
    const lines = [`Role: ${role === "student" ? form.studentChoice : form.facilitatorChoice}`, ""];
    data.forEach((value, key) => {
      lines.push(`${key}: ${String(value).trim()}`);
    });

    const subject = encodeURIComponent(`SOD+A Challenge — ${role}`);
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${JOIN_EMAIL}?subject=${subject}&body=${body}`;
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

        <div className="join-roles" role="group" aria-label={form.title}>
          <button
            type="button"
            className={`join-role${role === "student" ? " join-role--on" : ""}`}
            aria-pressed={role === "student"}
            onClick={() => {
              setRole("student");
              setSent(false);
            }}
          >
            {form.studentChoice}
          </button>
          <button
            type="button"
            className={`join-role${role === "facilitator" ? " join-role--on" : ""}`}
            aria-pressed={role === "facilitator"}
            onClick={() => {
              setRole("facilitator");
              setSent(false);
            }}
          >
            {form.facilitatorChoice}
          </button>
        </div>

        {role === "student" && !sent ? (
          <form className="join-form" onSubmit={onSubmit}>
            <p className="join-note">{form.studentNote}</p>
            <Field id="name" label={form.name} />
            <Field id="age" label={form.age} />
            <Field id="schoolLevel" label={form.schoolLevel} />
            <Field id="schoolOrg" label={form.schoolOrg} />
            <Field id="email" label={form.email} type="email" />
            <Field id="guideName" label={form.guideName} />
            <Field id="guideEmail" label={form.guideEmail} type="email" />
            <Field id="interests" label={form.interests} multiline />
            <button type="submit" className="site-btn site-btn--fill">
              {form.submit}
            </button>
          </form>
        ) : null}

        {role === "facilitator" && !sent ? (
          <form className="join-form" onSubmit={onSubmit}>
            <Field id="name" label={form.name} />
            <Field id="email" label={form.email} type="email" />
            <Field id="orgName" label={form.orgName} />
            <Field id="role" label={form.role} />
            <Field id="studentAges" label={form.studentAges} />
            <Field id="facilities" label={form.facilities} multiline />
            <Field id="expertise" label={form.expertise} multiline />
            <Field id="questions" label={form.questions} multiline required={false} />
            <Field id="hours" label={form.hours} type="number" />
            <button type="submit" className="site-btn site-btn--fill">
              {form.submit}
            </button>
          </form>
        ) : null}

        {sent ? <p className="join-thanks">{form.thanks}</p> : null}
      </article>
    </main>
  );
}
