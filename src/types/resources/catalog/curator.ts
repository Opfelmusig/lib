import type { Resource } from "@/types/query/resource";
import type { CatalogPlaylist } from "@/types/resources/catalog/playlist";
import type { Artwork, EditorialNote } from "@/types/shared";

interface CatalogCuratorBaseAttributes {
  artwork: Artwork;
  editorialNotes?: EditorialNote;
  name: string;
  url: string;
}

interface CatalogCuratorAttributes extends CatalogCuratorBaseAttributes {}

interface CatalogAppleCuratorAttributes extends CatalogCuratorBaseAttributes {
  kind: "Curator" | "Genre" | "Show";
  shortName?: string;
  showHostName?: string;
}

interface CatalogCuratorExtend {}

interface CatalogAppleCuratorExtend {}

export type CatalogCurator = Resource<
  "curators",
  CatalogCuratorAttributes,
  CatalogCuratorExtend,
  {
    playlists: CatalogPlaylist;
  }
>;

export type CatalogAppleCurator = Resource<
  "apple-curators",
  CatalogAppleCuratorAttributes,
  CatalogAppleCuratorExtend,
  {
    playlists: CatalogPlaylist;
  }
>;
