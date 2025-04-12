import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function Logo({ className }: Props) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="rounded-full bg-primary p-1.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6 text-primary-foreground"
        >
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M7 14l3-3 3 3 4-4" />
        </svg>
      </div>
      <span className="text-xl font-bold text-secondary-foreground">Hiro</span>
    </div>
  );
}
