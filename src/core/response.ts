import type { FetcherResponse } from "./request";
import { getFirstHeaderFromResponse } from "./request";

const validJson = (value: string) => {
  return (
    (value.startsWith("[") || value.startsWith("{")) &&
    (value.endsWith("]") || value.endsWith("}"))
  );
};

export class Response {
  public status: number;
  public token: string | null;
  public access_token: string | null = null;
  public message: string | null = null;
  public data: any;

  public constructor(response: FetcherResponse) {
    // Get content from response.content if available, otherwise decode from bytes
    const content = response.content ?? 
      (response.bytes instanceof ArrayBuffer
        ? new TextDecoder().decode(new Uint8Array(response.bytes))
        : new TextDecoder().decode(response.bytes));

    this.token = getFirstHeaderFromResponse(response, "x-token");

    const content_type = getFirstHeaderFromResponse(response, "content-type");
    // Set error if response is not JSON and don't starts like JSON. ED sometimes return JSON in a text/html Content-Type (yes....)
    if (
      !content_type?.startsWith("application/json") &&
      !validJson(content)
    ) {
      this.status = Number.parseInt(
        getFirstHeaderFromResponse(response, "x-code")!,
        10
      );
    }
    else {
      const parsedContent = JSON.parse(content);

      this.status = parsedContent.code;
      this.data = parsedContent.data;
      this.message = parsedContent.message;

      if ("token" in parsedContent) {
        this.token = parsedContent.token;
      }
    }
  }
}
