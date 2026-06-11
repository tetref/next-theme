import { Diamond } from "lucide-react";
import Link from "next/link";

export default function AuthSplitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding & testimonial */}
      <div className="relative hidden w-1/2 overflow-hidden bg-foreground md:flex md:flex-col md:items-center md:justify-center">
        {/* Decorative dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

        <div className="relative z-10 flex max-w-md flex-col items-center px-8 text-center">
          {/* Logo */}
          <Link
            href="/"
            className="mb-12 flex items-center gap-3 text-primary-foreground"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <Diamond className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Zenith</span>
          </Link>

          {/* Testimonial */}
          <blockquote className="space-y-6">
            <p className="text-xl leading-relaxed font-light text-primary-foreground/90">
              &ldquo;Zenith transformed how we manage our business. The
              dashboard is intuitive and beautiful.&rdquo;
            </p>
            <footer className="text-sm text-primary-foreground/60">
              <cite className="not-italic">
                <span className="font-semibold text-primary-foreground/80">
                  Sarah Chen
                </span>
                <span className="mx-2">&middot;</span>
                CEO at TechCorp
              </cite>
            </footer>
          </blockquote>

          {/* Decorative line */}
          <div className="mt-12 h-px w-24 bg-primary-foreground/20" />
        </div>
      </div>

      {/* Right panel — form content */}
      <div className="flex w-full items-center justify-center bg-background p-6 md:w-1/2 md:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
