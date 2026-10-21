import type { Registry } from "@/types/query/registry";

export type MutationType = keyof Registry;

export interface MutationData<TType extends MutationType> {
  id: string;
  type: TType;
}

export type MutateRelationships = Record<string, MutationType>;

export interface MutateResource<
  TAttributes extends object,
  TRelationships extends MutateRelationships,
> {
  attributes: TAttributes;
  relationships?: {
    [K in keyof TRelationships]?: {
      data: readonly MutationData<TRelationships[K]>[];
    };
  };
}

export type MutateAnyResource = MutateResource<object, MutateRelationships>;

export type MutateResourceRelationships<T> =
  T extends MutateResource<object, infer TRelationships> ? TRelationships : never;

export type MutateRelationshipItems<
  T extends MutateAnyResource,
  K extends keyof MutateResourceRelationships<T>,
> = readonly MutationData<MutateResourceRelationships<T>[K]>[];
