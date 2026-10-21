import type { RequiredProps } from "@/types/query/helpers";
import type { Registry } from "@/types/query/registry";
import type {
  AnyResource,
  AttributeNames,
  AttributesOf,
  Collection,
  ExtendableNames,
  ExtendablesOf,
  RelationshipNames,
  RelationshipsOf,
  ResourceLink,
  TypeOf,
  ViewNames,
  ViewsOf,
} from "@/types/query/resource";

export type RelationshipItem<
  TResource extends AnyResource,
  K extends RelationshipNames<TResource>,
> = Extract<RelationshipsOf<TResource>[K], AnyResource>;

export type ViewItem<TResource extends AnyResource, K extends ViewNames<TResource>> = Extract<
  ViewsOf<TResource>[K],
  AnyResource
>;

type RelationshipMode = "include" | "relate";

type RelationshipSelection =
  | RelationshipMode
  | {
      mode: RelationshipMode;
      limit?: number;
    };

type RelationshipSelections<TResource extends AnyResource> = Partial<
  Record<RelationshipNames<TResource>, RelationshipSelection>
>;

type ViewSelection =
  | boolean
  | {
      limit: number;
    };

type ViewSelections<TResource extends AnyResource> = Partial<
  Record<ViewNames<TResource>, ViewSelection>
>;

export type ResourceScope<TResource extends AnyResource> = {
  fields?: readonly AttributeNames<TResource>[];
  relationships?: RelationshipSelections<TResource>;
} & ([ExtendableNames<TResource>] extends [never]
  ? {}
  : {
      extend?: readonly ExtendableNames<TResource>[];
    }) &
  ([ViewNames<TResource>] extends [never]
    ? {}
    : {
        /** Views are only returned when this resource is the root resource. */
        views?: ViewSelections<TResource>;
      });

export type ResourceScopes = Partial<{
  [K in Extract<keyof Registry, string>]: ResourceScope<Registry[K]>;
}>;

export type ScopeFor<TResource extends AnyResource, TScopes extends ResourceScopes = {}> =
  TypeOf<TResource> extends keyof TScopes ? TScopes[TypeOf<TResource>] : {};

type RelationshipSelectionValue<
  TResource extends AnyResource,
  PScope,
  K extends RelationshipNames<TResource>,
> = PScope extends {
  relationships?: infer TRelationships;
}
  ? K extends keyof TRelationships
    ? TRelationships[K]
    : never
  : never;

type RelationshipSelectionMode<
  TResource extends AnyResource,
  PScope,
  K extends RelationshipNames<TResource>,
> =
  RelationshipSelectionValue<TResource, PScope, K> extends { mode: infer TMode }
    ? Extract<TMode, RelationshipMode>
    : Extract<RelationshipSelectionValue<TResource, PScope, K>, RelationshipMode>;

type RelationshipKeysByMode<
  TResource extends AnyResource,
  PScope,
  TMode extends RelationshipMode,
> = {
  [K in RelationshipNames<TResource>]: Extract<
    RelationshipSelectionMode<TResource, PScope, K>,
    TMode
  > extends never
    ? never
    : K;
}[RelationshipNames<TResource>];

export type SelectedRelationshipKeys<
  TResource extends AnyResource,
  PScope,
> = RelationshipKeysByMode<TResource, PScope, RelationshipMode>;

export type IncludedRelationshipKeys<
  TResource extends AnyResource,
  PScope,
> = RelationshipKeysByMode<TResource, PScope, "include">;

export type IncludedViewKeys<TResource extends AnyResource, PScope> = SelectedViewKeys<
  TResource,
  PScope
>;

export type SelectedViewKeys<TResource extends AnyResource, PScope> = PScope extends {
  views?: infer TViews;
}
  ? {
      [K in ViewNames<TResource>]: K extends keyof TViews
        ? TViews[K] extends false | undefined
          ? never
          : K
        : never;
    }[ViewNames<TResource>]
  : never;

type ArrayPropItem<PScope, K extends PropertyKey> = PScope extends {
  [P in K]?: readonly (infer U)[];
}
  ? U
  : never;

type SelectedFields<TResource extends AnyResource, PScope> = [
  Extract<ArrayPropItem<PScope, "fields">, AttributeNames<TResource>>,
] extends [never]
  ? AttributeNames<TResource>
  : Extract<ArrayPropItem<PScope, "fields">, AttributeNames<TResource>>;

type SelectedExtendables<TResource extends AnyResource, PScope> = Extract<
  ArrayPropItem<PScope, "extend">,
  ExtendableNames<TResource>
>;

type ScopedRelationshipItem<
  TResource extends AnyResource,
  PScope,
  K extends RelationshipNames<TResource>,
> =
  | (Extract<RelationshipSelectionMode<TResource, PScope, K>, "include"> extends never
      ? never
      : RelationshipItem<TResource, K>)
  | (Extract<RelationshipSelectionMode<TResource, PScope, K>, "relate"> extends never
      ? never
      : ResourceLink<RelationshipItem<TResource, K>>);

type ScopedRelationships<TResource extends AnyResource, TScopes extends ResourceScopes = {}> = {
  relationships?: {
    [K in SelectedRelationshipKeys<TResource, ScopeFor<TResource, TScopes>>]: Collection<
      ScopedResource<ScopedRelationshipItem<TResource, ScopeFor<TResource, TScopes>, K>, TScopes>
    >;
  };
};

type ScopedViews<TResource extends AnyResource, TScopes extends ResourceScopes = {}> = {
  views?: {
    [K in SelectedViewKeys<TResource, ScopeFor<TResource, TScopes>>]: Collection<
      ScopedResource<ViewItem<TResource, K>, TScopes>
    >;
  };
};

type ScopedFields<TResource extends AnyResource, PScope> = Pick<
  AttributesOf<TResource>,
  SelectedFields<TResource, PScope>
> &
  Pick<ExtendablesOf<TResource>, SelectedExtendables<TResource, PScope>>;

type ScopedAttributes<TResource extends AnyResource, PScope> = RequiredProps<
  AttributesOf<TResource>,
  SelectedFields<TResource, PScope>
>;

type ScopedExtendables<TResource extends AnyResource, PScope> = RequiredProps<
  ExtendablesOf<TResource>,
  SelectedExtendables<TResource, PScope>
>;

export declare const internalAttributesSymbol: unique symbol;
export declare const internalExtendablesSymbol: unique symbol;

type ScopedResourceItem<
  TResource extends AnyResource,
  TScopes extends ResourceScopes = {},
> = ResourceLink<TResource> & {
  attributes?: ScopedFields<TResource, ScopeFor<TResource, TScopes>>;
  [internalAttributesSymbol]?: ScopedAttributes<TResource, ScopeFor<TResource, TScopes>>;
  [internalExtendablesSymbol]?: ScopedExtendables<TResource, ScopeFor<TResource, TScopes>>;
} & ScopedRelationships<TResource, TScopes> &
  ScopedViews<TResource, TScopes>;

export type ScopedResource<
  TResource extends AnyResource,
  TScopes extends ResourceScopes = {},
> = TResource extends AnyResource ? ScopedResourceItem<TResource, TScopes> : never;

export type ScopedResourceOf<
  TKey extends keyof Registry,
  TScopes extends ResourceScopes = {},
> = ScopedResource<Registry[TKey], TScopes>;

export type ScopedResourceIterator<
  TResource extends AnyResource,
  TScopes extends ResourceScopes = {},
> = AsyncGenerator<ScopedResource<TResource, TScopes>, void, unknown>;
