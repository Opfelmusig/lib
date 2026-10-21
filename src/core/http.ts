import { AppleMusicError } from "@/core/error";
import { getDefaultHeaders } from "@/helpers/public";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import { AppleMusicErrorResponseSchema } from "@/schemas/error";
import type { HttpEvent, OpfelMusigConfig, TokenProvider } from "@/types/config";
import type { OpfelMusigHttpRequest } from "@/types/request";

export const appleMusicApiUrl = "https://amp-api.music.apple.com";

type DeepPartialNullable<T> = T extends (...args: any[]) => any
  ? T | null
  : T extends object
    ? { [K in keyof T]?: DeepPartialNullable<T[K]> | null }
    : T | null;

function mergePatch<T extends object>(current: T, patch: DeepPartialNullable<T>): T {
  const next = { ...(current as Record<string, unknown>) };

  for (const [key, value] of Object.entries(patch as object)) {
    if (value === undefined) continue;

    if (value === null) {
      delete next[key];
      continue;
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      next[key] = mergePatch(
        (next[key] ?? {}) as Record<string, unknown>,
        value as Record<string, unknown>,
      );
      continue;
    }

    next[key] = value;
  }

  return next as T;
}

async function resolveToken(token: TokenProvider) {
  return typeof token === "function" ? token() : token;
}

function rethrowAbort(cause: unknown, signal?: AbortSignal) {
  if (signal?.aborted) throw signal.reason ?? cause;
  if (cause instanceof Error && cause.name === "AbortError") throw cause;
}

function headerValue(headers: Record<string, string>, name: string) {
  const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase());
  return entry?.[1];
}

function bearerToken(value?: string) {
  return value?.match(/^Bearer\s+(.+)$/i)?.[1];
}

function httpEventError(kind: "network" | "parse", aborted = false): HttpEvent["error"] {
  if (aborted) {
    return {
      name: "AbortError",
      message: "Request aborted",
    };
  }

  return kind === "network"
    ? {
        name: "NetworkError",
        message: "Request failed",
      }
    : {
        name: "ParseError",
        message: "Response parsing failed",
      };
}

export class HttpClient {
  constructor(private config: OpfelMusigConfig) {}

  edit = (config: DeepPartialNullable<OpfelMusigConfig>) => {
    this.config = mergePatch<OpfelMusigConfig>(this.config, config);
  };

  get conf() {
    return {
      storefront: this.config.storefront,
      language: this.config.language,
    };
  }

  private async prepareTokens() {
    return {
      developerToken: await resolveToken(this.config.developerToken),
      userToken: await resolveToken(this.config.userToken),
      excludeOrigin: this.config.excludeOrigin,
    };
  }

  private get baseUrl() {
    const baseUrl = this.config.baseUrl ?? appleMusicApiUrl;
    return baseUrl.replace(/\/$/, "");
  }

  private emit(event: HttpEvent) {
    const observer = this.config.onHttpEvent;
    if (!observer) return;

    try {
      Promise.resolve(observer(event)).catch(() => {});
    } catch {
      return;
    }
  }

