"use client";
import { queryClient } from "@/context/tanstack-query-context";
import { createClient } from "@/lib/supabase/client";
import { Workspace } from "@/lib/supabase/types";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props {
  children: React.ReactNode;
  data: Workspace;
}

export function EditWorkspaceDialog({ children, data }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function updateWorkspace(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get("name");
      const supabase = createClient();
      await supabase.from("workspaces").update({ name }).eq("id", data.id).throwOnError();
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      setOpen(false);
    } catch (_error) {
      toast.error("Failed to update workspace");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit workspace</DialogTitle>
          <DialogDescription>Edit the workspace to better manage your tasks</DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
