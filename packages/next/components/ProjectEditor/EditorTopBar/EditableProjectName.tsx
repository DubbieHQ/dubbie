import React, { useState, useRef } from "react";
import { useAtom } from "jotai";
import { projectNameAtom } from "@/lib/atoms";
import { cn } from "@/lib/utils";

const EditableProjectName = () => {
  const [projectName, setProjectName] = useAtom(projectNameAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(projectName);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    setIsEditing(false);
    setProjectName(name.trim() === "" ? "Untitled" : name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  return (
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      onBlur={handleBlur}
      onFocus={() => setIsEditing(true)}
      onKeyDown={handleKeyDown}
      ref={inputRef}
      className={cn(
        "text-md w-[300px] min-w-10 border-none bg-transparent text-center outline-none focus:outline-none",
        {
          "cursor-pointer opacity-60": !isEditing,
        },
      )}
    />
  );
};

export default EditableProjectName;
