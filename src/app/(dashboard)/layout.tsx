import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TanstackQueryProvider } from "@/context/tanstack-query-context";
import { UserProvider } from "@/context/user-provider";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    redirect("/login");
  }

  return (
    <TanstackQueryProvider>
      <UserProvider user={user.user}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </UserProvider>
    </TanstackQueryProvider>
  );
}
