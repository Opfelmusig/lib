import { EquivalentClient } from "@/clients/shared/equivalent";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { DefaultParams } from "@/types/params";
import type { Registry } from "@/types/query/registry";
import type { ResourceResponse } from "@/types/query/response";
import type { ResourceScopes } from "@/types/query/scopes";

const type = "albums" as const satisfies keyof Registry;
type TResource = Registry[typeof type];

export class AlbumClient extends EquivalentClient<typeof type, TResource> {
  protected readonly type = type;

  async getByUpc<const TScopes extends ResourceScopes = {}>(
    upc: string | string[],
    opts: DefaultParams<TScopes> = {},
  ) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts).setStringArray("filter[upc]", upc);

    const result = await this.http.request<Result>(`${this.path}/${this.type}`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }
}
