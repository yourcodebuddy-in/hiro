import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TanstackQueryProvider } from "@/context/tanstack-query-context";
import { UserProvider } from "@/context/user-provider";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state");

  return (
    <TanstackQueryProvider>
      <NuqsAdapter>
        <UserProvider user={user.user}>
          <SidebarProvider defaultOpen={sidebarState?.value === "true"}>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        </UserProvider>
      </NuqsAdapter>
    </TanstackQueryProvider>
  );
}
