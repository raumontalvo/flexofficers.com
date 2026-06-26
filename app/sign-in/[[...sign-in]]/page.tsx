import { SignIn } from "@clerk/nextjs";
import { BrandHeader } from "@/components/brand";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-fo-bg px-6 py-10">
      <BrandHeader className="mb-10" logoHeight={56} />
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </main>
  );
}
