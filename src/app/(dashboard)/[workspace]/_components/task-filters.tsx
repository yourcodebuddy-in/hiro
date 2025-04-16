"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWorkspaceTasks } from "@/hooks/use-workspaces";
import { IconFilter } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  workspaceId: number;
}

export function TaskFilters({ workspaceId }: Props) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string>("all");
  const [tag, setTag] = useState<string>("all");
  const { categories, tags } = useWorkspaceTasks(workspaceId);
  const router = useRouter();
  const isMobile = useIsMobile();

  function filterTasks() {
    const searchParams = new URLSearchParams();
    if (category !== "all") searchParams.set("category", category);
    if (tag !== "all") searchParams.set("tag", tag);
    const pageUrl = new URL(window.location.href);
    pageUrl.search = String(searchParams);
    router.push(String(pageUrl));
    setOpen(false);
  }

  return (
    <div className="flex justify-end gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <IconFilter /> Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent align={isMobile ? "start" : "end"}>
          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label>Tag</Label>
            <Select value={tag} onValueChange={setTag}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {tags?.map((tag, index) => (
                  <SelectItem key={`${tag}-${index}`} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={filterTasks}>Confirm</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
