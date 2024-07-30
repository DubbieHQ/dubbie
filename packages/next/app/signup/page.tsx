import { ContinueWithGoogleButton } from "@/components/elements/buttons/ContinueWithGoogleButton";
import { DubbieLogo } from "@/components/icons/DubbieLogo";

export default function SignUpPage() {
  return (
    <div className="h-screen w-full center">
      {/* absolute */}
      <div className="absolute left-10 top-10">
        <DubbieLogo />
      </div>

      {/* center button for logging in */}
      <ContinueWithGoogleButton />
    </div>
  );
}
