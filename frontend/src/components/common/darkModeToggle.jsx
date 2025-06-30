import React from "react";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

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
    <button
      onClick={() => setIsDark(!isDark)}
      className="w-10 h-10 flex items-center justify-center text-foreground dark:text-foreground rounded cursor-pointer"
    >
      {isDark ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default DarkModeToggle;
