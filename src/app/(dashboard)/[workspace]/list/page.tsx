"use client";
import { useWorkspaceTasks } from "@/hooks/use-workspaces";
import { useParams } from "next/navigation";
import { StatusTabs } from "./_components/status-tabs";
import { TasksList } from "./_components/tasks-list";

export default function Page() {
  const params = useParams();
  const workspaceId = Number(params.workspace);
  const { data: tasks, isLoading } = useWorkspaceTasks(workspaceId);

  return (
    <div>
      <StatusTabs />
      <TasksList tasks={tasks} isLoading={isLoading} />
    </div>
  );
}
