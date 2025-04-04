/* eslint-disable unused-imports/no-unused-vars */
import { stat } from "node:fs/promises";
import { extname, join } from "node:path";
import {  cwd } from "node:process";

import { Hono } from "hono";

import createEtag from "etag";
import { lookup } from "mime-types";
import { cacheHeader } from "pretty-cache-header";

import { cache } from "../../../middleware/cache";
import { sendFile } from "../../../../utils/send-file";
import { isFlashRequest } from "../../../../utils/flash-request";

const app = new Hono();

app.use(cache({ maxAge: "1day" }), async (c, next) => {
  if (c.req.method !== "GET") {
    await next();
    return;
  }

  let filePath = encodeURIComponent(c.req.query("path") ?? "");
  const headers = new Headers(c.req.raw.headers);
  const type = lookup(extname(filePath)) || "application/octet-stream";
  const hasFlash = isFlashRequest(headers);

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

    return new Response(sendFile(filePath, !hasFlash), {
      headers: {
        ETag: etag,
        "Last-Modified": lastModified,
        "Cache-Control": cacheHeader({ noCache: true  }),
        "Content-Type": `${type}${/^text\/|^application\/(json|yaml|toml|xml|javascript)$/.test(type) ? "; charset=utf-8" : ""}`,
        "Content-Length": size.toString(),
        ...(!hasFlash && {
          "Content-Disposition": `inline; filename="what${extname(filePath)}"`,
        }),
      },
    });
  } catch {
    if (hasFlash) return new Response(null, { status: 404 });
    return next();
  }
});

export default app;
