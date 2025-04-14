import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useWorkspaceTasks } from "@/hooks/use-workspaces";
import { useMemo, useState } from "react";

interface Props {
  workspaceId: number;
  name: string;
  defaultValue?: string | null;
}

export function TagSelect({ workspaceId, name, defaultValue }: Props) {
  const [open, setOpen] = useState(false);
  const { data: tasks } = useWorkspaceTasks(workspaceId);
  const [value, setValue] = useState<string | null | undefined>(defaultValue);
  const tags = useMemo(() => (tasks ?? []).filter((task) => task.tag).map((task) => task.tag as string), [tasks]);

  return (
    <div className="flex items-center gap-2">
      <Input
        className="flex-1"
        value={value ?? ""}
        placeholder="Tag"
        name={name}
        onChange={(e) => setValue(e.target.value)}
      />
      <Select open={open} onOpenChange={setOpen} onValueChange={setValue}>
        <SelectTrigger className="aspect-square p-2.5 !bg-secondary border-0 *:stroke-primary-foreground *:!opacity-100" />
        <SelectContent align="end">
          {tags.map((tag, index) => (
            <SelectItem key={`${tag}-${index}`} value={tag}>
              {tag}
            </SelectItem>
          ))}
          {tags.length === 0 && <p className="text-sm text-muted-foreground p-2">No tags found</p>}
        </SelectContent>
      </Select>
    </div>
  );
}
