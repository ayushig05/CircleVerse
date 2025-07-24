import React from "react";
import { useEffect, useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div
      onClick={() => setIsDark(!isDark)}
      className="flex items-center justify-between cursor-pointer p-4 rounded-md transition w-full"
    >
      <span className="text-lg font-medium">Enable Dark Mode</span>
      {isDark ? (
        <ToggleRight className="text-blue-600" />
      ) : (
        <ToggleLeft className="text-gray-600" />
      )}
    </div>
  );
};

export default DarkModeToggle;
