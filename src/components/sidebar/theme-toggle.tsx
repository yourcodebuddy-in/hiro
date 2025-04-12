"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconMoon, IconSunFilled } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { state } = useSidebar();

  if (state === "collapsed")
    return (
      <Button variant="outline" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
        <IconSunFilled className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <IconMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    );

  return (
    <Tabs defaultValue={resolvedTheme} onValueChange={setTheme}>
      <TabsList className="w-full rounded-full">
        <TabsTrigger className="rounded-full" value="light">
          <IconMoon className="size-4" /> Light
        </TabsTrigger>
        <TabsTrigger className="rounded-full" value="dark">
          <IconSunFilled className="size-4" /> Dark
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
