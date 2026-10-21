import type { MutateResource } from "@/types/mutate";

export type MutateLibraryPlaylist = MutateResource<
  {
    name: string;
    description?: string;
    isPublic?: boolean;
  },
  {
    tracks: "songs" | "library-songs";
    parent: "library-playlist-folders";
  }
>;
