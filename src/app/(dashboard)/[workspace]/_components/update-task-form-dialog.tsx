"use client";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  DialogOrDrawer,
  DialogOrDrawerContent,
  DialogOrDrawerHeader,
  DialogOrDrawerTrigger,
} from "@/components/ui/dialog-or-drawer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/context/tanstack-query-context";
import { TastStatusOptions } from "@/lib/supabase/data";
import { Task, TaskStatus } from "@/lib/supabase/types";
import { updateTask } from "@/lib/supabase/utils.client";
import { useState } from "react";
import { toast } from "sonner";
import { CategorySelect } from "./category-select";
import { TagSelect } from "./tag-select";

interface Props {
  children?: React.ReactNode;
  data: Task;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function UpdateTaskFormDialog({ children, data, open = false, onOpenChange }: Props) {
  const [openState, setOpenState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(data?.due_date ? new Date(data.due_date) : undefined);
  const changeOpen = onOpenChange || setOpenState;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const status = formData.get("status") as TaskStatus;
      const tag = formData.get("tag") as string;
      const category = formData.get("category") as string;

      setLoading(true);
      await updateTask({
        id: data.id,
        status,
        title,
        description,
        dueDate: date,
        tag: tag ? tag : null,
        category: category ? Number(category) : null,
      });
      changeOpen(false);
      queryClient.invalidateQueries({ queryKey: ["workspace-tasks", data.workspace] });
    } catch (_error) {
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogOrDrawer open={open || openState} onOpenChange={changeOpen}>
      <DialogOrDrawerTrigger asChild>{children}</DialogOrDrawerTrigger>
      <DialogOrDrawerContent>
        <DialogOrDrawerHeader>
          <DialogTitle>Update Task</DialogTitle>
          <DialogDescription>Update the task to your liking</DialogDescription>
        </DialogOrDrawerHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input id="title" name="title" placeholder="Title" disabled={loading} defaultValue={data.title} required />
          <Textarea
            id="description"
            name="description"
            placeholder="Description"
            disabled={loading}
            defaultValue={data.description ?? ""}
          />
          <CategorySelect workspaceId={data.workspace} name="category" defaultValue={data?.category?.id} />
          <TagSelect workspaceId={data.workspace} name="tag" defaultValue={data.tag} />
          <Select name="status" defaultValue={data.status} disabled={loading} required>
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
      </DialogOrDrawerContent>
    </DialogOrDrawer>
  );
}
