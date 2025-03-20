import { getItemAsync, deleteItemAsync } from "expo-secure-store";
import { sendSavedQueue } from "../../app/utils/gameActions";

describe("sendSavedQueue", () => {
  const mockSendJsonMessage = jest.fn();
  const mockQueue = JSON.stringify([
    {
      grid_row: 1,
      grid_column: 1,
      completed: true,
      completed_by: { id: 1, name: "Player 1" },
    },
    {
      grid_row: 2,
      grid_column: 2,
      completed: false,
      completed_by: { id: 2, name: "Player 2" },
    },
  ]);
  test("saved queued items are sent and then the queue is deleted from storage", async () => {
    getItemAsync.mockResolvedValue(mockQueue);
    await sendSavedQueue(mockSendJsonMessage);

    expect(getItemAsync).toHaveBeenCalledWith("offlineUpdatesQueue");
    expect(mockSendJsonMessage).toHaveBeenCalledTimes(2);
    expect(mockSendJsonMessage).toHaveBeenCalledWith(
      expect.objectContaining({ grid_row: 1, grid_column: 1, completed: true }),
    );
    expect(mockSendJsonMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        grid_row: 2,
        grid_column: 2,
        completed: false,
      }),
    );
    expect(deleteItemAsync).toHaveBeenCalledWith("offlineUpdatesQueue");
  });

  test("nothing is sent if there are no offline updates", () => {});
});

describe("verifyEarliestCompletedSquare", () => {
  test("currentSquare returned if it has an earlier last_updated date", () => {});
  test("currentSquare returned if both squares have the same last_updated date", () => {});
  test("pushSquare returned if it has an earlier last_updated date", () => {});
  test("pushSquare returned if the game_id is different", () => {});
});
