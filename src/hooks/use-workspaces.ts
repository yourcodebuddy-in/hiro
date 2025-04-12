import { createClient } from "@/lib/supabase/client";
import { Tag, Task, Workspace } from "@/lib/supabase/types";
import { useQuery } from "@tanstack/react-query";

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.from("workspaces").select().throwOnError();
      return data as Workspace[];
    },
  });
}

export function useWorkspaceTags(id: number) {
  return useQuery({
    queryKey: ["workspace-tags", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.from("tags").select().eq("workspace_id", id).throwOnError();
      return data as Tag[];
    },
  });
}

export function useWorkspaceTasks(id: number) {
  return useQuery({
    queryKey: ["workspace-tasks", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.from("tasks").select("*, tag:tags(*)").eq("workspace_id", id).throwOnError();
      const sortedData = data?.sort((a, b) => a.position - b.position);
      return sortedData as Task[];
    },
  });
}
