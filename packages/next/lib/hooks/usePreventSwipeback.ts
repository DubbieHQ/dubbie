import { useEffect } from "react";

const usePreventSwipeback = () => {
  useEffect(() => {
    const preventSwipeBack = (e: WheelEvent) => {
      const tracksContainer = document.querySelector(".tracks");
      if (
        e.deltaX !== 0 &&
        (!tracksContainer || !tracksContainer.contains(e.target as Node))
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventSwipeBack, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventSwipeBack);
    };
  }, []);
};

export default usePreventSwipeback;
