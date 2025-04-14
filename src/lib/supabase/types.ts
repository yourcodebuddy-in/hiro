export type Workspace = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  user: string;
};

export type Category = {
  id: number;
  name: string;
  user: string;
  workspace: string;
};

export type TaskStatus = "todo" | "inwork" | "qa" | "completed";

export type Task = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  category: Category | null;
  tag: string | null;
  workspace: number;
  user: string;
  position: number;
};
