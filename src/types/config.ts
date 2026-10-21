export interface LanguageConfig {
  /** Default catalog language. Use a language supported by the user's storefront. */
  default?: string;
  /** Default lyrics language. */
  lyrics?: string;
  /** Default lyrics script tag. Set the lyrics language when using this option. */
  script?: string;
}

type Token = string | null | undefined;

export type TokenProvider = Token | (() => Token | Promise<Token>);

export interface HttpEvent {
  method: string;
  url: string;
  status?: number;
  statusText?: string;
  durationMs: number;
  response?: unknown;
  error?: {
    name: string;
    message: string;
  };
}

export interface OpfelMusigConfig {
  developerToken?: TokenProvider;
  userToken?: TokenProvider;
  language?: LanguageConfig;
  /** Storefront used for requests. Set this to the user's storefront. */
  storefront?: string;
  /**
   * Override the API base URL to use a proxy.
   *
   * Forward requests to `https://amp-api.music.apple.com`.
   */
  baseUrl?: string;
  /**
   * Exclude the `Origin` header when using a proxy.
   * Make sure the proxy adds the header back.
   *
   * Required headers:
   * - `origin: https://music.apple.com`
   * - `Authorization: Bearer {DEVELOPER_TOKEN}`
   *
   * Optional headers:
   * - `Music-User-Token: {USER_TOKEN}`
   * - `Media-User-Token: {USER_TOKEN}`
   *
   * In your proxy, import `getDefaultHeaders` from `@opfelmusig/lib/helpers`.
   */
  excludeOrigin?: boolean;
  extraHeaders?: Record<string, string>;
  /**
   * Custom fetch implementation. Defaults to `globalThis.fetch`.
   */
  fetch?: typeof globalThis.fetch;
  onHttpEvent?: (event: HttpEvent) => void | Promise<void>;
  debug?: boolean;
}

export interface RequestConfig {
  language?: LanguageConfig;
  storefront?: string;
  extraParams?: Record<string, string>;
  extraHeaders?: Record<string, string>;
  signal?: AbortSignal;
}
