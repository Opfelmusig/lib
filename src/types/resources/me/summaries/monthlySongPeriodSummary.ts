import type { Resource } from "@/types/query/resource";
import type { CatalogSong } from "@/types/resources/catalog/song";

interface MonthlySongPeriodSummaryAttributes {
  firstPlayed?: string;
  lastPlayed?: string;
  playCount?: number;
}

interface MonthlySongPeriodSummaryExtend {}

export type MonthlySongPeriodSummary = Resource<
  "monthly-song-period-summaries",
  MonthlySongPeriodSummaryAttributes,
  MonthlySongPeriodSummaryExtend,
  {
    song: CatalogSong;
  }
>;
