import { createClient } from "@/lib/supabase/client";
import { Category, Task, Workspace } from "@/lib/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

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

export function useWorkspaceCategories(id: number) {
  return useQuery({
    queryKey: ["workspace-categories", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select().eq("workspace", id).throwOnError();
      return data as Category[];
    },
  });
}

export function useWorkspaceTasks(id: number) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");

  const { data, ...rest } = useQuery({
    queryKey: ["workspace-tasks", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("tasks")
        .select("*, category:categories(*)")
        .eq("workspace", id)
        .order("position", { ascending: true })
        .throwOnError();

      // Ensure position is a number
      const processedData = data?.map((task) => ({
        ...task,
        position: typeof task.position === "number" ? task.position : 0,
      }));

      // Group by status first, then sort by position within each status
      const sortedData = processedData?.sort((a, b) => {
        // If status is the same, sort by position
        if (a.status === b.status) {
          return a.position - b.position;
        }
        // Otherwise, keep them in their status groups
        return 0;
      });

      return sortedData as Task[];
    },
  });

  const tags = useMemo(() => {
    return data?.map((task) => task.tag).filter((tag) => tag !== null) ?? [];
  }, [data]);

  const categories = useMemo(() => {
    return data?.map((task) => task.category).filter((category) => category !== null) ?? [];
  }, [data]);

  const filteredData = useMemo(() => {
    let result = data ?? [];
    if (category) {
      result = result.filter((task) => task.category?.id === Number(category));
    }
    if (tag) {
      result = result.filter((task) => task.tag === tag);
    }
    return result;
  }, [data, category, tag]);

  return { data: filteredData, tags, categories, ...rest };
}
