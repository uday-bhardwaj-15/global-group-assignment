import axios from "axios";

// Base URL for the Reqres API
const BASE_URL = "https://reqres.in/api";

// User interface to define the structure of user data
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

// Interface for the user list response from the API
export interface UserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

// Interface for user creation/update response
export interface UserUpdateResponse {
  name?: string;
  job?: string;
  updatedAt?: string;
}

// User service with comprehensive methods
export const userService = {
  // Fetch all users with pagination
  async getUsers(page = 1, perPage = 6): Promise<UserListResponse> {
    try {
      const response = await axios.get(`${BASE_URL}/users`, {
        params: {
          page,
          per_page: perPage,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Fetch a specific user by ID
  async getUserById(id: number): Promise<User> {
    try {
      const response = await axios.get(`${BASE_URL}/users/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  // Create a new user
  async createUser(userData: Partial<User>): Promise<UserUpdateResponse> {
    try {
      const response = await axios.post(`${BASE_URL}/users`, {
        name: `${userData.first_name} ${userData.last_name}`,
        job: "New User",
        email: userData.email,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Update an existing user
  async updateUser(
    id: number,
    userData: Partial<User>
  ): Promise<UserUpdateResponse & Partial<User>> {
    try {
      // Reqres API expects a specific format
      const updatePayload = {
        name: `${userData.first_name} ${userData.last_name}`,
        job: "Updated User",
        email: userData.email,
      };

      const response = await axios.put(
        `${BASE_URL}/users/${id}`,
        updatePayload
      );

      // Merge API response with input data
      return {
        ...userData,
        ...response.data,
      };
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  // Delete a user
  async deleteUser(id: number): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },

  // Search/Filter users (client-side implementation)
  filterUsers(users: User[], searchTerm: string): User[] {
    if (!searchTerm) return users;

    const lowercasedTerm = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.first_name.toLowerCase().includes(lowercasedTerm) ||
        user.last_name.toLowerCase().includes(lowercasedTerm) ||
        user.email.toLowerCase().includes(lowercasedTerm)
    );
  },

  // Sort users by different criteria
  sortUsers(users: User[], criteria: "name" | "email" = "name"): User[] {
    return [...users].sort((a, b) => {
      if (criteria === "name") {
        return `${a.first_name} ${a.last_name}`.localeCompare(
          `${b.first_name} ${b.last_name}`
        );
      }
      return a.email.localeCompare(b.email);
    });
  },
};

// Utility function for error handling
export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    // Handle specific Axios error types
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Data:", error.response.data);
      console.error("Status:", error.response.status);
      return {
        message: error.response.data.error || "An error occurred",
        status: error.response.status,
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      return {
        message: "No response from server",
        status: 0,
      };
    } else {
      // Something happened in setting up the request
      console.error("Error:", error.message);
      return {
        message: "Error setting up the request",
        status: -1,
      };
    }
  } else {
    // Handle non-Axios errors
    console.error("Unexpected error:", error);
    return {
      message: "An unexpected error occurred",
      status: -2,
    };
  }
};
