import { createClient } from "./server";
import { Workspace } from "./types";

export async function getUser() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error("User not found");
  }
  return user.data.user;
}

export async function getWorkspace(id: number) {
  const supabase = await createClient();
  const { data } = await supabase.from("workspaces").select("*").eq("id", id).limit(1).maybeSingle();
  return data as Workspace | null;
}
