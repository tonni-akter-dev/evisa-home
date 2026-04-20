"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SubItem = {
  name: string;
  path: string;
};

type NavItem = {
  name: string;
  path?: string;
  subItems?: SubItem[];
};

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "Visas",
    subItems: [
      { name: "Visa List", path: "/dashboard/e-visa-list" },
      { name: "Add New EVisa", path: "/dashboard/e-visa" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>("Visas");
  const pathname = usePathname();

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-sm">
      
      {/* LOGO */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white tracking-wide">
          Visa Admin
        </h1>
        <p className="text-xs text-gray-500">Management Panel</p>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <div key={item.name}>
              {item.subItems ? (
                <>
                  {/* PARENT */}
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <span>{item.name}</span>

                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        openDropdown === item.name ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* CHILDREN */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openDropdown === item.name
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-3 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-3">
                      {item.subItems.map((sub) => {
                        const isSubActive = pathname === sub.path;

                        return (
                          <Link
                            key={sub.name}
                            href={sub.path}
                            className={`block px-3 py-2 rounded-md text-sm transition ${
                              isSubActive
                                ? "bg-blue-500 text-white shadow"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.path || "#"}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-500 text-white shadow"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/signin";
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;