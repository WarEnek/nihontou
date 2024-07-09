import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import svgr from "vite-plugin-svgr";

export default defineConfig({
	plugins: [react(), TanStackRouterVite(), svgr()],
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:8083",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});