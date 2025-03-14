import { z } from "zod";

export const CreateRequirementSchema = z.object({
  name: z.string(),
});

export const GetRequirementByIdSchema = z.object({
  requirementId: z.number(),
});
