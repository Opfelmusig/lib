import type { Registry } from "@/types/query/registry";
import type {
  AnyResource,
  AttributeNames,
  AttributesOf,
  Collection,
  ExtendableNames,
  ExtendablesOf,
  RelationshipNames,
  ResourceLink,
  ViewNames,
} from "@/types/query/resource";
import type {
  internalAttributesSymbol,
  internalExtendablesSymbol,
  RelationshipItem,
  ViewItem,
} from "@/types/query/scopes";

export type ResourceOf<TKey extends keyof Registry> = Registry[TKey];

export type ValidateResourceName<TKey extends keyof Registry> = TKey;

type RelationshipCollections<TRelationships> = {
  [K in keyof TRelationships as K extends string ? K : never]: Collection<
    NonNullable<TRelationships[K]>
  >;
} & Record<never, never>;

type ResourceTemplateRelationships<TResource extends AnyResource> = {
  [K in RelationshipNames<TResource>]?: ResourceTemplate<RelationshipItem<TResource, K>>;
};

type ResourceTemplateViews<TResource extends AnyResource> = {
  [K in ViewNames<TResource>]?: ResourceTemplate<ViewItem<TResource, K>>;
};

type ResourceTemplateItem<
  TResource extends AnyResource,
  TAttributes extends AttributeNames<TResource> = never,
  TExtendables extends ExtendableNames<TResource> = never,
  TRelationships = {},
  TViews = {},
> = ResourceLink<TResource> & {
  attributes?: Pick<AttributesOf<TResource>, TAttributes> &
    Pick<ExtendablesOf<TResource>, TExtendables>;
  [internalAttributesSymbol]?: RequiredProps<AttributesOf<TResource>, TAttributes>;
  [internalExtendablesSymbol]?: RequiredProps<ExtendablesOf<TResource>, TExtendables>;
  relationships?: RelationshipCollections<TRelationships>;
  views?: RelationshipCollections<TViews>;
};

export type ResourceTemplate<
  TResource extends AnyResource,
  TAttributes extends AttributeNames<TResource> = never,
  TExtendables extends ExtendableNames<TResource> = never,
  TRelationships extends ResourceTemplateRelationships<TResource> = {},
  TViews extends ResourceTemplateViews<TResource> = {},
> = TResource extends AnyResource
  ? ResourceTemplateItem<
      TResource,
      Extract<TAttributes, AttributeNames<TResource>>,
      Extract<TExtendables, ExtendableNames<TResource>>,
      Pick<TRelationships, Extract<keyof TRelationships, RelationshipNames<TResource>>>,
      Pick<TViews, Extract<keyof TViews, ViewNames<TResource>>>
    >
  : never;

export type ResourceTemplateOf<
  TKey extends keyof Registry,
  TAttributes extends AttributeNames<ResourceOf<TKey>> = never,
  TExtendables extends ExtendableNames<ResourceOf<TKey>> = never,
  TRelationships extends ResourceTemplateRelationships<ResourceOf<TKey>> = {},
  TViews extends ResourceTemplateViews<ResourceOf<TKey>> = {},
> = ResourceTemplate<ResourceOf<TKey>, TAttributes, TExtendables, TRelationships, TViews>;

export type RequiredProps<T, K extends keyof T> = {
  [P in K]-?: T[P];
};
