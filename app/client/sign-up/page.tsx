import { SignUp } from "@clerk/nextjs";
import { UserRole } from "@/app/generated/prisma/enums";
import { BrandHeader } from "@/components/brand";
import { getOnboardingReturnUrl } from "@/lib/onboarding-flow";

type ClientSignUpPageProps = {
  searchParams?: Promise<{
    role?: string;
  }>;
};

export default async function ClientSignUpPage({ searchParams }: ClientSignUpPageProps) {
  const params = await searchParams;
  const returnUrl = getOnboardingReturnUrl(params?.role ?? UserRole.CLIENT);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-fo-bg px-6 py-10">
      <BrandHeader className="mb-10" logoHeight={56} />
      <SignUp
        routing="path"
        path="/client/sign-up"
        signInUrl="/client/sign-in"
        forceRedirectUrl={returnUrl}
        fallbackRedirectUrl={returnUrl}
        signInForceRedirectUrl="/client/sign-in"
      />
    </main>
  );
}
