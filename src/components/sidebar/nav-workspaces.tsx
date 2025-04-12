"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { queryClient } from "@/context/tanstack-query-context";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { createClient } from "@/lib/supabase/client";
import { Workspace } from "@/lib/supabase/types";
import { generateBrightColor } from "@/utils/color";
import { IconDots, IconSquareRoundedPlus, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { NewWorkspaceDialog } from "../workspaces/new-workspace-dialog";

export function NavWorkspaces() {
  const { data: workspaces } = useWorkspaces();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-base text-muted-foreground mb-3 p-4 group-data-[state=collapsed]:p-0 flex items-center justify-between">
        Workspace
        <NewWorkspaceDialog>
          <IconSquareRoundedPlus className="!size-5 text-muted-foreground" />
        </NewWorkspaceDialog>
      </SidebarGroupLabel>
      <SidebarMenu>
        {workspaces?.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild className="text-base font-medium p-4 h-10 justify-between">
              <div>
                <Link className="flex items-center gap-4 w-full" href={`/${item.id}/board`}>
                  <div
                    className="size-2 rounded-full group-data-[state=collapsed]:mx-auto"
                    style={{ backgroundColor: generateBrightColor(item.name) }}
                  />
                  <span className="truncate group-data-[state=collapsed]:hidden">{item.name}</span>
                </Link>
                <WorkspaceMenuButton workspace={item} />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function WorkspaceMenuButton({ workspace }: { workspace: Workspace }) {
  async function deleteWorkspace() {
    const supabase = createClient();
    const { error } = await supabase.from("workspaces").delete().eq("id", workspace.id).throwOnError();
    if (error) {
      toast.error("Failed to delete workspace");
    } else {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-fit focus-visible:ring-0 group-data-[state=collapsed]:hidden">
          <IconDots className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={10} side="right">
        <DropdownMenuLabel>{workspace.name}</DropdownMenuLabel>
        <DropdownMenuItem onSelect={deleteWorkspace}>
          <IconTrash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
