import useGameEntry from "../useGameEntry";
import RequestService from "../../services";
import { renderHook } from "@testing-library/react-native";

jest.mock("../../services", () => ({
  sendRequest: jest.fn(),
}));

describe("useGameEntry Hook", () => {
  test("default values are returned for loading, playerModal, and error", () => {
    RequestService.sendRequest.mockResolvedValue({
      response: { ok: true, json: { game: {} } },
      error: null,
    });
    const { result } = renderHook(() => useGameEntry());
    expect(result.current.loading).toBe(false);
    expect(result.current.playerModal).toBe(false);
    expect(result.current.error).toBe(false);
  });

  test("playerModal is true when player is found in storage", () => {});

  test("playerModal is false when player is not found in storage", () => {});

  test("navigates to Play screen with previousGame data when offline and previousGame exists", () => {});

  test("makes a request and navigate to Play screen with new game when online", () => {});

  test("error is set when response is false", () => {});
});
