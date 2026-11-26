import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss()],
	cacheDir: "node_modules/.cache/storybook-vite",
	resolve: {
		alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) },
	},
});
