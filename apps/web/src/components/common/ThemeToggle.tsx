import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle dark mode"
      title={
        theme === "light"
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
    >
      {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
    </button>
  );
}