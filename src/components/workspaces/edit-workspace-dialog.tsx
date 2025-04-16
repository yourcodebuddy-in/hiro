"use client";
import { queryClient } from "@/context/tanstack-query-context";
import { createClient } from "@/lib/supabase/client";
import { Workspace } from "@/lib/supabase/types";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { DialogDescription, DialogTitle } from "../ui/dialog";
import {
  DialogOrDrawer,
  DialogOrDrawerContent,
  DialogOrDrawerHeader,
  DialogOrDrawerTrigger,
} from "../ui/dialog-or-drawer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props {
  children?: React.ReactNode;
  data: Workspace;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditWorkspaceDialog({ children, data, open = false, onOpenChange }: Props) {
  const [openState, setOpenState] = useState(false);
  const [loading, setLoading] = useState(false);
  const changeOpen = onOpenChange || setOpenState;

  async function updateWorkspace(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get("name");
      const supabase = createClient();
      await supabase.from("workspaces").update({ name }).eq("id", data.id).throwOnError();
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      changeOpen(false);
    } catch (_error) {
      toast.error("Failed to update workspace");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogOrDrawer open={open || openState} onOpenChange={changeOpen}>
      <DialogOrDrawerTrigger asChild>{children}</DialogOrDrawerTrigger>
      <DialogOrDrawerContent>
        <DialogOrDrawerHeader>
          <DialogTitle>Edit workspace</DialogTitle>
          <DialogDescription>Edit the workspace to better manage your tasks</DialogDescription>
        </DialogOrDrawerHeader>
        <form onSubmit={updateWorkspace}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="My Workspace"
                name="name"
                required
                disabled={loading}
                defaultValue={data.name}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading} loading={loading}>
              Update
            </Button>
          </div>
        </form>
      </DialogOrDrawerContent>
    </DialogOrDrawer>
  );
}
