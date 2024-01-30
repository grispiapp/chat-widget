import { getChatUrl } from "./utils";

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function api<T>(
    url: string,
    method: RequestMethod = "GET",
    body: Record<string, unknown> | unknown = {},
    headers: Record<string, unknown> = {}
): Promise<T> {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `${getChatUrl()}${url}`;
    }

    const init: RequestInit = {
        method,
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            tenantId: window.GrispiChat.options.tenantId,
            ...headers,
        },
    };

    if (!["GET", "HEAD"].includes(method)) {
        init.body = JSON.stringify(body);
    }

    const response = await fetch(url, init);

    if (!response.ok) {
        throw {
            message: `Request failed: ${response.status}`,
            response,
        };
    }

    try {
        return await response.json();
    } catch {
        //
    }
}
