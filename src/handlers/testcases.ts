import { Request } from "@modelcontextprotocol/sdk/types.js";
import * as testcases from "../operations/testcases.js";
import { SpiraService } from "../services/spira";

export const HandleTestCaseCreation = async (
  spiraService: SpiraService,
  request: Request,
) => {
  if (!request.params || !request.params.arguments) {
    throw new Error("Arguments are required");
  }
  const args = testcases.CreateTestCaseSchema.parse(request.params.arguments);
  const result = await spiraService.createTestCase(
    args.name,
    args.description,
    args.release,
    args.requirements,
  );

  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
  };
};
