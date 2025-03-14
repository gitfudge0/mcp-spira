# mcp-spira

MCP Server for Spira, enabling LLMs to create and manage requirements and test cases.

## Features

- **Requirements Management**: Create, retrieve, and update feature requirements with priority status
- **Test Case Management**: Create and retrieve detailed test cases linked to requirements

## Tools

1. `create-requirement`

   - Create a feature requirement with status set as High on Spira
   - Inputs:
     - `name` (string): Name of the requirement

2. `get-requirement-by-id`

   - Fetch a requirement by its ID from Spira
   - Inputs:
     - `requirementId` (number): ID of the requirement to fetch

3. `update-requirement`

   - Update an existing requirement in Spira
   - Inputs:
     - `requirementId` (number): ID of the requirement to update
     - `name` (string, optional): New name for the requirement
     - `description` (string, optional): New description for the requirement
     - `importanceId` (number, optional): New importance ID
     - `statusId` (number, optional): New status ID
     - `requirementTypeId` (number, optional): New requirement type ID

4. `create-test-case`

   - Create a test case on Spira
   - Inputs:
     - `name` (string): Test case name
     - `description` (string): Detailed test case description
     - `release` (string): Release to associate with the test case
     - `requirements` (string[]): Array of requirements to link to this test case

5. `get-test-case-by-id`
   - Fetch a test case by its ID from Spira
   - Inputs:
     - `testCaseId` (number): ID of the test case to fetch

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- A Spira api token

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

### Spira API Token

To use this MCP server, you need to generate an API token from your Spira instance:

1. Make sure you are logged in to your Spira application
2. Click on your user avatar from the top right of any page in the app
3. From the dropdown click your name
4. This opens your user profile. Scroll down until you see the label "Enable RSS Feeds"
5. Make sure "Enable RSS Feeds" is set to "Yes"
6. Look at the "RSS / API Key": if this is blank, click "Generate New"
7. You can now click on the RSS key to copy it automatically to your clipboard

### Usage with Claude Desktop

To use this with Claude Desktop, add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mcp-spira": {
      "env": {
        "SPIRA_BASE_URL": "https://yourcompany.spiraservice.net/services/v5_0/RestService.svc",
        "SPIRA_USERNAME": "your_username",
        "SPIRA_API_KEY": "{your_token}",
        "SPIRA_PROJECT_ID": "project_id"
      },
      "args": ["@gitfudge0/mcp-spira"],
      "command": "npx",
      "disabled": false
    }
  }
}
```

## Example Usage

After setting up the MCP server, you can use it with Claude to:

1. Create requirements:

   ```
   Please create a requirement for adding user authentication to our system
   ```

2. Fetch a requirement:

   ```
   Can you fetch the requirement with ID 123 for me?
   ```

3. Create test cases:
   ```
   Create a test case for verifying that a user can log in with valid credentials
   ```
4. Fetch a test case:
   ```
   Can you get the details of test case with ID 456?
   ```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
