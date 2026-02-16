import { Info } from "lucide-react";

interface InfoTooltipProps {
  text: string;
  size?: "sm" | "md" | "lg";
}

export function InfoTooltip({ text, size = "md" }: InfoTooltipProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="group relative inline-flex cursor-help">
      <Info className={`${sizeClasses[size]} opacity-60 group-hover:opacity-100 transition-opacity text-neutral-400 group-hover:text-amber-400`} />
      
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none z-50">
        {/* Arrow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gradient-to-br from-amber-400/80 to-orange-500/80 rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        {/* Tooltip Box */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-4 py-3 bg-gradient-to-br from-neutral-800 to-neutral-900 text-white text-xs rounded-xl whitespace-nowrap border border-amber-500/30 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-100 scale-95 group-hover:-translate-y-1 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400" />
            <span className="font-medium text-amber-50">{text}</span>
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      </div>
    </div>
  );
}
