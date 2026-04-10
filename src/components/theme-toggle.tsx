"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-2 w-9 h-9" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full w-9 h-9 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-orange-500" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
