import type { Resource } from "@/types/query/resource";

export type StorefrontAttributes = {
  defaultLanguageTag: string;
  explicitContentPolicy: "allowed" | "opt-in" | "prohibited";
  name: string;
  supportedLanguageTags: readonly string[];
};

export type Storefront = Resource<"storefronts", StorefrontAttributes>;
