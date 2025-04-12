import { queryClient } from "@/context/tanstack-query-context";
import { useUser } from "@/context/user-provider";
import { useWorkspaceTags } from "@/hooks/use-workspaces";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { toast } from "sonner";

interface Props {
  workspaceId: number;
  name: string;
}

export function TagSelect({ workspaceId, name }: Props) {
  const [value, setValue] = useState<{ label: string; value: string } | null>(null);
  const { data, isLoading } = useWorkspaceTags(workspaceId);
  const { user } = useUser();

  async function handleCreateOption(input: string) {
    try {
      const supabase = createClient();
      const { data: newTag } = await supabase
        .from("tags")
        .insert({ name: input, user_id: user.id, workspace_id: workspaceId })
        .throwOnError()
        .select("id")
        .single();

      if (!newTag) {
        throw new Error("Failed to create tag");
      }

      queryClient.invalidateQueries({ queryKey: ["workspace-tags", workspaceId] });
      setValue({ label: input, value: newTag.id.toString() });

      return newTag;
    } catch (_error) {
      toast.error("Failed to create tag");
    }
  }

  return (
    <CreatableSelect
      className="h-9 [&_div]:!border-border [&_div]:!shadow-none"
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      isClearable
      isLoading={isLoading}
      isSearchable
      name={name}
      options={data?.map((tag) => ({ label: tag.name, value: tag.id.toString() })) ?? []}
      onCreateOption={handleCreateOption}
      placeholder="Select a tag"
      classNames={{
        control: () => "!bg-popover !rounded-md",
        input: () => "!text-sm",
        indicatorsContainer: () =>
          "[&_svg]:!fill-muted-foreground [&_svg]:!stroke-muted-foreground [&_svg]:!size-4 [&_svg]:!opacity-50 [&>div]:!pr-3",
        indicatorSeparator: () => "!hidden",
        placeholder: () => "!text-popover-foreground !text-sm",
        singleValue: () => "!text-sm",
        menu: () => "!bg-popover p-1 !rounded-md !border",
        option: () => "!text-popover-foreground hover:!bg-muted !bg-transparent !py-1.5 !px-2 !text-sm rounded-md",
      }}
    />
  );
}
