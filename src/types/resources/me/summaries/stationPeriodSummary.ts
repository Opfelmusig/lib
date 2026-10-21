import type { Resource } from "@/types/query/resource";
import type { CatalogStation } from "@/types/resources/catalog/station";

interface StationPeriodSummaryAttributes {
  firstPlayed?: string;
  lastPlayed?: string;
  listenTimeInMinutes?: number;
  playCount?: number;
}

interface StationPeriodSummaryExtend {}

export type StationPeriodSummary = Resource<
  "station-period-summaries",
  StationPeriodSummaryAttributes,
  StationPeriodSummaryExtend,
  {
    station: CatalogStation;
  }
>;
