import type { playlistFolderTreeScopes } from "@/clients/library/playlistFolder";
import type { CatalogActivity } from "@/types/resources/catalog/activity";
import type { CatalogAlbum } from "@/types/resources/catalog/album";
import type { CatalogArtist } from "@/types/resources/catalog/artist";
import type { CatalogAudioAnalysis } from "@/types/resources/catalog/audioAnalysis";
import type { CatalogConcert } from "@/types/resources/catalog/concert";
import type { CatalogCreditArtist } from "@/types/resources/catalog/creditArtist";
import type { CatalogAppleCurator, CatalogCurator } from "@/types/resources/catalog/curator";
import type { CatalogEditorialItem } from "@/types/resources/catalog/editorialItem";
import type { CatalogGenre } from "@/types/resources/catalog/genre";
import type { CatalogLyrics } from "@/types/resources/catalog/lyrics";
import type { CatalogMusicVideo } from "@/types/resources/catalog/musicVideo";
import type { CatalogPlaylist } from "@/types/resources/catalog/playlist";
import type { CatalogRecordLabel } from "@/types/resources/catalog/recordLabel";
import type { CatalogRoleCategory } from "@/types/resources/catalog/roleCategory";
import type { CatalogSong } from "@/types/resources/catalog/song";
import type { CatalogStation } from "@/types/resources/catalog/station";
import type { CatalogStationGenre } from "@/types/resources/catalog/stationGenre";
import type { CatalogSyllableLyrics } from "@/types/resources/catalog/syllableLyrics";
import type { CatalogVenue } from "@/types/resources/catalog/venue";
import type { LibraryAlbum } from "@/types/resources/library/album";
import type { LibraryArtist } from "@/types/resources/library/artist";
import type { LibraryMusicVideo } from "@/types/resources/library/musicVideo";
import type { MutateLibraryPlaylist } from "@/types/resources/library/mutate/playlist";
import type { MutateLibraryPlaylistFolder } from "@/types/resources/library/mutate/playlistFolder";
import type { LibraryPlaylist } from "@/types/resources/library/playlist";
import type { LibraryPlaylistFolder } from "@/types/resources/library/playlistFolder";
import type { LibrarySong } from "@/types/resources/library/song";
import type { MusicSummary } from "@/types/resources/me/musicSummary";
import type { PersonalSocialProfile } from "@/types/resources/me/profile";
import type { Rating, RatingResources } from "@/types/resources/me/rating";
import type {
  Recommendation,
  RecommendationContents,
  RecommendationDisplay,
  RecommendationDisplayKind,
  RecommendationDisplayString,
  RecommendationKind,
} from "@/types/resources/me/recommendation";
import type { AlbumPeriodSummary } from "@/types/resources/me/summaries/albumPeriodSummary";
import type { ArtistPeriodSummary } from "@/types/resources/me/summaries/artistPeriodSummary";
import type { GenrePeriodSummary } from "@/types/resources/me/summaries/genrePeriodSummary";
import type { MonthlySongPeriodSummary } from "@/types/resources/me/summaries/monthlySongPeriodSummary";
import type { PlaylistPeriodSummary } from "@/types/resources/me/summaries/playlistPeriodSummary";
import type { SongPeriodSummary } from "@/types/resources/me/summaries/songPeriodSummary";
import type { StationPeriodSummary } from "@/types/resources/me/summaries/stationPeriodSummary";
import type { Storefront } from "@/types/resources/other/storefront";

/* ====== General ====== */

export type { AnyResource } from "@/types/query/resource";
export type { Registry } from "@/types/query/registry";
export type { ResourceResponse } from "@/types/query/response";
export type {
  ResourceScopes,
  ScopedResource,
  ScopedResourceOf,
  ScopedResourceIterator,
} from "@/types/query/scopes";
export type { MutateRelationshipItems } from "@/types/mutate";
export type {
  ResourceOf,
  ResourceTemplate,
  ResourceTemplateOf,
  ValidateResourceName,
} from "@/types/query/helpers";

/* ====== Playback ====== */

export type * from "@/types/playback";

/* ====== Shared ====== */

export type * from "@/types/shared";

/* ====== Resources ====== */

type Song = CatalogSong | LibrarySong;
export type { CatalogSong, LibrarySong, Song };

type Album = CatalogAlbum | LibraryAlbum;
export type { Album, CatalogAlbum, LibraryAlbum };

type Artist = CatalogArtist | LibraryArtist;
export type { Artist, CatalogArtist, LibraryArtist };

type MusicVideo = CatalogMusicVideo | LibraryMusicVideo;
export type { CatalogMusicVideo, LibraryMusicVideo, MusicVideo };

type Playlist = CatalogPlaylist | LibraryPlaylist;
export type { CatalogPlaylist, LibraryPlaylist, Playlist };

export type {
  CatalogActivity,
  CatalogAppleCurator,
  CatalogAudioAnalysis,
  CatalogConcert,
  CatalogCreditArtist,
  CatalogCurator,
  CatalogEditorialItem,
  CatalogGenre,
  CatalogLyrics,
  CatalogRecordLabel,
  CatalogRoleCategory,
  CatalogStation,
  CatalogStationGenre,
  CatalogSyllableLyrics,
  CatalogVenue,
  LibraryPlaylistFolder,
};

export type {
  AudioAnalysisSummary,
  AudioAnalysisKey,
  AudioAnalysisLoudness,
  AudioAnalysisVocalActivity,
  CatalogAudioAnalysisAttributes,
} from "@/types/resources/catalog/audioAnalysis";

export type LibraryPlaylistFolderTreeScopes = typeof playlistFolderTreeScopes;

/* ====== Me Resources ====== */

export type {
  AlbumPeriodSummary,
  ArtistPeriodSummary,
  GenrePeriodSummary,
  MonthlySongPeriodSummary,
  MusicSummary,
  PlaylistPeriodSummary,
  PersonalSocialProfile,
  RatingResources,
  Rating,
  Recommendation,
  RecommendationKind,
  RecommendationDisplay,
  RecommendationDisplayKind,
  RecommendationDisplayString,
  RecommendationContents,
  SongPeriodSummary,
  StationPeriodSummary,
};

/* ====== Other Resources ====== */

export type { Storefront };

/* ====== Combined Resources ====== */

export type * from "@/types/combined";

/* ====== Library Mutations ====== */

export type { MutateLibraryPlaylist, MutateLibraryPlaylistFolder };
