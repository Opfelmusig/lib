import type { Resource } from "@/types/query/resource";
import type { CatalogCreditArtist } from "@/types/resources/catalog/creditArtist";

interface CatalogRoleCategoryAttributes {
  kind: string;
  title: string;
}

interface CatalogRoleCategoryExtend {}

export type CatalogRoleCategory = Resource<
  "role-categories",
  CatalogRoleCategoryAttributes,
  CatalogRoleCategoryExtend,
  {
    "credit-artists": CatalogCreditArtist;
  }
>;
