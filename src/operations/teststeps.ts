import { z } from "zod";

export const CreateTestStepSchema = z.object({
  testCaseId: z.string(),
  description: z.string(),
  expectedResult: z.string(),
  position: z.string(),
});
