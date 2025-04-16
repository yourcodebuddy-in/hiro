import { LayoutHeader } from "@/app/(dashboard)/[workspace]/_components/header";
import { Button } from "@/components/ui/button";
import { getWorkspace } from "@/lib/supabase/utils.server";
import { IconSquareRoundedPlus } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { NewTaskFormDialog } from "./_components/new-task-form-dialog";
import { WorkspaceInfo } from "./_components/workspace-info";

interface Props {
  children: React.ReactNode;
  params: Promise<{ workspace: string }>;
}

export default async function Layout({ children, params }: Props) {
  const paramsList = await params;
  const workspace = await getWorkspace(Number(paramsList.workspace));

  if (!workspace) {
    return redirect("/");
  }

  return (
    <div>
      <LayoutHeader />
      <div className="flex flex-1 flex-col gap-8 md:gap-14 p-6 md:p-10">
        <WorkspaceInfo id={workspace.id} name={workspace.name} />
        {children}
        <NewTaskFormDialog workspaceId={workspace.id}>
          <Button size="lg" className="fixed bottom-8 right-8 rounded-full bg-hiro-1 text-white z-50">
            <IconSquareRoundedPlus /> New Task
          </Button>
        </NewTaskFormDialog>
      </div>
    </div>
  );
}
