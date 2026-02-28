import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";

const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", bio: "", twitter: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.register(form);
      await login(form.email, form.password);
      navigate("/post");
    } catch (err: any) {
      setError(err.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center pt-20 px-8">
      <div className="w-full max-w-sm">
        <div className="border border-border bg-white p-10">
          <div className="mb-8">
            <span className="tag text-muted mb-4 inline-block">Join the team</span>
            <h1 className="font-display text-3xl text-ink">Create account</h1>
            <p className="font-mono text-xs text-muted mt-2">First account registered becomes admin.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Name", key: "name" as const, type: "text", placeholder: "Alex Mercer" },
              { label: "Email", key: "email" as const, type: "email", placeholder: "you@example.com" },
              { label: "Password", key: "password" as const, type: "password", placeholder: "8+ characters" },
              { label: "Twitter (optional)", key: "twitter" as const, type: "text", placeholder: "@handle" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="font-mono text-xs text-muted uppercase tracking-wider block mb-2">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={set(key)}
                  required={key !== "twitter"}
                  disabled={loading}
                  placeholder={placeholder}
                  className="w-full border border-border bg-cream px-4 py-3 font-mono text-sm text-ink focus:outline-none focus:border-ink transition-colors"
                />
              </div>
            ))}

            {error && <p className="font-mono text-xs text-red-500 py-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-cream font-mono text-xs tracking-widest uppercase py-3 hover:bg-dim transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="font-mono text-xs text-muted text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-ink underline hover:no-underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
