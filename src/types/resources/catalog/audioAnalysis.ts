import type { Resource } from "@/types/query/resource";

export interface AudioAnalysisSummary<T> {
  beginning?: T;
  ending?: T;
  main: T;
}

export interface AudioAnalysisKey {
  mode: "major" | "minor";
  tonic: string;
}

export interface AudioAnalysisLoudness {
  value: number;
  peak?: number;
  range?: number;
}

export interface AudioAnalysisVocalActivity {
  startInMilliseconds: number;
  endInMilliseconds: number;
  strength: "very-low" | "low" | "medium" | "high" | "very-high";
}

export interface CatalogAudioAnalysisAttributes {
  acousticness?: AudioAnalysisSummary<number>;
  beats?: {
    barsInMilliseconds: readonly number[];
    beatsInMilliseconds: readonly number[];
  };
  bpm?: AudioAnalysisSummary<number> & {
    percentDeviation?: number;
  };
  danceability?: AudioAnalysisSummary<number>;
  energy?: AudioAnalysisSummary<number>;
  key?: AudioAnalysisSummary<AudioAnalysisKey>;
  loudness?: AudioAnalysisSummary<AudioAnalysisLoudness>;
  melodicness?: AudioAnalysisSummary<number>;
  valence?: AudioAnalysisSummary<number>;
  vocalActivity?: readonly AudioAnalysisVocalActivity[];
}

export type CatalogAudioAnalysis = Resource<"audio-analysis", CatalogAudioAnalysisAttributes>;
