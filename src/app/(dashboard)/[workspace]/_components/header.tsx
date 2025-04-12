"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { Separator } from "../../../../components/ui/separator";
import { SidebarTrigger } from "../../../../components/ui/sidebar";

export function LayoutHeader() {
  return (
    <div className="flex items-center gap-2 border-b w-full h-[84px]">
      <header className="w-full flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 w-full">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Nav />
          <AvatarMenu />
        </div>
      </header>
    </div>
  );
}

function Nav() {
  const pathname = usePathname();
  const isListActive = pathname.endsWith("list");
  const isBoardActive = pathname.endsWith("board");
  const isCalendarActive = pathname.endsWith("calendar");
  const params = useParams();
  const workspaceId = params.workspace as string;

  return (
    <div className="hidden md:block">
      <div className="flex gap-6">
        <Link href={`/${workspaceId}/list`} className="flex gap-3 items-center px-4 relative">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.925 10.125H3.075C1.95 10.125 1.5 10.605 1.5 11.7975V14.8275C1.5 16.02 1.95 16.5 3.075 16.5H14.925C16.05 16.5 16.5 16.02 16.5 14.8275V11.7975C16.5 10.605 16.05 10.125 14.925 10.125Z"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill={isListActive ? "#306BFF" : "#94A3B8"}
            />
            <path
              d="M9.675 1.5H3.075C1.95 1.5 1.5 1.98 1.5 3.1725V6.2025C1.5 7.395 1.95 7.875 3.075 7.875H9.675C10.8 7.875 11.25 7.395 11.25 6.2025V3.1725C11.25 1.98 10.8 1.5 9.675 1.5Z"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill={isListActive ? "#306BFF" : "#94A3B8"}
            />
          </svg>
          List
          {isListActive && <div className="border-blue-500 border-b-4 absolute -bottom-7 left-0 right-0" />}
        </Link>
        <Link href={`/${workspaceId}/board`} className="flex gap-3 items-center px-4 relative">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.875 14.925V3.075C7.875 1.95 7.395 1.5 6.2025 1.5H3.1725C1.98 1.5 1.5 1.95 1.5 3.075V14.925C1.5 16.05 1.98 16.5 3.1725 16.5H6.2025C7.395 16.5 7.875 16.05 7.875 14.925Z"
              fill={isBoardActive ? "#306BFF" : "#94A3B8"}
            />
            <path
              d="M16.5 9.675V3.075C16.5 1.95 16.02 1.5 14.8275 1.5H11.7975C10.605 1.5 10.125 1.95 10.125 3.075V9.675C10.125 10.8 10.605 11.25 11.7975 11.25H14.8275C16.02 11.25 16.5 10.8 16.5 9.675Z"
              fill={isBoardActive ? "#306BFF" : "#94A3B8"}
            />
          </svg>
          Board
          {isBoardActive && <div className="border-blue-500 border-b-4 absolute -bottom-7 left-0 right-0" />}
        </Link>
        <Link href={`/${workspaceId}/calendar`} className="flex gap-3 items-center px-4 relative">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.66667 1.66666V4.16666"
              stroke={isCalendarActive ? "#306BFF" : "#94A3B8"}
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13.3333 1.66666V4.16666"
              stroke={isCalendarActive ? "#306BFF" : "#94A3B8"}
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2.91667 7.57501H17.0833"
              stroke={isCalendarActive ? "#306BFF" : "#94A3B8"}
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M17.5 7.08332V14.1667C17.5 16.6667 16.25 18.3333 13.3333 18.3333H6.66667C3.75 18.3333 2.5 16.6667 2.5 14.1667V7.08332C2.5 4.58332 3.75 2.91666 6.66667 2.91666H13.3333C16.25 2.91666 17.5 4.58332 17.5 7.08332Z"
              stroke={isCalendarActive ? "#306BFF" : "#94A3B8"}
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13.0789 11.4167H13.0864"
              stroke={isCalendarActive ? "#306BFF" : "#94A3B8"}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13.0789 13.9167H13.0864"
              stroke={isCalendarActive ? "#306BFF" : "#94A3B8"}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.99624 11.4167H10.0037"
              stroke={isCalendarActive ? "#306BFF" : "#94A3B8"}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.99624 13.9167H10.0037"
              stroke={isCalendarActive ? "#306BFF" : "#94A3B8"}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.91192 11.4167H6.91941"
              stroke={isCalendarActive ? "#306BFF" : "#94A3B8"}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.91192 13.9167H6.91941"
              stroke={isCalendarActive ? "#306BFF" : "#94A3B8"}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Calendar
          {isCalendarActive && <div className="border-blue-500 border-b-4 absolute -bottom-7 left-0 right-0" />}
        </Link>
      </div>
    </div>
  );
}

function AvatarMenu() {
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="ml-auto block size-10">
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleLogout}>
          <IconLogout /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
