import { isbot } from "isbot";
import { config, getURL } from "./config";

const headers = new Headers({
  Host: '3000-irl231-oiuiuy8-rh3vwrsnxgl.ws-us118.gitpod.io',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36 Edg/90.0.818.51',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US',
  Artixmode: 'launcher',
  'Cache-Control': 'no-cache',
  Cookie: '',
  Pragma: 'no-cache',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
  'X-Forwarded-For': '124.217.121.142',
  'X-Forwarded-Host': '3000-irl231-oiuiuy8-rh3vwrsnxgl.ws-us118.gitpod.io',
  'X-Forwarded-Port': '443',
  'X-Forwarded-Proto': 'https',
  'X-Requested-With': 'ShockwaveFlash/32.0.0.371'
});

const url = getURL(3000);
const referer = new RegExp(`^app:|^https?://${url}`);
const userAgent = /Chrome\/(8[4-9]|90)\.0\.\d{4}\.\d{2}/;

 const isTrustedReferer = (headers: Headers) => headers.get("host") === url;

 const isTrustedUA = (headers: Headers) => !isbot(headers.get("user-agent")) && userAgent.test(headers.get("user-agent") || "");
 const isFlashRequest = (headers: Headers) => headers.get("x-flash-version") || headers.get("x-requested-with")?.startsWith("ShockwaveFlash");

const sendFakSWF = !(isFlashRequest(headers) && isTrustedReferer(headers) && isTrustedUA(headers));

console.log(headers, url)
console.log(sendFakSWF, isTrustedReferer(headers));
