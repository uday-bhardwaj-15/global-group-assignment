// src/app/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import { userService, User } from "@/services/userService";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers(page);
        setUsers(data.data);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, [page, router]);

  const handleDelete = async (id: number) => {
    try {
      await userService.deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/users/${id}/edit`);
  };

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border rounded p-4 flex flex-col items-center"
          >
            <img
              src={user.avatar}
              alt={`${user.first_name} ${user.last_name}`}
              className="w-24 h-24 rounded-full mb-4"
            />
            <h2 className="text-xl">{`${user.first_name} ${user.last_name}`}</h2>
            <p className="text-gray-500">{user.email}</p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(user.id)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`p-2 rounded ${
              page === pageNum ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
}
