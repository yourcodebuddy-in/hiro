import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queryClient } from "@/context/tanstack-query-context";
import { createClient } from "@/lib/supabase/client";
import { Task } from "@/lib/supabase/types";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { UpdateTaskFormDialog } from "./update-task-form-dialog";

interface Props {
  data: Task;
  children: React.ReactNode;
}

export function TaskMenu({ data, children }: Props) {
  async function deleteTask() {
    const supabase = createClient();
    const { error } = await supabase.from("tasks").delete().eq("id", data.id);
    if (error) {
      toast.error("Failed to delete task");
    }
    const tasks = queryClient.getQueryData<Task[]>(["workspace-tasks", data.workspace_id]);
    const filteredTasks = tasks?.filter((task) => task.id !== data.id);
    queryClient.setQueryData(["workspace-tasks", data.workspace_id], filteredTasks);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <UpdateTaskFormDialog id={Number(data.workspace_id)} data={data}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <IconEdit />
            Edit
          </DropdownMenuItem>
        </UpdateTaskFormDialog>
        <DropdownMenuItem onSelect={deleteTask}>
          <IconTrash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
