import { createClient } from "./client";
import { Task } from "./types";

interface UpsertTaskProps {
  title: string;
  description?: string | null;
  tag?: string | null;
  category?: number | null;
  status: string;
  workspace: number;
  dueDate?: Date | null;
  position?: number | null;
  userId: string;
}

export async function createTask({
  title,
  description,
  tag,
  category,
  position,
  status,
  workspace,
  dueDate,
  userId,
}: UpsertTaskProps) {
  const supabase = createClient();
  await supabase
    .from("tasks")
    .insert({
      title,
      description,
      tag,
      category,
      position,
      status,
      workspace,
      user: userId,
      due_date: dueDate,
    })
    .throwOnError();
}

export async function updateTask({ id, ...rest }: Partial<UpsertTaskProps> & { id: number }) {
  const supabase = createClient();
  await supabase
    .from("tasks")
    .update({
      title: rest.title ?? undefined,
      description: rest.description ?? undefined,
      tag: rest.tag ?? undefined,
      category: rest.category ?? undefined,
      position: rest.position ?? undefined,
      status: rest.status ?? undefined,
      workspace: rest.workspace ?? undefined,
      user: rest.userId ?? undefined,
      due_date: rest.dueDate ?? undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .throwOnError();
}

export async function reorderTasks(tasks: Task[]) {
  const supabase = createClient();
  const updates = tasks.map((task) => ({
    ...task,
    updated_at: new Date().toISOString(),
  }));
  await supabase.from("tasks").upsert(updates).throwOnError();
}

export async function deleteTask(id: number) {
  const supabase = createClient();
  await supabase.from("tasks").delete().eq("id", id).throwOnError();
}
