import config, { getURL } from "../config";

const ADOBE_AIR_CLIENT = {
  USER_AGENT: "Mozilla/5.0 (Windows; U; en-US) AppleWebKit/533.19.4 (KHTML, like Gecko) AdobeAIR/33.1",
  FLASH_VERSION: "33,1,1,935"
} as const;

const ELECTRON_CLIENT = {
  USER_AGENT: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36 Edg/90.0.818.51",
  X_VERSION: "c3LDQ3LDY5LDY1"
} as const;

export function isFlashRequest(headers: Headers) {
    const referer = headers.get("referer");
    if (!referer) return false;

    const [userAgent, xFlashVersion, xVersion] = [
        headers.get("user-agent"),
        headers.get("x-flash-version"),
        headers.get("x-version")
    ];

    if (referer.startsWith("app:/")) {
        return (
            userAgent === ADOBE_AIR_CLIENT.USER_AGENT &&
            xFlashVersion === ADOBE_AIR_CLIENT.FLASH_VERSION
        );
    }

    try {
        const refererHost = new URL(referer).host;
        const isValidOrigin = refererHost === getURL(config.server.website.port);

        return (
            isValidOrigin &&
            userAgent === ELECTRON_CLIENT.USER_AGENT &&
            xVersion === ELECTRON_CLIENT.X_VERSION
        );
    } catch {
        return false;
    }
}
