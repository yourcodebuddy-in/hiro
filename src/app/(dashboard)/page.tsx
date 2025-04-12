import { LayoutHeader } from "./_components/header";
import { PageInfo } from "./_components/page-info";
import { WorkspaceList } from "./_components/workspace-list";

export default function Page() {
  return (
    <div>
      <LayoutHeader />
      <div className="flex flex-1 flex-col gap-8 md:gap-14 p-6 md:p-10">
        <PageInfo />
        <WorkspaceList />
      </div>
    </div>
  );
}
