"use client";

import React from "react";
import { Button } from "@/components/elements/buttons/DefaultButton";
import { useAuth } from "@clerk/nextjs";

const LogoutButton = () => {
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <Button
      className="self-end text-sm"
      size="small"
      variant="secondary"
      onClick={handleLogout}
    >
      Sign out
    </Button>
  );
};

export default LogoutButton;
