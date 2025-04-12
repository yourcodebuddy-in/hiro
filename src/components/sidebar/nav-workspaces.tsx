"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { generateBrightColor } from "@/utils/color";
import { IconDots, IconSquareRoundedPlus } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { NewWorkspaceDialog } from "../workspaces/new-workspace-dialog";
import { WorkspaceMenu } from "../workspaces/workspace-menu";

export function NavWorkspaces() {
  const { data: workspaces } = useWorkspaces();
  const { setOpenMobile } = useSidebar();

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
            <SidebarMenuButton
              asChild
              className="text-base font-medium p-4 h-10 justify-between"
              onClick={() => setOpenMobile(false)}
            >
              <div>
                <Link className="flex items-center gap-4 w-full" href={`/${item.id}/board`}>
                  <div
                    className="size-2 rounded-full group-data-[state=collapsed]:mx-auto"
                    style={{ backgroundColor: generateBrightColor(item.name) }}
                  />
                  <span className="truncate group-data-[state=collapsed]:hidden">{item.name}</span>
                </Link>
                <WorkspaceMenu workspace={item}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-fit focus-visible:ring-0 group-data-[state=collapsed]:hidden"
                  >
                    <IconDots className="size-4" />
                  </Button>
                </WorkspaceMenu>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
