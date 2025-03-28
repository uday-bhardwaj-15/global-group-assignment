import axios from "axios";

const BASE_URL = "https://reqres.in/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const response = await axios.post(`${BASE_URL}/login`, credentials);
      // Store token in localStorage
      localStorage.setItem("authToken", response.data.token);
      return response.data;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("authToken");
  },

  getToken() {
    return localStorage.getItem("authToken");
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
