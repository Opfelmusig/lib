import type { Resource } from "@/types/query/resource";
import type { CatalogActivity } from "@/types/resources/catalog/activity";
import type { CatalogArtist } from "@/types/resources/catalog/artist";
import type { CatalogAppleCurator, CatalogCurator } from "@/types/resources/catalog/curator";
import type { CatalogMusicVideo } from "@/types/resources/catalog/musicVideo";
import type { CatalogSong } from "@/types/resources/catalog/song";
import type { LibraryPlaylist } from "@/types/resources/library/playlist";
import type { SocialProfile } from "@/types/resources/me/profile";
import type { BasePlaylistAttributes } from "@/types/resources/shared/playlist";
import type { EditorialArtwork, EditorialVideo, RatingValue } from "@/types/shared";

type CatalogPlaylistType = "editorial" | "external" | "personal-mix" | "replay" | "user-shared";

interface CatalogPlaylistAttributes extends BasePlaylistAttributes {
  curatorName: string;
  curatorSocialHandle?: string;
  isChart: boolean;
  lastModifiedDate?: string;
  playlistType: CatalogPlaylistType;
  url: string;
}

interface CatalogPlaylistExtend {
  personalRating?: RatingValue;
  editorialVideo?: EditorialVideo;
  editorialArtwork?: EditorialArtwork;
  trackTypes?: readonly ("music-videos" | "songs")[];
  trackCount?: number;
}

export type CatalogPlaylist = Resource<
  "playlists",
  CatalogPlaylistAttributes,
  CatalogPlaylistExtend,
  {
    curator: CatalogActivity | CatalogAppleCurator | CatalogCurator | SocialProfile;
    library: LibraryPlaylist;
    tracks: CatalogSong | CatalogMusicVideo;
  },
  {
    "featured-artists": CatalogArtist;
    "more-by-curator": CatalogPlaylist;
  }
>;
