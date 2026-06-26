import { SignUp } from "@clerk/nextjs";
import { BrandHeader } from "@/components/brand";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-fo-bg px-6 py-10">
      <BrandHeader className="mb-10" logoHeight={56} />
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </main>
  );
}
