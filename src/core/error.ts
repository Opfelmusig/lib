import type z from "zod";

import { type AppleMusicErrorSchema } from "@/schemas/error";

export type AppleMusicErrorKind = "response" | "network";
export type AppleMusicErrorDetail = z.infer<typeof AppleMusicErrorSchema>;

export interface AppleMusicErrorOptions {
  kind: AppleMusicErrorKind;
  url: string;
  status?: number;
  statusText?: string;
  retryAfter?: string;
  errors?: readonly AppleMusicErrorDetail[];
  message?: string;
  cause?: unknown;
}

function getDefaultMessage(options: AppleMusicErrorOptions) {
  if (options.kind === "network") return "Apple Music API network error";

  return `Apple Music API error ${options.status ?? "unknown"}${options.statusText ? ` ${options.statusText}` : ""}`;
}

export class AppleMusicError extends Error {
  readonly kind: AppleMusicErrorKind;
  readonly url: string;
  readonly status?: number;
  readonly statusText?: string;
  readonly retryAfter?: string;
  readonly errors: readonly AppleMusicErrorDetail[];

  constructor(options: AppleMusicErrorOptions) {
    super(options.message ?? getDefaultMessage(options), { cause: options.cause });

    this.name = "AppleMusicError";
    this.kind = options.kind;
    this.url = options.url;
    this.status = options.status;
    this.statusText = options.statusText;
    this.retryAfter = options.retryAfter;
    this.errors = options.errors ?? [];
  }
}

export function isNoRelatedResourcesError(cause: unknown): cause is AppleMusicError {
  return (
    cause instanceof AppleMusicError &&
    cause.status === 404 &&
    cause.errors.length > 0 &&
    cause.errors.every((error) => error.code === "40403")
  );
}
