import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "@/lib/heroicons";
import { useToast } from "@/hooks/use-toast";
import AuthShell from "@/components/auth/AuthShell";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err?.response?.data?.message || "Please check your email and password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      toast({
        title: "Could not start Google login",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in to Continuum"
      subtitle="Use your email and password or continue with Google."
      footer={
        <p>
          Don’t have an account?{' '}
          <Link to="/register" className="text-white underline underline-offset-4 hover:opacity-80">
            Create one.
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label htmlFor="email" className="label-caps">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full bg-transparent border-0 border-b border-white/15 focus:border-white pb-2 text-base outline-none transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="password" className="label-caps">
              Password
            </label>
            <Link to="/forgot-password" className="text-sm text-white/60 hover:text-white transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full bg-transparent border-0 border-b border-white/15 focus:border-white pb-2 text-base outline-none transition-colors"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
        </button>

        <div className="text-center text-sm text-white/50">or continue with</div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="btn-secondary w-full justify-center"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Google"}
        </button>
      </form>
    </AuthShell>
  );
}

/*
The old Google-only redirect page was replaced with an email/password login form.
*/

