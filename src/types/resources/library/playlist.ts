import type { Resource } from "@/types/query/resource";
import type { CatalogPlaylist } from "@/types/resources/catalog/playlist";
import type { LibraryMusicVideo } from "@/types/resources/library/musicVideo";
import type { LibraryPlaylistFolder } from "@/types/resources/library/playlistFolder";
import type { LibrarySong } from "@/types/resources/library/song";
import type { BasePlaylistAttributes } from "@/types/resources/shared/playlist";

interface LibraryPlaylistAttributes extends BasePlaylistAttributes {
  canEdit: boolean;
  dateAdded?: string;
  lastModifiedDate?: string;
  hasCatalog: boolean;
  isPublic: boolean;
}

interface LibraryPlaylistExtend {
  trackTypes?: readonly ("library-music-videos" | "library-songs")[];
  tags?: readonly ("favorited" | (string & {}))[];
  trackCount?: number;
}

export type LibraryPlaylist = Resource<
  "library-playlists",
  LibraryPlaylistAttributes,
  LibraryPlaylistExtend,
  {
    catalog: CatalogPlaylist;
    tracks: LibrarySong | LibraryMusicVideo;
    parent: LibraryPlaylistFolder;
  }
>;
