import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Field, TacButton } from "@/components/ui/tactical";
import { supabase } from "../utils/supabase";

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

  const [callsign, setCallsign] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
        onSubmit={async (e) => {
  e.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  if (!callsign.trim()) {
    setError("Callsign is required.");
    return;
  }

  setLoading(true);

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    setError(signUpError.message);
    setLoading(false);
    return;
  }

  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        username: callsign.trim(),
        rank: "Recruit",
        clearance: "Pending",
        defusals: 0,
        detonations: 0,
      });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }
  }

  setLoading(false);
  navigate({ to: "/dashboard" });
}}
      >
        <Field
  label="Callsign"
  placeholder="NIGHTHAWK_07"
  hint="Visible to your squad in lobby."
  value={callsign}
  onChange={(e) => setCallsign(e.target.value)}
/>
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
  autoComplete="new-password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
        <Field
  label="Confirm password"
  type="password"
  placeholder="••••••••"
  autoComplete="new-password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
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
  {loading ? "Creating account..." : "Create account"}
</TacButton>
      </form>
    </AuthLayout>
  );
}
