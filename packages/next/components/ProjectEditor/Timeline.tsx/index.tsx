import { Line } from "../../elements/Line";
import React from "react";
import { ControlPanel } from "./ControlPanel";
import { Tracks } from "./Tracks.tsx";

function Timeline() {
  return (
    <div className="relative flex w-full shrink-0 grow-0 flex-row">
      <ControlPanel />
      <Line orientation="vertical" className="h-[95%] self-end" />
      <Tracks />
    </div>
  );
}
export const MemoizedTimeline = React.memo(Timeline);
