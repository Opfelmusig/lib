import type { Resource } from "@/types/query/resource";
import type { CatalogAlbum } from "@/types/resources/catalog/album";
import type { CatalogConcert } from "@/types/resources/catalog/concert";
import type { CatalogGenre } from "@/types/resources/catalog/genre";
import type { CatalogMusicVideo } from "@/types/resources/catalog/musicVideo";
import type { CatalogPlaylist } from "@/types/resources/catalog/playlist";
import type { CatalogSong } from "@/types/resources/catalog/song";
import type { CatalogStation } from "@/types/resources/catalog/station";
import type { BaseArtistAttributes } from "@/types/resources/shared/artist";
import type {
  Artwork,
  AssetUrls,
  EditorialArtwork,
  EditorialNote,
  EditorialVideo,
  RatingValue,
} from "@/types/shared";

interface ArtistHero {
  url: string;
}

interface CatalogArtistAttributes extends BaseArtistAttributes {
  artwork?: Artwork;
  genreNames: readonly string[];
  url: string;
  editorialNotes?: EditorialNote;
}

interface CatalogArtistExtend {
  editorialVideo?: EditorialVideo;
  editorialArtwork?: EditorialArtwork;
  personalRating?: RatingValue;
  artistBio?: string;
  bornOrFormed?: string;
  hero?: ArtistHero;
  isGroup?: boolean;
  origin?: string;
  extendedAssetUrls?: AssetUrls;
}

export type CatalogArtist = Resource<
  "artists",
  CatalogArtistAttributes,
  CatalogArtistExtend,
  {
    albums: CatalogAlbum;
    bands: CatalogArtist;
    "default-playable-content": CatalogStation;
    genres: CatalogGenre;
    "music-videos": CatalogMusicVideo;
    persons: CatalogArtist;
    playlists: CatalogPlaylist;
    station: CatalogStation;
  },
  {
    "all-upcoming-concerts": CatalogConcert;
    "appears-on-albums": CatalogAlbum;
    "compilation-albums": CatalogAlbum;
    "featured-albums": CatalogAlbum;
    "featured-on-albums": CatalogAlbum;
    "featured-release": CatalogAlbum;
    "full-albums": CatalogAlbum;
    "latest-release": CatalogAlbum;
    "live-albums": CatalogAlbum;
    "more-to-hear": CatalogStation;
    "music-videos": CatalogMusicVideo;
    playlists: CatalogPlaylist;
    "similar-artists": CatalogArtist;
    singles: CatalogAlbum;
    "top-songs": CatalogSong;
  }
>;
