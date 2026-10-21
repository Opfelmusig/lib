import type { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { RequestConfig } from "@/types/config";

export interface OpfelMusigHttpRequest {
  body?: BodyInit | null | ((tokens: HeaderConfig) => BodyInit | null);
  config?: RequestConfig;
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: RequestQueryBuilder;
}

export interface HeaderConfig {
  developerToken?: string | null;
  userToken?: string | null;
  excludeOrigin?: boolean;
}
