import type { Artwork, ContentRating, PlayParameters } from "@/types/shared";

export interface BaseSongAttributes {
  artistName: string;
  albumName: string;
  artwork: Artwork;
  contentRating?: ContentRating;
  discNumber?: number;
  durationInMillis: number;
  genreNames: readonly string[];
  hasLyrics: boolean;
  name: string;
  playParams?: PlayParameters;
  releaseDate?: string;
  trackNumber?: number;
}
