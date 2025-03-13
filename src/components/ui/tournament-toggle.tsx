
import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Trophy } from "lucide-react";

interface TournamentToggleProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function TournamentToggle({ value, onValueChange }: TournamentToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(newValue) => {
        if (newValue) onValueChange(newValue);
      }}
      className="bg-gray-50 p-1 rounded-lg border border-gray-200 w-fit"
    >
      <ToggleGroupItem value="asl" className="gap-1.5 px-3">
        <Trophy size={16} />
        <span>ASL</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="apl" className="gap-1.5 px-3">
        <Trophy size={16} />
        <span>APL</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
