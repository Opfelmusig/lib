import { ResourceClient } from "@/clients/resource";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { DefaultParams, PaginationParams } from "@/types/params";
import type { Registry } from "@/types/query/registry";
import type { ResourceResponse } from "@/types/query/response";
import type { ResourceScopes } from "@/types/query/scopes";

const type = "personal-recommendation" as const satisfies keyof Registry;
type TResource = Registry[typeof type];

export class RecommendationClient extends ResourceClient<typeof type, TResource> {
  protected readonly type = "recommendations";

  async getDefault<const TScopes extends ResourceScopes = {}>(
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
}
