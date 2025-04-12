import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import * as React from "react";
import { Logo } from "../logo";
import { Separator } from "../ui/separator";
import { NavWorkspaces } from "./nav-workspaces";
import { ThemeToggle } from "./theme-toggle";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-6 group-data-[state=collapsed]:px-2">
        <div className="flex justify-between items-center gap-2">
          <Logo className="group-data-[state=collapsed]:[&_span]:hidden" />
          <SidebarTrigger className="bg-secondary border -ml-2" />
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavWorkspaces />
      </SidebarContent>
      <SidebarFooter className="p-6 group-data-[state=collapsed]:p-2">
        <ThemeToggle />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
