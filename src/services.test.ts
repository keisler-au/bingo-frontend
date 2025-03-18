import RequestService from "./services";

describe("RequestService", () => {
  let url: string;
  let data: any;

  beforeEach(() => {
    jest.clearAllMocks();
    url = "https://test_url.com";
    data = { game: [] };
  });

  test("successful response", async () => {
    const mockResponse = { status: 200, json: { response: "success!" } };
    jest.spyOn(global, "fetch").mockResolvedValue(mockResponse);

    const result = await RequestService.sendRequest(url, data);

    expect(fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: "POST",
        body: expect.any(String),
      }),
    );
    expect(result.response).toEqual(mockResponse);
    expect(result.error).toBe(false);
  });

  test("request aborted after 5 seconds", async () => {});

  test("404 error response", async () => {});

  test("400 error response", async () => {});

  test("500 error response and capture exception with Sentry", async () => {});
});
