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
import { useUser } from "@/context/user-provider";
import { TastStatusOptions } from "@/lib/supabase/data";
import { createTask } from "@/lib/supabase/utils.client";
import { useState } from "react";
import { toast } from "sonner";
import { TagSelect } from "./tag-select";

interface Props {
  id: number;
  children: React.ReactNode;
}

export function NewTaskFormDialog({ id, children }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { user } = useUser();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const status = formData.get("status") as string;
      const tag = formData.get("tag") as string;

      setLoading(true);
      await createTask({
        tag: tag ? Number(tag) : null,
        status,
        title,
        description,
        workspace: id,
        dueDate: date,
        userId: user.id,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>Add a new task to your workspace</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input id="title" name="title" placeholder="Title" disabled={loading} />
          <Textarea id="description" name="description" placeholder="Description" disabled={loading} />
          <TagSelect workspaceId={id} name="tag" />
          <Select name="status" defaultValue="todo" disabled={loading}>
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
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
