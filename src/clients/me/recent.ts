import { BaseResourceClient } from "@/clients/resource";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { DefaultParams, LimitParam, PaginationParams } from "@/types/params";
import type { ResourceOf } from "@/types/query/helpers";
import type { ResourceResponse } from "@/types/query/response";
import type { ResourceScopes, ScopedResourceIterator } from "@/types/query/scopes";

type RecentlyPlayedResource = ResourceOf<
  "albums" | "library-albums" | "playlists" | "library-playlists" | "stations"
>;

type RecentlyPlayedTrackResource = ResourceOf<
  "songs" | "library-songs" | "music-videos" | "library-music-videos"
>;

type RecentlyPlayedStationResource = ResourceOf<"stations">;

export class RecentClient extends BaseResourceClient {
  async getRecentlyPlayed<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> & PaginationParams = {},
  ) {
    type Result = ResourceResponse<RecentlyPlayedResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const result = await this.http.request<Result>(`${this.path}/recent/played`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  async getRecentlyPlayedTracks<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> & PaginationParams = {},
  ) {
    type Result = ResourceResponse<RecentlyPlayedTrackResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const result = await this.http.request<Result>(`${this.path}/recent/played/tracks`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  async getRecentlyPlayedStations<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> & PaginationParams = {},
  ) {
    type Result = ResourceResponse<RecentlyPlayedStationResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const result = await this.http.request<Result>(`${this.path}/recent/radio-stations`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  iterateRecentlyPlayed<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> & LimitParam = {},
  ): ScopedResourceIterator<RecentlyPlayedResource, TScopes> {
    return this.iterate((offset) => this.getRecentlyPlayed<TScopes>({ ...opts, offset }));
  }

  iterateRecentlyPlayedTracks<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> & LimitParam = {},
  ): ScopedResourceIterator<RecentlyPlayedTrackResource, TScopes> {
    return this.iterate((offset) => this.getRecentlyPlayedTracks<TScopes>({ ...opts, offset }));
  }

  iterateRecentlyPlayedStations<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> & LimitParam = {},
  ): ScopedResourceIterator<RecentlyPlayedStationResource, TScopes> {
    return this.iterate((offset) => this.getRecentlyPlayedStations<TScopes>({ ...opts, offset }));
  }
}
