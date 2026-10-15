"use client";

import { useState, type FormEvent } from "react";
import { appointmentRequestSchema } from "@medibridge/shared";
import { apiPost } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

type AppointmentResult = { data: { id: string; status: string; scheduledAt: string } };

export function ConsultationRequestForm() {
  const [type, setType] = useState<"video" | "phone" | "in-person">("video");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [timezone, setTimezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  const [error, setError] = useState("");
  const [request, setRequest] = useState<AppointmentResult["data"] | null>(null);
  const [busy, setBusy] = useState(false);
  const minimumDate = new Date().toISOString().slice(0, 10);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const parsed = appointmentRequestSchema.safeParse({
      type,
      scheduledAt: date && time ? new Date(`${date}T${time}`).toISOString() : "",
      timezone,
    });
    if (!parsed.success) {
      setError("Choose a valid future date and time, and confirm your timezone.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const result = await apiPost<AppointmentResult>("appointments", parsed.data);
      setRequest(result.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to request a consultation.");
    } finally {
      setBusy(false);
    }
  }

  if (request) {
    return <div className="notice" role="status"><strong>Time requested.</strong> Status: {request.status}. The appointment is not confirmed until the care team replies.</div>;
  }

  return (
    <form className="card contact-form" onSubmit={submit}>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="consultation-type">Consultation type</label>
          <select id="consultation-type" value={type} onChange={(event) => setType(event.target.value as typeof type)}>
            <option value="video">Video</option><option value="phone">Phone</option><option value="in-person">In person</option>
          </select>
        </div>
        <div className="field"><label htmlFor="consultation-date">Preferred date</label><input id="consultation-date" type="date" min={minimumDate} value={date} onChange={(event) => setDate(event.target.value)} required /></div>
        <div className="field"><label htmlFor="consultation-time">Preferred time</label><input id="consultation-time" type="time" value={time} onChange={(event) => setTime(event.target.value)} required /></div>
        <div className="field"><label htmlFor="consultation-timezone">Timezone</label><input id="consultation-timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)} required /></div>
      </div>
      <p className="muted">This requests a preferred time; it does not reserve a slot. Availability will be confirmed by the care team.</p>
      {error && <p className="field-error" role="alert">{error}</p>}
      <Button type="submit" disabled={busy}>{busy ? "Sending request…" : "Request this time"}</Button>
    </form>
  );
}
