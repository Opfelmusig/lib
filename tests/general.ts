import { type Assert, type IsEqual } from "thisval";

import type { ResourceTypes } from "@/types/combined";
import type { Registry } from "@/types/query/registry";

type _AllResourcesExported = Assert<IsEqual<ResourceTypes, keyof Registry>>;
