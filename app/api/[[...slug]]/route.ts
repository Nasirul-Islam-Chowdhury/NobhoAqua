import serverlessHttp from "serverless-http";
import app from "@/server/app";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = serverlessHttp(app, { binary: false });

interface GatewayResult {
  statusCode: number;
  headers?: Record<string, string>;
  multiValueHeaders?: Record<string, string[]>;
  body?: string;
}

async function bridge(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? await req.text() : undefined;

  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const event = {
    httpMethod: req.method,
    path: url.pathname,
    queryStringParameters: Object.fromEntries(url.searchParams) as Record<string, string>,
    headers,
    body: body ?? null,
    isBase64Encoded: false,
  };

  const result = (await handler(event, {} as never)) as GatewayResult;

  const responseHeaders = new Headers();
  const multiHeaders = (result.multiValueHeaders ?? {}) as Record<string, string[]>;
  const singleHeaders = (result.headers ?? {}) as Record<string, string>;

  for (const [key, values] of Object.entries(multiHeaders)) {
    for (const value of values) responseHeaders.append(key, String(value));
  }
  for (const [key, value] of Object.entries(singleHeaders)) {
    if (!responseHeaders.has(key)) responseHeaders.set(key, String(value));
  }

  // The Response constructor throws if a body is given alongside a
  // null-body status (204/205/304) — even an empty string counts as "given".
  const nullBodyStatus = new Set([101, 204, 205, 304]);
  const responseBody = nullBodyStatus.has(result.statusCode) ? null : (result.body ?? "");

  return new Response(responseBody, {
    status: result.statusCode,
    headers: responseHeaders,
  });
}

export { bridge as DELETE, bridge as GET, bridge as PATCH, bridge as POST, bridge as PUT };
