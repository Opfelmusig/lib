import type { ResourceOf } from "@/types/query/helpers";
import type { Result } from "@/types/query/results";

export type ChartResult = Result<{
  albums: ResourceOf<"albums">;
  "music-videos": ResourceOf<"music-videos">;
  playlists: ResourceOf<"playlists">;
  songs: ResourceOf<"songs">;
}>;
