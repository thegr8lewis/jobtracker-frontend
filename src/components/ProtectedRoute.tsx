// src/components/ProtectedRoute.tsx
import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "../lib/auth-context";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }
  return <>{children}</>;
}
