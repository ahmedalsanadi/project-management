"use client";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useMutation } from "@tanstack/react-query";

export default function RegisterForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { register } = useAuth();

  const registerMutation = useMutation({
    mutationFn: () => register(formData.name, formData.email, formData.password),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {registerMutation.error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {registerMutation.error.response?.data?.message || "An error occurred"}
              </div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-b-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {registerMutation.isPending ? "Creating account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
