import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_INTERNAL_URL ?? "http://localhost:4000/api/v1";
const FORWARDED_HEADERS = ["accept", "content-type", "x-csrf-token", "idempotency-key"];

async function proxyRequest(
  request: NextRequest,
  context: { params: { path: string[] } },
): Promise<NextResponse> {
  const segments = context.params.path;
  if (segments.some((segment) => segment === "." || segment === ".." || /[\\/]/.test(segment))) {
    return NextResponse.json({ message: "Invalid API path" }, { status: 400 });
  }

  const path = segments.map(encodeURIComponent).join("/");
  const target = new URL(`${API_BASE_URL.replace(/\/$/, "")}/${path}${request.nextUrl.search}`);
  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const authorization = request.headers.get("authorization");
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);
  else if (authorization) headers.set("authorization", authorization);

  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);

  const hasBody = !["GET", "HEAD"].includes(request.method);
  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return NextResponse.json(
      { message: "The service is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }
  const responseHeaders = new Headers();
  for (const name of ["content-type", "cache-control", "content-disposition"]) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  const upstreamHeaders = upstream.headers as Headers & { getSetCookie?: () => string[] };
  for (const cookie of upstreamHeaders.getSetCookie?.() ?? []) {
    responseHeaders.append("set-cookie", cookie);
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
