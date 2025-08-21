// // src/components/ProtectedRoute.tsx
// import React from "react";
// import { useRouter } from "next/router";
// import { useAuth } from "../lib/auth-context";

// export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   React.useEffect(() => {
//     if (!loading && !user) router.replace("/login");
//   }, [loading, user, router]);

//   if (loading || !user) {
//     return <div style={{ padding: 24 }}>Loading…</div>;
//   }
//   return <>{children}</>;
// }


// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../lib/auth-context";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Wait for client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.replace("/login");
    }
  }, [mounted, loading, user, router]);

  // Avoid rendering anything until mounted + auth checked
  if (!mounted || loading || !user) return null;

  return <>{children}</>;
}
