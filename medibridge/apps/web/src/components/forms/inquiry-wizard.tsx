"use client";

import { useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, FileText, LoaderCircle, Upload, X } from "lucide-react";
import { inquiryRequestSchema } from "@medibridge/shared";
import { apiPost } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { getFieldErrors, type FormFieldErrors } from "./validation-errors";

type InquiryFields = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  treatment: string;
  conditionText: string;
  preferredCountry: string;
  preferredCity: string;
  timeline: string;
  budgetUsd: string;
  consent: boolean;
};

type CreatedInquiry = { data: { reference: string; uploadToken: string } };
type PresignedUpload = { data: { key: string; url: string; headers: Record<string, string> } };
type CompletedUpload = { data: { id: string } };

const steps = ["About you", "Care", "Reports", "Travel", "Consent"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg"]);
const initialFields: InquiryFields = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  treatment: "",
  conditionText: "",
  preferredCountry: "India",
  preferredCity: "",
  timeline: "",
  budgetUsd: "",
  consent: false,
};

export function InquiryWizard() {
  const [fields, setFields] = useState(initialFields);
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({});
  const [uploadWarning, setUploadWarning] = useState("");
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function update<K extends keyof InquiryFields>(key: K, value: InquiryFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    setError("");
  }

  function addFiles(incoming: FileList | File[]) {
    const additions = Array.from(incoming);
    const invalid = additions.find((file) => !ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE || file.size === 0);
    if (invalid) {
      setError(`${invalid.name}: select a PDF or JPG file no larger than 10 MB.`);
      setFieldErrors((current) => ({ ...current, files: "Select a PDF or JPG file no larger than 10 MB." }));
      return;
    }
    const combined = [...files, ...additions].filter((file, index, all) =>
      all.findIndex((candidate) => candidate.name === file.name && candidate.size === file.size) === index,
    );
    if (combined.length > 5) {
      setError("You can attach up to five reports.");
      setFieldErrors((current) => ({ ...current, files: "You can attach up to five reports." }));
      return;
    }
    setFiles(combined);
    setFieldErrors((current) => {
      const next = { ...current };
      delete next.files;
      return next;
    });
    setError("");
  }

  function canContinue(): boolean {
    const errors: FormFieldErrors = {};
    if (step === 0) {
      if (fields.fullName.trim().length < 2) errors.fullName = "Enter your full name (at least 2 characters).";
      if (!inquiryRequestSchema.shape.email.safeParse(fields.email).success) errors.email = "Enter a valid email address.";
      if (fields.phone.trim().length < 7 || fields.phone.trim().length > 32) errors.phone = "Enter a phone number between 7 and 32 characters.";
      if (fields.country.trim().length < 2) errors.country = "Enter your country of residence.";
    }
    if (step === 1) {
      if (fields.conditionText.trim().length < 10) errors.conditionText = "Add at least 10 characters so the coordination team can understand your request.";
      if (fields.treatment.trim().length > 160) errors.treatment = "Keep the treatment area to 160 characters or fewer.";
    }
    if (step === 2 && fieldErrors.files) {
      errors.files = fieldErrors.files;
    }
    if (step === 3) {
      if (fields.preferredCity.trim().length > 100) errors.preferredCity = "Keep the preferred city to 100 characters or fewer.";
      if (fields.timeline.length > 100) errors.timeline = "Choose a shorter timeframe.";
      if (fields.budgetUsd && (!/^\d+$/.test(fields.budgetUsd) || Number(fields.budgetUsd) < 1 || Number(fields.budgetUsd) > 10_000_000)) {
        errors.budgetUsd = "Enter a whole amount between 1 and 10,000,000 USD.";
      }
    }
    if (step === 4 && !fields.consent) {
      errors.consent = "Please confirm consent so the team can respond to your inquiry.";
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError("Please review the highlighted fields.");
      return false;
    }
    setError("");
    return true;
  }

  async function submitInquiry() {
    if (!canContinue()) return;
    const payload = {
      fullName: fields.fullName,
      email: fields.email,
      phone: fields.phone,
      country: fields.country,
      treatment: fields.treatment || undefined,
      conditionText: fields.conditionText,
      preferredCountry: fields.preferredCountry || undefined,
      preferredCity: fields.preferredCity || undefined,
      timeline: fields.timeline || undefined,
      budgetUsd: fields.budgetUsd ? Number(fields.budgetUsd) : undefined,
      consent: true as const,
      consentPolicyVersion: "2026-09-30",
    };
    const parsed = inquiryRequestSchema.safeParse(payload);
    if (!parsed.success) {
      const errors = getFieldErrors(parsed.error.issues);
      if (errors.consent) errors.consent = "Please confirm consent so the team can respond to your inquiry.";
      setFieldErrors(errors);
      setError("Some details need attention. Review the highlighted fields.");
      return;
    }

    setSubmitting(true);
    setError("");
    let createdReference = "";
    try {
      const created = await apiPost<CreatedInquiry>("inquiries", parsed.data);
      createdReference = created.data.reference;
      setReference(created.data.reference);
      for (const file of files) {
        const details = { filename: file.name, contentType: file.type, sizeBytes: file.size };
        const signed = await apiPost<PresignedUpload>(
          `inquiries/${encodeURIComponent(created.data.reference)}/documents/presign`,
          { ...details, uploadToken: created.data.uploadToken },
        );
        const stored = await fetch(signed.data.url, {
          method: "PUT",
          headers: signed.data.headers,
          body: file,
        });
        if (!stored.ok) throw new Error("A report could not be uploaded. Your inquiry was still received.");
        await apiPost<CompletedUpload>(
          `inquiries/${encodeURIComponent(created.data.reference)}/documents/complete`,
          { ...details, key: signed.data.key, uploadToken: created.data.uploadToken },
        );
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "The request could not be completed.";
      if (createdReference) setUploadWarning(message);
      else setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (reference && !submitting) {
    return (
      <div className="card success-panel" role="status">
        <span className="success-icon"><Check size={25} aria-hidden="true" /></span>
        <p className="eyebrow">Inquiry received</p>
        <h2>Thank you. Your reference is {reference}.</h2>
        <p className="muted">A coordinator can follow up using the contact details you provided. Do not send medical records by ordinary email.</p>
        {uploadWarning && <p className="field-error">{uploadWarning}</p>}
      </div>
    );
  }

  return (
    <form className="wizard-card card" onSubmit={(event) => event.preventDefault()} noValidate aria-busy={submitting}>
      <div className="wizard-progress" aria-label={`Step ${step + 1} of ${steps.length}`}>
        {steps.map((label, index) => <span key={label} data-active={index <= step} />)}
      </div>
      <div className="wizard-step-title">
        <span className="eyebrow">Step {step + 1} of {steps.length}</span>
        <h2>{steps[step]}</h2>
      </div>

      {step === 0 && (
        <fieldset className="wizard-fields">
          <legend>Your contact details</legend>
          <div className="field-grid">
            <Field label="Full name" name="fullName" value={fields.fullName} error={fieldErrors.fullName} onChange={(value) => update("fullName", value)} required maxLength={160} />
            <Field label="Email" name="email" type="email" value={fields.email} error={fieldErrors.email} onChange={(value) => update("email", value)} required maxLength={254} />
            <Field label="Phone" name="phone" type="tel" value={fields.phone} error={fieldErrors.phone} onChange={(value) => update("phone", value)} required maxLength={32} />
            <Field label="Country of residence" name="country" value={fields.country} error={fieldErrors.country} onChange={(value) => update("country", value)} required maxLength={100} />
          </div>
        </fieldset>
      )}

      {step === 1 && (
        <fieldset className="wizard-fields">
          <legend>Tell us about the care you are exploring</legend>
          <div className="field">
            <label htmlFor="treatment">Treatment area (optional)</label>
            <select id="treatment" value={fields.treatment} onChange={(event) => update("treatment", event.target.value)} aria-invalid={Boolean(fieldErrors.treatment)} aria-describedby={fieldErrors.treatment ? "treatment-error" : undefined}>
              <option value="">Choose an area</option>
              <option>Cardiac care</option><option>Orthopedics</option><option>Cancer care</option>
              <option>Fertility and IVF</option><option>Dental care</option><option>Cosmetic care</option>
              <option>Eye care</option><option>Transplant consultation</option><option>Bariatric care</option>
              <option>Wellness and Ayurveda</option><option>Not sure yet</option>
            </select>
            {fieldErrors.treatment && <span className="field-error" id="treatment-error" role="alert">{fieldErrors.treatment}</span>}
          </div>
          <div className="field">
            <label htmlFor="condition">What would you like the care team to know?</label>
            <textarea id="condition" value={fields.conditionText} onChange={(event) => update("conditionText", event.target.value)} maxLength={8000} required aria-invalid={Boolean(fieldErrors.conditionText)} aria-describedby={fieldErrors.conditionText ? "condition-error condition-help" : "condition-help"} />
            {fieldErrors.conditionText && <span className="field-error" id="condition-error" role="alert">{fieldErrors.conditionText}</span>}
            <span id="condition-help" className="muted">Share only what is relevant to your request. Do not include unnecessary identification numbers.</span>
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="wizard-fields">
          <legend>Medical reports (optional)</legend>
          <button
            className="drop-zone"
            type="button"
            onClick={() => fileInput.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => { event.preventDefault(); addFiles(event.dataTransfer.files); }}
            aria-invalid={Boolean(fieldErrors.files)}
            aria-describedby={fieldErrors.files ? "upload-hint upload-error" : "upload-hint"}
          >
            <span><Upload size={25} aria-hidden="true" /><br /><strong>Choose reports or drop them here</strong></span>
            <span id="upload-hint" className="muted">PDF or JPG, up to 10 MB per file. Up to five files.</span>
          </button>
          {fieldErrors.files && <span className="field-error" id="upload-error" role="alert">{fieldErrors.files}</span>}
          <input
            ref={fileInput}
            className="visually-hidden"
            type="file"
            accept="application/pdf,image/jpeg,.pdf,.jpg,.jpeg"
            multiple
            onChange={(event) => { if (event.target.files) addFiles(event.target.files); event.target.value = ""; }}
          />
          {files.length > 0 && (
            <ul className="file-list">
              {files.map((file) => (
                <li key={`${file.name}-${file.size}`}>
                  <FileText size={18} aria-hidden="true" />
                  <span>{file.name} <small>({(file.size / 1024 / 1024).toFixed(1)} MB)</small></span>
                  <button className="icon-button" type="button" aria-label={`Remove ${file.name}`} onClick={() => setFiles((current) => current.filter((item) => item !== file))}><X size={16} /></button>
                </li>
              ))}
            </ul>
          )}
          <p className="notice">Reports are uploaded to private storage using a short-lived link after you submit. Files are not saved to this device by the form.</p>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset className="wizard-fields">
          <legend>Travel preferences</legend>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="preferred-country">Preferred location</label>
              <select id="preferred-country" value={fields.preferredCountry} onChange={(event) => update("preferredCountry", event.target.value)}>
                <option value="India">India</option>
                <option value="Nepal">Nepal</option>
                <option value="Not sure">Not sure yet</option>
              </select>
            </div>
            <Field label="Preferred city (optional)" name="preferredCity" value={fields.preferredCity} error={fieldErrors.preferredCity} onChange={(value) => update("preferredCity", value)} maxLength={100} />
            <div className="field">
              <label htmlFor="timeline">When are you considering travel?</label>
              <select id="timeline" value={fields.timeline} onChange={(event) => update("timeline", event.target.value)} aria-invalid={Boolean(fieldErrors.timeline)} aria-describedby={fieldErrors.timeline ? "timeline-error" : undefined}>
                <option value="">Choose a timeframe</option>
                <option>As soon as possible</option><option>Within 1–3 months</option>
                <option>Within 3–6 months</option><option>Flexible / exploring</option>
              </select>
              {fieldErrors.timeline && <span className="field-error" id="timeline-error" role="alert">{fieldErrors.timeline}</span>}
            </div>
            <Field label="Approximate budget in USD (optional)" name="budgetUsd" type="number" min="1" value={fields.budgetUsd} error={fieldErrors.budgetUsd} onChange={(value) => update("budgetUsd", value)} />
          </div>
        </fieldset>
      )}

      {step === 4 && (
        <fieldset className="wizard-fields">
          <legend>Consent and review</legend>
          <div className="card review-summary">
            <p><strong>Name:</strong> {fields.fullName || "Not provided"}</p>
            <p><strong>Care area:</strong> {fields.treatment || "Not specified"}</p>
            <p><strong>Location:</strong> {fields.preferredCountry || "Not specified"}</p>
            <p><strong>Reports selected:</strong> {files.length}</p>
          </div>
          <label className="consent-check">
            <input type="checkbox" checked={fields.consent} onChange={(event) => update("consent", event.target.checked)} aria-invalid={Boolean(fieldErrors.consent)} aria-describedby={fieldErrors.consent ? "consent-error" : undefined} />
            <span>I consent to Mediyatra using these details to respond to my inquiry and coordinate a requested clinical review. I understand this is not medical advice and I can ask about data access or deletion.</span>
          </label>
          {fieldErrors.consent && <span className="field-error" id="consent-error" role="alert">{fieldErrors.consent}</span>}
          <p className="muted">Consent policy version: 2026-09-30. See the <a className="text-link" href="/en/legal/privacy">privacy notice</a>.</p>
        </fieldset>
      )}

      {error && <p className="form-error-summary" role="alert">{error}</p>}
      <div className="wizard-actions">
        {step > 0 && <Button variant="ghost" type="button" onClick={() => { setStep((value) => value - 1); setError(""); }}><ChevronLeft size={17} /> Back</Button>}
        {step < steps.length - 1 ? (
          <Button variant="primary" type="button" onClick={() => { if (canContinue()) setStep((value) => value + 1); }}>Continue <ChevronRight size={17} /></Button>
        ) : (
          <Button variant="accent" type="button" disabled={submitting} onClick={submitInquiry}>
            {submitting && <LoaderCircle className="form-submit-spinner" size={18} aria-hidden="true" />}
            {submitting ? "Submitting securely…" : "Submit inquiry"}
          </Button>
        )}
      </div>
      <p className="muted privacy-footnote">Your report uploads use expiring links. Do not email medical documents or include information not needed to assess your request.</p>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  min,
  error,
  maxLength,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  min?: string;
  error?: string;
  maxLength?: number;
}) {
  const errorId = `${name}-error`;
  return (
    <div className="field">
      <label htmlFor={name}>{label}{required ? " *" : ""}</label>
      <input id={name} name={name} type={type} value={value} min={min} maxLength={maxLength} required={required} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
      {error && <span className="field-error" id={errorId} role="alert">{error}</span>}
    </div>
  );
}
