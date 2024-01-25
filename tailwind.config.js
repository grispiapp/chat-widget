/** @type {import('tailwindcss').Config} */
export default {
    prefix: "cb-",
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "rgba(var(--color-primary), var(--tw-bg-opacity))",
                foreground: "rgba(var(--color-foreground), var(--tw-bg-opacity))",
                "muted-foreground": "rgba(var(--color-muted-foreground), var(--tw-bg-opacity))",
                background: "rgba(var(--color-background), var(--tw-bg-opacity))",
                "muted-background": "rgba(var(--color-muted-background), var(--tw-bg-opacity))",
                success: "rgba(var(--color-success), var(--tw-bg-opacity))",
                danger: "rgba(var(--color-danger), var(--tw-bg-opacity))",
            },
        },
    },
};
