import { Hono } from "hono";

import routeFile from "./file";
import routeVersion from "./version";
import { isFlashRequest } from "../../../utils/flash-request";
import { cacheHeader } from "pretty-cache-header";

const app = new Hono();

app.route("/file", routeFile).route(
    "/",
    new Hono()
        .use(async (c, next) => {
            if (!isFlashRequest(c.req.raw.headers))
                return c.newResponse("Forbidden", 401, {
                    "Cache-Control": cacheHeader({
                        maxAge: "1day",
                        immutable: true,
                        public: true,
                    }),
                });

            return next();
        })
        .route("/game/version", routeVersion),
);

export const routeGame = app;
