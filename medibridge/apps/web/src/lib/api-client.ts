type ApiFailure = { message?: string };

async function readResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null) as T | ApiFailure | null;
  if (!response.ok) {
    const message = payload && typeof payload === "object" && "message" in payload
      ? String(payload.message)
      : "The request could not be completed";
    throw new Error(message);
  }
  return payload as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`/api/${path.replace(/^\//, "")}`, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });
  return readResponse<T>(response);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const csrfResponse = await fetch("/api/auth/csrf", {
    credentials: "same-origin",
    cache: "no-store",
  });
  const csrfPayload = await readResponse<{ csrfToken: string }>(csrfResponse);
  const response = await fetch(`/api/${path.replace(/^\//, "")}`, {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      "x-csrf-token": csrfPayload.csrfToken,
    },
    body: JSON.stringify(body),
  });
  return readResponse<T>(response);
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const csrfResponse = await fetch("/api/auth/csrf", {
    credentials: "same-origin",
    cache: "no-store",
  });
  const csrfPayload = await readResponse<{ csrfToken: string }>(csrfResponse);
  const response = await fetch(`/api/${path.replace(/^\//, "")}`, {
    method: "PATCH",
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      "x-csrf-token": csrfPayload.csrfToken,
    },
    body: JSON.stringify(body),
  });
  return readResponse<T>(response);
}
