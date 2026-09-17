"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import SiteActions from "./SiteActions";
import { useLanguage } from "./LanguageProvider";
import { fieldsFromForm, FormSendError, sendChallengeForm } from "@/lib/sendForm";
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
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "activate">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!role || status === "sending") return;

    const fields = fieldsFromForm(event.currentTarget, {
      Role: role === "student" ? form.studentChoice : form.facilitatorChoice,
    });

    setStatus("sending");
    try {
      await sendChallengeForm(fields, `SOD+A Challenge — ${role}`);
      setStatus("sent");
    } catch (error) {
      setStatus(error instanceof FormSendError ? error.kind : "error");
    }
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
              setStatus("idle");
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
              setStatus("idle");
            }}
          >
            {form.facilitatorChoice}
          </button>
        </div>

        {role === "student" && status !== "sent" ? (
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
            {status === "error" || status === "activate" ? (
              <p className="join-error">{status === "activate" ? form.activate : form.error}</p>
            ) : null}
            <button type="submit" className="site-btn site-btn--fill" disabled={status === "sending"}>
              {status === "sending" ? form.sending : form.submit}
            </button>
          </form>
        ) : null}

        {role === "facilitator" && status !== "sent" ? (
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
            {status === "error" || status === "activate" ? (
              <p className="join-error">{status === "activate" ? form.activate : form.error}</p>
            ) : null}
            <button type="submit" className="site-btn site-btn--fill" disabled={status === "sending"}>
              {status === "sending" ? form.sending : form.submit}
            </button>
          </form>
        ) : null}

        {status === "sent" ? <p className="join-thanks">{form.thanks}</p> : null}
      </article>
    </main>
  );
}
