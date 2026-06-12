import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-teal/10 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="font-serif text-xl text-teal">
            {SITE_NAME} Admin
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/"
              className="text-teal/60 hover:text-coral transition-colors"
            >
              View Site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="min-h-[calc(100vh-4.5rem)] bg-ivory">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8">{children}</div>
      </main>
    </>
  );
}
