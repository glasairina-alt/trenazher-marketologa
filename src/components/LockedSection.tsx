import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LockedSectionProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export const LockedSection = ({ onClick, children, className }: LockedSectionProps) => {
  return (
    <div className={cn("relative", className)}>
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onClick}
              className="flex flex-col items-center gap-2 p-6 rounded-lg bg-card border-2 border-primary/20 hover:border-primary/40 hover:bg-card/80 transition-all shadow-lg group"
            >
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">
                Разблокировать
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Доступно на платном тарифе</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
