import type { Artwork, ContentRating, PlayParameters } from "@/types/shared";

export interface BaseAlbumAttributes {
  artistName: string;
  artwork: Artwork;
  contentRating?: ContentRating;
  genreNames: readonly string[];
  name: string;
  playParams?: PlayParameters;
  releaseDate?: string;
  trackCount: number;
}
