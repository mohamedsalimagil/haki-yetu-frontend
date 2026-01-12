/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Navy Blue from Figma
        accent: "#FACC15", // Amber accent from Figma
        'bg-slate': "#F9FAFB", // Light slate background from Figma
        secondary: "#c53030", // Accent Red for 'Urgency'
        pending: "#FACC15", // Amber for pending states
        background: "#F9FAFB", // Light gray background
        // Dark mode colors
        'dark-bg': "#0f172a", // Slate 900
        'dark-card': "#1e293b", // Slate 800
        'dark-border': "#334155", // Slate 700
      }
    },
  },
  plugins: [],
}
