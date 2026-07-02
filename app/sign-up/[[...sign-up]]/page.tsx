import { SignUp } from "@clerk/nextjs";
import { BrandHeader } from "@/components/brand";
import { getOnboardingReturnUrl } from "@/lib/onboarding-flow";

type SignUpPageProps = {
  searchParams?: Promise<{
    role?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const returnUrl = getOnboardingReturnUrl(params?.role);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-fo-bg px-6 py-10">
      <BrandHeader className="mb-10" logoHeight={56} />
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl={returnUrl}
        fallbackRedirectUrl={returnUrl}
        signInForceRedirectUrl="/sign-in"
      />
    </main>
  );
}
