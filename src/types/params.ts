import type { RequestConfig } from "@/types/config";
import type { AnyResult, ResultShape } from "@/types/query/results";
import type { ResourceScopes } from "@/types/query/scopes";

export interface LimitParam {
  limit?: number;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface ConfigParam {
  config?: RequestConfig;
}

export interface DefaultParams<TScopes extends ResourceScopes = {}> extends ConfigParam {
  scopes?: TScopes & ResourceScopes;
}

export interface ResultParams<
  TResult extends AnyResult,
  TTypes extends ResultShape<TResult>,
  TScopes extends ResourceScopes = {},
> extends DefaultParams<TScopes> {
  shape: TTypes & ResultShape<TResult>;
}

export interface SortParams<TSort extends string> {
  sort?: `-${TSort}` | TSort;
}
