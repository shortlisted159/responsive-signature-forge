
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Position = "left" | "right" | "top" | "bottom" | "center" | "none";

interface PhotoPositionSelectorProps {
  currentPosition: Position;
  onPositionChange: (position: Position) => void;
}

export default function PhotoPositionSelector({
  currentPosition,
  onPositionChange,
}: PhotoPositionSelectorProps) {
  const { toast } = useToast();
  
  const positions: { value: Position; label: string; icon: string }[] = [
    { value: "left", label: "Left", icon: "◀️" },
    { value: "center", label: "Center", icon: "⏺️" },
    { value: "right", label: "Right", icon: "▶️" },
    { value: "top", label: "Top", icon: "🔼" },
    { value: "bottom", label: "Bottom", icon: "🔽" },
    { value: "none", label: "None", icon: "⭕" },
  ];

  const handlePositionSelect = (position: Position) => {
    onPositionChange(position);
    toast({
      title: "Photo position updated",
      description: `Photo position set to ${position}`,
      duration: 2000,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between interactive-element"
        >
          <span>
            {positions.find(p => p.value === currentPosition)?.icon}{" "}
            {positions.find(p => p.value === currentPosition)?.label || "Select position"}
          </span>
          <span className="text-xs opacity-70">▼</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 glass-effect">
        <div className="photo-position-grid">
          {positions.map((position) => (
            <div
              key={position.value}
              className={cn(
                "photo-position-option",
                currentPosition === position.value && "active"
              )}
              onClick={() => handlePositionSelect(position.value)}
            >
              <div className="flex flex-col items-center">
                <span className="text-xl mb-1">{position.icon}</span>
                <span className="text-xs">{position.label}</span>
                {currentPosition === position.value && (
                  <Check className="h-4 w-4 absolute right-1 top-1 text-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
