import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <section className="py-24 md:py-32">
      <LayoutContainer className="text-center">
        <p className="text-coral font-medium text-sm uppercase tracking-wider mb-4">
          404
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-teal mb-4">
          Page Not Found
        </h1>
        <p className="text-teal/70 text-lg mb-10 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist. Perhaps you&apos;d
          like to explore the gallery instead.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/" variant="primary">
            Back to Home
          </Button>
          <Button href="/gallery" variant="secondary">
            View Gallery
          </Button>
        </div>
      </LayoutContainer>
    </section>
  );
}
