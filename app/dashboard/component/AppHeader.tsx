/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

const AppHeader = () => {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  return (
    <header className="sticky top-0 dark:bg-gray-900 z-50 flex items-center justify-between w-full bg-white border-b border-gray-200 px-4 py-3 dark:border-gray-700">
      {/* Left: Sidebar toggle + Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              {email || "Guest"}
            </span>
           
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
