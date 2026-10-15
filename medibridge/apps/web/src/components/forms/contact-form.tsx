"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { contactMessageSchema } from "@medibridge/shared";
import { apiPost } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { getFieldErrors, type FormFieldErrors } from "./validation-errors";

type ContactResponse = { data: { reference: string } };
type ContactFields = { name: string; email: string; service: string; message: string; consent: boolean };

const initialFields: ContactFields = { name: "", email: "", service: "", message: "", consent: false };

export function ContactForm({ callbackDoctor }: { callbackDoctor?: string }) {
  const [fields, setFields] = useState<ContactFields>(() => callbackDoctor
    ? { ...initialFields, service: "Doctor Appointment", message: `I would like to request a call back about doctor profile: ${callbackDoctor}.` }
    : initialFields);
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({});
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof ContactFields>(key: K, value: ContactFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    const errorKey = key === "service" ? "subject" : key;
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[errorKey];
      if (key === "service") delete next.service;
      return next;
    });
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = contactMessageSchema.safeParse({ ...fields, subject: fields.service });
    if (!parsed.success) {
      const errors: FormFieldErrors = {};
      if (fields.name.trim().length < 2) errors.name = "Enter your name (at least 2 characters).";
      else if (fields.name.trim().length > 160) errors.name = "Keep your name to 160 characters or fewer.";
      if (fields.email.trim().length > 254) errors.email = "Keep your email address to 254 characters or fewer.";
      else if (getFieldErrors(parsed.error.issues).email) errors.email = "Enter a valid email address.";
      if (!fields.service) errors.service = "Choose the service you need.";
      if (fields.message.trim().length < 10) errors.message = "Enter a message of at least 10 characters.";
      else if (fields.message.trim().length > 3000) errors.message = "Keep your message to 3,000 characters or fewer.";
      if (!fields.consent) errors.consent = "Please provide consent so we can respond to your message.";
      setFieldErrors(errors);
      setError("Please review the highlighted fields.");
      return;
    }

    setSubmitting(true);
    setError("");
    setFieldErrors({});
    try {
      const result = await apiPost<ContactResponse>("contact", parsed.data);
      setReference(result.data.reference);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The request could not be completed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return <div className="notice form-success" role="status"><strong>Message received.</strong><br />Reference: {reference}</div>;
  }

  return (
    <form className="contact-form card" onSubmit={submit} noValidate aria-busy={submitting}>
      {callbackDoctor && <p className="notice" role="status">Callback request for doctor profile: <strong>{callbackDoctor}</strong>. Please add your preferred contact time if needed.</p>}
      <div className="field-grid">
        <Field label="Name" name="name" value={fields.name} error={fieldErrors.name} onChange={(value) => update("name", value)} />
        <Field label="Email" name="email" type="email" value={fields.email} error={fieldErrors.email} onChange={(value) => update("email", value)} />
      </div>
      <div className="field">
        <label htmlFor="contact-service">Service required</label>
        <select id="contact-service" value={fields.service} onChange={(event) => update("service", event.target.value)} required aria-invalid={Boolean(fieldErrors.service)} aria-describedby={fieldErrors.service ? "contact-service-error" : undefined}>
          <option value="">Choose a service</option><option>Medical Tourism</option><option>Hospital Coordination</option><option>Doctor Appointment</option><option>Visa and Documentation</option><option>Travel and Accommodation</option><option>Nursing Care at Home</option><option>Other</option>
        </select>
        {fieldErrors.service && <span className="field-error" id="contact-service-error" role="alert">{fieldErrors.service}</span>}
      </div>
      <div className="field">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" maxLength={3000} value={fields.message} onChange={(event) => update("message", event.target.value)} required aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? "contact-message-error contact-message-help" : "contact-message-help"} />
        {fieldErrors.message && <span className="field-error" id="contact-message-error" role="alert">{fieldErrors.message}</span>}
        <span className="muted" id="contact-message-help">Do not include medical details or attach records here. Use the secure inquiry flow for care requests.</span>
      </div>
      <div>
        <label className="consent-check" htmlFor="contact-consent">
          <input id="contact-consent" type="checkbox" checked={fields.consent} onChange={(event) => update("consent", event.target.checked)} required aria-invalid={Boolean(fieldErrors.consent)} aria-describedby={fieldErrors.consent ? "contact-consent-error" : undefined} />
          <span>I consent to MediYatra using this message and my contact details to respond.</span>
        </label>
        {fieldErrors.consent && <span className="field-error" id="contact-consent-error" role="alert">{fieldErrors.consent}</span>}
      </div>
      {error && <p className="form-error-summary" role="alert">{error}</p>}
      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting && <LoaderCircle className="form-submit-spinner" size={18} aria-hidden="true" />}
        {submitting ? "Sending message…" : "Send message"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  error,
  onChange,
}: {
  label: string;
  name: "name" | "email";
  type?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const errorId = `contact-${name}-error`;
  return (
    <div className="field">
      <label htmlFor={`contact-${name}`}>{label}</label>
      <input id={`contact-${name}`} name={name} type={type} value={value} onChange={(event) => onChange(event.target.value)} required aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
      {error && <span className="field-error" id={errorId} role="alert">{error}</span>}
    </div>
  );
}
