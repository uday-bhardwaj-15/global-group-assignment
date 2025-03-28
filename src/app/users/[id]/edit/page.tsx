// src/app/users/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { userService, User } from "@/services/userService";
import { authService } from "@/services/authService";
import { toast, Toaster } from "react-hot-toast";

export default function EditUserPage() {
  const [user, setUser] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const userId = Number(params.id);

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await userService.getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user", error);
        setError("Failed to load user data");
      }
    };

    fetchUser();
  }, [userId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Ensure all required fields are present
      if (!user.first_name || !user.last_name || !user.email) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      // Attempt to update user
      const updatedUser = await userService.updateUser(userId, user);

      // Update local state with new user data
      setUser(updatedUser);

      // Show success message
      toast.success("User updated successfully!");

      // Redirect after a short delay to show the toast
      setTimeout(() => {
        router.push("/users");
      }, 1500);
    } catch (error) {
      console.error("Failed to update user", error);
      setError("Failed to update user");
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Add Toaster for notifications */}
      <Toaster position="top-right" />

      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Edit User</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">First Name</label>
            <input
              type="text"
              name="first_name"
              value={user.first_name || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={user.last_name || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={user.email || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {loading ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
}
