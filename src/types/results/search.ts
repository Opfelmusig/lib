import type { ResourceOf } from "@/types/query/helpers";
import type { Result } from "@/types/query/results";

export type SearchCatalogResult = Result<
  {
    activities: ResourceOf<"activities">;
    albums: ResourceOf<"albums">;
    "apple-curators": ResourceOf<"apple-curators">;
    artists: ResourceOf<"artists">;
    curators: ResourceOf<"curators">;
    "music-videos": ResourceOf<"music-videos">;
    playlists: ResourceOf<"playlists">;
    "record-labels": ResourceOf<"record-labels">;
    songs: ResourceOf<"songs">;
    stations: ResourceOf<"stations">;
  },
  {
    topResults: ResourceOf<
      | "activities"
      | "albums"
      | "apple-curators"
      | "artists"
      | "curators"
      | "music-videos"
      | "playlists"
      | "record-labels"
      | "songs"
      | "stations"
    >;
  },
  {
    activities: "activity";
    albums: "album";
    "apple-curators": "apple_curator";
    artists: "artist";
    curators: "curator";
    "music-videos": "music_video";
    playlists: "playlist";
    "record-labels": "record_label";
    songs: "song";
    stations: "radio_episode";
    topResults: "top";
  }
>;

export type SearchCatalogHintsResult = {
  results: {
    terms: readonly string[];
  };
};

export type SearchLibraryResult = Result<{
  "library-albums": ResourceOf<"library-albums">;
  "library-artists": ResourceOf<"library-artists">;
  "library-music-videos": ResourceOf<"library-music-videos">;
  "library-playlists": ResourceOf<"library-playlists">;
  "library-songs": ResourceOf<"library-songs">;
}>;

export type SearchSocialResult = Result<
  {
    playlists: ResourceOf<"playlists">;
    "social-profiles": ResourceOf<"social-profiles">;
  },
  {
    topResults: ResourceOf<"playlists" | "social-profiles">;
  },
  {
    playlists: "playlist";
    "social-profiles": "profile";
    topResults: "top";
  }
>;
