import React from "react";
import { PlusIcon } from "lucide-react";
import { createSegmentAtom } from "@/lib/atoms";
import { useSetAtom } from "jotai";

const AddSegmentButton = () => {
  const createSegment = useSetAtom(createSegmentAtom);
  return (
    <div
      className="absolute right-1 top-1 cursor-pointer rounded-lg border border-btn bg-btn p-[2.5px] transition-all
        duration-200 hover:brightness-[0.97]
        active:brightness-[0.94]"
      onClick={() => {
        createSegment();
      }}
    >
      <PlusIcon size={16} className="opacity-70" />
    </div>
  );
};

export default AddSegmentButton;
