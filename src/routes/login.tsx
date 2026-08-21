import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Field, TacButton } from "@/components/ui/tactical";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Bomb Defusal" },
      { name: "description", content: "Sign in to your Bomb Defusal operative account." },
      { property: "og:title", content: "Sign In — Bomb Defusal" },
      { property: "og:description", content: "Access your squad and jump into a live bomb." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  return (
    <AuthLayout
      title="Operative Login"
      subtitle="Authenticate to rejoin your squad."
      footer={
        <>
          No credentials yet?{" "}
          <Link to="/signup" className="text-primary underline-offset-4 hover:underline">
            Request clearance
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/dashboard" });
        }}
      >
        <Field label="Email" type="email" placeholder="operative@site.io" autoComplete="email" />
        <Field
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
        />
        <TacButton type="submit" variant="danger" className="w-full">
          Log in
        </TacButton>
      </form>
    </AuthLayout>
  );
}
