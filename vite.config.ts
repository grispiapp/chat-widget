import preact from "@preact/preset-vite";
import path from "path";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        plugins: [preact()],
        resolve: {
            alias: {
                "@components": path.resolve(__dirname, "./src/components"),
                "@ui": path.resolve(__dirname, "./src/components/common/ui"),
                "@lib": path.resolve(__dirname, "./src/lib"),
                "@hooks": path.resolve(__dirname, "./src/hooks"),
                "@context": path.resolve(__dirname, "./src/context"),
                "@resources": path.resolve(__dirname, "./resources"),
                "@": path.resolve(__dirname, "./src"),
            },
        },
    });
};
