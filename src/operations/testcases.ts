import { z } from "zod";

export const CreateTestCaseSchema = z.object({
  name: z.string(),
  description: z.string(),
  release: z.string(),
  requirements: z.array(z.string()),
});

export const GetTestCaseByIdSchema = z.object({
  testCaseId: z.number(),
});
