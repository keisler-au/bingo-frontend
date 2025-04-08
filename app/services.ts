import * as Sentry from "sentry-expo";

class RequestService {
  static FAILED_CONNECTION =
    "We failed to connect to the server. Please try again.";
  static NOT_FOUND =
    "The entry used did not connect, please check it's correct and try again.";
  static WEBSOCKET_FAILURE =
    "We failed to connect to the server. If the issue re-occurs please report it via Settings";
  static SERVER_ERROR =
    "There was an issue with the server. If it re-occurs please report it via Settings";

  static async sendRequest(url: string, data: any) {
    let response;
    let error: boolean | string = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      response = await fetch(url, {
        signal: controller.signal,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      clearTimeout(timeoutId);
    } catch (e: any) {
      error = this.FAILED_CONNECTION;
    }

    if (response?.status) {
      if (response?.status === 400) error = this.FAILED_CONNECTION;
      else if (response?.status === 404) error = this.NOT_FOUND;
      else if (response?.status > 399) error = this.SERVER_ERROR;
    }
    if (error) {
      const error_message = `Error: ${error}\nURL: ${url}\nData: ${data}`;
      console.error(error_message);
      Sentry.Native.captureException(error_message);
    }

    return { response, error };
  }
}

export default RequestService;
