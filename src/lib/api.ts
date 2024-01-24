import { getChatUrl } from "./utils";

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function api<T>(
  url: string,
  method: RequestMethod = "GET",
  body: Record<string, unknown> = {}
): Promise<T> {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    const baseUrl = getChatUrl(window.GrispiChat.options.environment);
    url = `${baseUrl}${url}`;
  }

  const init: RequestInit = {
    method,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      tenantId: window.GrispiChat.options.tenantId,
    },
  };

  if (!["GET", "HEAD"].includes(method)) {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return await response.json();
}
