import type { Resource } from "@/types/query/resource";
import type { BaseLyricsAttributes } from "@/types/resources/shared/lyrics";

interface CatalogSyllableLyricsAttributes extends BaseLyricsAttributes {}

interface CatalogSyllableLyricsExtend {
  ttmlLocalizations?: string;
}

export type CatalogSyllableLyrics = Resource<
  "syllable-lyrics",
  CatalogSyllableLyricsAttributes,
  CatalogSyllableLyricsExtend
>;
