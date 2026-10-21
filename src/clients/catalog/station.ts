import { ResourceClient } from "@/clients/resource";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { DefaultParams } from "@/types/params";
import type { Registry } from "@/types/query/registry";
import type { ResourceResponse } from "@/types/query/response";
import type { ResourceScopes } from "@/types/query/scopes";

const type = "stations" as const satisfies keyof Registry;
type TResource = Registry[typeof type];

export class StationClient extends ResourceClient<typeof type, TResource> {
  protected readonly type = type;

  async getFeaturedOnStorefront<const TScopes extends ResourceScopes = {}>(
    opts: DefaultParams<TScopes> = {},
  ) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder()
      .params(opts)
      .setStringArray("filter[featured]", "apple-music-live-radio");

    const result = await this.http.request<Result>(`${this.path}/${this.type}`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  async getPersonal<const TScopes extends ResourceScopes = {}>(opts: DefaultParams<TScopes> = {}) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder()
      .params(opts)
      .setStringArray("filter[identity]", "personal");

    const result = await this.http.request<Result>(`${this.path}/${this.type}`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }

  async getResourceStation<const TScopes extends ResourceScopes = {}>(
    resourceId: string,
    opts: DefaultParams<TScopes> = {},
  ) {
    type Result = ResourceResponse<TResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const result = await this.http.request<Result>(`${this.path}/${this.type}/ra.${resourceId}`, {
      config: opts.config,
      query,
    });

    return this.prepare(result);
  }
}
