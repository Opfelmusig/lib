import type { Resource } from "@/types/query/resource";
import type { CatalogAlbum } from "@/types/resources/catalog/album";
import type { CatalogArtist } from "@/types/resources/catalog/artist";
import type { CatalogAudioAnalysis } from "@/types/resources/catalog/audioAnalysis";
import type { CatalogGenre } from "@/types/resources/catalog/genre";
import type { CatalogLyrics } from "@/types/resources/catalog/lyrics";
import type { CatalogMusicVideo } from "@/types/resources/catalog/musicVideo";
import type { CatalogRoleCategory } from "@/types/resources/catalog/roleCategory";
import type { CatalogStation } from "@/types/resources/catalog/station";
import type { CatalogSyllableLyrics } from "@/types/resources/catalog/syllableLyrics";
import type { LibrarySong } from "@/types/resources/library/song";
import type { BaseSongAttributes } from "@/types/resources/shared/song";
import type {
  AssetUrls,
  AudioVariants,
  EditorialNote,
  Offer,
  Preview,
  RatingValue,
} from "@/types/shared";

interface CatalogSongAttributes extends BaseSongAttributes {
  attribution?: string;
  composerName?: string;
  editorialNotes?: EditorialNote;
  isrc?: string;
  movementCount?: number;
  movementName?: string;
  movementNumber?: number;
  previews: readonly Preview[];
  url: string;
  workName?: string;
  audioLocale?: string;
  audioTraits?: readonly AudioVariants[];
  isMasteredForItunes: boolean;
  isVocalAttenuationAllowed: boolean;
  isAppleDigitalMaster: boolean;
  hasTimeSyncedLyrics: boolean;
}

interface CatalogSongExtend {
  artistUrl?: string;
  personalRating?: RatingValue;
  inLibrary?: boolean;
  extendedAssetUrls?: AssetUrls;
  lyricsExcerpt?: string;
  offers?: readonly Offer[];
}

export type CatalogSong = Resource<
  "songs",
  CatalogSongAttributes,
  CatalogSongExtend,
  {
    albums: CatalogAlbum;
    artists: CatalogArtist;
    "audio-analysis": CatalogAudioAnalysis;
    credits: CatalogRoleCategory;
    genres: CatalogGenre;
    library: LibrarySong;
    lyrics: CatalogLyrics;
    "music-videos": CatalogMusicVideo;
    station: CatalogStation;
    "syllable-lyrics": CatalogSyllableLyrics;
  }
>;
