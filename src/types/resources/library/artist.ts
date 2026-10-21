import type { Resource } from "@/types/query/resource";
import type { CatalogArtist } from "@/types/resources/catalog/artist";
import type { LibraryAlbum } from "@/types/resources/library/album";
import type { BaseArtistAttributes } from "@/types/resources/shared/artist";

interface LibraryArtistAttributes extends BaseArtistAttributes {}

interface LibraryArtistExtend {}

export type LibraryArtist = Resource<
  "library-artists",
  LibraryArtistAttributes,
  LibraryArtistExtend,
  {
    albums: LibraryAlbum;
    catalog: CatalogArtist;
  }
>;
