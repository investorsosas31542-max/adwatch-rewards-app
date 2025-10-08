"use client";

import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRewards } from "@/hooks/use-rewards";
import { Clapperboard, DollarSign } from "lucide-react";

export function AppHeader() {
  const { balance } = useRewards();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Clapperboard className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold">AdWatch Rewards</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-accent px-3 py-1">
          <DollarSign className="h-5 w-5 text-accent-foreground" />
          <span className="text-lg font-bold text-accent-foreground">
            {balance.toFixed(2)}
          </span>
        </div>
      </div>
    </header>
  );
}
