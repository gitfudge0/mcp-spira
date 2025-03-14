import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { SpiraService } from "./services/spira";
import projectPackage from "../package.json";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import zodToJsonSchema from "zod-to-json-schema";
import * as requirements from "./operations/requirements";
import * as requirementHandlers from "./handlers/requirement";
import * as testcases from "./operations/testcases";
import * as testcaseHandlers from "./handlers/testcases";

// Load environment variables
dotenv.config();

// Initialize the Spira service
const spiraService = new SpiraService();

// Create server configuration
const server = new Server(
  {
    name: "Spira MCP Server",
    version: projectPackage.version,
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "create-requirement",
      description:
        "Create a feature requirement with status set as High on Spira",
      inputSchema: zodToJsonSchema(requirements.CreateRequirementSchema),
    },
    {
      name: "get-requirement-by-id",
      description: "Fetch a requirement by its ID from Spira",
      inputSchema: zodToJsonSchema(requirements.GetRequirementByIdSchema),
    },
    {
      name: "create-test-case",
      description: "Create a test case on Spira",
      inputSchema: zodToJsonSchema(testcases.CreateTestCaseSchema),
    },
    {
      name: "get-test-case-by-id",
      description: "Fetch a test case by its ID from Spira",
      inputSchema: zodToJsonSchema(testcases.GetTestCaseByIdSchema),
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (!request.params.arguments) {
    throw new Error("Arguments are required");
  }

  switch (request.params.name) {
    case "create-requirement": {
      return await requirementHandlers.HandleRequirementCreation(
        spiraService,
        request,
      );
    }
    case "get-requirement-by-id": {
      return await requirementHandlers.HandleGetRequirementById(
        spiraService,
        request,
      );
    }
    case "create-test-case": {
      return await testcaseHandlers.HandleTestCaseCreation(
        spiraService,
        request,
      );
    }
    case "get-test-case-by-id": {
      return await testcaseHandlers.HandleGetTestCaseById(
        spiraService,
        request,
      );
    }
    default:
      throw new Error(`Unknown tool: ${request.params.name}`);
  }
});

const transport = new StdioServerTransport();
server.connect(transport);
