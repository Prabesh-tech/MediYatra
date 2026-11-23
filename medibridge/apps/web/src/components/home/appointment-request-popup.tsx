"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { inquiryRequestSchema } from "@medibridge/shared";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/api-client";
import { localizedHref, siteConfig } from "@/config/site";

const DISMISSED_KEY = "mediyatra-appointment-popup-dismissed";

type AppointmentFields = {
  fullName: string;
  phone: string;
  city: string;
  message: string;
  email: string;
  country: string;
  consent: boolean;
};

type InquiryResult = { data: { reference: string } };

const initialFields: AppointmentFields = {
  fullName: "",
  phone: "",
  city: "",
  message: "",
  email: "",
  country: "",
  consent: false,
};

export function AppointmentRequestPopup({ locale }: { locale: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState(initialFields);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (window.sessionStorage.getItem(DISMISSED_KEY) !== "true") {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (visible && dialog && !dialog.open) dialog.showModal();
  }, [visible]);

  function closePopup() {
    window.sessionStorage.setItem(DISMISSED_KEY, "true");
    dialogRef.current?.close();
  }

  function updateField<K extends keyof AppointmentFields>(key: K, value: AppointmentFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function continueToDetails() {
    if (fields.fullName.trim().length < 2) {
      setError("Enter your name so we know how to address you.");
      return;
    }
    if (fields.phone.trim().length < 7 || fields.phone.trim().length > 32) {
      setError("Enter a phone number between 7 and 32 characters.");
      return;
    }
    if (fields.city.trim().length > 100) {
      setError("Enter a city with no more than 100 characters.");
      return;
    }
    if (fields.message.trim().length < 10 || fields.message.trim().length > 8000) {
      setError("Tell us a little more about your request (10 to 8,000 characters).");
      return;
    }
    setStep(1);
    setError("");
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = inquiryRequestSchema.safeParse({
      fullName: fields.fullName,
      email: fields.email,
      phone: fields.phone,
      country: fields.country,
      conditionText: fields.message,
      preferredCountry: "India",
      preferredCity: fields.city || undefined,
      consent: fields.consent,
      consentPolicyVersion: "2026-09-30",
    });

    if (!parsed.success) {
      setError("Check your email, country, and consent before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const result = await apiPost<InquiryResult>("inquiries", parsed.data);
      setReference(result.data.reference);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not send your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="appointment-popup"
      aria-labelledby="appointment-popup-title"
      onClose={() => {
        window.sessionStorage.setItem(DISMISSED_KEY, "true");
        setVisible(false);
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closePopup();
      }}
    >
      <div className="appointment-popup-header">
        <div className="appointment-popup-heading">
          <Link
            className="appointment-popup-brand"
            href={localizedHref(locale, "")}
            aria-label={`${siteConfig.brand.displayName} home`}
          >
            <Image src={siteConfig.brand.logoPath} alt="" width={176} height={48} />
          </Link>
          <p className="eyebrow">MediYatra coordination</p>
          <h2 id="appointment-popup-title">Request an Appointment</h2>
        </div>
        <button className="appointment-popup-close" type="button" onClick={closePopup} aria-label="Close appointment request">
          <X size={24} aria-hidden="true" />
        </button>
      </div>

      {reference ? (
        <div className="appointment-popup-success" role="status">
          <h3>Your request has been received.</h3>
          <p>Reference: <strong>{reference}</strong></p>
          <p>The care team will follow up. This request is not a confirmed appointment.</p>
          <Button variant="accent" type="button" onClick={closePopup}>Done</Button>
        </div>
      ) : (
        <form className="appointment-popup-form" onSubmit={submitRequest}>
          {step === 0 ? (
            <>
              <div className="appointment-popup-fields">
                <div className="field">
                  <label htmlFor="appointment-popup-name">Name</label>
                  <input id="appointment-popup-name" autoComplete="name" placeholder="Enter your name" maxLength={160} value={fields.fullName} onChange={(event) => updateField("fullName", event.target.value)} required />
                </div>
                <div className="field">
                  <label htmlFor="appointment-popup-phone">Phone No.</label>
                  <input id="appointment-popup-phone" type="tel" autoComplete="tel" placeholder="Enter your phone number" maxLength={32} value={fields.phone} onChange={(event) => updateField("phone", event.target.value)} required />
                </div>
                <div className="field">
                  <label htmlFor="appointment-popup-city">City</label>
                  <input id="appointment-popup-city" autoComplete="address-level2" placeholder="Enter your city" maxLength={100} value={fields.city} onChange={(event) => updateField("city", event.target.value)} />
                </div>
                <div className="field appointment-popup-message">
                  <label htmlFor="appointment-popup-message">Message</label>
                  <textarea id="appointment-popup-message" rows={3} maxLength={8000} placeholder="Tell us about your request" value={fields.message} onChange={(event) => updateField("message", event.target.value)} required />
                </div>
              </div>
              <p className="appointment-popup-note">Share only details needed to coordinate your request. This form does not confirm an appointment.</p>
              <div className="appointment-popup-actions">
                <Button variant="accent" type="button" onClick={continueToDetails}>Next</Button>
              </div>
            </>
          ) : (
            <>
              <p className="appointment-popup-step">Step 2 of 2 · How can we reach you?</p>
              <div className="appointment-popup-fields">
                <div className="field">
                  <label htmlFor="appointment-popup-email">Email</label>
                  <input id="appointment-popup-email" type="email" autoComplete="email" maxLength={254} value={fields.email} onChange={(event) => updateField("email", event.target.value)} required />
                </div>
                <div className="field">
                  <label htmlFor="appointment-popup-country">Country of residence</label>
                  <input id="appointment-popup-country" autoComplete="country-name" maxLength={100} value={fields.country} onChange={(event) => updateField("country", event.target.value)} required />
                </div>
              </div>
              <label className="appointment-popup-consent">
                <input type="checkbox" checked={fields.consent} onChange={(event) => updateField("consent", event.target.checked)} />
                <span>I agree that MediYatra may use these details to respond to my request. See the <Link href={`/${locale}/legal/privacy`}>privacy notice</Link>.</span>
              </label>
              <p className="appointment-popup-note">Diagnosis and treatment decisions are made by qualified doctors and hospitals.</p>
              <div className="appointment-popup-actions">
                <Button variant="ghost" type="button" onClick={() => { setStep(0); setError(""); }}>Back</Button>
                <Button variant="accent" type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send request"}</Button>
              </div>
            </>
          )}
          {error && <p className="form-error-summary" role="alert">{error}</p>}
        </form>
      )}
    </dialog>
  );
}
