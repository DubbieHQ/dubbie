"use client";
import { motion } from "framer-motion";
import { GoogleLogo } from "@/components/icons/GoogleLogo";
import { useSignIn } from "@clerk/nextjs";

export const ContinueWithGoogleButton: React.FC = () => {
  const { signIn } = useSignIn();

  const handleGoogleAuth = async () => {
    // Ensure signIn is available
    if (!signIn) return;

    // Use authenticateWithRedirect to initiate the OAuth flow
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback", // Specify the redirect URL after successful authentication
      // Optionally, specify a URL to redirect to if the OAuth flow completes successfully
      redirectUrlComplete: "/", // This can be adjusted based on your routing needs
    });
  };

  const variants = {
    hover: {
      filter: "brightness(0.97)",
    },
    pressed: {
      scale: 0.98,
    },
  };

  return (
    <motion.div
      className="flex cursor-pointer select-none items-center
      justify-center gap-1 rounded-full border
      border-btn bg-btn py-2 pl-5 pr-6 shadow-custom-sm"
      onClick={handleGoogleAuth} // Use the Google auth handler here
      variants={variants}
      whileHover="hover"
      whileTap="pressed"
    >
      <GoogleLogo />
      <div className="ml-2 opacity-70">Continue with Google</div>
    </motion.div>
  );
};
