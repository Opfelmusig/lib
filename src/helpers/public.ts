import type { LibraryResourceTypes } from "@/types/combined";
import type { Registry } from "@/types/query/registry";
import type { AnyResource } from "@/types/query/resource";
import type { ResourceScope, ResourceScopes } from "@/types/query/scopes";
import type { HeaderConfig } from "@/types/request";
import type { Artwork } from "@/types/shared";

export { ROOT_FOLDER_ID } from "@/clients/library/playlistFolder";

interface ImageOptions {
  width?: number;
  height?: number;
  crop?: string;
  format?: string;
}

export function defineScopes<const TScopes extends ResourceScopes>(scopes: TScopes) {
  return scopes;
}

export function defineResourceScope<
  const TKey extends Extract<keyof Registry, string>,
  const TScope extends ResourceScope<Extract<Registry[TKey], AnyResource>>,
>(_resource: TKey, scope: TScope) {
  return scope;
}

export function getArtworkUrl(artwork?: Artwork | string | null, options: ImageOptions = {}) {
  const url = typeof artwork === "string" ? artwork : artwork?.url;

  if (!url) return;

  const width = options?.width ?? options?.height ?? 512;
  const height = options?.height ?? width;

  return url
    .replace("{w}", String(width))
    .replace("{h}", String(height))
    .replace("{c}", options.crop ?? "")
    .replace("{f}", options.format ?? "jpg");
}

export function getArtworkExpiresAt(artwork?: Artwork | string | null) {
  const url = typeof artwork === "string" ? artwork : artwork?.url;

  if (!url) return;

  let params: URLSearchParams;
  try {
    params = new URL(url).searchParams;
  } catch {
    return;
  }

  const date = params.get("X-Amz-Date");
  const seconds = params.get("X-Amz-Expires");

  if (!date || !/^\d{8}T\d{6}Z$/.test(date) || !seconds || !/^\d+$/.test(seconds)) return;

  const iso = date.replace(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
    "$1-$2-$3T$4:$5:$6.000Z",
  );
  const signedAt = new Date(iso);

  if (!Number.isFinite(signedAt.getTime()) || signedAt.toISOString() !== iso) return;

  const expiresAt = new Date(signedAt.getTime() + Number(seconds) * 1000);

  return Number.isFinite(expiresAt.getTime()) ? expiresAt : undefined;
}

export function getDefaultHeaders(config?: HeaderConfig) {
  return {
    ...(config?.excludeOrigin ? {} : { Origin: "https://music.apple.com" }),
    ...(config?.developerToken
      ? {
          Authorization: `Bearer ${config.developerToken}`,
        }
      : {}),
    ...(config?.userToken
      ? {
          "Music-User-Token": config.userToken,
          "Media-User-Token": config.userToken,
        }
      : {}),
  };
}

export async function collect<T>(
  iterator: AsyncIterable<T>,
  options: {
    signal?: AbortSignal;
    onItem?: (item: T) => void | Promise<void>;
  } = {},
): Promise<T[]> {
  const result: T[] = [];

  for await (const item of iterator) {
    options.signal?.throwIfAborted();

    result.push(item);
    await options.onItem?.(item);
  }

  return result;
}

export function isLibraryResource<T extends { type: string }>(
  resource: T,
): resource is Extract<T, { type: LibraryResourceTypes }> {
  return resource.type.startsWith("library-");
}

export function isResourceType<T extends { type: string }, Types extends readonly T["type"][]>(
  resource: T,
  ...types: Types
): resource is Extract<T, { type: Types[number] }> {
  return types.includes(resource.type);
}

export function isNotResourceType<T extends { type: string }, Types extends readonly T["type"][]>(
  resource: T,
  ...types: Types
): resource is Exclude<T, Extract<T, { type: Types[number] }>> {
  return !types.includes(resource.type);
}

export { lyricScriptFromLanguage } from "@/helpers/language";
