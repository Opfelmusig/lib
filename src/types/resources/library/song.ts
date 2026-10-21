import type { Resource } from "@/types/query/resource";
import type { CatalogSong } from "@/types/resources/catalog/song";
import type { LibraryAlbum } from "@/types/resources/library/album";
import type { LibraryArtist } from "@/types/resources/library/artist";
import type { BaseSongAttributes } from "@/types/resources/shared/song";

interface LibrarySongAttributes extends BaseSongAttributes {}

interface LibrarySongExtend {}

export type LibrarySong = Resource<
  "library-songs",
  LibrarySongAttributes,
  LibrarySongExtend,
  {
    albums: LibraryAlbum;
    artists: LibraryArtist;
    catalog: CatalogSong;
  }
>;
