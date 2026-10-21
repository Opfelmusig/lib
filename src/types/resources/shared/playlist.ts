import type { Artwork, Description, PlayParameters } from "@/types/shared";

export interface BasePlaylistAttributes {
  artwork?: Artwork;
  description?: Description;
  name: string;
  playParams?: PlayParameters;
}
