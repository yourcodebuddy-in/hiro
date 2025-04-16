"use client";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  DialogOrDrawer,
  DialogOrDrawerContent,
  DialogOrDrawerDescription,
  DialogOrDrawerHeader,
  DialogOrDrawerTitle,
  DialogOrDrawerTrigger,
} from "@/components/ui/dialog-or-drawer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/context/tanstack-query-context";
import { useUser } from "@/context/user-provider";
import { TastStatusOptions } from "@/lib/supabase/data";
import { createTask } from "@/lib/supabase/utils.client";
import { useState } from "react";
import { toast } from "sonner";
import { CategorySelect } from "./category-select";
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
    tag?: string;
    category?: number;
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
      const category = formData.get("category") as string;

      setLoading(true);
      await createTask({
        status,
        title,
        description,
        workspace: workspaceId,
        dueDate: date,
        userId: user.id,
        tag: tag ? tag : null,
        category: category ? Number(category) : null,
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
    <DialogOrDrawer open={open || openState} onOpenChange={changeOpen}>
      <DialogOrDrawerTrigger asChild>{children}</DialogOrDrawerTrigger>
      <DialogOrDrawerContent>
        <DialogOrDrawerHeader>
          <DialogOrDrawerTitle>New Task</DialogOrDrawerTitle>
          <DialogOrDrawerDescription>Add a new task to your workspace</DialogOrDrawerDescription>
        </DialogOrDrawerHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="title"
            name="title"
            placeholder="Title"
            disabled={loading}
            defaultValue={defaultValues?.title}
            required
          />
          <Textarea
            id="description"
            name="description"
            placeholder="Description"
            disabled={loading}
            defaultValue={defaultValues?.description}
          />
          <CategorySelect workspaceId={workspaceId} name="category" defaultValue={defaultValues?.category} />
          <TagSelect workspaceId={workspaceId} name="tag" defaultValue={defaultValues?.tag} />
          <Select name="status" defaultValue={defaultValues?.status ?? "todo"} disabled={loading} required>
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
      </DialogOrDrawerContent>
    </DialogOrDrawer>
  );
}
