import { type Config } from "@react-router/dev/config"

function defineConfig(config: Config) {
  return config;
}

export default defineConfig({
  appDirectory: "src",
  future: {
    unstable_optimizeDeps: true,
  },
});
