import React from "react";
import EditableProjectName from "./EditableProjectName";
import { BackButton } from "@/components/elements/buttons/BackButton";
import { ExportButtonWithPopover } from "@/components/elements/buttons/ExportButtonWithPopover";

function EditorTopBar() {
  return (
    <div className="flex h-16 shrink-0 flex-row items-center justify-between px-8">
      <BackButton url={"/"} />
      <EditableProjectName />
      <ExportButtonWithPopover />
    </div>
  );
}

export const MemoizedEditorTopBar = React.memo(EditorTopBar);
