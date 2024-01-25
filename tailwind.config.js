/** @type {import('tailwindcss').Config} */
export default {
  prefix: "cb-",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgba(var(--color-primary))",
        foreground: "rgba(var(--color-foreground))",
        mutedForeground: "rgba(var(--color-muted-foreground))",
        background: "rgba(var(--color-background))",
      },
    },
  },
};
