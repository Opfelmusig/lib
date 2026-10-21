import { MusicSummaryClient } from "@/clients/me/musicSummary";
import { RatingsClient } from "@/clients/me/ratings";
import { RecentClient } from "@/clients/me/recent";
import { RecommendationClient } from "@/clients/me/recommendation";
import { StationClient } from "@/clients/me/station";
import { BaseResourceClient } from "@/clients/resource";
import type { HttpClient } from "@/core/http";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { DefaultParams, LimitParam, PaginationParams } from "@/types/params";
import type { ResourceResponse } from "@/types/query/response";
import type { ResourceScopes, ScopedResourceIterator } from "@/types/query/scopes";
import type { LibraryPlaylist } from "@/types/resources/library/playlist";
import type { PersonalSocialProfile } from "@/types/resources/me/profile";
import type { Storefront } from "@/types/resources/other/storefront";

export class MeClient extends BaseResourceClient {
  recommendations: RecommendationClient;
  musicSummaries: MusicSummaryClient;
  recent: RecentClient;
  ratings: RatingsClient;
  stations: StationClient;

  constructor(http: HttpClient, path: string) {
    super(http, path);

    this.recommendations = new RecommendationClient(http, path);
    this.musicSummaries = new MusicSummaryClient(http, path);
    this.recent = new RecentClient(http, path);
    this.ratings = new RatingsClient(http, path);
    this.stations = new StationClient(http, path);
  }

  async getStorefront<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> = {},
  ) {
    type Result = ResourceResponse<Storefront, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const result = await this.http.request<Result>(`${this.path}/storefront`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  async getProfile<const TScopes extends ResourceScopes = {}>(opts: DefaultParams<TScopes> = {}) {
    type Result = ResourceResponse<PersonalSocialProfile, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const result = await this.http.request<Result>(`${this.path}/social/profile`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  async getHeavyRotation<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> & PaginationParams = {},
  ) {
    type Result = ResourceResponse<LibraryPlaylist, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const result = await this.http.request<Result>(`${this.path}/history/heavy-rotation`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  iterateHeavyRotation<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> & LimitParam = {},
  ): ScopedResourceIterator<LibraryPlaylist, TScopes> {
    return this.iterate((offset) => this.getHeavyRotation<TScopes>({ ...opts, offset }));
  }
}
