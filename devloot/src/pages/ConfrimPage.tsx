import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { subscribersApi } from "../services/api";

type State = "loading" | "success" | "error";

const ConfirmPage: React.FC = () => {
  const [params] = useSearchParams();
  const [state, setState] = useState<State>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) { setState("error"); setMessage("Missing confirmation token."); return; }
    subscribersApi
      .confirm(token)
      .then((res) => { setMessage(res.message); setState("success"); })
      .catch((err) => { setMessage(err.message); setState("error"); });
  }, [params]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center pt-20 px-8">
      <div className="border border-border bg-white p-12 max-w-md w-full text-center">
        {state === "loading" && (
          <>
            <div className="w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="font-mono text-sm text-muted">Confirming your subscription...</p>
          </>
        )}
        {state === "success" && (
          <>
            <div className="w-10 h-10 bg-accent flex items-center justify-center mx-auto mb-6 font-mono text-xl">✓</div>
            <h1 className="font-display text-3xl text-ink mb-4">You're confirmed!</h1>
            <p className="font-body text-sm text-muted leading-relaxed mb-8">{message}</p>
            <Link to="/" className="inline-block bg-ink text-cream font-mono text-xs tracking-widest uppercase px-8 py-3 hover:bg-dim transition-colors">
              Read the newsletter →
            </Link>
          </>
        )}
        {state === "error" && (
          <>
            <div className="w-10 h-10 bg-red-100 flex items-center justify-center mx-auto mb-6 font-mono text-xl text-red-500">✕</div>
            <h1 className="font-display text-3xl text-ink mb-4">Something went wrong</h1>
            <p className="font-body text-sm text-muted leading-relaxed mb-8">{message}</p>
            <Link to="/" className="inline-block font-mono text-xs text-ink underline hover:no-underline">
              ← Back to home
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmPage;
