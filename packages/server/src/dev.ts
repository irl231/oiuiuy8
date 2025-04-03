import api from "./api"
import config from "./config"
import { Hono } from "hono"
import { serve } from "./utils/serve";


async function main() {
  const app = new Hono();
  app.route("/api", api.app);

  serve(app, 3000)
}

main()
