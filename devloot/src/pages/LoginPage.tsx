import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const { login, isAuthed } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthed) navigate("/post");
  }, [isAuthed, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/post");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center pt-20 px-8">
      <div className="w-full max-w-sm">
        <div className="border border-border bg-white p-10">
          <div className="mb-8">
            <span className="tag text-muted mb-4 inline-block">Author access</span>
            <h1 className="font-display text-3xl text-ink">Sign in</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-xs text-muted uppercase tracking-wider block mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full border border-border bg-cream px-4 py-3 font-mono text-sm text-ink focus:outline-none focus:border-ink transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-muted uppercase tracking-wider block mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full border border-border bg-cream px-4 py-3 font-mono text-sm text-ink focus:outline-none focus:border-ink transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="font-mono text-xs text-red-500 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-cream font-mono text-xs tracking-widest uppercase py-3 hover:bg-dim transition-colors disabled:opacity-60 disabled:cursor-wait mt-2"
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="font-mono text-xs text-muted text-center">
              No account?{" "}
              <Link to="/register" className="text-ink underline hover:no-underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
