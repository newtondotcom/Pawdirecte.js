import { Response } from "@/core/response";

export const API_VERSION = "7.0.1";

// Types matching @literate.ink/utilities interface
export interface FetcherRequest {
  url: string;
  method: string;
  headers: Array<[key: string, value: string]>;
  body?: string | Uint8Array;
  follow?: boolean;
}

export interface FetcherResponse {
  status: number;
  headers: Array<[key: string, value: string]>;
  bytes: Uint8Array | ArrayBuffer;
  content?: string; // Added for convenience
}

export type Fetcher = (req: FetcherRequest) => Promise<FetcherResponse>;

// Helper to get all headers with the same key from FetcherResponse
// Returns an array of all header values with the matching key (empty array if none found)
export const getHeaderFromResponse = (
  response: FetcherResponse,
  headerName: string
): string[] => {
  const lowerHeaderName = headerName.toLowerCase();
  const values: string[] = [];
  for (const [key, value] of response.headers) {
    if (key.toLowerCase() === lowerHeaderName) {
      values.push(value);
    }
  }
  return values;
};

// Helper to get the first header value (for backward compatibility with single-value headers)
export const getFirstHeaderFromResponse = (
  response: FetcherResponse,
  headerName: string
): string | null => {
  const values = getHeaderFromResponse(response, headerName);
  return values.length > 0 ? values[0] : null;
};

// Default fetcher using native fetch
export const defaultFetcher: Fetcher = async (
  req: FetcherRequest
): Promise<FetcherResponse> => {
  const headers: Record<string, string> = {};
  for (const [key, value] of req.headers) {
    headers[key] = value;
  }

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.body) {
    // Convert Uint8Array to a format fetch can handle
    if (req.body instanceof Uint8Array) {
      fetchOptions.body = req.body as BodyInit;
    } else {
      fetchOptions.body = req.body as BodyInit;
    }
  }

  const response = await fetch(req.url, fetchOptions);
  const arrayBuffer = await response.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const content = new TextDecoder().decode(bytes);

  const responseHeaders: Array<[string, string]> = [];
  response.headers.forEach((value, key) => {
    responseHeaders.push([key.toLowerCase(), value]);
  });

  return {
    status: response.status,
    headers: responseHeaders,
    bytes,
    content, // Add content for convenience
  };
};

export class Request {
  public url: URL;
  public headers: Record<string, string>;
  public method: string | undefined;
  public content: string | undefined;

  public constructor(path: string) {
    this.url = new URL(`https://api.ecoledirecte.com/v3${path}`);
    // this.headers = { "User-Agent": "Android EDMOBILE v7.0.1" };
    this.headers = {};
  }

  public setToken(token: string): Request {
    this.headers["X-Token"] = token;
    return this;
  }

  public addVersionURL(): Request {
    this.url.searchParams.set("v", API_VERSION);
    return this;
  }

  public setFormData(body: any): Request {
    this.method = "POST";
    this.content = `data=${JSON.stringify(body)}`;
    this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    return this;
  }

  private toFetcherRequest(): FetcherRequest {
    const headers: Array<[string, string]> = Object.entries(this.headers);
    return {
      url: this.url.toString(),
      method: this.method || "GET",
      headers,
      body: this.content,
    };
  }

  public async send(fetcher: Fetcher = defaultFetcher): Promise<Response> {
    const fetcherRequest = this.toFetcherRequest();
    const response = await fetcher(fetcherRequest);
    return new Response(response);
  }

  public async sendRaw(fetcher: Fetcher = defaultFetcher): Promise<FetcherResponse> {
    const fetcherRequest = this.toFetcherRequest();
    return await fetcher(fetcherRequest);
  }
}
