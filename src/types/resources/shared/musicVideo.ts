import type { Artwork, ContentRating, PlayParameters } from "@/types/shared";

export interface BaseMusicVideoAttributes {
  albumName?: string;
  artistName: string;
  artwork: Artwork;
  contentRating?: ContentRating;
  durationInMillis: number;
  genreNames: readonly string[];
  name: string;
  playParams?: PlayParameters;
  releaseDate?: string;
  trackNumber?: number;
}
