import type { Resource } from "@/types/query/resource";
import type { CatalogAlbum } from "@/types/resources/catalog/album";
import type { CatalogArtist } from "@/types/resources/catalog/artist";
import type { CatalogGenre } from "@/types/resources/catalog/genre";
import type { CatalogSong } from "@/types/resources/catalog/song";
import type { LibraryMusicVideo } from "@/types/resources/library/musicVideo";
import type { BaseMusicVideoAttributes } from "@/types/resources/shared/musicVideo";
import type { EditorialNote, Preview, RatingValue } from "@/types/shared";

interface CatalogMusicVideoAttributes extends BaseMusicVideoAttributes {
  editorialNotes?: EditorialNote;
  has4K: boolean;
  hasHDR: boolean;
  isrc?: string;
  previews: readonly Preview[];
  url: string;
  videoSubType?: "preview";
  workId?: string;
  workName?: string;
}

interface CatalogMusicVideoExtend {
  artistUrl?: string;
  personalRating?: RatingValue;
}

export type CatalogMusicVideo = Resource<
  "music-videos",
  CatalogMusicVideoAttributes,
  CatalogMusicVideoExtend,
  {
    albums: CatalogAlbum;
    artists: CatalogArtist;
    genres: CatalogGenre;
    library: LibraryMusicVideo;
    songs: CatalogSong;
  },
  {
    "more-by-artist": CatalogMusicVideo;
    "more-in-genre": CatalogMusicVideo;
  }
>;
