import type { Resource } from "@/types/query/resource";
import type { BaseLyricsAttributes } from "@/types/resources/shared/lyrics";

interface CatalogLyricsAttributes extends BaseLyricsAttributes {}

interface CatalogLyricsExtend {}

export type CatalogLyrics = Resource<"lyrics", CatalogLyricsAttributes, CatalogLyricsExtend>;
