"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Download, Eye, RefreshCw } from "lucide-react";
import { apiGet, apiPatch } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

const statuses = ["NEW", "CONTACTED", "QUOTE_SENT", "CONFIRMED", "TREATED", "CLOSED"] as const;
type Inquiry = {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  preferredCountry: string | null;
  preferredCity: string | null;
  status: typeof statuses[number];
  createdAt: string;
  treatment: { name: string } | null;
  assignedTo: { user: { firstName: string; lastName: string } } | null;
  _count: { documents: number; quotes: number; appointments: number };
};
type Overview = { inquiries: number; users: number; verifiedHospitals: number; publishedTreatments: number };
type InquiryDetail = Inquiry & { conditionText: string; notes: string | null; timeline: string | null; budgetUsd: number | null; consentPolicyVersion: string };

export function AdminDashboard() {
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [detail, setDetail] = useState<InquiryDetail | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  async function load(search = query) {
    setError("");
    try {
      const params = new URLSearchParams({ page: "1", pageSize: "50" });
      if (search.trim()) params.set("q", search.trim());
      const [inquiryResult, overviewResult] = await Promise.all([
        apiGet<{ data: Inquiry[] }>(`admin/inquiries?${params.toString()}`),
        apiGet<{ data: Overview }>("admin/overview").catch(() => null),
      ]);
      setRows(inquiryResult.data);
      if (overviewResult) setOverview(overviewResult.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load the admin workspace.");
    }
  }

  useEffect(() => { void load(""); }, []);

  async function search(event: FormEvent) {
    event.preventDefault();
    await load(query);
  }

  async function changeStatus(id: string, status: string) {
    setBusyId(id);
    try {
      await apiPatch(`admin/inquiries/${encodeURIComponent(id)}`, { status });
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update the inquiry.");
    } finally {
      setBusyId("");
    }
  }

  async function viewDetail(id: string) {
    setBusyId(id);
    try {
      const response = await apiGet<{ data: InquiryDetail }>(`admin/inquiries/${encodeURIComponent(id)}`);
      setDetail(response.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to open the inquiry.");
    } finally {
      setBusyId("");
    }
  }

  function exportCurrentPage() {
    const escape = (value: string) => {
      const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
      return `"${safe.replaceAll('"', '""')}"`;
    };
    const header = ["Reference", "Name", "Email", "Phone", "Status", "Country", "Destination"];
    const lines = rows.map((row) => [row.reference, row.fullName, row.email, row.phone, row.status, row.country, row.preferredCountry ?? ""].map(escape).join(","));
    const blob = new Blob([[header.map(escape).join(","), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "medibridge-inquiries-current-page.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="dashboard-stack">
      {error && <p className="field-error" role="alert">{error}</p>}
      {overview && (
        <div className="grid grid-4 admin-metrics">
          <Metric label="Inquiries" value={overview.inquiries} />
          <Metric label="Accounts" value={overview.users} />
          <Metric label="Verified hospitals" value={overview.verifiedHospitals} />
          <Metric label="Published care areas" value={overview.publishedTreatments} />
        </div>
      )}
      <section className="card">
        <div className="dashboard-heading">
          <div><p className="eyebrow">Inquiry pipeline</p><h2>Requests</h2></div>
          <div className="button-row">
            <Button variant="ghost" onClick={() => void load()} aria-label="Refresh inquiry list"><RefreshCw size={17} /></Button>
            <Button variant="secondary" onClick={exportCurrentPage} disabled={!rows.length}><Download size={16} /> Export current page</Button>
          </div>
        </div>
        <form className="catalog-search" onSubmit={search}>
          <label className="field"><span>Search name, email, or reference</span><input value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <Button type="submit">Search</Button>
        </form>
        {rows.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Reference</th><th>Patient</th><th>Request</th><th>Destination</th><th>Status</th><th>Files</th><th>Actions</th></tr></thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td data-label="Reference">{row.reference}</td>
                    <td data-label="Patient">{row.fullName}<br /><small>{row.email}</small></td>
                    <td data-label="Request">{row.treatment?.name ?? "General inquiry"}</td>
                    <td data-label="Destination">{[row.preferredCity, row.preferredCountry].filter(Boolean).join(", ") || "Not set"}</td>
                    <td data-label="Status">
                      <select aria-label={`Update status for ${row.reference}`} value={row.status} disabled={busyId === row.id} onChange={(event) => void changeStatus(row.id, event.target.value)}>
                        {statuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                    <td data-label="Files">{row._count.documents}</td>
                    <td data-label="Actions"><button className="icon-button" type="button" aria-label={`View details for ${row.reference}`} onClick={() => void viewDetail(row.id)}><Eye size={17} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="muted">No inquiry records are available for this account.</p>}
      </section>
      {detail && (
        <section className="card inquiry-detail" aria-labelledby="inquiry-detail-title">
          <div className="dashboard-heading"><div><p className="eyebrow">Restricted patient information</p><h2 id="inquiry-detail-title">{detail.reference}</h2></div><button className="icon-button" type="button" onClick={() => setDetail(null)} aria-label="Close inquiry details">×</button></div>
          <p><strong>{detail.fullName}</strong> · {detail.email} · {detail.phone}</p>
          <h3>Patient-provided description</h3><p className="sensitive-text">{detail.conditionText}</p>
          {detail.notes && <><h3>Coordinator notes</h3><p className="sensitive-text">{detail.notes}</p></>}
          <p className="muted">Consent policy: {detail.consentPolicyVersion}. Do not copy clinical details into logs or unapproved systems.</p>
        </section>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <article className="card metric-card"><span className="muted">{label}</span><strong>{value.toLocaleString("en")}</strong></article>;
}
