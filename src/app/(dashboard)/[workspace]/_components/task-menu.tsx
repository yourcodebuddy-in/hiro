import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queryClient } from "@/context/tanstack-query-context";
import { createClient } from "@/lib/supabase/client";
import { Task } from "@/lib/supabase/types";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { UpdateTaskFormDialog } from "./update-task-form-dialog";

interface Props {
  data: Task;
  children: React.ReactNode;
}

export function TaskMenu({ data, children }: Props) {
  const [open, setOpen] = useState(false);

  async function deleteTask() {
    const supabase = createClient();
    const { error } = await supabase.from("tasks").delete().eq("id", data.id);
    if (error) {
      toast.error("Failed to delete task");
    }
    const tasks = queryClient.getQueryData<Task[]>(["workspace-tasks", data.workspace]);
    const filteredTasks = tasks?.filter((task) => task.id !== data.id);
    queryClient.setQueryData(["workspace-tasks", data.workspace], filteredTasks);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Task</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setOpen(true)}>
          <IconEdit />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={deleteTask}>
          <IconTrash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <UpdateTaskFormDialog data={data} open={open} onOpenChange={setOpen} />
    </DropdownMenu>
  );
}
