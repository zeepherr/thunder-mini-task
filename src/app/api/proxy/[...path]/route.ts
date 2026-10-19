import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { serverEnv } from "@/config/server-env";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function handleProxy(request: Request, context: RouteContext) {
  const { path } = await context.params;
  if (
    path.length < 1 ||
    path.length > 2 ||
    path[0] !== "tasks" ||
    path.some((segment) => segment === "." || segment === "..")
  ) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (!serverEnv.coreApiUrl || !serverEnv.coreApiKey) {
    return NextResponse.json(
      { error: "Core API is not configured." },
      { status: 503 },
    );
  }

  const origin = request.headers.get("origin");
  if (origin && new URL(origin).origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("to_at")?.value;
  const incomingUrl = new URL(request.url);
  const pathSuffix = path.map(encodeURIComponent).join("/");
  const targetUrl = new URL(
    `/api/core/v1/${pathSuffix}${incomingUrl.search}`,
    serverEnv.coreApiUrl,
  );

  const headers = new Headers({ "x-api-key": serverEnv.coreApiKey });
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  let body: ArrayBuffer | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    const requestBody = await request.arrayBuffer();
    if (requestBody.byteLength > 0) {
      body = requestBody;
      headers.set("Content-Type", request.headers.get("content-type") ?? "application/json");
    }
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });
    const responseBody = await upstream.arrayBuffer();
    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Core API is temporarily unavailable." },
      { status: 502 },
    );
  }
}

export async function GET(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}
