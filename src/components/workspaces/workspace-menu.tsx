import { queryClient } from "@/context/tanstack-query-context";
import { createClient } from "@/lib/supabase/client";
import { Workspace } from "@/lib/supabase/types";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EditWorkspaceDialog } from "./edit-workspace-dialog";

interface Props {
  children: React.ReactNode;
  workspace: Workspace;
}

export function WorkspaceMenu({ children, workspace }: Props) {
  const router = useRouter();

  async function deleteWorkspace() {
    const supabase = createClient();
    const toastId = toast.loading("Deleting workspace...");
    const { error } = await supabase.from("workspaces").delete().eq("id", workspace.id).throwOnError();
    if (error) {
      toast.error("Failed to delete workspace", { id: toastId });
    } else {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      router.refresh();
      toast.success("Workspace deleted successfully", { id: toastId });
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={10} side="right">
        <DropdownMenuLabel>Workspace</DropdownMenuLabel>
        <EditWorkspaceDialog data={workspace}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <IconEdit />
            Edit
          </DropdownMenuItem>
        </EditWorkspaceDialog>
        <DropdownMenuItem onSelect={deleteWorkspace}>
          <IconTrash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
