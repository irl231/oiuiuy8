/* eslint-disable unused-imports/no-unused-vars */
import { stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { cwd } from "node:process";

import { Hono } from "hono";

import createEtag from "etag";
import { lookup } from "mime-types";
import { cacheHeader } from "pretty-cache-header";

import { cache } from "../../../middleware/cache";
import { sendFile, isFlashRequest, isTrustedReferer, isTrustedUA } from "./lib";
import { Readable } from "node:stream";

const app = new Hono();

app.use(cache({ maxAge: "1day" }), async (c, next) => {
  if (c.req.method !== "GET") {
    await next();
    return;
  }

  let filePath = c.req.query("path") ?? "";
  const headers = new Headers(c.req.raw.headers);
  const type = lookup(extname(filePath)) || "application/octet-stream";

  try {
    filePath = join(cwd(), "..", "..", "gamefiles", filePath);
    console.log("filepath: ", filePath);

    const _stat = await stat(filePath);
    if (_stat.isDirectory()) throw new Error("Cannot read a directory");

    const { size, mtimeMs } = _stat;
    const etag = createEtag(_stat);
    const lastModified = new Date(mtimeMs).toUTCString();

    if (headers.get("If-None-Match") === etag || headers.get("If-Modified-Since") === lastModified) {
      console.log("file not modified", filePath);
      // return new Response(null, { status: 304 });
    }

    const sendFakSWF = !(isFlashRequest(headers) && isTrustedReferer(headers) && isTrustedUA(headers) && type === "application/x-shockwave-flash");
    return new Response(sendFile(filePath, sendFakSWF), {
      headers: {
        ETag: etag,
        "Last-Modified": lastModified,
        "Cache-Control": cacheHeader({ noCache: true  }),
        "Content-Type": `${type}${/^text\/|^application\/(json|yaml|toml|xml|javascript)$/.test(type) ? "; charset=utf-8" : ""}`,
        "Content-Length": size.toString(),
        ...(!isFlashRequest(headers) && {
          "Content-Disposition": `inline; filename="what${extname(filePath)}"`,
        }),
      },
    });
  } catch (error) {
    if (isFlashRequest(headers)) return new Response(null, { status: 404 });
    return next();
  }
});

export const routeFile = app;
