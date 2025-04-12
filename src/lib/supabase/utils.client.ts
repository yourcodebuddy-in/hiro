import { createClient } from "./client";

interface UpsertTaskProps {
  title: string;
  description?: string | null;
  tag?: number | null;
  status: string;
  workspace: number;
  dueDate?: Date | null;
  position?: number | null;
  userId: string;
}

export async function createTask({ title, description, tag, status, workspace, dueDate, userId }: UpsertTaskProps) {
  const supabase = createClient();
  await supabase
    .from("tasks")
    .insert({
      title,
      description,
      tag,
      status,
      workspace_id: workspace,
      user_id: userId,
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
      status: rest.status ?? undefined,
      workspace_id: rest.workspace ?? undefined,
      user_id: rest.userId ?? undefined,
      due_date: rest.dueDate ?? undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .throwOnError();
}

export async function reorderTasks(tasks: { id: number; position: number }[]) {
  const supabase = createClient();
  const updates = tasks.map(({ id, position }) => ({
    id,
    position,
    updated_at: new Date().toISOString(),
  }));
  await supabase.from("tasks").upsert(updates).throwOnError();
}

export async function deleteTask(id: number) {
  const supabase = createClient();
  await supabase.from("tasks").delete().eq("id", id).throwOnError();
}
