import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle dark and light mode"
      className={`
        relative flex items-center h-8 w-16 rounded-full p-1
        transition-all duration-300 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-offset-1
        ${isDark
          ? "bg-slate-800 border border-slate-700 focus:ring-yellow-400/50 focus:ring-offset-slate-900"
          : "bg-slate-200 border border-slate-300 focus:ring-blue-400/50 focus:ring-offset-white"
        }
      `}
    >
      {/* Track Icons */}
      <FiSun
        className={`absolute left-1.5 text-xs transition-opacity duration-300 ${
          isDark ? "opacity-40 text-yellow-400" : "opacity-0"
        }`}
      />
      <FiMoon
        className={`absolute right-1.5 text-xs transition-opacity duration-300 ${
          isDark ? "opacity-0" : "opacity-40 text-slate-500"
        }`}
      />

      {/* Sliding knob */}
      <span
        className={`
          relative z-10 flex h-6 w-6 items-center justify-center rounded-full
          shadow-md transform transition-all duration-300
          ${isDark
            ? "translate-x-8 bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-950"
            : "translate-x-0 bg-white text-blue-600"
          }
        `}
      >
        {isDark ? (
          <FiMoon className="text-[11px] font-bold" />
        ) : (
          <FiSun className="text-[11px] font-bold" />
        )}
      </span>
    </button>
  );
}
