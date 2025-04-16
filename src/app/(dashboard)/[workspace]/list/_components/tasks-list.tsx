import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { taskStatusMap } from "@/lib/supabase/data";
import { Task } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { IconDots } from "@tabler/icons-react";
import { format, isPast } from "date-fns";
import { TaskMenu } from "../../_components/task-menu";

interface Props {
  tasks: Task[] | undefined;
  isLoading?: boolean;
}

export function TasksList({ tasks, isLoading }: Props) {
  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <Table>
        {tasks?.length === 0 && (
          <TableCaption className="text-center border border-dashed py-6 md:py-12 rounded-lg">
            No tasks found
          </TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : tasks?.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    <Badge
                      data-status={task.status}
                      variant="secondary"
                      className="data-[status=todo]:bg-hiro-1 data-[status=inwork]:bg-hiro-2 data-[status=qa]:bg-hiro-3 data-[status=completed]:bg-hiro-4 text-white capitalize"
                    >
                      {taskStatusMap.get(task.status)?.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(task.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell
                    className={cn(
                      task.due_date &&
                        isPast(new Date(task.due_date)) &&
                        task.status !== "completed" &&
                        "text-destructive"
                    )}
                  >
                    {task.due_date ? format(new Date(task.due_date), "MMM d, yyyy") : "N/A"}
                  </TableCell>
                  <TableCell>{task.category?.name ?? "N/A"}</TableCell>
                  <TableCell>{task.tag ?? "N/A"}</TableCell>
                  <TableCell>
                    <TaskMenu data={task}>
                      <Button variant="ghost" size="icon">
                        <IconDots />
                      </Button>
                    </TaskMenu>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
