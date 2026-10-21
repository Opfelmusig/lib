import { EquivalentClient } from "@/clients/shared/equivalent";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { DefaultParams } from "@/types/params";
import type { Registry } from "@/types/query/registry";
import type { ResourceResponse } from "@/types/query/response";
import type { ResourceScopes } from "@/types/query/scopes";

const type = "music-videos" as const satisfies keyof Registry;
type TResource = Registry[typeof type];

export class MusicVideoClient extends EquivalentClient<typeof type, TResource> {
  protected readonly type = type;

  async getByIsrc<const TScopes extends ResourceScopes = {}>(
    isrc: string | string[],
    opts: DefaultParams<TScopes> = {},
  ) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts).setStringArray("filter[isrc]", isrc);

    const result = await this.http.request<Result>(`${this.path}/${this.type}`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }
}
