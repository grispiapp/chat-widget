import { getChatUrl } from "./utils";

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
export type RequestOptions = Omit<RequestInit, "body"> & {
    body: Record<string, unknown> | unknown;
};

export async function api<T>(
    url: string,
    method: RequestMethod = "GET",
    options: RequestOptions = undefined
): Promise<T> {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `${getChatUrl()}${url}`;
    }

    let body;

    if (options?.body instanceof FormData) {
        body = options.body;
    } else if (options?.body) {
        body = JSON.stringify(options.body);
    }

    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        tenantId: window.GrispiChat.options.tenantId,
        ...(options?.headers || {}),
    };

    if (headers["Content-Type"] === "multipart/form-data") {
        delete headers["Content-Type"];
    }

    const formattedOptions: RequestInit = {
        ...options,
        body,
        headers,
    };

    const init: RequestInit = {
        mode: "cors",
        method,
        ...formattedOptions,
    };

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
