import { type Assert, type IsEqual } from "thisval";

import type { ResourceTypes } from "@/types/combined";
import type { Registry } from "@/types/query/registry";

type ExcludedTildeRegistry = keyof {
  [K in keyof Registry as K extends `~${string}` ? never : K]: Registry[K];
};

type _AllResourcesExported = Assert<IsEqual<ResourceTypes, ExcludedTildeRegistry>>;
