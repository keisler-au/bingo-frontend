import { render, screen } from "@testing-library/react-native";
import Play from "../Play";

describe("Play Component", () => {
  const mockRoute = {
    params: {
      game: {
        id: "game1",
        code: "ABC123",
        title: "Test Game",
        tasks: [
          ["1", "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
        ],
        players: [
          { id: "player1", name: "Player 1" },
          { id: "player2", name: "Player 2" },
        ],
      },
      player: { id: "player1", name: "Player 1" },
    },
  };

  test("renders the component correctly", () => {
    render(<Play route={mockRoute} />);

    expect(screen.getByText("Test Game")).toBeTruthy();
    expect(screen.getByText("ABC123")).toBeTruthy();
    expect(screen.getByTestId("shareButton")).toBeTruthy();
  });

  test("handles share functionality", () => {});
  test("player panel displays players and opens and closes", () => {});
  test("web socket closed on component unmount", () => {});
  test("web socket reconnect attempts", () => {});
});

describe("Online Task Updates", () => {
  test("game updated and saved after remote task update recieved", () => {});
  test("game updated and sent after local task update submitted", () => {});
  test("socket connection retried after disconnect", () => {});
  test("error modal displays after exponential socket connection retries", () => {});
});

describe("Offline Task Updates", () => {
  test("game saved to storage", () => {});
  test("local task update saved to queue", () => {});
  test("local task update sent from queue", () => {});
  test("local task update sent ", () => {});
});
