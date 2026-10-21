import type { RequiredProps } from "@/types/query/helpers";
import type { AnyResource } from "@/types/query/resource";
import type { ResourceResponse } from "@/types/query/response";
import type { ResourceScopes } from "@/types/query/scopes";

export interface Result<
  TTypes extends Record<string, AnyResource> = {},
  TWith extends Record<string, AnyResource> = {},
  TMap extends Partial<Record<keyof TTypes | keyof TWith, string>> = {},
> {
  types: TTypes;
  with: TWith;
  map: TMap;
}

export type AnyResult = Result<{}, {}, {}>;

export type TypesOf<TResult extends AnyResult> = NonNullable<TResult["types"]>;
export type WithOf<TResult extends AnyResult> = NonNullable<TResult["with"]>;
export type MapOf<TResult extends AnyResult> = NonNullable<TResult["map"]>;

export type TypesNames<TResult extends AnyResult> = Extract<keyof TypesOf<TResult>, string>;
export type WithNames<TResult extends AnyResult> = Extract<keyof WithOf<TResult>, string>;
export type MapNames<TResult extends AnyResult> = Extract<keyof MapOf<TResult>, string>;

export type TypesItem<TResult extends AnyResult, K extends TypesNames<TResult>> = Extract<
  TypesOf<TResult>[K],
  AnyResource
>;

export type WithItem<TResult extends AnyResult, K extends WithNames<TResult>> = Extract<
  WithOf<TResult>[K],
  AnyResource
>;

export type ResultShape<TResult extends AnyResult> = {
  types: readonly [TypesNames<TResult>, ...TypesNames<TResult>[]];
} & ([WithNames<TResult>] extends [never]
  ? {}
  : {
      with?: readonly WithNames<TResult>[];
    });

export declare const internalTypesSymbol: unique symbol;
export declare const internalWithSymbol: unique symbol;

type ArrayPropItem<TShape, K extends PropertyKey> = TShape extends {
  [P in K]?: readonly (infer U)[];
}
  ? U
  : never;

type SelectedTypes<TResult extends AnyResult, TShape extends ResultShape<TResult>> = Extract<
  ArrayPropItem<TShape, "types">,
  TypesNames<TResult>
>;

type SelectedWith<TResult extends AnyResult, TShape extends ResultShape<TResult>> = Extract<
  ArrayPropItem<TShape, "with">,
  WithNames<TResult>
>;

type ShapedTypes<TResult extends AnyResult, TShape extends ResultShape<TResult>> = RequiredProps<
  TypesOf<TResult>,
  SelectedTypes<TResult, TShape>
>;

type ShapedWith<TResult extends AnyResult, TShape extends ResultShape<TResult>> = RequiredProps<
  WithOf<TResult>,
  SelectedWith<TResult, TShape>
>;

type ShapedCombined<TResult extends AnyResult, TShape extends ResultShape<TResult>> = ShapedTypes<
  TResult,
  TShape
> &
  ShapedWith<TResult, TShape>;

type ShapedResults<
  TResult extends AnyResult,
  TShape extends ResultShape<TResult>,
  TScopes extends ResourceScopes = {},
> = {
  [
    K in keyof ShapedCombined<TResult, TShape> as K extends keyof MapOf<TResult>
      ? Extract<MapOf<TResult>[K], string>
      : K
  ]: ResourceResponse<Extract<ShapedCombined<TResult, TShape>[K], AnyResource>, TScopes>;
};

export type ShapedResult<
  TResult extends AnyResult,
  TShape extends ResultShape<TResult>,
  TScopes extends ResourceScopes = {},
> = {
  meta?: Record<string, unknown>;
  results: ShapedResults<TResult, TShape, TScopes>;
  [internalTypesSymbol]?: ShapedTypes<TResult, TShape>;
  [internalWithSymbol]?: ShapedWith<TResult, TShape>;
};

export type AnyShapedResult = ShapedResult<AnyResult, ResultShape<AnyResult>, ResourceScopes>;

export type ResultsOf<TShaped extends AnyShapedResult> = TShaped["results"];
