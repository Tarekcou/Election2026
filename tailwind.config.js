/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        projection: "1536px",
        "4k": "2560px",
      },
      fontSize: {
        "projection-xs": "1.25rem",
        "projection-sm": "1.5rem",
        "projection-base": "1.75rem",
        "projection-lg": "2rem",
        "projection-xl": "2.5rem",
        "projection-2xl": "3rem",
        "projection-3xl": "3.5rem",
        "projection-4xl": "4rem",
      },
      spacing: {
        "projection-1": "0.5rem",
        "projection-2": "1rem",
        "projection-3": "1.5rem",
        "projection-4": "2rem",
        "projection-5": "2.5rem",
        "projection-6": "3rem",
        "projection-8": "4rem",
        "projection-10": "5rem",
        "projection-12": "6rem",
      },
    },
  },
  plugins: [],
};
