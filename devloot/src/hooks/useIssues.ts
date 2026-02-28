import { useState, useEffect } from "react";
import { issuesApi, ApiIssue } from "../services/api";

interface UseIssuesResult {
  issues: ApiIssue[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useIssues(limit = 20, offset = 0): UseIssuesResult {
  const [issues, setIssues] = useState<ApiIssue[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    issuesApi
      .list(limit, offset)
      .then(({ issues, total }) => {
        if (!cancelled) {
          setIssues(issues);
          setTotal(total);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [limit, offset, tick]);

  return { issues, total, loading, error, refetch: () => setTick((t) => t + 1) };
}

export function useIssue(slugOrId: string | undefined) {
  const [issue, setIssue] = useState<ApiIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugOrId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    issuesApi
      .get(slugOrId)
      .then((data) => { if (!cancelled) { setIssue(data); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [slugOrId]);

  return { issue, loading, error };
}
