import type { ResourceOf, ValidateResourceName } from "@/types/query/helpers";

/* ====== Resource Types ====== */

export type CatalogResourceTypes = ValidateResourceName<
  | "activities"
  | "albums"
  | "apple-curators"
  | "artists"
  | "audio-analysis"
  | "concerts"
  | "credit-artists"
  | "curators"
  | "editorial-items"
  | "genres"
  | "music-videos"
  | "playlists"
  | "record-labels"
  | "role-categories"
  | "songs"
  | "stations"
  | "station-genres"
  | "lyrics"
  | "syllable-lyrics"
  | "venues"
>;

export type LibraryResourceTypes = ValidateResourceName<
  | "library-albums"
  | "library-artists"
  | "library-music-videos"
  | "library-playlist-folders"
  | "library-playlists"
  | "library-songs"
>;

export type MeResourceTypes = ValidateResourceName<
  | "genre-period-summaries"
  | "playlist-period-summaries"
  | "artist-period-summaries"
  | "monthly-song-period-summaries"
  | "song-period-summaries"
  | "album-period-summaries"
  | "music-summaries"
  | "station-period-summaries"
  | "personal-social-profiles"
  | "ratings"
  | "personal-recommendation"
>;

export type SocialResourceTypes = ValidateResourceName<"social-profiles">;

export type OtherResourceTypes = ValidateResourceName<"storefronts">;

export type ResourceTypes = ValidateResourceName<
  | CatalogResourceTypes
  | LibraryResourceTypes
  | MeResourceTypes
  | SocialResourceTypes
  | OtherResourceTypes
>;

/* ====== Resource Collections ====== */

export type CatalogResources = ResourceOf<CatalogResourceTypes>;
export type LibraryResources = ResourceOf<LibraryResourceTypes>;
export type MeResources = ResourceOf<MeResourceTypes>;
export type SocialResources = ResourceOf<SocialResourceTypes>;
export type OtherResources = ResourceOf<OtherResourceTypes>;
export type Resources = ResourceOf<ResourceTypes>;

/* ====== Group Types ====== */

export type PinnableResourceTypes = ValidateResourceName<
  | "library-albums"
  | "library-artists"
  | "library-music-videos"
  | "library-playlists"
  | "library-songs"
>;

export type RecentlyAddedResourceTypes = ValidateResourceName<
  "library-albums" | "library-playlists"
>;

export type RateableResourceTypes = ValidateResourceName<
  | "songs"
  | "albums"
  | "artists"
  | "playlists"
  | "library-songs"
  | "library-albums"
  | "library-artists"
  | "library-playlists"
>;

/* ====== Group Collections ====== */

export type PinnableResources = ResourceOf<PinnableResourceTypes>;

export type RecentlyAddedResources = ResourceOf<RecentlyAddedResourceTypes>;

export type RateableResources = ResourceOf<RateableResourceTypes>;
