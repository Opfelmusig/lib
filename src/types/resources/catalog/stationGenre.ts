import type { Resource } from "@/types/query/resource";
import type { CatalogStation } from "@/types/resources/catalog/station";

interface CatalogStationGenreAttributes {
  name: string;
}

interface CatalogStationGenreExtend {}

export type CatalogStationGenre = Resource<
  "station-genres",
  CatalogStationGenreAttributes,
  CatalogStationGenreExtend,
  {
    stations: CatalogStation;
  }
>;
