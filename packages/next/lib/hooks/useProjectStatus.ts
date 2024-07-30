import { useEffect, useRef } from "react";
import { projectInEditorAtom, fetchAndUpdateProjectAtom } from "../atoms";
import { useSetAtom, useAtomValue } from "jotai";

export const useProjectStatus = () => {
  const projectInEditor = useAtomValue(projectInEditorAtom);
  const fetchAndUpdateProject = useSetAtom(fetchAndUpdateProjectAtom);
  const lastFetchTime = useRef(0);

  useEffect(() => {
    if (projectInEditor.status === "COMPLETED") return;

    const fetchProject = () => {
      const now = Date.now();
      if (now - lastFetchTime.current >= 1000) {
        console.log("Fetching project...");
        fetchAndUpdateProject(projectInEditor.id);
        lastFetchTime.current = now;
      }
    };

    fetchProject(); // Initial fetch

    const intervalId = setInterval(fetchProject, 1000);

    return () => clearInterval(intervalId);
  }, [projectInEditor.id, projectInEditor.status, fetchAndUpdateProject]);
};
