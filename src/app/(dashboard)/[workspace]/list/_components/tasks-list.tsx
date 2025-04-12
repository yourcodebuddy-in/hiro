import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Task } from "@/lib/supabase/types";
import { generateBrightColor } from "@/utils/color";
import { IconDots } from "@tabler/icons-react";
import { format } from "date-fns";
import { TaskMenu } from "../../_components/task-menu";

interface Props {
  tasks: Task[] | undefined;
}

export function TasksList({ tasks }: Props) {
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
            <TableHead>Tag</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks
            ? tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    {
                      <Badge variant="secondary" className="capitalize px-3 py-1 rounded-md">
                        {task.status}
                      </Badge>
                    }
                  </TableCell>
                  <TableCell>{format(new Date(task.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>{task.due_date ? format(new Date(task.due_date), "MMM d, yyyy") : "N/A"}</TableCell>
                  <TableCell>
                    {task.tag ? (
                      <span
                        className="text-xs px-3 py-1 text-white rounded-md capitalize"
                        style={{
                          backgroundColor: generateBrightColor(task.title) + "30",
                          color: generateBrightColor(task.title),
                        }}
                      >
                        {task.tag.name}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    <TaskMenu data={task}>
                      <Button variant="ghost" size="icon">
                        <IconDots />
                      </Button>
                    </TaskMenu>
                  </TableCell>
                </TableRow>
              ))
            : Array.from({ length: 5 }).map((_, index) => (
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
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
