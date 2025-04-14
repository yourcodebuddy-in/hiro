"use client";
import { queryClient } from "@/context/tanstack-query-context";
import { useWorkspaceTasks } from "@/hooks/use-workspaces";
import { Task, TaskStatus } from "@/lib/supabase/types";
import { reorderTasks, updateTask } from "@/lib/supabase/utils.client";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { DroppableColumn } from "./_components/droppable-column";
import { TaskCard } from "./_components/task-card";

const TASK_STATUS: TaskStatus[] = ["todo", "inwork", "qa", "completed"];

export default function Page() {
  const params = useParams();
  const workspaceId = Number(params.workspace);
  const { data: tasks } = useWorkspaceTasks(workspaceId);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeStatus, setActiveStatus] = useState<TaskStatus | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[] | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  // Synchronize local tasks with fetched tasks
  useEffect(() => {
    setLocalTasks(tasks ?? []);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const toDoTasks = useMemo(() => localTasks?.filter((task) => task.status === "todo"), [localTasks]);
  const inWorkTasks = useMemo(() => localTasks?.filter((task) => task.status === "inwork"), [localTasks]);
  const qaTasks = useMemo(() => localTasks?.filter((task) => task.status === "qa"), [localTasks]);
  const completedTasks = useMemo(() => localTasks?.filter((task) => task.status === "completed"), [localTasks]);

  const tasksByStatus = {
    todo: toDoTasks,
    inwork: inWorkTasks,
    qa: qaTasks,
    completed: completedTasks,
  };

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    if (typeof active.id !== "number") return;

    const activeTask = localTasks?.find((task) => task.id === active.id);
    if (activeTask) {
      setActiveTask(activeTask);
      setActiveStatus(activeTask.status);
      setActiveId(active.id);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || typeof active.id !== "number" || !localTasks) return;

    const activeTaskIndex = localTasks.findIndex((task) => task.id === active.id);
    if (activeTaskIndex === -1) return;

    const activeTask = localTasks[activeTaskIndex];

    // Find the status we're dropping into
    let targetStatus: TaskStatus | undefined;
    let overTaskId: number | undefined;

    if (typeof over.id === "string" && over.id.startsWith("status-")) {
      targetStatus = over.id.replace("status-", "") as TaskStatus;
    } else if (typeof over.id === "number") {
      overTaskId = over.id;
      const overTask = localTasks.find((task) => task.id === overTaskId);
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    if (!targetStatus) return;

    // Create a new array of tasks with the updated task
    const updatedLocalTasks = [...localTasks];

    // If status changed
    if (activeTask.status !== targetStatus) {
      // Optimistically update the UI
      // Remove the task from its original position
      updatedLocalTasks.splice(activeTaskIndex, 1);

      // Find the right position in the target column
      const targetTasks = localTasks.filter((task) => task.status === targetStatus);
      let newPosition = targetTasks.length;

      // If dropping between tasks, calculate the position
      if (overTaskId) {
        const overTaskIndex = targetTasks.findIndex((task) => task.id === overTaskId);
        if (overTaskIndex !== -1) {
          newPosition = overTaskIndex;
        }
      }

      // Create updated task
      const updatedTask = { ...activeTask, status: targetStatus, position: newPosition };

      // Find the right index to insert the task
      const insertIndex = localTasks.findIndex(
        (task) => task.status === targetStatus && (newPosition === 0 || task.position >= newPosition)
      );

      if (insertIndex !== -1) {
        updatedLocalTasks.splice(insertIndex, 0, updatedTask);
      } else {
        // Add to the end of the appropriate status group
        const lastTaskOfStatusIndex = localTasks.findIndex(
          (task, i, arr) => task.status === targetStatus && (i === arr.length - 1 || arr[i + 1].status !== targetStatus)
        );

        if (lastTaskOfStatusIndex !== -1) {
          updatedLocalTasks.splice(lastTaskOfStatusIndex + 1, 0, updatedTask);
        } else {
          // If no tasks with this status exist, add to the end
          updatedLocalTasks.push(updatedTask);
        }
      }

      // Update local state first
      setLocalTasks(updatedLocalTasks);

      // Update task in the backend
      await updateTask({ id: activeTask.id, status: targetStatus, position: newPosition });

      // Update positions of all tasks in the target column
      const tasksToUpdate = updatedLocalTasks
        .filter((task) => task.status === targetStatus)
        .map((task, index) => ({
          ...task,
          position: index,
        }));

      // Update all task positions in the backend
      if (tasksToUpdate.length > 0) {
        await reorderTasks(tasksToUpdate);
      }
    } else {
      // If in same column, just reorder
      const overTaskIndex = overTaskId
        ? localTasks.findIndex((task) => task.id === overTaskId)
        : localTasks.filter((task) => task.status === targetStatus).length;

      if (overTaskIndex === -1) return;

      // Check if the position actually changed
      if (activeTaskIndex === overTaskIndex) {
        // No change in position, exit early
        setActiveTask(null);
        setActiveStatus(null);
        setActiveId(null);
        return;
      }

      // Optimistically update the UI
      const newLocalTasks = arrayMove(updatedLocalTasks, activeTaskIndex, overTaskIndex);

      // Check if there are actual changes in positions
      const hasPositionChanges = newLocalTasks.some((task, index) => {
        const originalTask = localTasks.find((t) => t.id === task.id);
        return originalTask && originalTask.position !== index;
      });

      if (!hasPositionChanges) {
        // No actual changes in positions
        setActiveTask(null);
        setActiveStatus(null);
        setActiveId(null);
        return;
      }

      setLocalTasks(newLocalTasks);

      // Get updated positions for tasks of this status
      const tasksToUpdate = newLocalTasks
        .filter((task) => task.status === targetStatus)
        .map((task, index) => ({
          ...task,
          position: index,
        }));

      // Update backend
      if (tasksToUpdate.length > 0) {
        await reorderTasks(tasksToUpdate);
      }
    }

    // Refetch to ensure data consistency
    queryClient.invalidateQueries({ queryKey: ["workspace-tasks", workspaceId] });

    setActiveTask(null);
    setActiveStatus(null);
    setActiveId(null);
  }

  async function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || typeof active.id !== "number" || !activeTask) return;

    let targetStatus: TaskStatus | undefined;

    if (typeof over.id === "string" && over.id.startsWith("status-")) {
      targetStatus = over.id.replace("status-", "") as TaskStatus;
    } else if (typeof over.id === "number") {
      const overTask = localTasks?.find((task) => task.id === over.id);
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    if (!targetStatus || targetStatus === activeStatus) return;
    setActiveStatus(targetStatus);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      autoScroll={true}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 *:space-y-8">
        {TASK_STATUS.map((status) => (
          <DroppableColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            activeId={activeId}
            workspaceId={workspaceId}
          />
        ))}
      </div>
      {typeof document !== "undefined" &&
        createPortal(
          <DragOverlay
            adjustScale={false}
            dropAnimation={{
              duration: 300,
              easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
            }}
          >
            {activeTask && <TaskCard data={activeTask} />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}
