"use client";

import { useEffect, useState } from "react";
import { Eye, RefreshCw } from "lucide-react";
import { apiGet, apiPatch } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

type ContactMessage = { id: string; name: string; email: string; subject: string; status: string; createdAt: string };
type ContactDetail = ContactMessage & { message: string };

export function AdminContactInbox() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [detail, setDetail] = useState<ContactDetail | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const result = await apiGet<{ data: ContactMessage[] }>("admin/contact?page=1&pageSize=25");
      setMessages(result.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load the contact inbox.");
    }
  }

  useEffect(() => { void load(); }, []);

  async function view(id: string) {
    try {
      const result = await apiGet<{ data: ContactDetail }>(`admin/contact/${encodeURIComponent(id)}`);
      setDetail(result.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to open the message.");
    }
  }

  async function setStatus(id: string, status: "REVIEWED" | "CLOSED") {
    try {
      await apiPatch(`admin/contact/${encodeURIComponent(id)}`, { status });
      if (detail?.id === id) setDetail((current) => current ? { ...current, status } : current);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update the message.");
    }
  }

  return (
    <div className="dashboard-stack">
      {error && <p className="field-error" role="alert">{error} (super-admin access is required.)</p>}
      <section className="card">
        <div className="dashboard-heading"><div><p className="eyebrow">General enquiries</p><h2>Contact inbox</h2></div><Button variant="ghost" onClick={() => void load()} aria-label="Refresh contact messages"><RefreshCw size={17} /></Button></div>
        {messages.length ? (
          <div className="dashboard-list">
            {messages.map((message) => (
              <article className="dashboard-row" key={message.id}>
                <div><strong>{message.subject}</strong><p className="muted">{message.name} · {message.email} · {message.status}</p></div>
                <button className="icon-button" type="button" aria-label={`Review ${message.subject}`} onClick={() => void view(message.id)}><Eye size={17} /></button>
              </article>
            ))}
          </div>
        ) : !error ? <p className="muted">No contact messages yet.</p> : null}
      </section>
      {detail && (
        <section className="card inquiry-detail" aria-labelledby="contact-detail-title">
          <div className="dashboard-heading"><div><p className="eyebrow">Contact message</p><h2 id="contact-detail-title">{detail.subject}</h2></div><button className="icon-button" type="button" aria-label="Close contact message" onClick={() => setDetail(null)}>×</button></div>
          <p><strong>{detail.name}</strong> · {detail.email}</p>
          <p className="sensitive-text">{detail.message}</p>
          <div className="button-row">
            <Button variant="secondary" onClick={() => void setStatus(detail.id, "REVIEWED")}>Mark reviewed</Button>
            <Button variant="ghost" onClick={() => void setStatus(detail.id, "CLOSED")}>Close message</Button>
          </div>
        </section>
      )}
    </div>
  );
}
