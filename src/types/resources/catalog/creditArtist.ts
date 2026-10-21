import type { Resource } from "@/types/query/resource";
import type { Artwork } from "@/types/shared";

interface CatalogCreditArtistAttributes {
  artwork?: Artwork;
  name: string;
  roleNames: readonly string[];
}

interface CatalogCreditArtistExtend {}

export type CatalogCreditArtist = Resource<
  "credit-artists",
  CatalogCreditArtistAttributes,
  CatalogCreditArtistExtend
>;
