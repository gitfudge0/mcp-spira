import { z } from "zod";

export const CreateRequirementSchema = z.object({
  name: z.string(),
});
