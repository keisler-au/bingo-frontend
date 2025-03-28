import { Task as Square } from "../types";

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const getFirstType = (completedInCurrentSession: true | undefined) =>
  completedInCurrentSession ? "value" : "completed_by";

const getNextType = (attr: string) => {
  const displayOrder = ["value", "completed_by", "last_updated"];
  const nextIndex = (displayOrder.indexOf(attr) + 1) % displayOrder.length;
  return displayOrder[nextIndex];
};

const formatDisplayText = (attrType: string, attrValue: any) => {
  switch (attrType) {
    case "last_updated":
      return formatTime(attrValue);
    case "completed_by":
      return attrValue.name;
    case "value":
      return attrValue;
  }
};

export const addDisplayTextDetails = (square: Square) => {
  const displayType =
    square.displayType == null
      ? getFirstType(square.currentSession)
      : getNextType(square.displayType);
  const displayText = formatDisplayText(displayType, square[displayType]);
  return { ...square, displayText, displayType };
};

export default {};
