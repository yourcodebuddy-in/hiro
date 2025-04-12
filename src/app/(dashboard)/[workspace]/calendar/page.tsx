"use client";
import { useWorkspaceTasks } from "@/hooks/use-workspaces";
import { Task } from "@/lib/supabase/types";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../../react-big-calendar.css";
import { NewTaskFormDialog } from "../_components/new-task-form-dialog";
import { UpdateTaskFormDialog } from "../_components/update-task-form-dialog";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: ["en"],
});

export default function Page() {
  const [newOpen, setNewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const params = useParams();
  const workspaceId = Number(params.workspace);
  const { data: tasks } = useWorkspaceTasks(workspaceId);
  const events = useMemo(
    () =>
      tasks
        ?.filter((task) => task.due_date)
        .map((task) => ({
          start: new Date(task.due_date!),
          end: new Date(task.due_date!),
          title: task.title,
          allDay: true,
          resource: task,
        })),
    [tasks]
  );

  function handleSlotClick({ start }: { start: Date }) {
    setNewOpen(true);
    setSelectedDate(start);
  }

  function handleEventClick(event: { resource: Task }) {
    setSelectedTask(event.resource);
    setEditOpen(true);
  }

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleEventClick}
        onSelectSlot={handleSlotClick}
        style={{ height: 800 }}
        views={["day", "week", "month"]}
        selectable
      />
      <NewTaskFormDialog
        workspaceId={workspaceId}
        open={newOpen}
        onOpenChange={setNewOpen}
        defaultValues={{ date: selectedDate ?? undefined }}
      />
      {selectedTask && <UpdateTaskFormDialog data={selectedTask} open={editOpen} onOpenChange={setEditOpen} />}
    </div>
  );
}
