import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  DialogOrDrawer,
  DialogOrDrawerContent,
  DialogOrDrawerHeader,
  DialogOrDrawerTrigger,
} from "@/components/ui/dialog-or-drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { queryClient } from "@/context/tanstack-query-context";
import { useUser } from "@/context/user-provider";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  workspaceId: number;
  children: React.ReactNode;
}

export function NewCategoryFormDialog({ workspaceId, children }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  async function createCategory() {
    if (!name) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("categories").insert({
      name,
      workspace: workspaceId,
      user: user.id,
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["workspace-categories", workspaceId] });
    setOpen(false);
    setName("");
  }

  return (
    <DialogOrDrawer open={open} onOpenChange={setOpen}>
      <DialogOrDrawerTrigger asChild>{children}</DialogOrDrawerTrigger>
      <DialogOrDrawerContent>
        <DialogOrDrawerHeader>
          <DialogTitle>New Category</DialogTitle>
          <DialogDescription>Create a new category to organize your tasks.</DialogDescription>
        </DialogOrDrawerHeader>
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
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button className="w-full" type="button" disabled={loading} loading={loading} onClick={createCategory}>
            Create
          </Button>
        </div>
      </DialogOrDrawerContent>
    </DialogOrDrawer>
  );
}
