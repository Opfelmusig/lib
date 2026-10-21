import type { Registry } from "@/types/query/registry";

export interface Collection<TData> {
  href?: string;
  next?: string;
  data: TData[];
  attributes?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

export interface ResourceRef<TType extends keyof Registry = keyof Registry> {
  id: string;
  type: TType;
  href?: string;
  meta?: Record<string, unknown>;
}

export interface Resource<
  TType extends keyof Registry,
  TAttributes extends object = {},
  TExtendables extends object = {},
  TRelationships extends Record<string, AnyResource> = {},
  TViews extends Record<string, AnyResource> = {},
> extends ResourceRef<TType> {
  attributes?: TAttributes;
  extendables?: TExtendables;
  relationships?: TRelationships;
  views?: TViews;
}

export type AnyResource = Resource<keyof Registry>;

export type TypeOf<TResource extends AnyResource> = TResource["type"];

export type AttributesOf<TResource extends AnyResource> = NonNullable<TResource["attributes"]>;
export type ExtendablesOf<TResource extends AnyResource> = NonNullable<TResource["extendables"]>;

export type RelationshipsOf<TResource extends AnyResource> = NonNullable<
  TResource["relationships"]
>;
export type ViewsOf<TResource extends AnyResource> = NonNullable<TResource["views"]>;

export type AttributeNames<TResource extends AnyResource> = Extract<
  keyof AttributesOf<TResource>,
  string
>;
export type ExtendableNames<TResource extends AnyResource> = Extract<
  keyof ExtendablesOf<TResource>,
  string
>;
export type RelationshipNames<TResource extends AnyResource> = Extract<
  keyof RelationshipsOf<TResource>,
  string
>;
export type ViewNames<TResource extends AnyResource> = Extract<keyof ViewsOf<TResource>, string>;

export type ResourceLink<TResource extends AnyResource> = ResourceRef<TypeOf<TResource>>;
