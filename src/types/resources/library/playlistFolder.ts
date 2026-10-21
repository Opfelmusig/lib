import type { Resource } from "@/types/query/resource";
import type { LibraryPlaylist } from "@/types/resources/library/playlist";

interface LibraryPlaylistFolderAttributes {
  name: string;
  dateAdded?: string;
}

interface LibraryPlaylistFolderExtend {}

export type LibraryPlaylistFolder = Resource<
  "library-playlist-folders",
  LibraryPlaylistFolderAttributes,
  LibraryPlaylistFolderExtend,
  {
    children: LibraryPlaylist | LibraryPlaylistFolder;
    parent: LibraryPlaylistFolder;
  }
>;
