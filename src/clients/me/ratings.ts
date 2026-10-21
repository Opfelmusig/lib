import { BaseResourceClient } from "@/clients/resource";
import { isNoRelatedResourcesError } from "@/core/error";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { RateableResourceTypes } from "@/types/combined";
import type { ConfigParam, DefaultParams, LimitParam, PaginationParams } from "@/types/params";
import type { ResourceOf } from "@/types/query/helpers";
import type { RelationshipNames, TypeOf } from "@/types/query/resource";
import type { ResourceResponse } from "@/types/query/response";
import type {
  RelationshipItem,
  ResourceScopes,
  ScopedResourceIterator,
} from "@/types/query/scopes";
import type { RatingResources } from "@/types/resources/me/rating";
import type { RatingValue } from "@/types/shared";

type TResource = ResourceOf<"ratings">;

export class RatingsClient extends BaseResourceClient {
  async set(id: string, type: RateableResourceTypes, value: RatingValue, opts: ConfigParam = {}) {
    await this.http.request(`${this.path}/ratings/${type}/${id}`, {
      config: opts.config,
      method: "PUT",
      body: JSON.stringify({
        type: "rating",
        attributes: { value },
      }),
    });
  }

  async delete(id: string, type: RateableResourceTypes, opts: ConfigParam = {}) {
    await this.http.request(`${this.path}/ratings/${type}/${id}`, {
      config: opts.config,
      method: "DELETE",
    });
  }

  async get<const TScopes extends ResourceScopes = {}>(
    id: string,
    type: TypeOf<RatingResources>,
    opts: DefaultParams<TScopes> = {},
  ) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const result = await this.http.request<Result>(`${this.path}/ratings/${type}/${id}`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  async getMany<const TScopes extends ResourceScopes = {}>(
    ids: string[],
    type: TypeOf<RatingResources>,
    opts: DefaultParams<TScopes> = {},
  ) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts).setStringArray("ids", ids);

    const result = await this.http.request<Result>(`${this.path}/ratings/${type}`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  /**
   * Unfortunately, Apple Music uses `40403` for both missing parents and empty relationships,
   * so we cannot distinguish between them. We handle this error by returning an empty collection.
   */
  async getRelationship<
    TRelationship extends RelationshipNames<TResource>,
    const TScopes extends ResourceScopes = {},
  >(
    id: string,
    type: TypeOf<RatingResources>,
    relationship: TRelationship,
    opts: DefaultParams<TScopes> & PaginationParams = {},
  ) {
    type Resource = RelationshipItem<TResource, TRelationship>;
    type Result = ResourceResponse<Resource, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    let result: Result;

    try {
      result = await this.http.request<Result>(
        `${this.path}/ratings/${type}/${id}/${relationship}`,
        {
          config: opts.config,
          query,
        },
      );
    } catch (cause) {
      if (!isNoRelatedResourcesError(cause)) throw cause;

      result = { data: [] };
    }

    return this.prepare(result);
  }

  iterateRelationship<
    TRelationship extends RelationshipNames<TResource>,
    const TScopes extends ResourceScopes = {},
  >(
    id: string,
    type: TypeOf<RatingResources>,
    relationship: TRelationship,
    opts: DefaultParams<TScopes> & LimitParam = {},
  ): ScopedResourceIterator<RelationshipItem<TResource, TRelationship>, TScopes> {
    return this.iterate((offset) =>
      this.getRelationship<TRelationship, TScopes>(id, type, relationship, {
        ...opts,
        offset,
      }),
    );
  }
}
