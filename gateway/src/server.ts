import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { handle, productionDeps, type Env } from "./handler";

const port = Number(process.env.PORT ?? 8787);
const env: Env = {
  ROOT_DOMAIN: process.env.ROOT_DOMAIN ?? "kudostack.my.id",
  RESERVED_SUBDOMAINS: process.env.RESERVED_SUBDOMAINS,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  GATEWAY_SECRET: process.env.GATEWAY_SECRET,
  STATIC_ROUTES: process.env.STATIC_ROUTES,
  ORIGIN_ROUTES: process.env.ORIGIN_ROUTES,
};

function originRoutes(): Record<string, string> {
  if (!env.ORIGIN_ROUTES) return {};
  const parsed: unknown = JSON.parse(env.ORIGIN_ROUTES);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("ORIGIN_ROUTES harus berupa JSON object.");
  }
  return Object.fromEntries(
    Object.entries(parsed).map(([host, origin]) => {
      if (typeof origin !== "string" || !/^https?:\/\//.test(origin)) {
        throw new Error(`Origin untuk ${host} tidak valid.`);
      }
      return [host.toLowerCase(), origin.replace(/\/+$/, "")];
    }),
  );
}

const routes = originRoutes();
const deps = productionDeps(env);

function requestHeaders(request: IncomingMessage): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(request.headers)) {
    if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }
  return headers;
}

function requestUrl(request: IncomingMessage): URL {
  const host = request.headers.host;
  if (!host) throw new Error("Request tidak memiliki Host header.");
  return new URL(request.url ?? "/", `http://${host}`);
}

async function passthrough(request: Request): Promise<Response> {
  const incoming = new URL(request.url);
  const origin = routes[incoming.hostname.toLowerCase()];
  if (!origin) {
    return new Response("Origin untuk host ini belum dikonfigurasi.", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  const target = new URL(`${origin}${incoming.pathname}${incoming.search}`);
  const headers = new Headers(request.headers);
  headers.set("host", target.host);
  headers.set("x-forwarded-host", incoming.host);
  headers.set("x-forwarded-proto", "https");
  return fetch(new Request(target, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "manual",
  }));
}

function writeResponse(response: Response, serverResponse: ServerResponse): void {
  serverResponse.statusCode = response.status;
  response.headers.forEach((value, key) => serverResponse.setHeader(key, value));
  if (!response.body) {
    serverResponse.end();
    return;
  }
  response.body.pipeTo(new WritableStream({
    write(chunk) {
      serverResponse.write(Buffer.from(chunk));
    },
    close() {
      serverResponse.end();
    },
    abort(error) {
      serverResponse.destroy(error instanceof Error ? error : undefined);
    },
  })).catch((error) => serverResponse.destroy(error));
}

const server = createServer(async (request, response) => {
  try {
    const url = requestUrl(request);
    const webRequest = new Request(url, {
      method: request.method,
      headers: requestHeaders(request),
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request,
      // Node's incoming stream is a web-compatible body only with duplex enabled.
      duplex: "half",
    } as RequestInit);
    const result = await handle(webRequest, env, {
      ...deps,
      passthrough,
    });
    writeResponse(result, response);
  } catch (error) {
    console.error("[gateway] server error", error);
    response.statusCode = 500;
    response.setHeader("content-type", "text/plain; charset=utf-8");
    response.end("Gateway error.");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`[gateway] listening on 0.0.0.0:${port}`);
});
