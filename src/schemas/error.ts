import z from "zod";

export const AppleMusicErrorSourceSchema = z.object({
  parameter: z.string().optional(),
  pointer: z.string().optional(),
});

export const AppleMusicErrorSchema = z.object({
  code: z.string(),
  detail: z.string().optional(),
  id: z.string(),
  source: AppleMusicErrorSourceSchema.optional(),
  status: z.string(),
  title: z.string(),
});

export const AppleMusicErrorResponseSchema = z.object({
  errors: z.array(AppleMusicErrorSchema),
});
