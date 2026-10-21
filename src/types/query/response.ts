import type { AnyResource, Collection } from "@/types/query/resource";
import type { ResourceScopes, ScopedResource } from "@/types/query/scopes";

export type ResourceResponse<
  TRoot extends AnyResource,
  TScopes extends ResourceScopes = {},
> = Collection<ScopedResource<TRoot, TScopes>>;
