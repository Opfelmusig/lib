import type { Resource } from "@/types/query/resource";
import type { CatalogArtist } from "@/types/resources/catalog/artist";
import type { CatalogGenre } from "@/types/resources/catalog/genre";
import type { CatalogMusicVideo } from "@/types/resources/catalog/musicVideo";
import type { CatalogPlaylist } from "@/types/resources/catalog/playlist";
import type { CatalogRecordLabel } from "@/types/resources/catalog/recordLabel";
import type { CatalogSong } from "@/types/resources/catalog/song";
import type { CatalogStation } from "@/types/resources/catalog/station";
import type { LibraryAlbum } from "@/types/resources/library/album";
import type { BaseAlbumAttributes } from "@/types/resources/shared/album";
import type {
  AssetUrls,
  AudioVariants,
  EditorialArtwork,
  EditorialNote,
  EditorialVideo,
  RatingValue,
} from "@/types/shared";

interface CatalogAlbumAttributes extends BaseAlbumAttributes {
  copyright?: string;
  editorialNotes?: EditorialNote;
  isMasteredForItunes: boolean;
  isSingle: boolean;
  isCompilation: boolean;
  isComplete: boolean;
  isPrerelease: boolean;
  recordLabel?: string;
  audioTraits?: readonly AudioVariants[];
  upc?: string;
  url: string;
}

interface CatalogAlbumExtend {
  artistUrl?: string;
  editorialVideo?: EditorialVideo;
  editorialArtwork?: EditorialArtwork;
  personalRating?: RatingValue;
  extendedAssetUrls?: AssetUrls;
}

export type CatalogAlbum = Resource<
  "albums",
  CatalogAlbumAttributes,
  CatalogAlbumExtend,
  {
    artists: CatalogArtist;
    genres: CatalogGenre;
    library: LibraryAlbum;
    "record-labels": CatalogRecordLabel;
    tracks: CatalogSong | CatalogMusicVideo;
  },
  {
    "appears-on": CatalogPlaylist;
    "audio-extras": CatalogStation;
    "more-by-artist": CatalogAlbum;
    "other-versions": CatalogAlbum;
    "related-videos": CatalogMusicVideo;
    "video-extras": CatalogMusicVideo;
    "you-might-also-like": CatalogAlbum;
  }
>;
