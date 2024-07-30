import { useState, useEffect } from "react";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [hasWindow, setHasWindow] = useState(false);

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    if (typeof window !== "undefined") {
      setHasWindow(true);
      handleResize(); // Set initial size

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return { windowSize, hasWindow };
}

export default useWindowSize;
