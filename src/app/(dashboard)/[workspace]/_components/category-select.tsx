import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkspaceCategories } from "@/hooks/use-workspaces";
import { IconPlus } from "@tabler/icons-react";
import { NewCategoryFormDialog } from "./new-category-form-dialog";

interface Props {
  workspaceId: number;
  name: string;
  defaultValue?: number;
}

export function CategorySelect({ workspaceId, name, defaultValue }: Props) {
  const { data: categories, isLoading } = useWorkspaceCategories(workspaceId);

  return (
    <div className="flex items-center gap-2">
      <Select name={name} defaultValue={defaultValue ? String(defaultValue) : undefined}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={isLoading ? "Loading..." : "Select a category"} />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={String(category.id)}>
              {category.name}
            </SelectItem>
          ))}
          {categories?.length === 0 && <p className="text-sm text-muted-foreground p-2">No categories found</p>}
        </SelectContent>
      </Select>
      <NewCategoryFormDialog workspaceId={workspaceId}>
        <Button type="button" variant="secondary" size="icon">
          <IconPlus />
        </Button>
      </NewCategoryFormDialog>
    </div>
  );
}
