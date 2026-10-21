import type { Resource } from "@/types/query/resource";
import type { CatalogAlbum } from "@/types/resources/catalog/album";
import type { LibraryArtist } from "@/types/resources/library/artist";
import type { LibraryMusicVideo } from "@/types/resources/library/musicVideo";
import type { LibrarySong } from "@/types/resources/library/song";
import type { BaseAlbumAttributes } from "@/types/resources/shared/album";

interface LibraryAlbumAttributes extends BaseAlbumAttributes {
  dateAdded?: string;
}

interface LibraryAlbumExtend {}

export type LibraryAlbum = Resource<
  "library-albums",
  LibraryAlbumAttributes,
  LibraryAlbumExtend,
  {
    artists: LibraryArtist;
    catalog: CatalogAlbum;
    tracks: LibrarySong | LibraryMusicVideo;
  }
>;
