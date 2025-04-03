import { Hono } from "hono";

import { routeFile } from "./file";

const app = new Hono();

app.route("/file", routeFile);
// app.route("/api/login/now", routeLogin);
// app.route("/api/data/gameversion", routeVersion);
// app.route("/api/data/gamenews", routeNews);

export const routeGame = app;
