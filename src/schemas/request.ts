import z from "zod";

export const RelationshipModeSchema = z.enum(["include", "relate"]);

export const RelationshipConfigSchema = z.union([
  RelationshipModeSchema,
  z.object({
    mode: RelationshipModeSchema,
    limit: z.number().int().positive().optional(),
  }),
]);

export const ViewConfigSchema = z.union([
  z.boolean(),
  z.object({
    limit: z.number().int().positive(),
  }),
]);

export const ScopeSchema = z
  .strictObject({
    fields: z.array(z.string()),
    extend: z.array(z.string()),
    relationships: z.record(z.string(), RelationshipConfigSchema),
    views: z.record(z.string(), ViewConfigSchema),
  })
  .partial();

export const ScopesSchema = z.record(z.string(), z.unknown());

export type Scope = z.infer<typeof ScopeSchema>;

export const ShapeSchema = z.strictObject({
  types: z.array(z.string()),
  with: z.array(z.string()).optional(),
});

export type Shape = z.infer<typeof ShapeSchema>;
