import { BaseResourceClient } from "@/clients/resource";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { DefaultParams, LimitParam } from "@/types/params";
import type { ResourceOf } from "@/types/query/helpers";
import type { ResourceResponse } from "@/types/query/response";
import type { ResourceScopes } from "@/types/query/scopes";

type StationTrackResource = ResourceOf<"songs" | "music-videos">;

export class StationClient extends BaseResourceClient {
  async getNextTracks<const TScopes extends ResourceScopes = {}>(
    id: string,
    opts: DefaultParams<TScopes> & LimitParam = {},
  ) {
    type Result = ResourceResponse<StationTrackResource, TScopes>;

    const query = new RequestQueryBuilder().params(opts);

    const result = await this.http.request<Result>(`${this.path}/stations/next-tracks/${id}`, {
      config: opts.config,
      method: "POST",
      query,
    });

    return this.prepare(result);
  }
}
