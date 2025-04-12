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
import { Tag } from "@/lib/supabase/types";
import { createTask } from "@/lib/supabase/utils.client";
import { useState } from "react";
import { toast } from "sonner";
import { TagSelect } from "./tag-select";

interface Props {
  workspaceId: number;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultValues?: {
    title?: string;
    description?: string;
    status?: string;
    tag?: Tag;
    date?: Date;
  };
}

export function NewTaskFormDialog({ workspaceId, children, open = false, onOpenChange, defaultValues }: Props) {
  const [openState, setOpenState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(defaultValues?.date);
  const { user } = useUser();
  const changeOpen = onOpenChange || setOpenState;

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
        workspace: workspaceId,
        dueDate: date,
        userId: user.id,
      });
      changeOpen(false);
      queryClient.invalidateQueries({ queryKey: ["workspace-tasks", workspaceId] });
    } catch (_error) {
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open || openState} onOpenChange={changeOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>Add a new task to your workspace</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input id="title" name="title" placeholder="Title" disabled={loading} defaultValue={defaultValues?.title} />
          <Textarea
            id="description"
            name="description"
            placeholder="Description"
            disabled={loading}
            defaultValue={defaultValues?.description}
          />
          <TagSelect
            workspaceId={workspaceId}
            name="tag"
            defaultValue={
              defaultValues?.tag ? { label: defaultValues.tag.name, value: String(defaultValues.tag.id) } : undefined
            }
          />
          <Select name="status" defaultValue={defaultValues?.status ?? "todo"} disabled={loading}>
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
