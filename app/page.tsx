import { LandingLanguageProvider } from "@/components/landing/landing-language-context";
import { LandingPageContent } from "@/components/landing/LandingPageContent";

export default function Home() {
  return (
    <LandingLanguageProvider>
      <LandingPageContent />
    </LandingLanguageProvider>
  );
}
