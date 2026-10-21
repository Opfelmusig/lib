import { ResourceClient } from "@/clients/resource";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { DefaultParams, LimitParam, PaginationParams } from "@/types/params";
import type { Registry } from "@/types/query/registry";
import type { ResourceResponse } from "@/types/query/response";
import type { ResourceScopes, ScopedResourceIterator } from "@/types/query/scopes";

const type = "genres" as const satisfies keyof Registry;
type TResource = Registry[typeof type];

export class GenreClient extends ResourceClient<typeof type, TResource> {
  protected readonly type = type;

  async getFromTopCharts<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> & PaginationParams = {},
  ) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const result = await this.http.request<Result>(`${this.path}/${this.type}`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  iterateFromTopCharts<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> & LimitParam = {},
  ): ScopedResourceIterator<TResource, TScopes> {
    return this.iterate((offset) => this.getFromTopCharts<TScopes>({ ...opts, offset }));
  }
}
