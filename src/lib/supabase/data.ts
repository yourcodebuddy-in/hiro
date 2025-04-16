import { TaskStatus } from "./types";

export const TastStatusOptions: { label: string; value: TaskStatus }[] = [
  { label: "To do", value: "todo" },
  { label: "In work", value: "inwork" },
  { label: "QA", value: "qa" },
  { label: "Completed", value: "completed" },
];

export const taskStatusMap = new Map<TaskStatus, string>([
  ["todo", "To do"],
  ["inwork", "In work"],
  ["qa", "QA"],
  ["completed", "Completed"],
]);
