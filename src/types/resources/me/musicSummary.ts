import type { Resource } from "@/types/query/resource";
import type { CatalogPlaylist } from "@/types/resources/catalog/playlist";
import type { AlbumPeriodSummary } from "@/types/resources/me/summaries/albumPeriodSummary";
import type { ArtistPeriodSummary } from "@/types/resources/me/summaries/artistPeriodSummary";
import type { GenrePeriodSummary } from "@/types/resources/me/summaries/genrePeriodSummary";
import type { MonthlySongPeriodSummary } from "@/types/resources/me/summaries/monthlySongPeriodSummary";
import type { PlaylistPeriodSummary } from "@/types/resources/me/summaries/playlistPeriodSummary";
import type { SongPeriodSummary } from "@/types/resources/me/summaries/songPeriodSummary";
import type { StationPeriodSummary } from "@/types/resources/me/summaries/stationPeriodSummary";

interface MusicSummaryAttributes {
  name: string;
  month?: number;
  period: string;
  year: number;
  listenTimeInMinutes?: number;
  topSongCount?: number;
  uniqueAlbumCount?: number;
  uniqueArtistCount?: number;
  uniqueGenreCount?: number;
  uniquePlaylistCount?: number;
  uniqueSongCount?: number;
  uniqueStationCount?: number;
}

interface MusicSummaryExtend {}

export type MusicSummary = Resource<
  "music-summaries",
  MusicSummaryAttributes,
  MusicSummaryExtend,
  {
    playlist: CatalogPlaylist;
  },
  {
    "top-albums": AlbumPeriodSummary;
    "top-artists": ArtistPeriodSummary;
    "top-genres": GenrePeriodSummary;
    "top-playlists": PlaylistPeriodSummary;
    "top-songs": SongPeriodSummary;
    "top-songs-for-months": MonthlySongPeriodSummary;
    "top-stations": StationPeriodSummary;
  }
>;
