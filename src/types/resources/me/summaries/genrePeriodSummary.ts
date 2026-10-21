import type { Resource } from "@/types/query/resource";

interface GenrePeriodSummaryAttributes {
  firstPlayed?: string;
  genreName?: string;
  lastPlayed?: string;
  listenTimeInMinutes?: number;
  playCount?: number;
}

interface GenrePeriodSummaryExtend {}

export type GenrePeriodSummary = Resource<
  "genre-period-summaries",
  GenrePeriodSummaryAttributes,
  GenrePeriodSummaryExtend
>;
