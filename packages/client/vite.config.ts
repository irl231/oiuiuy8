import { defineConfig } from "vite";
import { version } from "../../package.json";
import { Config } from "../server/src/config";
import { GIT_VERSION } from "../server/src/utils/git-version";
import { reactRouter } from "@react-router/dev/vite";
import { codefend } from "rollup-plugin-codefend";

export default defineConfig(({ mode }) => {
  process.env = {
    ...process.env,
    VITE_GAME_VERSION: version,
  };

  const isDev = mode === "development";

  return {
    base: "",
    build: {
      target: "es2022",
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        plugins: !isDev
          ? codefend({
              transformation: {
                prefix: "Ox",
                static: [
                  {
                    from: "predefined_secret",
                    to: "123456",
                  },
                ],
                ignore: ["node_modules"],
              },
              debug: {
                stats: true,
              },
            })
          : undefined,
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
      port: 3000,
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: `http://${Config.devServer.host}:${Config.devServer.port}`,
          changeOrigin: true,
          secure: false,
        },
        "/team_v2": {
          target: `http://${Config.devServer.host}:${Config.devServer.port}`,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  };
});
