import { ResourceClient } from "@/clients/resource";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { DefaultParams } from "@/types/params";
import type { Registry } from "@/types/query/registry";
import type { ResourceResponse } from "@/types/query/response";
import type { ResourceScopes } from "@/types/query/scopes";

const type = "storefronts" as const satisfies keyof Registry;
type TResource = Registry[typeof type];

export class StorefrontClient extends ResourceClient<typeof type, TResource> {
  protected readonly type = "storefronts";

  async getAll<const TScopes extends ResourceScopes = {}>(opts: DefaultParams<TScopes> = {}) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const result = await this.http.request<Result>(`${this.path}/${this.type}`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }
}
