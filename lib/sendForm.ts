import { FORM_INBOX } from "./contact";

export class FormSendError extends Error {
  readonly kind: "activate" | "error";

  constructor(kind: "activate" | "error", message: string) {
    super(message);
    this.kind = kind;
  }
}

/** Posts the challenge forms through FormSubmit so they arrive in FORM_INBOX. */
export async function sendChallengeForm(
  fields: Record<string, string>,
  subject: string,
) {
  const payload: Record<string, string> = {
    ...fields,
    _subject: subject,
    _template: "box",
    _captcha: "false",
  };
  if (fields.email) payload._replyto = fields.email;

  const response = await fetch(`https://formsubmit.co/ajax/${FORM_INBOX}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => null)) as
    | { success?: boolean | string; message?: string }
    | null;

  const ok = result?.success === true || result?.success === "true";
  if (ok) return;

  const message = result?.message || "Form send failed";
  if (/activation/i.test(message)) {
    throw new FormSendError("activate", message);
  }
  throw new FormSendError("error", message);
}

export function fieldsFromForm(form: HTMLFormElement, extra: Record<string, string> = {}) {
  const fields = { ...extra };
  new FormData(form).forEach((value, key) => {
    if (key.startsWith("_")) return;
    fields[key] = String(value).trim();
  });
  return fields;
}
