import { render, screen } from "@testing-library/react-native";
import JoinGameInput from "../Join";

describe("Join Game Input Fields", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders input fields and join button", () => {
    render(<JoinGameInput />);

    expect(() => screen.getByText("Join Game")).toThrow();
    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId(`input-${i}`)).toBeTruthy();
    }
    expect(screen.getByTestId(`dash-3`)).toBeTruthy();
  });

  test("updates code state when text is entered into input fields", () => {});

  test("updates only valid characters into input fields", () => {});

  test("backspacing in input fields", () => {});

  test("copy and pasting into input fields", () => {});
});

describe("Player Profile Joining Game", () => {
  test("sets the code from previous game if within 24 hours", async () => {});

  test("displays profile modal when there is no player profile in storage", () => {});
});

describe("Join Game Entry", () => {
  test("calls handleGameEntry when join button is pressed", async () => {});

  test("displays error modal when there is an error", () => {});
});
