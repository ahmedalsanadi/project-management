"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Menu } from "@headlessui/react";
import { LogOut, User } from "lucide-react";

export function UserMenu() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center ">
      <Menu as="div" className="relative ml-3">
        <Menu.Button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span className="sr-only">Open user menu</span>
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <User size={16} />
          </div>
        </Menu.Button>

        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={logout}
                className={`${
                  active ? "bg-gray-100" : ""
                } flex w-full px-4 py-2 text-sm text-gray-700`}
              >
                <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
}
