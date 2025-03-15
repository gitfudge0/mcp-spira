import { Request } from "@modelcontextprotocol/sdk/types.js";
import * as teststeps from "../operations/teststeps";
import { SpiraService } from "../services/spira";

export const HandleTestStepCreation = async (
  spiraService: SpiraService,
  request: Request,
) => {
  if (!request.params || !request.params.arguments) {
    throw new Error("Arguments are required");
  }
  const args = teststeps.CreateTestStepSchema.parse(request.params.arguments);
  const result = await spiraService.createTestStep(
    args.testCaseId,
    args.description,
    args.expectedResult,
    args.position,
  );

  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
  };
};
