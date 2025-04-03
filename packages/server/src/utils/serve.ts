import { serve as honoServe } from "@hono/node-server";
import type { Hono } from "hono";
import type { AddressInfo } from "node:net";

export async function serve(app: Hono, port: number, hostname?:string) {
  return new Promise<AddressInfo>((resolve, reject) => {

    try {
    honoServe(
      {
        ...app,
        port,
        hostname,
      },
      resolve,
    );
  } catch(err) {
    reject(err)
  }
  })
}
