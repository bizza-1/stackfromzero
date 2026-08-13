"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme || (systemPrefersDark ? "dark" : "light");

    setTheme(initialTheme);
    document.documentElement.setAttribute("data-bs-theme", initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-bs-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("theme", nextTheme);
  };

  return (
    <button
      type="button"
      className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <i className={`bi ${theme === "dark" ? "bi-sun-fill" : "bi-moon-fill"}`} aria-hidden="true" />
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
