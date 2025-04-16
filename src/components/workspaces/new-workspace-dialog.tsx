"use client";
import { queryClient } from "@/context/tanstack-query-context";
import { useUser } from "@/context/user-provider";
import { createClient } from "@/lib/supabase/client";
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
  children: React.ReactNode;
}

export function NewWorkspaceDialog({ children }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  async function createWorkspace(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get("name");
      const supabase = createClient();
      await supabase.from("workspaces").insert({ name, user: user.id }).throwOnError();
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      setOpen(false);
    } catch (_error) {
      toast.error("Failed to create workspace");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogOrDrawer open={open} onOpenChange={setOpen}>
      <DialogOrDrawerTrigger asChild>{children}</DialogOrDrawerTrigger>
      <DialogOrDrawerContent>
        <DialogOrDrawerHeader>
          <DialogTitle>Create a workspace</DialogTitle>
          <DialogDescription>Create a workspace to manage your tasks</DialogDescription>
        </DialogOrDrawerHeader>
        <form onSubmit={createWorkspace}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="My Workspace" name="name" required disabled={loading} />
            </div>
            <Button type="submit" className="w-full" disabled={loading} loading={loading}>
              Create
            </Button>
          </div>
        </form>
      </DialogOrDrawerContent>
    </DialogOrDrawer>
  );
}
