import { ResourceClient } from "@/clients/resource";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { DefaultParams } from "@/types/params";
import type { Registry } from "@/types/query/registry";
import type { ResourceResponse } from "@/types/query/response";
import type { ResourceScopes } from "@/types/query/scopes";

export abstract class EquivalentClient<
  TKey extends keyof Registry,
  TResource extends Registry[TKey] = Registry[TKey],
> extends ResourceClient<TKey, TResource> {
  async getEquivalents<const TScopes extends ResourceScopes = {}>(
    ids: string | string[],
    opts: DefaultParams<TScopes> & { restrict?: ["explicit"] } = {},
  ) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder()
      .params(opts)
      .setStringArray("filter[equivalents]", ids)
      .setStringArray("restrict", opts.restrict);

    const result = await this.http.request<Result>(`${this.path}/${this.type}`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }
}
