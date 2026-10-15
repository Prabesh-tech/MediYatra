"use client";

import { useState, type FormEvent } from "react";
import { reviewSubmissionSchema } from "@medibridge/shared";
import { apiPost } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

export function ReviewForm({ hospitalId }: { hospitalId: string }) {
  const [rating, setRating] = useState("5");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const parsed = reviewSubmissionSchema.safeParse({
      rating: Number(rating),
      title: title || undefined,
      body,
      consentToPublish: consent,
    });
    if (!parsed.success) {
      setError("Add a review of at least 20 characters and confirm publication consent.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      await apiPost(`hospitals/${encodeURIComponent(hospitalId)}/reviews`, parsed.data);
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to submit this review.");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) return <p className="notice" role="status">Review received. It will appear only after moderation.</p>;

  return (
    <form className="card contact-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="review-rating">Rating</label>
        <select id="review-rating" value={rating} onChange={(event) => setRating(event.target.value)}>
          <option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option>
        </select>
      </div>
      <div className="field"><label htmlFor="review-title">Title (optional)</label><input id="review-title" value={title} maxLength={160} onChange={(event) => setTitle(event.target.value)} /></div>
      <div className="field"><label htmlFor="review-body">Your experience</label><textarea id="review-body" value={body} maxLength={3000} onChange={(event) => setBody(event.target.value)} /><span className="muted">Avoid including medical record details or another person’s information.</span></div>
      <label className="consent-check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I agree that this review may be published after moderation. My identity will be shown as “Verified patient”.</span></label>
      {error && <p className="field-error" role="alert">{error}</p>}
      <Button type="submit" disabled={busy}>{busy ? "Submitting…" : "Submit for review"}</Button>
    </form>
  );
}
