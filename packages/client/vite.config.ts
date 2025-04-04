import { defineConfig } from "vite";
import { version } from "../../package.json";
import { config } from "../server/src/config";
import { GIT_VERSION } from "../server/src/utils/git-version";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig(({ mode }) => {
	process.env = {
		...process.env,
		VITE_GAME_VERSION: version,
	};

	const isDev = mode === "development";

	return {
		base: "",
    css: {
      transformer: "lightningcss",
      lightningcss: {
        targets: { chrome: 87, firefox: 78, safari: 14 },
      },
    },
		build: {
      cssMinify: "lightningcss",
      minify: "esbuild",
      sourcemap: false,
			target: "es2022",
			chunkSizeWarningLimit: 2000,
			rollupOptions: {
				output: {
					assetFileNames(assetInfo) {
						if (assetInfo.names[0]?.endsWith(".css")) {
							return "css/[name]-[hash][extname]";
						}
						return "assets/[name]-[hash][extname]";
					},
					entryFileNames: "js/app-[hash].js",
					chunkFileNames: "js/[name]-[hash].js",
					manualChunks(id, _chunkInfo) {
						if (id.includes("node_modules")) {
							return "vendor";
						}
					},
				},
			},
		},
		resolve: {
			extensions: [".ts", ".js"],
		},
		define: {
			GIT_VERSION: JSON.stringify(GIT_VERSION),
			IS_DEV: isDev,
		},
		plugins: [reactRouter()],
		json: {
			stringify: true,
		},
		server: {
			allowedHosts: [".gitpod.io"],
			host: config.server.website.host,
			port: config.server.website.port,
			proxy: {
				"/api": {
					target: config.server.game.apiUrl,
					rewrite: (path) => path.replace(/^\/api/, ""),
					preserveHeaderKeyCase: true,
          cookiePathRewrite: "/",
					changeOrigin: true,
					secure: false,
				},
				"/team_v2": {
					target: `http://${config.server.game.host}:${config.server.game.port}`,
					changeOrigin: true,
					secure: false,
					ws: true,
				},
			},
		},
	};
});
