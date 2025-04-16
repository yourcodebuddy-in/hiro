"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceMenu } from "@/components/workspaces/workspace-menu";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { generateBrightColor } from "@/utils/color";
import { IconDots } from "@tabler/icons-react";
import { format } from "date-fns";
import Link from "next/link";

export function WorkspaceList() {
  const { data: workspaces, isLoading } = useWorkspaces();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-muted-foreground">Select a workspace to get started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspaces?.map((workspace) => (
          <Card className="p-4 rounded-md shadow-none hover:shadow-sm transition-all duration-200" key={workspace.id}>
            <CardHeader className="p-0 flex items-start justify-between">
              <Link href={`/${workspace.id}/board`}>
                <div className="space-y-3">
                  <CardTitle className="flex items-center gap-2">
                    <span
                      className="block size-2 aspect-square rounded-full"
                      style={{ backgroundColor: generateBrightColor(workspace.name) }}
                    />
                    {workspace.name}
                  </CardTitle>
                  <CardDescription>Created on {format(workspace.created_at, "MMM d, yyyy")}</CardDescription>
                </div>
              </Link>
              <WorkspaceMenu workspace={workspace}>
                <Button variant="ghost" size="icon">
                  <IconDots className="size-4" />
                </Button>
              </WorkspaceMenu>
            </CardHeader>
          </Card>
        ))}
        {isLoading && Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="w-full h-20" />)}
      </div>
      {workspaces?.length === 0 && (
        <div className="flex items-center justify-center px-4 py-10 border border-dashed rounded-md">
          <p className="text-muted-foreground">No workspaces found</p>
        </div>
      )}
    </div>
  );
}
