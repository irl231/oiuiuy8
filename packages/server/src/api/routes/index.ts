import { Hono } from "hono";

import { routeGame } from "./game";

const app = new Hono();

app.route("/", routeGame);
app.get("/ping", (c) => c.text("pong"));

export default app;
