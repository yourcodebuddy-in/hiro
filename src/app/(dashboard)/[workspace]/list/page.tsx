"use client";
import { useWorkspaceTasks } from "@/hooks/use-workspaces";
import { TaskStatus } from "@/lib/supabase/types";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { StatusTabs } from "./_components/status-tabs";
import { TasksList } from "./_components/tasks-list";

export default function Page() {
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const params = useParams();
  const workspaceId = Number(params.workspace);
  const { data: tasks } = useWorkspaceTasks(workspaceId);
  const filteredTasks = useMemo(() => {
    if (status === "all") return tasks;
    return tasks?.filter((task) => task.status === status);
  }, [tasks, status]);

  return (
    <div>
      <StatusTabs status={status} setStatus={setStatus} />
      <TasksList tasks={filteredTasks} />
    </div>
  );
}
