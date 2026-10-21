import type { Resource } from "@/types/query/resource";
import type { CatalogMusicVideo } from "@/types/resources/catalog/musicVideo";
import type { LibraryAlbum } from "@/types/resources/library/album";
import type { LibraryArtist } from "@/types/resources/library/artist";
import type { BaseMusicVideoAttributes } from "@/types/resources/shared/musicVideo";

interface LibraryMusicVideoAttributes extends BaseMusicVideoAttributes {}

interface LibraryMusicVideoExtend {}

export type LibraryMusicVideo = Resource<
  "library-music-videos",
  LibraryMusicVideoAttributes,
  LibraryMusicVideoExtend,
  {
    albums: LibraryAlbum;
    artists: LibraryArtist;
    catalog: CatalogMusicVideo;
  }
>;
