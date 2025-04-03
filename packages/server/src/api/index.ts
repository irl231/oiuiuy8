
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { HTTPException } from "hono/http-exception";
import { prettyJSON } from "hono/pretty-json";
import { cache } from "./middleware/cache";
import { clientIp } from "./middleware/client-ip";
import { config, isProd } from "../config";

import routes from "./routes";
import { serve } from "../utils/serve";
import { Logger } from "../utils/logger";

class Api {
	#app = new Hono();
  #logger = new Logger("Api")
	constructor() {
		this.#app
			.use(compress({ encoding: "gzip" }), prettyJSON({ space: 4 }), clientIp())
			.route("/", routes)
			.onError((err) => {
				if (err instanceof HTTPException) return err.getResponse();
				return new Response("Caught Unknown Error", {
					status: 500,
				});
			});

      if (process.argv.includes("--api-server")) {
      serve(this.#app, config.server.api.port, config.server.api.host).then((info) => {
        this.#logger.log(`Server starts at port ${info.port}`)
      })
		}

	}

  get app() {
    return this.#app;
  }
}

const api = new Api();

export default api;
