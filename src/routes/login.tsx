import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Field, TacButton } from "@/components/ui/tactical";
import { supabase } from "../utils/supabase";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
        onSubmit={async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    setError(loginError.message);
    setLoading(false);
    return;
  }

  setLoading(false);
  navigate({ to: "/dashboard" });
}}
      >
        <Field
  label="Email"
  type="email"
  placeholder="operative@site.io"
  autoComplete="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
        <Field
  label="Password"
  type="password"
  placeholder="••••••••"
  autoComplete="current-password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
        {error && (
  <p className="text-sm text-primary" role="alert">
    {error}
  </p>
)}
        <TacButton
  type="submit"
  variant="danger"
  className="w-full"
  disabled={loading}
>
  {loading ? "Authenticating..." : "Log in"}
</TacButton>
      </form>
    </AuthLayout>
  );
}
