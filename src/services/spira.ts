import axios, { AxiosInstance } from "axios";

export class SpiraService {
  private client: AxiosInstance;
  private baseUrl: string | undefined;
  private username: string | undefined;
  private apiKey: string | undefined;
  private projectId: string | undefined;

  constructor() {
    // Check and assign environment variables with proper validation
    this.baseUrl = process.env.SPIRA_BASE_URL;
    this.username = process.env.SPIRA_USERNAME;
    this.apiKey = process.env.SPIRA_API_KEY;
    this.projectId = process.env.SPIRA_PROJECT_ID;

    // Validate required environment variables
    if (!this.baseUrl) {
      throw new Error("SPIRA_BASE_URL environment variable is required");
    }
    if (!this.username) {
      throw new Error("SPIRA_USERNAME environment variable is required");
    }
    if (!this.apiKey) {
      throw new Error("SPIRA_API_KEY environment variable is required");
    }
    if (!this.projectId) {
      throw new Error("SPIRA_PROJECT_ID environment variable is required");
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        username: this.username,
        "api-key": this.apiKey,
      },
    });
  }

  /**
   * Create a new requirement in the Spira project
   * @param name The name of the requirement
   * @param requirementTypeId The type ID of the requirement
   * @param statusId The status ID of the requirement
   * @param importanceId The importance ID of the requirement
   * @param description Optional description for the requirement
   * @returns The created requirement data or error message
   */
  async createRequirement(name: string) {
    // Validate required parameters
    if (!name) {
      throw new Error("Requirement name is required");
    }

    try {
      const response = await this.client.post(
        `/projects/${this.projectId}/requirements`,
        {
          Name: name,
          RequirementTypeId: 2, // Feature
          StatusId: 1, // Requested
          ImportanceId: 2, // High
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return `API Error: ${error.message} - ${error.response?.data || "No additional error data"}`;
      }
      return `Error: ${error}`;
    }
  }

  /**
   * Retrieve all requirements in the project
   * @param startingRow Optional starting row for pagination
   * @param numberOfRows Optional number of rows to return
   * @returns List of requirements or error message
   */
  async getRequirements(startingRow?: number, numberOfRows?: number) {
    try {
      const params: Record<string, any> = {};
      if (startingRow !== undefined) params.starting_row = startingRow;
      if (numberOfRows !== undefined) params.number_of_rows = numberOfRows;

      const response = await this.client.get(
        `/projects/${this.projectId}/requirements`,
        { params },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return `API Error: ${error.message} - ${error.response?.data || "No additional error data"}`;
      }
      return `Error: ${error}`;
    }
  }

  /**
   * Search for requirements in the project
   * @param searchCriteria The search criteria object
   * @param startingRow Optional starting row for pagination
   * @param numberOfRows Optional number of rows to return
   * @returns List of matching requirements or error message
   */
  async searchRequirements() {
    try {
      const response = await this.client.post(
        `/projects/${this.projectId}/requirements/search?starting_row=1&number_of_rows=50`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return `API Error: ${error.message} - ${error.response?.data || "No additional error data"}`;
      }
      return `Error: ${error}`;
    }
  }

  /**
   * Retrieve a specific requirement by ID
   * @param requirementId The ID of the requirement to retrieve
   * @returns The requirement data or error message
   */
  async getRequirementById(requirementId: number) {
    if (!requirementId) {
      throw new Error("Requirement ID is required");
    }

    try {
      const response = await this.client.get(
        `/projects/${this.projectId}/requirements/${requirementId}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return `API Error: ${error.message} - ${error.response?.data || "No additional error data"}`;
      }
      return `Error: ${error}`;
    }
  }

  /**
   * Update an existing requirement
   * @param requirementId The ID of the requirement to update
   * @param updateData The data to update
   * @returns The updated requirement data or error message
   */
  async updateRequirement(requirementId: number, updateData: any) {
    if (!requirementId) {
      throw new Error("Requirement ID is required");
    }
    if (!updateData) {
      throw new Error("Update data is required");
    }

    try {
      // Ensure the RequirementId is included in the update data
      const data = { ...updateData, RequirementId: requirementId };
      const response = await this.client.put(
        `/projects/${this.projectId}/requirements`,
        data,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return `API Error: ${error.message} - ${error.response?.data || "No additional error data"}`;
      }
      return `Error: ${error}`;
    }
  }

  /**
   * Delete a requirement
   * @param requirementId The ID of the requirement to delete
   * @returns Success or error message
   */
  async deleteRequirement(requirementId: number) {
    if (!requirementId) {
      throw new Error("Requirement ID is required");
    }

    try {
      const response = await this.client.delete(
        `/projects/${this.projectId}/requirements/${requirementId}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return `API Error: ${error.message} - ${error.response?.data || "No additional error data"}`;
      }
      return `Error: ${error}`;
    }
  }

  /**
   * Create a new test case
   * @param testCaseData The test case data
   * @returns The created test case data or error message
   */
  async createTestCase(
    name: string,
    description: string,
    releaseId?: string,
    requirements?: string[],
  ) {
    try {
      const response = await this.client.post(
        `/projects/${this.projectId}/test-cases`,
        {
          Name: name,
          Description: description,
          TestCaseTypeId: 0,
          TestCaseStatusId: 0,
          TestCasePriorityId: 2,
          ...(releaseId ? { ReleaseId: releaseId } : {}),
          ...(requirements
            ? { Requirements: requirements.map((x) => ({ RequirementId: x })) }
            : {}),
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return `API Error: ${error.message} - ${error.response?.data || "No additional error data"}`;
      }
      return `Error: ${error}`;
    }
  }

  /**
   * Retrieve all test cases in the project
   * @param startingRow Optional starting row for pagination
   * @param numberOfRows Optional number of rows to return
   * @param releaseId Optional release ID to filter by
   * @returns List of test cases or error message
   */
  async getTestCases(
    startingRow?: number,
    numberOfRows?: number,
    releaseId?: number,
  ) {
    try {
      const params: Record<string, any> = {};
      if (startingRow !== undefined) params.starting_row = startingRow;
      if (numberOfRows !== undefined) params.number_of_rows = numberOfRows;
      if (releaseId !== undefined) params.release_id = releaseId;

      const response = await this.client.get(
        `/projects/${this.projectId}/test-cases`,
        { params },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return `API Error: ${error.message} - ${error.response?.data || "No additional error data"}`;
      }
      return `Error: ${error}`;
    }
  }

  /**
   * Retrieve a specific test case by ID
   * @param testCaseId The ID of the test case to retrieve
   * @returns The test case data or error message
   */
  async getTestCaseById(testCaseId: number) {
    if (!testCaseId) {
      throw new Error("Test case ID is required");
    }

    try {
      const response = await this.client.get(
        `/projects/${this.projectId}/test-cases/${testCaseId}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return `API Error: ${error.message} - ${error.response?.data || "No additional error data"}`;
      }
      return `Error: ${error}`;
    }
  }

  /**
   * Search for test cases
   * @param searchCriteria The search criteria
   * @param startingRow Starting row for pagination
   * @param numberOfRows Number of rows to return
   * @returns List of matching test cases or error message
   */
  async searchTestCases(
    searchCriteria: any,
    startingRow: number = 1,
    numberOfRows: number = 50,
  ) {
    if (!searchCriteria) {
      throw new Error("Search criteria is required");
    }

    try {
      const response = await this.client.post(
        `/projects/${this.projectId}/test-cases/search?starting_row=${startingRow}&number_of_rows=${numberOfRows}`,
        searchCriteria,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return `API Error: ${error.message} - ${error.response?.data || "No additional error data"}`;
      }
      return `Error: ${error}`;
    }
  }

  /**
   * Retrieve all users in the system
   * @returns List of users or error message
   */
  async getUsers() {
    try {
      const response = await this.client.get("/users");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return `API Error: ${error.message} - ${error.response?.data || "No additional error data"}`;
      }
      return `Error: ${error}`;
    }
  }

  /**
   * Retrieve a specific user by ID
   * @param userId The ID of the user to retrieve
   * @returns The user data or error message
   */
  async getUserById(userId: number) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const response = await this.client.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return `API Error: ${error.message} - ${error.response?.data || "No additional error data"}`;
      }
      return `Error: ${error}`;
    }
  }

  /**
   * Retrieve a user by username
   * @param username The username to search for
   * @param includeInactive Whether to include inactive users
   * @returns The user data or error message
   */
  async getUserByUsername(username: string, includeInactive: boolean = true) {
    if (!username) {
      throw new Error("Username is required");
    }

    try {
      const response = await this.client.get(
        `/users/usernames/${username}?include_inactive=${includeInactive}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return `API Error: ${error.message} - ${error.response?.data || "No additional error data"}`;
      }
      return `Error: ${error}`;
    }
  }
}
