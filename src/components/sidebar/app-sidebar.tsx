import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";
import { Logo } from "../logo";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { NavWorkspaces } from "./nav-workspaces";
import { ThemeToggle } from "./theme-toggle";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-6 group-data-[state=collapsed]:px-2">
        <div className="flex justify-between items-center gap-2">
          <Link href="/">
            <Logo className="group-data-[state=collapsed]:[&_span]:hidden" />
          </Link>
          <SidebarTrigger className="bg-secondary border -ml-2" />
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavWorkspaces />
      </SidebarContent>
      <SidebarFooter className="p-6 group-data-[state=collapsed]:p-2">
        <Link href="https://youtu.be/DXwZbR5Fz1Y" target="_blank">
          <Button variant="destructive" className="rounded-full w-full">
            <IconBrandYoutubeFilled /> <span className="group-data-[state=collapsed]:hidden">Demo</span>
          </Button>
        </Link>
        <ThemeToggle />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
