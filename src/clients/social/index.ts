import { BaseResourceClient } from "@/clients/resource";
import { SocialProfileClient } from "@/clients/social/profile";
import type { HttpClient } from "@/core/http";
import { RequestQueryBuilder } from "@/helpers/requestQuery";
import type { PaginationParams, ResultParams } from "@/types/params";
import type { ResultShape, ShapedResult } from "@/types/query/results";
import type { ResourceScopes } from "@/types/query/scopes";
import type { SearchSocialResult } from "@/types/results/search";

export class SocialClient extends BaseResourceClient {
  profiles: SocialProfileClient;

  constructor(http: HttpClient, path: string) {
    super(http, path);

    this.profiles = new SocialProfileClient(http, path);
  }

  async search<
    const TTypes extends ResultShape<SearchSocialResult>,
    const TScopes extends ResourceScopes = {},
  >(term: string, opts: ResultParams<SearchSocialResult, TTypes, TScopes> & PaginationParams) {
    type Result = ShapedResult<SearchSocialResult, TTypes, TScopes>;

    const query = new RequestQueryBuilder()
      .params(opts)
      .setString("term", term)
      .setStringArray("with", [...(opts.shape.with ?? []), "serverBubbles"]);

    const result = await this.http.request<Result>(`${this.path}/search`, {
      config: opts.config,
      query,
    });

    return this.prepareResults(result);
  }
}
