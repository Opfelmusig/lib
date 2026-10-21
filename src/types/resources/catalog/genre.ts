import type { Resource } from "@/types/query/resource";

interface CatalogGenreAttributes {
  chartLabel?: string;
  name: string;
  parentId?: string;
  parentName?: string;
}

interface CatalogGenreExtend {}

export type CatalogGenre = Resource<"genres", CatalogGenreAttributes, CatalogGenreExtend>;
