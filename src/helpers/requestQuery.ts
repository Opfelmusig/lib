import { type Scope, ScopeSchema, ScopesSchema, ShapeSchema } from "@/schemas/request";
import type { LanguageConfig, RequestConfig } from "@/types/config";

export class RequestQueryBuilder {
  private query: Record<string, string> = {};

  static create(base?: RequestQueryBuilder) {
    const requestQuery = new RequestQueryBuilder();
    requestQuery.query = base?.query ? structuredClone(base.query) : {};
    return requestQuery;
  }

  params(params?: Record<string, any>) {
    if (!params) return this;

    for (const [key, value] of Object.entries(params)) {
      if (["limit", "offset"].includes(key)) {
        this.setNumber(key, value);
      }

      if (key === "scopes") {
        this.scopes(value);
      }

      if (key === "shape") {
        this.shape(value);
      }
    }

    return this;
  }

  private shape(value: unknown) {
    const result = ShapeSchema.safeParse(value);

    if (!result.success) {
      console.warn(
        `[Opfelmusig/RequestQuery] 'shape' is not in the correct format. Skipping.`,
        result.error.issues[0]?.message,
      );
      return;
    }

    this.setStringArray("types", result.data.types);
    if (result.data.with) this.setStringArray("with", result.data.with);
  }

  private scopes(value: unknown) {
    const result = ScopesSchema.safeParse(value);

    if (!result.success) {
      console.warn(
        `[Opfelmusig/RequestQuery] 'scopes' is not in the correct format. Skipping.`,
        result.error.issues[0]?.message,
      );
      return;
    }

    for (const [key, value] of Object.entries(result.data)) {
      const result = ScopeSchema.safeParse(value);

      if (!result.success) {
        console.warn(
          `[Opfelmusig/RequestQuery] 'scopes/${key}' is not in the correct format. Skipping.`,
          result.error.issues[0]?.message,
        );
        continue;
      }

      this.scope(key, result.data);
    }
  }

  private scope(scope: string, value: Scope) {
    const fields = value.fields ? [...(value.fields ?? []), ...(value.extend ?? [])] : [];

    if (fields.length) this.setStringArray("fields", fields, scope);
    if (value.extend?.length) this.setStringArray("extend", value.extend, scope);

    if (value.relationships) {
      const include = [];
      const relate = [];

      for (const [name, options] of Object.entries(value.relationships)) {
        const mode = typeof options === "string" ? options : options.mode;

        if (mode === "include") include.push(name);
        if (mode === "relate") relate.push(name);

        if (typeof options === "object") {
          this.setNumber("limit", options.limit, `${scope}:${name}`);
        }
      }

      if (include.length) this.setStringArray("include", include, scope);
      if (relate.length) this.setStringArray("relate", relate, scope);
    }

    if (value.views) {
      const views = [];

      for (const [name, options] of Object.entries(value.views)) {
        if (!options) continue;

        views.push(name);

        if (typeof options === "object") {
          this.setNumber("limit", options.limit, `${scope}:${name}`);
        }
      }

      if (views.length) this.setStringArray("views", views, scope);
    }
  }

  language(language?: LanguageConfig) {
    if (language) {
      this.setString("l", language.default);
      this.setString("l[lyrics]", language.lyrics);
      this.setString("l[script]", language.script);
    }

    return this;
  }

  requestConfig(config: RequestConfig | undefined) {
    this.language(config?.language);

    if (config?.extraParams) {
      for (const [key, value] of Object.entries(config.extraParams)) {
        if (key === undefined || value === undefined) continue;

        this.set(key, value);
      }
    }

    return this;
  }

  urlParams(params: string) {
    for (const [key, value] of new URLSearchParams(params).entries()) {
      this.set(key, value);
    }

    return this;
  }

  set(key?: string, value?: string, scope?: string) {
    if (!key || value === undefined || key.startsWith("~")) return this;

    key = scope ? `${key}[${scope}]` : key;

    this.query[key] = value;

    return this;
  }

  setNumber(key: string, value?: number, scope?: string) {
    if (value === undefined) return this;

    if (typeof value !== "number") {
      console.warn(`[Opfelmusig/RequestQuery] '${key}' is not a number. Skipping.`);
      return this;
    }

    this.set(key, String(value), scope);

    return this;
  }

  setStringArray(key: string, values?: string | string[], scope?: string) {
    if (values === undefined) return this;

    values = !Array.isArray(values) ? [values] : values;

    values = values.filter((x) => x !== undefined && !String(x).startsWith("~"));

    if (values.length <= 0) return this;

    this.set(key, values.join(","), scope);

    return this;
  }

  setString(key: string, value?: string, scope?: string) {
    if (value === undefined) return this;

    if (typeof value !== "string") {
      console.warn(`[Opfelmusig/RequestQuery] '${key}' is not a string. Skipping.`);
      return this;
    }

    this.set(key, value, scope);

    return this;
  }

  prepare() {
    return this.query;
  }
}
