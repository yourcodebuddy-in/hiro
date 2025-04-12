import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queryClient } from "@/context/tanstack-query-context";
import { Task, TaskStatus } from "@/lib/supabase/types";
import { deleteTask, updateTask } from "@/lib/supabase/utils.client";
import { IconDots, IconTransfer, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

interface Props {
  status: TaskStatus;
  workspaceId: number;
}

export function TaskStatusColumnMenu({ status, workspaceId }: Props) {
  async function transferTasks(targetStatus: TaskStatus) {
    const toastId = toast.loading("Transferring tasks...");
    try {
      const tasks = queryClient.getQueryData<Task[]>(["workspace-tasks", workspaceId]) || [];
      const tasksToBeUpdated =
        tasks.filter((task) => task.status === status).map((task) => ({ ...task, status: targetStatus })) || [];

      const promises = tasksToBeUpdated.map((task) => updateTask({ id: task.id, status: targetStatus }));
      await Promise.all(promises);

      const tasksNotUpdated = tasks?.filter((task) => task.status !== status) || [];
      queryClient.setQueryData(["workspace-tasks", workspaceId], [...tasksNotUpdated, ...tasksToBeUpdated]);
      toast.success("Tasks transferred successfully", { id: toastId });
    } catch (_error) {
      toast.error("Failed to transfer tasks", { id: toastId });
    }
  }

  async function deleteColumn() {
    const toastId = toast.loading("Deleting tasks...");
    try {
      const tasks = queryClient.getQueryData<Task[]>(["workspace-tasks", workspaceId]) || [];
      const tasksToBeDeleted = tasks.filter((task) => task.status === status);

      const promises = tasksToBeDeleted.map((task) => deleteTask(task.id));
      await Promise.all(promises);

      const tasksNotDeleted = tasks.filter((task) => task.status !== status);
      queryClient.setQueryData(["workspace-tasks", workspaceId], tasksNotDeleted);
      toast.success("Tasks deleted successfully", { id: toastId });
    } catch (_error) {
      toast.error("Failed to delete tasks", { id: toastId });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconDots className="ml-auto text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="capitalize">{status}</DropdownMenuLabel>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <IconTransfer className="mr-2" size={16} />
            Transfer
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {status !== "todo" && (
              <DropdownMenuItem onClick={() => transferTasks("todo")}>
                <span className="block size-2 bg-hiro-1 rounded-full" />
                Todo
              </DropdownMenuItem>
            )}
            {status !== "inwork" && (
              <DropdownMenuItem onClick={() => transferTasks("inwork")}>
                <span className="block size-2 bg-hiro-2 rounded-full" />
                In Work
              </DropdownMenuItem>
            )}
            {status !== "qa" && (
              <DropdownMenuItem onClick={() => transferTasks("qa")}>
                <span className="block size-2 bg-hiro-3 rounded-full" />
                QA
              </DropdownMenuItem>
            )}
            {status !== "completed" && (
              <DropdownMenuItem onClick={() => transferTasks("completed")}>
                <span className="block size-2 bg-hiro-4 rounded-full" />
                Completed
              </DropdownMenuItem>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem onClick={deleteColumn}>
          <IconTrash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
