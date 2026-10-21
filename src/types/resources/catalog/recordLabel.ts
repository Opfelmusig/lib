import type { Resource } from "@/types/query/resource";
import type { CatalogAlbum } from "@/types/resources/catalog/album";
import type { Artwork, Description } from "@/types/shared";

interface CatalogRecordLabelAttributes {
  artwork: Artwork;
  description?: Description;
  name: string;
  url: string;
}

interface CatalogRecordLabelExtend {}

export type CatalogRecordLabel = Resource<
  "record-labels",
  CatalogRecordLabelAttributes,
  CatalogRecordLabelExtend,
  {},
  {
    "latest-releases": CatalogAlbum;
    "top-releases": CatalogAlbum;
  }
>;
