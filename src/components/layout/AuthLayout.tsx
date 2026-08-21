import type { ReactNode } from "react";
import { Brand } from "@/components/layout/AppShell";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 tactical-grid opacity-40" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <Brand className="mb-8 self-start" />
        <div className="panel scanlines animate-rise-in p-6 sm:p-8">
          <div className="mb-6">
            <div className="label-caps text-primary">Secure Terminal</div>
            <h1 className="mt-2 text-2xl font-bold uppercase tracking-wide">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
      </div>
    </div>
  );
}
