import type { Resource } from "@/types/query/resource";
import type { CatalogArtist } from "@/types/resources/catalog/artist";

interface ArtistPeriodSummaryAttributes {
  firstPlayed?: string;
  lastPlayed?: string;
  listenTimeInMinutes?: number;
  playCount?: number;
  year: string;
}

interface ArtistPeriodSummaryExtend {}

export type ArtistPeriodSummary = Resource<
  "artist-period-summaries",
  ArtistPeriodSummaryAttributes,
  ArtistPeriodSummaryExtend,
  {
    artist: CatalogArtist;
  }
>;
