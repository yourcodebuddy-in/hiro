export type Workspace = {
  id: number;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type Tag = {
  id: number;
  created_at: string;
  name: string;
  user_id: string;
  workspace_id: string;
};

export type TaskStatus = "todo" | "inwork" | "qa" | "completed";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  tag: Tag | null;
  workspace_id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  position: number;
};
