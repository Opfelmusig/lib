import type { MutateResource } from "@/types/mutate";

export type MutateLibraryPlaylistFolder = MutateResource<
  {
    name: string;
  },
  {
    parent: "library-playlist-folders";
  }
>;
