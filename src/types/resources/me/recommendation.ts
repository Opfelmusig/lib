import type { Resource } from "@/types/query/resource";
import type { CatalogAlbum } from "@/types/resources/catalog/album";
import type { CatalogArtist } from "@/types/resources/catalog/artist";
import type { CatalogConcert } from "@/types/resources/catalog/concert";
import type { CatalogEditorialItem } from "@/types/resources/catalog/editorialItem";
import type { CatalogMusicVideo } from "@/types/resources/catalog/musicVideo";
import type { CatalogPlaylist } from "@/types/resources/catalog/playlist";
import type { CatalogStation } from "@/types/resources/catalog/station";
import type { LibraryAlbum } from "@/types/resources/library/album";
import type { LibraryArtist } from "@/types/resources/library/artist";
import type { LibraryMusicVideo } from "@/types/resources/library/musicVideo";
import type { LibraryPlaylist } from "@/types/resources/library/playlist";

export interface RecommendationDisplayString {
  contentIds?: readonly string[];
  stringForDisplay: string;
}

export type RecommendationDisplayKind =
  | "MusicCircleCoverShelf"
  | "MusicConcertsEmptyShelf"
  | "MusicCoverGrid"
  | "MusicCoverShelf"
  | "MusicNotesHeroShelf"
  | "MusicSocialCardShelf"
  | "MusicSuperHeroShelf";

export interface RecommendationDisplay {
  decorations: readonly string[];
  kind: RecommendationDisplayKind;
}

export type RecommendationKind =
  | "concerts-for-you"
  | "music-recommendations"
  | "recently-played"
  | "your-favorites";

interface RecommendationAttributes {
  display?: RecommendationDisplay;
  hasSeeAll: boolean;
  isGroupRecommendation: boolean;
  kind: RecommendationKind;
  nextUpdateDate: string;
  reason?: RecommendationDisplayString;
  resourceTypes: readonly string[];
  title?: RecommendationDisplayString;
  version: number;
}

interface RecommendationExtend {}

export type RecommendationContents =
  | CatalogAlbum
  | CatalogPlaylist
  | CatalogStation
  | CatalogMusicVideo
  | CatalogConcert
  | CatalogArtist
  | LibraryAlbum
  | LibraryPlaylist
  | LibraryMusicVideo
  | LibraryArtist
  | CatalogEditorialItem
  | Recommendation;

type RecommendationRelationships = {
  contents: RecommendationContents;
};

export type Recommendation = Resource<
  "personal-recommendation",
  RecommendationAttributes,
  RecommendationExtend,
  RecommendationRelationships,
  {
    "see-all": Recommendation;
  }
>;
