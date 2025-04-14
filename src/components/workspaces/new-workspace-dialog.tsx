"use client";
import { queryClient } from "@/context/tanstack-query-context";
import { useUser } from "@/context/user-provider";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a workspace</DialogTitle>
          <DialogDescription>Create a workspace to manage your tasks</DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
