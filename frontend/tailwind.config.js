/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#15120F",
        surface: "#1F1A16",
        surface2: "#28211C",
        accent: "#E8B84B",
        text: "#F3EBDD",
        muted: "#8C8178",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        ui: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};
