import { useQueryState } from "nuqs";

export function StatusTabs() {
  const [status, setStatus] = useQueryState("status", {
    defaultValue: "all",
  });

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-7 items-center relative *:cursor-pointer mb-7 *:aria-disabled:text-muted-foreground *:font-medium">
      <div
        aria-disabled={status !== "all"}
        className="flex gap-3 items-center px-4 relative"
        onClick={() => setStatus("all")}
      >
        All
        {status === "all" && (
          <div className="border-black dark:border-white border-b-4 absolute -bottom-4 left-0 right-0" />
        )}
      </div>
      <div
        aria-disabled={status !== "todo"}
        className="flex gap-3 items-center px-4 relative"
        onClick={() => setStatus("todo")}
      >
        To Do
        {status === "todo" && <div className="border-hiro-1 border-b-4 absolute -bottom-4 left-0 right-0" />}
      </div>
      <div
        aria-disabled={status !== "inwork"}
        className="flex gap-3 items-center px-4 relative"
        onClick={() => setStatus("inwork")}
      >
        In Work
        {status === "inwork" && <div className="border-hiro-2 border-b-4 absolute -bottom-4 left-0 right-0" />}
      </div>
      <div
        aria-disabled={status !== "qa"}
        className="flex gap-3 items-center px-4 relative"
        onClick={() => setStatus("qa")}
      >
        QA
        {status === "qa" && <div className="border-hiro-3 border-b-4 absolute -bottom-4 left-0 right-0" />}
      </div>
      <div
        aria-disabled={status !== "completed"}
        className="flex gap-3 items-center px-4 relative"
        onClick={() => setStatus("completed")}
      >
        Completed
        {status === "completed" && <div className="border-hiro-4 border-b-4 absolute -bottom-4 left-0 right-0" />}
      </div>
    </div>
  );
}
