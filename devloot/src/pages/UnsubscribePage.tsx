import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { subscribersApi } from "../services/api";

type State = "loading" | "success" | "error";

const UnsubscribePage: React.FC = () => {
  const [params] = useSearchParams();
  const [state, setState] = useState<State>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) { setState("error"); setMessage("Missing unsubscribe token."); return; }
    subscribersApi
      .unsubscribe(token)
      .then((res) => { setMessage(res.message); setState("success"); })
      .catch((err) => { setMessage(err.message); setState("error"); });
  }, [params]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center pt-20 px-8">
      <div className="border border-border bg-white p-12 max-w-md w-full text-center">
        {state === "loading" && (
          <>
            <div className="w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="font-mono text-sm text-muted">Processing...</p>
          </>
        )}
        {state === "success" && (
          <>
            <span className="tag text-muted mb-6 inline-block">Unsubscribed</span>
            <h1 className="font-display text-3xl text-ink mb-4">Sorry to see you go.</h1>
            <p className="font-body text-sm text-muted leading-relaxed mb-8">{message}</p>
            <p className="font-mono text-xs text-muted mb-8">Changed your mind?</p>
            <Link to="/" className="inline-block bg-ink text-cream font-mono text-xs tracking-widest uppercase px-8 py-3 hover:bg-dim transition-colors">
              Resubscribe →
            </Link>
          </>
        )}
        {state === "error" && (
          <>
            <h1 className="font-display text-3xl text-ink mb-4">Hmm, something went wrong.</h1>
            <p className="font-body text-sm text-muted mb-8">{message}</p>
            <Link to="/" className="font-mono text-xs text-ink underline">← Back to home</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default UnsubscribePage;
