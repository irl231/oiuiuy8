import { env } from "node:process";

const getEnv = <T extends string>(key: T) => env?.[key] as (typeof env)[T];

export const getURL = (port: number): string => {
  const appUrl = getEnv("APP_URL") ?? `localhost:${port}`;
  const gitpodUrl = getEnv("GITPOD_WORKSPACE_URL")?.replace("https://", `${port}-`);
  const codespaceUrl =
    getEnv("CODESPACE_NAME") && `${getEnv("CODESPACE_NAME")}-${port}.app.github.dev`;

  return gitpodUrl ?? codespaceUrl ?? appUrl;
};

export const isProd = getEnv("NODE_ENV") === "production";

export const runningOnVite = process.argv.toString().includes("vite");

interface ServerOpts {
  host: string;
  port: number;
  proxyIPHeader?: string;
  /**
   * HTTPS/SSL options. Not used if running locally or with nginx.
   */
  ssl?: {
    keyFile: string;
    certFile: string;
  };
  /**
   * Optional URL to access the API from the game server.
   */
  apiUrl?: string;
}

export interface ServerConfig {
  website: ServerOpts;
  game: ServerOpts;
  api: ServerOpts;
}

class Config {
  #serverConfig: ServerConfig;

  constructor() {
    this.#serverConfig = {
      website: {
        host: "0.0.0.0",
        port: 3000,
      },
      api: {
        host: "0.0.0.0",
        port: 8000,
      },
      game: {
        host: "0.0.0.0",
        port: 8001,
      },
    };

    this.#serverConfig.game.apiUrl = `http://${getURL(this.#serverConfig.api.port)}`;
  }

  get server(): ServerConfig {
    return this.#serverConfig;
  }
}

export const config = new Config();

export default config;
