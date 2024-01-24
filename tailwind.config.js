/** @type {import('tailwindcss').Config} */
export default {
  prefix: "cb-",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgba(var(--color-primary))",
      },
    },
  },
};
