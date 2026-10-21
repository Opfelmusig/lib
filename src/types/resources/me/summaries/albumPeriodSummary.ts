import type { Resource } from "@/types/query/resource";
import type { CatalogAlbum } from "@/types/resources/catalog/album";

interface AlbumPeriodSummaryAttributes {
  firstPlayed?: string;
  lastPlayed?: string;
  listenTimeInMinutes?: number;
  playCount?: number;
  year: string;
}

interface AlbumPeriodSummaryExtend {}

export type AlbumPeriodSummary = Resource<
  "album-period-summaries",
  AlbumPeriodSummaryAttributes,
  AlbumPeriodSummaryExtend,
  {
    album: CatalogAlbum;
  }
>;