  private async send<T>(url: string, request: OpfelMusigHttpRequest): Promise<T> {
    const configuredTokens = await this.prepareTokens();
    const method = request.method ?? "GET";
    const headers: Record<string, string> = {
      ...getDefaultHeaders(configuredTokens),
      ...(method !== "GET" && request.body
        ? {
            "Content-Type": "application/json",
          }
        : undefined),
      ...this.config.extraHeaders,
      ...request.config?.extraHeaders,
      ...request.headers,
    };
    const requestTokens = {
      developerToken:
        bearerToken(headerValue(headers, "Authorization")) ?? configuredTokens.developerToken,
      userToken:
        headerValue(headers, "Media-User-Token") ??
        headerValue(headers, "Music-User-Token") ??
        configuredTokens.userToken,
      excludeOrigin: configuredTokens.excludeOrigin,
    };
    const body = typeof request.body === "function" ? request.body(requestTokens) : request.body;

    const fetch = this.config.fetch ?? globalThis.fetch;
    const startedAt = performance.now();
    let response: Response;

    try {
      response = await fetch(url, {
        body,
        headers,
        method,
        signal: request.config?.signal,
      });
    } catch (cause) {
      const aborted =
        request.config?.signal?.aborted || (cause instanceof Error && cause.name === "AbortError");

      this.emit({
        method,
        url,
        durationMs: performance.now() - startedAt,
        error: httpEventError("network", aborted),
      });

      rethrowAbort(cause, request.config?.signal);

      throw new AppleMusicError({
        kind: "network",
        url,
        cause,
      });
    }

    if (this.config.debug) {
      console.log(`RES ${response.status} [${response.statusText}]`);
    }

    const responseContext = {
      url,
      status: response.status,
      statusText: response.statusText,
      retryAfter: response.headers.get("Retry-After") ?? undefined,
    };
    let result: unknown;

    try {
      const body = await response.text();

      result = body.trim() === "" ? undefined : JSON.parse(body);
    } catch (cause) {
      const aborted =
        request.config?.signal?.aborted || (cause instanceof Error && cause.name === "AbortError");

      this.emit({
        method,
        url,
        status: response.status,
        statusText: response.statusText,
        durationMs: performance.now() - startedAt,
        error: httpEventError("parse", aborted),
      });

      throw cause;
    }

    if (!response.ok) {
      let errorResponse;

      try {
        errorResponse = AppleMusicErrorResponseSchema.parse(result);
      } catch (cause) {
        this.emit({
          method,
          url,
          status: response.status,
          statusText: response.statusText,
          durationMs: performance.now() - startedAt,
          response: result,
          error: httpEventError("parse"),
        });

        throw cause;
      }

      this.emit({
        method,
        url,
        status: response.status,
        statusText: response.statusText,
        durationMs: performance.now() - startedAt,
        response: result,
      });

      throw new AppleMusicError({
        kind: "response",
        ...responseContext,
        errors: errorResponse.errors,
      });
    }

    this.emit({
      method,
      url,
      status: response.status,
      statusText: response.statusText,
      durationMs: performance.now() - startedAt,
      response: result,
    });

    return result as T;
  }

  async request<T>(path: string, request: OpfelMusigHttpRequest = {}): Promise<T> {
    const questionIndex = path.indexOf("?");

    const url = questionIndex === -1 ? path : path.slice(0, questionIndex);
    const params = questionIndex === -1 ? "" : path.slice(questionIndex + 1);

    const requestPath = url
      .replace("{{storefront}}", request.config?.storefront ?? this.config.storefront ?? "us")
      .replace(/^\/+/, "");

    const requestQuery = RequestQueryBuilder.create(request.query)
      .language(this.config.language)
      .requestConfig(request.config)
      .urlParams(params)
      .set("art[url]", "f")
      .set("omit[resource]", "autos")
      .prepare();

    const query = new URLSearchParams(requestQuery).toString();
    const requestUrl = `${this.baseUrl}/${requestPath}${query ? `?${query}` : ""}`;

    const method = request.method ?? "GET";

    if (this.config.debug) {
      const {
        ["art[url]"]: artworkUrlFormat,
        ["omit[resource]"]: omitResource,
        ...rest
      } = requestQuery;

      console.log(`REQ ${method} [/${requestPath}] - ${JSON.stringify(rest)}`);
    }

    return this.send(requestUrl, request);
  }

  async requestUrl<T>(url: string, request: OpfelMusigHttpRequest = {}): Promise<T> {
    const parsedUrl = new URL(url);

    if (this.config.debug) {
      console.log(`REQ ${request.method ?? "GET"} [${parsedUrl.origin}${parsedUrl.pathname}]`);
    }

    return this.send(url, request);
  }
}
