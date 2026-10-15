"use client";

import { useState, type FormEvent } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { contactMessageSchema } from "@medibridge/shared";
import { apiPost } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { getFieldErrors, type FormFieldErrors } from "./validation-errors";

type ContactResponse = { data: { reference: string } };
type NursingFields = {
  patientName: string;
  phone: string;
  email: string;
  location: string;
  requiredDate: string;
  preferredTime: string;
  careType: string;
  message: string;
};
type NursingFieldName = keyof NursingFields;

const initialFields: NursingFields = {
  patientName: "",
  phone: "",
  email: "",
  location: "",
  requiredDate: "",
  preferredTime: "",
  careType: "",
  message: "",
};

export function NursingCareForm() {
  const [fields, setFields] = useState(initialFields);
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({});
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(key: NursingFieldName, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors: FormFieldErrors = {};
    if (fields.patientName.trim().length < 2) errors.patientName = "Enter a name of at least 2 characters.";
    else if (fields.patientName.trim().length > 160) errors.patientName = "Keep the patient's name to 160 characters or fewer.";
    if (fields.phone.trim().length < 7 || fields.phone.trim().length > 32) errors.phone = "Enter a phone number between 7 and 32 characters.";
    if (!fields.location.trim()) errors.location = "Enter the patient's location.";
    else if (fields.location.trim().length > 100) errors.location = "Keep the location to 100 characters or fewer.";
    if (!fields.requiredDate) errors.requiredDate = "Choose a requested date.";
    if (!fields.preferredTime) errors.preferredTime = "Choose a preferred time.";
    if (!fields.careType) errors.careType = "Choose the type of care needed.";

    const message = [
      `Patient: ${fields.patientName}`,
      `Phone: ${fields.phone}`,
      `Location: ${fields.location}`,
      `Required date: ${fields.requiredDate}`,
      `Preferred time: ${fields.preferredTime}`,
      `Type of care: ${fields.careType}`,
      `Additional message: ${fields.message || "Not provided"}`,
    ].join("\n");
    const parsed = contactMessageSchema.safeParse({
      name: fields.patientName,
      email: fields.email,
      subject: "Nursing care at home request",
      message,
      consent: true,
    });
    if (!parsed.success) {
      const schemaErrors = getFieldErrors(parsed.error.issues);
      if (schemaErrors.name) errors.patientName = "Enter the patient's name (at least 2 characters).";
      if (schemaErrors.email) errors.email = fields.email.trim().length > 254
        ? "Keep the email address to 254 characters or fewer."
        : "Enter a valid email address.";
      if (schemaErrors.message) errors.message = schemaErrors.message;
    }
    if (fields.message.length > 2000) errors.message = "Keep the message to 2,000 characters or fewer.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please review the highlighted fields.");
      return;
    }
    if (!parsed.success) return;

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
    return (
      <div className="notice form-success" role="status">
        <Check size={19} aria-hidden="true" />
        <span><strong>Nursing request received.</strong><br />Reference: {reference}. Our team will contact you to discuss availability and next steps.</span>
      </div>
    );
  }

  return (
    <form className="card contact-form" onSubmit={submit} noValidate aria-busy={submitting}>
      <div className="field-grid">
        <Field label="Patient name" name="patientName" value={fields.patientName} error={fieldErrors.patientName} onChange={(value) => update("patientName", value)} maxLength={160} />
        <Field label="Phone number" name="phone" type="tel" value={fields.phone} error={fieldErrors.phone} onChange={(value) => update("phone", value)} maxLength={32} />
        <Field label="Email" name="email" type="email" value={fields.email} error={fieldErrors.email} onChange={(value) => update("email", value)} maxLength={254} />
        <Field label="Location" name="location" value={fields.location} error={fieldErrors.location} onChange={(value) => update("location", value)} maxLength={100} />
        <Field label="Required date" name="requiredDate" type="date" value={fields.requiredDate} error={fieldErrors.requiredDate} onChange={(value) => update("requiredDate", value)} />
        <Field label="Preferred time" name="preferredTime" type="time" value={fields.preferredTime} error={fieldErrors.preferredTime} onChange={(value) => update("preferredTime", value)} />
      </div>
      <div className="field">
        <label htmlFor="nursing-care-type">Type of care required</label>
        <select id="nursing-care-type" value={fields.careType} onChange={(event) => update("careType", event.target.value)} required aria-invalid={Boolean(fieldErrors.careType)} aria-describedby={fieldErrors.careType ? "nursing-care-type-error" : undefined}>
          <option value="">Choose a service</option><option>Home nursing visit</option><option>Post-hospital care</option><option>Elderly care support</option><option>Wound and dressing care</option><option>Medication support</option><option>Basic patient monitoring</option>
        </select>
        {fieldErrors.careType && <span className="field-error" id="nursing-care-type-error" role="alert">{fieldErrors.careType}</span>}
      </div>
      <div className="field">
        <label htmlFor="nursing-message">Additional message <span className="field-optional">(optional)</span></label>
        <textarea id="nursing-message" maxLength={2000} value={fields.message} onChange={(event) => update("message", event.target.value)} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? "nursing-message-error nursing-message-count" : "nursing-message-count"} />
        {fieldErrors.message && <span className="field-error" id="nursing-message-error" role="alert">{fieldErrors.message}</span>}
        <span className="muted field-hint" id="nursing-message-count">{fields.message.length}/2,000 characters</span>
      </div>
      {error && <p className="form-error-summary" role="alert">{error}</p>}
      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting && <LoaderCircle className="form-submit-spinner" size={18} aria-hidden="true" />}
        {submitting ? "Sending request…" : "Book a Nursing Visit"}
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
  maxLength,
}: {
  label: string;
  name: NursingFieldName;
  type?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  maxLength?: number;
}) {
  const id = `nursing-${name}`;
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} type={type} value={value} maxLength={maxLength} required onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
      {error && <span className="field-error" id={errorId} role="alert">{error}</span>}
    </div>
  );
}
