import type { Resource } from "@/types/query/resource";
import type { CatalogSong } from "@/types/resources/catalog/song";

interface SongPeriodSummaryAttributes {
  firstPlayed?: string;
  lastPlayed?: string;
  listenTimeInMinutes?: number;
  playCount?: number;
  year: string;
}

interface SongPeriodSummaryExtend {}

export type SongPeriodSummary = Resource<
  "song-period-summaries",
  SongPeriodSummaryAttributes,
  SongPeriodSummaryExtend,
  {
    song: CatalogSong;
  }
>;
