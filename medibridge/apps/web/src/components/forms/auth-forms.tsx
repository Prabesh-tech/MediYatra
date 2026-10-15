"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

function AuthShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="auth-card card">
      <p className="eyebrow">Mediyatra account</p>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function AuthField({
  label,
  name,
  type = "text",
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={value} autoComplete={autoComplete} required onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

export function LoginForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await apiPost("auth/login", { email, password });
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Sign in">
      <form className="auth-form" onSubmit={submit}>
        <AuthField label="Email" name="login-email" type="email" autoComplete="email" value={email} onChange={setEmail} />
        <AuthField label="Password" name="login-password" type="password" autoComplete="current-password" value={password} onChange={setPassword} />
        {error && <p className="field-error" role="alert">{error}</p>}
        <Button type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
      </form>
      <div className="auth-links">
        <Link href={`/${locale}/request-password-reset`}>Forgot password?</Link>
        <Link href={`/${locale}/register`}>Create a patient account</Link>
      </div>
    </AuthShell>
  );
}

export function RegisterForm({ locale }: { locale: string }) {
  const [fields, setFields] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function update(key: keyof typeof fields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await apiPost<{ message: string }>("auth/register", fields);
      setMessage(result.message);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create an account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Create a patient account">
      {message ? <p className="notice" role="status">{message}</p> : (
        <form className="auth-form" onSubmit={submit}>
          <div className="field-grid">
            <AuthField label="First name" name="first-name" autoComplete="given-name" value={fields.firstName} onChange={(value) => update("firstName", value)} />
            <AuthField label="Last name" name="last-name" autoComplete="family-name" value={fields.lastName} onChange={(value) => update("lastName", value)} />
          </div>
          <AuthField label="Email" name="register-email" type="email" autoComplete="email" value={fields.email} onChange={(value) => update("email", value)} />
          <AuthField label="Password (12 characters minimum)" name="register-password" type="password" autoComplete="new-password" value={fields.password} onChange={(value) => update("password", value)} />
          {error && <p className="field-error" role="alert">{error}</p>}
          <Button type="submit" disabled={busy}>{busy ? "Creating account…" : "Create account"}</Button>
        </form>
      )}
      <div className="auth-links"><Link href={`/${locale}/login`}>Return to sign in</Link></div>
    </AuthShell>
  );
}

export function RequestResetForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await apiPost<{ message: string }>("auth/request-password-reset", { email });
      setMessage(result.message);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to process the request.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Reset your password">
      {message ? <p className="notice" role="status">{message}</p> : (
        <form className="auth-form" onSubmit={submit}>
          <AuthField label="Account email" name="reset-email" type="email" autoComplete="email" value={email} onChange={setEmail} />
          {error && <p className="field-error" role="alert">{error}</p>}
          <Button type="submit" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</Button>
        </form>
      )}
    </AuthShell>
  );
}

export function VerifyEmailForm({ token, locale }: { token: string; locale: string }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function verify() {
    setBusy(true);
    setError("");
    try {
      await apiPost("auth/verify-email", { token });
      setMessage("Your email is verified. You can now sign in.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "This verification link could not be used.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Verify your email">
      {message ? <p className="notice" role="status">{message} <Link className="text-link" href={`/${locale}/login`}>Sign in</Link></p> : <><p className="muted">Use the one-time link sent to your email address.</p><Button type="button" onClick={verify} disabled={!token || busy}>{busy ? "Verifying…" : "Verify email"}</Button>{error && <p className="field-error" role="alert">{error}</p>}</>}
    </AuthShell>
  );
}

export function ResetPasswordForm({ token, locale }: { token: string; locale: string }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await apiPost("auth/reset-password", { token, password });
      setMessage("Password updated. Sign in with your new password.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to reset the password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Choose a new password">
      {message ? <p className="notice" role="status">{message} <Link className="text-link" href={`/${locale}/login`}>Sign in</Link></p> : (
        <form className="auth-form" onSubmit={submit}>
          <AuthField label="New password (12 characters minimum)" name="new-password" type="password" autoComplete="new-password" value={password} onChange={setPassword} />
          {error && <p className="field-error" role="alert">{error}</p>}
          <Button type="submit" disabled={!token || busy}>{busy ? "Updating…" : "Update password"}</Button>
        </form>
      )}
    </AuthShell>
  );
}
