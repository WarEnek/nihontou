import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
	plugins: [react(), svgr()],
	server: {
		host: true,
		port: 8000,
		proxy: {
			"/api": {
				target: "nihontou-be:8083",
				// target: "http://localhost:8083",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
