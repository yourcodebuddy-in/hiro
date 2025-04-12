import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { Task } from "@/lib/supabase/types";
import { generateBrightColor } from "@/utils/color";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconDots } from "@tabler/icons-react";
import { format } from "date-fns";
import { useState } from "react";
import { TaskMenu } from "../../_components/task-menu";

interface Props {
  data: Task;
}

export function TaskCard({ data }: Props) {
  const color = generateBrightColor(data.title);
  const [dropPosition, setDropPosition] = useState<"top" | "bottom" | null>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver, active } = useSortable({
    id: data.id,
    data: {
      type: "Task",
      task: data,
    },
  });

  // Only apply indicators when being dragged over
  const isBeingDraggedOver = isOver && active?.id !== data.id;

  // Handle mouse position to determine if hovering over top or bottom half
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isBeingDraggedOver) {
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseY = e.clientY;
      const halfHeight = rect.height / 2;
      const positionFromTop = mouseY - rect.top;

      if (positionFromTop < halfHeight) {
        setDropPosition("top");
      } else {
        setDropPosition("bottom");
      }
    }
  };

  const handleMouseLeave = () => {
    setDropPosition(null);
  };

  // Calculate styling based on drag states
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 1 : 0,
    marginBottom: "0.5rem",
    outline: isBeingDraggedOver ? "2px solid rgba(59, 130, 246, 0.5)" : "none",
    position: "relative" as const,
  };

  return (
    <div style={{ position: "relative" }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {isBeingDraggedOver && dropPosition === "top" && (
        <div
          className="absolute top-0 left-0 right-0 h-2 bg-blue-500 rounded-full transform -translate-y-2 z-10"
          style={{ opacity: 0.6 }}
        />
      )}

      <Card
        className="p-0 rounded-lg shadow-none cursor-move"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <CardContent className="p-0">
          <div className="p-4">
            <h4 className="text-md md:text-lg font-semibold">{data.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{data.description}</p>
            <div className="flex items-center gap-2 mt-2">
              {data.tag && (
                <span
                  className="text-xs px-3 py-1 text-white rounded-md capitalize"
                  style={{ backgroundColor: color + "30", color }}
                >
                  {data.tag.name}
                </span>
              )}
            </div>
          </div>
          <Separator />
          <div className="p-4">
            <span className="text-sm flex items-center gap-1">
              Due: {data.due_date ? format(new Date(data.due_date), "MMM d, yyyy") : "No due date"}
            </span>
          </div>
          <TaskMenu data={data}>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2">
              <IconDots />
            </Button>
          </TaskMenu>
        </CardContent>
      </Card>

      {isBeingDraggedOver && dropPosition === "bottom" && (
        <div
          className="absolute bottom-0 left-0 right-0 h-2 bg-blue-500 rounded-full transform translate-y-2 z-10"
          style={{ opacity: 0.6 }}
        />
      )}
    </div>
  );
}
