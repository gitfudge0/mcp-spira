import { Request } from "@modelcontextprotocol/sdk/types.js";
import * as requirements from "../operations/requirements.js";
import { SpiraService } from "../services/spira";

export const HandleRequirementCreation = async (
  spiraService: SpiraService,
  request: Request,
) => {
  if (!request.params || !request.params.arguments) {
    throw new Error("Arguments are required");
  }
  const args = requirements.CreateRequirementSchema.parse(
    request.params.arguments,
  );

  const result = await spiraService.createRequirement(args.name);

  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
  };
};
