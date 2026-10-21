import type { Resource } from "@/types/query/resource";
import type { CatalogPlaylist } from "@/types/resources/catalog/playlist";

interface PlaylistPeriodSummaryAttributes {
  firstPlayed?: string;
  lastPlayed?: string;
  listenTimeInMinutes?: number;
  playCount?: number;
}

interface PlaylistPeriodSummaryExtend {}

export type PlaylistPeriodSummary = Resource<
  "playlist-period-summaries",
  PlaylistPeriodSummaryAttributes,
  PlaylistPeriodSummaryExtend,
  {
    playlist: CatalogPlaylist;
  }
>;
