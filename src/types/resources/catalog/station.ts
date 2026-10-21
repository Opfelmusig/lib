import type { Resource } from "@/types/query/resource";
import type { CatalogAppleCurator } from "@/types/resources/catalog/curator";
import type { Artwork, EditorialNote, PlayParameters } from "@/types/shared";

interface CatalogStationAttributes {
  artwork: Artwork;
  editorialNotes?: EditorialNote;
  mediaKind: "audio" | "video";
  isLive: boolean;
  kind:
    | "songSeeded"
    | "artistSeeded"
    | "albumSeeded"
    | "playlistSeeded"
    | "user"
    | "artistOnly"
    | "query"
    | "streaming";
  name: string;
  playParams?: PlayParameters;
  radioUrl?: string;
  requiresSubscription: boolean;
  url: string;
}

interface CatalogStationExtend {}

export type CatalogStation = Resource<
  "stations",
  CatalogStationAttributes,
  CatalogStationExtend,
  {
    "radio-show": CatalogAppleCurator;
  }
>;
