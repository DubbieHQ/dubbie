import { Spinner } from "@/components/ui/Spinner";
import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Spinner size="medium" />
    </div>
  );
};

export default LoadingPage;
