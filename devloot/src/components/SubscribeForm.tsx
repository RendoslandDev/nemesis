import React, { useState } from "react";
import { subscribersApi } from "../services/api";

type FormState = "idle" | "loading" | "success" | "error";

interface SubscribeFormProps {
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  successMessage?: string;
  center?: boolean;
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({
  inputClassName = "",
  buttonClassName = "",
  successMessage,
  center = false,
}) => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || state === "loading") return;
    setState("loading");
    try {
      const res = await subscribersApi.subscribe(email);
      setMessage(res.message);
      setState("success");
      setEmail("");
    } catch (err: any) {
      setMessage(err.message ?? "Something went wrong. Please try again.");
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
        <p className="font-mono text-sm text-ink">{message}</p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-0 max-w-md">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === "loading"}
          className={`subscribe-input flex-1 border border-border border-r-0 bg-transparent px-4 py-3 font-mono text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors disabled:opacity-50 ${inputClassName}`}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className={`bg-ink text-cream font-mono text-xs tracking-widest uppercase px-6 py-3 hover:bg-dim transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-wait ${buttonClassName}`}
        >
          {state === "loading" ? "..." : "Subscribe →"}
        </button>
      </form>
      {state === "error" && (
        <p className="mt-2 font-mono text-xs text-red-500">{message}</p>
      )}
    </div>
  );
};

export default SubscribeForm;
