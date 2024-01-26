/** @type {import('tailwindcss').Config} */
export default {
    prefix: "cb-",
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "rgb(var(--color-primary))",
                foreground: "rgb(var(--color-foreground))",
                "muted-foreground": "rgb(var(--color-muted-foreground))",
                background: "rgb(var(--color-background))",
                "muted-background": "rgb(var(--color-muted-background))",
                success: "rgb(var(--color-success))",
                danger: "rgb(var(--color-danger))",
            },
        },
    },
};
