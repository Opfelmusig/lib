import type { Resource } from "@/types/query/resource";

interface VenueGeoLocation {
  latitude: number;
  longitude: number;
}

interface VenueStructuredAddress {
  address: string;
  city: string;
  country: string;
  countryIsoCode: string;
  postCode: string;
  region: string;
}

interface CatalogVenueAttributes {
  geoLocation: VenueGeoLocation;
  name: string;
  structuredAddress: VenueStructuredAddress;
}

export type CatalogVenue = Resource<"venues", CatalogVenueAttributes>;
