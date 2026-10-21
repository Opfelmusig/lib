import type { Resource } from "@/types/query/resource";
import type { CatalogArtist } from "@/types/resources/catalog/artist";
import type { CatalogPlaylist } from "@/types/resources/catalog/playlist";
import type { CatalogVenue } from "@/types/resources/catalog/venue";

interface ConcertProvider {
  name: string;
  url: string;
}

interface ConcertTicket {
  provider: ConcertProvider;
  vendor: string;
  url: string;
}

interface CatalogConcertAttributes {
  endISODateTime: string;
  startISODateTime: string;
  timezone: string;
  url: string;
}

interface CatalogConcertExtend {
  eventDataProviders?: readonly ConcertProvider[];
  ticketDataProvider?: ConcertProvider | readonly ConcertProvider[];
  tickets?: readonly ConcertTicket[];
}

export type CatalogConcert = Resource<
  "concerts",
  CatalogConcertAttributes,
  CatalogConcertExtend,
  {
    artists: CatalogArtist;
    playlists: CatalogPlaylist;
    venues: CatalogVenue;
  },
  {
    "more-upcoming-concerts": CatalogConcert;
  }
>;
