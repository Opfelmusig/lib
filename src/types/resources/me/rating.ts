import type { ResourceOf } from "@/types/query/helpers";
import type { Resource } from "@/types/query/resource";
import type { RatingValue } from "@/types/shared";

interface MeRatingsAttributes {
  value?: RatingValue;
}

export type RatingResources = ResourceOf<
  | "albums"
  | "music-videos"
  | "playlists"
  | "songs"
  | "stations"
  | "library-music-videos"
  | "library-playlists"
  | "library-songs"
>;

export type Rating = Resource<
  "ratings",
  MeRatingsAttributes,
  {},
  {
    content: RatingResources;
  }
>;
