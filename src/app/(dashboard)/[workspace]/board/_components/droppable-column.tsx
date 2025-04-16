import { Skeleton } from "@/components/ui/skeleton";
import { taskStatusMap } from "@/lib/supabase/data";
import { Task, TaskStatus } from "@/lib/supabase/types";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { IconDots } from "@tabler/icons-react";
import { useMemo } from "react";
import { TaskCard } from "./task-card";
import { TaskStatusColumnMenu } from "./task-status-column-menu";

interface Props {
  status: TaskStatus;
  tasks: Task[] | undefined;
  workspaceId: number;
  activeId: number | null;
  isLoading?: boolean;
}

export function DroppableColumn({ status, tasks, workspaceId, isLoading }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: `status-${status}`,
  });

  // Get sorted items for this column
  const items = useMemo(() => {
    return tasks?.map((task) => task.id) || [];
  }, [tasks]);

  const isEmpty = !tasks || tasks.length === 0;
  const randomNumber = Math.floor(Math.random() * 3) + 1;

  return (
    <div
      ref={setNodeRef}
      data-status={status}
      className="space-y-2 rounded-lg h-full min-h-[300px] transition-colors duration-200"
    >
      <div
        className={`border-b-3 border-hiro-${
          status === "todo" ? "1" : status === "inwork" ? "2" : status === "qa" ? "3" : "4"
        } pb-4`}
      >
        <div className="flex items-center gap-4 text-lg font-semibold">
          <h3 className="capitalize">{taskStatusMap.get(status)?.toUpperCase()}</h3>
          <span className="bg-secondary px-4 py-1 rounded-full text-xs mr-auto">{tasks?.length || 0}</span>
          <TaskStatusColumnMenu status={status} workspaceId={workspaceId}>
            {<IconDots className="ml-auto text-muted-foreground" />}
          </TaskStatusColumnMenu>
        </div>
      </div>
      <div className="p-1 flex flex-col min-h-[150px]">
        {isLoading ? (
          Array.from({ length: randomNumber }).map((_, index) => <Skeleton key={index} className="w-full h-40 mb-4" />)
        ) : (
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {!isEmpty ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <TaskCard key={task.id} data={task} />
                ))}
              </div>
            ) : (
              <div
                className={`text-muted-foreground text-sm flex items-center justify-center h-32 border-2 border-dashed rounded-lg transition-colors duration-200 ${
                  isOver ? "bg-muted/30 border-blue-500/50" : ""
                }`}
              >
                Drag tasks here
              </div>
            )}
          </SortableContext>
        )}
      </div>
    </div>
  );
}
