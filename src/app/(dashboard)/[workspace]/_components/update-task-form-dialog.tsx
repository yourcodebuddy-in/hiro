"use client";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/context/tanstack-query-context";
import { TastStatusOptions } from "@/lib/supabase/data";
import { Task, TaskStatus } from "@/lib/supabase/types";
import { updateTask } from "@/lib/supabase/utils.client";
import { useState } from "react";
import { toast } from "sonner";
import { TagSelect } from "./tag-select";

interface Props {
  id: number;
  children: React.ReactNode;
  data: Task;
}

export function UpdateTaskFormDialog({ id, children, data }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(data?.due_date ? new Date(data.due_date) : undefined);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const status = formData.get("status") as TaskStatus;
      const tag = formData.get("tag") as string;

      setLoading(true);
      await updateTask({
        id: data.id,
        tag: tag ? Number(tag) : null,
        status,
        title,
        description,
        dueDate: date,
      });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["workspace-tasks", id] });
    } catch (_error) {
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent popoverTarget="">
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
          <DialogDescription>Update the task to your liking</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input id="title" name="title" placeholder="Title" disabled={loading} defaultValue={data.title} />
          <Textarea
            id="description"
            name="description"
            placeholder="Description"
            disabled={loading}
            defaultValue={data.description ?? ""}
          />
          <TagSelect workspaceId={id} name="tag" />
          <Select name="status" defaultValue={data.status} disabled={loading}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {TastStatusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DatePicker className="w-full" date={date} setDate={setDate} />
          <Button className="w-full" disabled={loading} loading={loading}>
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
