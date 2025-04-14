import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Category</DialogTitle>
          <DialogDescription>Create a new category to organize your tasks.</DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          <Input id="name" name="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="button" disabled={loading} loading={loading} onClick={createCategory}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
