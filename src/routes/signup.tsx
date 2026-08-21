import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Field, TacButton } from "@/components/ui/tactical";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — Bomb Defusal" },
      { name: "description", content: "Register a Bomb Defusal operative callsign and join a squad." },
      { property: "og:title", content: "Create Account — Bomb Defusal" },
      { property: "og:description", content: "Register a callsign and start defusing with friends." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  return (
    <AuthLayout
      title="Request Clearance"
      subtitle="Register a callsign before your first deployment."
      footer={
        <>
          Already cleared?{" "}
          <Link to="/login" className="text-primary underline-offset-4 hover:underline">
            Log in
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
        <Field label="Callsign" placeholder="NIGHTHAWK_07" hint="Visible to your squad in lobby." />
        <Field label="Email" type="email" placeholder="operative@site.io" autoComplete="email" />
        <Field label="Password" type="password" placeholder="••••••••" autoComplete="new-password" />
        <Field
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
        />
        <TacButton type="submit" variant="danger" className="w-full">
          Create account
        </TacButton>
      </form>
    </AuthLayout>
  );
}
