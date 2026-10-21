import { isNoRelatedResourcesError } from "@/core/error";
import type { HttpClient } from "@/core/http";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { DefaultParams, LimitParam, PaginationParams, SortParams } from "@/types/params";
import type { Registry } from "@/types/query/registry";
import type { AnyResource, RelationshipNames, ViewNames } from "@/types/query/resource";
import type { ResourceResponse } from "@/types/query/response";
import type { AnyResult, ResultShape, ShapedResult } from "@/types/query/results";
import type {
  RelationshipItem,
  ResourceScopes,
  ScopedResourceIterator,
  ViewItem,
} from "@/types/query/scopes";

type ResourceClientConstructor<TKey extends keyof Registry> = new (
  http: HttpClient,
  path: string,
) => ResourceClient<TKey>;

type LibraryResourceClientConstructor<TKey extends keyof Registry> = new (
  http: HttpClient,
  path: string,
) => LibraryResourceClient<TKey>;

export abstract class BaseResourceClient {
  constructor(
    protected readonly http: HttpClient,
    protected readonly path: string,
  ) {}

  protected prepare<TResource extends AnyResource, TScopes extends ResourceScopes = {}>(
    raw: ResourceResponse<TResource, TScopes>,
  ) {
    return raw;
  }

  protected prepareResults<
    TResult extends AnyResult,
    TTypes extends ResultShape<TResult>,
    TScopes extends ResourceScopes = {},
  >(raw: ShapedResult<TResult, TTypes, TScopes>) {
    return raw;
  }

  protected async *iterate<
    TResource extends AnyResource,
    const TScopes extends ResourceScopes = {},
  >(
    fetch: (offset: number) => Promise<ResourceResponse<TResource, TScopes>>,
    initialOffset = 0,
  ): ScopedResourceIterator<TResource, TScopes> {
    let page = await fetch(initialOffset);

    while (true) {
      yield* page.data;

      if (!page.next) break;

      const offsetValue = new URL(page.next, "https://music.apple.com").searchParams.get("offset");

      if (!offsetValue) break;

      const offset = Number(offsetValue);

      if (Number.isNaN(offset)) break;

      page = await fetch(offset);
    }
  }
}

export abstract class ResourceClient<
  TKey extends keyof Registry,
  TResource extends Registry[TKey] = Registry[TKey],
> extends BaseResourceClient {
  protected readonly type: string;

  constructor(http: HttpClient, path: string, type = "") {
    super(http, path);

    this.type = type;
  }

  async get<const TScopes extends ResourceScopes = {}>(
    id: string,
    opts: DefaultParams<TScopes> = {},
  ) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const result = await this.http.request<Result>(`${this.path}/${this.type}/${id}`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  async getMany<const TScopes extends ResourceScopes = {}>(
    ids: string[],
    opts: DefaultParams<TScopes> = {},
  ) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts).setStringArray("ids", ids);

    const result = await this.http.request<Result>(`${this.path}/${this.type}`, {
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
  >(id: string, relationship: TRelationship, opts: DefaultParams<TScopes> & PaginationParams = {}) {
    type Resource = RelationshipItem<TResource, TRelationship>;
    type Result = ResourceResponse<Resource, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    let result: Result;

    try {
      result = await this.http.request<Result>(`${this.path}/${this.type}/${id}/${relationship}`, {
        config: opts.config,
        query,
      });
    } catch (cause) {
      if (!isNoRelatedResourcesError(cause)) throw cause;

      result = { data: [] };
    }

    return this.prepare(result);
  }

  /**
   * Unfortunately, Apple Music uses `40403` for both missing parents and empty relationships,
   * so we cannot distinguish between them. We handle this error by returning an empty collection.
   */
  async getView<TView extends ViewNames<TResource>, const TScopes extends ResourceScopes = {}>(
    id: string,
    view: TView,
    opts: DefaultParams<TScopes> & PaginationParams = {},
  ) {
    type Resource = ViewItem<TResource, TView>;
    type Result = ResourceResponse<Resource, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    let result: Result;

    try {
      result = await this.http.request<Result>(`${this.path}/${this.type}/${id}/view/${view}`, {
        config: opts.config,
        query,
      });
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
    relationship: TRelationship,
    opts: DefaultParams<TScopes> & LimitParam = {},
  ): ScopedResourceIterator<RelationshipItem<TResource, TRelationship>, TScopes> {
    return this.iterate((offset) =>
      this.getRelationship<TRelationship, TScopes>(id, relationship, {
        ...opts,
        offset,
      }),
    );
  }

  iterateView<TView extends ViewNames<TResource>, const TScopes extends ResourceScopes = {}>(
    id: string,
    view: TView,
    opts: DefaultParams<TScopes> & LimitParam = {},
  ): ScopedResourceIterator<ViewItem<TResource, TView>, TScopes> {
    return this.iterate((offset) => this.getView<TView, TScopes>(id, view, { ...opts, offset }));
  }
}

export function createResourceClient<const TKey extends keyof Registry>(
  type: TKey,
): ResourceClientConstructor<TKey> {
  return class extends ResourceClient<TKey> {
    constructor(http: HttpClient, path: string) {
      super(http, path, type);
    }
  };
}

export abstract class LibraryResourceClient<
  TKey extends keyof Registry,
  TResource extends Registry[TKey] = Registry[TKey],
> extends ResourceClient<TKey, TResource> {
  async getAll<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> & PaginationParams & SortParams<"dateAdded" | "name"> = {},
  ) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts).setString("sort", opts.sort);

    const result = await this.http.request<Result>(`${this.path}/${this.type}`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  iterateAll<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> & LimitParam & SortParams<"dateAdded" | "name"> = {},
  ): ScopedResourceIterator<TResource, TScopes> {
    return this.iterate((offset) => this.getAll<TScopes>({ ...opts, offset }));
  }
}

export function createLibraryResourceClient<const TKey extends keyof Registry>(
  type: string,
): LibraryResourceClientConstructor<TKey> {
  return class extends LibraryResourceClient<TKey> {
    constructor(http: HttpClient, path: string) {
      super(http, path, type);
    }
  };
}
