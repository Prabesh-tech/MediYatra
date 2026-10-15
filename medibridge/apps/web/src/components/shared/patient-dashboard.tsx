"use client";

import { useEffect, useState } from "react";
import { Download, FileText, RefreshCw } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

type Inquiry = {
  id: string;
  reference: string;
  status: string;
  preferredCountry: string | null;
  preferredCity: string | null;
  createdAt: string;
  treatment: { slug: string; name: string } | null;
  quotes: { id: string; totalUsd: number; validUntil: string; status: string; createdAt: string }[];
};
type DashboardData = {
  inquiries: Inquiry[];
  appointments: { id: string; type: string; scheduledAt: string; timezone: string; status: string }[];
  documents: { id: string; filename: string; mimeType: string; sizeBytes: number; createdAt: string }[];
};

export function PatientDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setError("");
    try {
      const response = await apiGet<{ data: DashboardData }>("users/me/dashboard");
      setData(response.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load your dashboard.");
    }
  }

  useEffect(() => { void load(); }, []);

  async function requestData(type: "EXPORT" | "DELETE") {
    setBusy(true);
    setNotice("");
    try {
      const response = await apiPost<{ data: { id: string; status: string } }>("users/me/data-requests", { type });
      setNotice(`${type === "EXPORT" ? "Export" : "Deletion"} request recorded: ${response.data.id}.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to record the request.");
    } finally {
      setBusy(false);
    }
  }

  async function openDocument(id: string) {
    try {
      const response = await apiGet<{ data: { url: string } }>(`uploads/${encodeURIComponent(id)}/download`);
      window.location.assign(response.data.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to open this document.");
    }
  }

  if (error && !data) {
    return <div className="empty-state"><p role="alert">{error}</p><Button variant="secondary" onClick={() => void load()}><RefreshCw size={16} /> Try again</Button></div>;
  }
  if (!data) return <p role="status" aria-live="polite">Loading your dashboard…</p>;

  return (
    <div className="dashboard-stack">
      {error && <p className="field-error" role="alert">{error}</p>}
      {notice && <p className="notice" role="status">{notice}</p>}
      <section className="card">
        <div className="dashboard-heading"><div><p className="eyebrow">Your care</p><h2>Inquiries</h2></div><Button variant="ghost" onClick={() => void load()} aria-label="Refresh dashboard"><RefreshCw size={17} /></Button></div>
        {data.inquiries.length ? (
          <div className="dashboard-list">
            {data.inquiries.map((inquiry) => (
              <article className="dashboard-row" key={inquiry.id}>
                <div><strong>{inquiry.treatment?.name ?? "Care inquiry"}</strong><p className="muted">Reference {inquiry.reference} · {inquiry.preferredCity ? `${inquiry.preferredCity}, ` : ""}{inquiry.preferredCountry ?? "Destination not set"}</p></div>
                <span className="status-badge">{inquiry.status.replaceAll("_", " ")}</span>
                <span>{new Date(inquiry.createdAt).toLocaleDateString("en")}</span>
              </article>
            ))}
          </div>
        ) : <p className="muted">No inquiries yet. Your submitted requests will appear here.</p>}
      </section>
      <div className="grid grid-2">
        <section className="card">
          <h2>Appointments</h2>
          {data.appointments.length ? data.appointments.map((appointment) => <p key={appointment.id}>{new Date(appointment.scheduledAt).toLocaleString("en")} · {appointment.status}</p>) : <p className="muted">No appointments are scheduled.</p>}
        </section>
        <section className="card">
          <h2>Medical documents</h2>
          {data.documents.length ? data.documents.map((document) => (
            <div className="dashboard-row" key={document.id}>
              <span><FileText size={17} aria-hidden="true" /> {document.filename}</span>
              <button className="icon-button" type="button" aria-label={`Download ${document.filename}`} onClick={() => void openDocument(document.id)}><Download size={17} /></button>
            </div>
          )) : <p className="muted">No reports uploaded yet.</p>}
        </section>
      </div>
      <section className="card">
        <h2>Privacy requests</h2>
        <p className="muted">Submit an export or deletion request. The team will review and process it according to the applicable policy.</p>
        <div className="button-row">
          <Button variant="secondary" disabled={busy} onClick={() => void requestData("EXPORT")}>Request data export</Button>
          <Button variant="ghost" disabled={busy} onClick={() => void requestData("DELETE")}>Request account deletion</Button>
        </div>
      </section>
    </div>
  );
}
