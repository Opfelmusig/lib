import type { Resource } from "@/types/query/resource";
import type { CatalogPlaylist } from "@/types/resources/catalog/playlist";
import type { Artwork, EditorialNote } from "@/types/shared";

interface CatalogActivityAttributes {
  artwork: Artwork;
  editorialNotes?: EditorialNote;
  name: string;
  url: string;
}

interface CatalogActivityExtend {}

export type CatalogActivity = Resource<
  "activities",
  CatalogActivityAttributes,
  CatalogActivityExtend,
  {
    playlists: CatalogPlaylist;
  }
>;
