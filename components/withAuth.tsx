"use client";

import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

type Role = "admin" | "vendor" | "user";

/**
 * withAuth HOC
 * - Redirects to /auth/login when no user
 * - Optionally restricts to specific roles
 * - Uses React.createElement to avoid JSX + generics typing issues in Next builds
 *
 * Usage:
 *   export default withAuth(MyComponent);             // any logged-in user
 *   export default withAuth(MyComponent, ["admin"]);  // only admin
 *   export default withAuth(MyComponent, ["vendor"]); // only vendor
 */
export default function withAuth<C extends React.ComponentType<any>>(
  Comp: C,
  allowedRoles?: Role[]
) {
  type P = React.ComponentProps<C>;

  function Wrapped(props: P) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.replace("/auth/login");
        return;
      }
      if (allowedRoles && !allowedRoles.includes((user.role as Role) || "user")) {
        router.replace("/");
      }
    }, [user, router]);

    // Block render while redirecting / unauthorized
    if (!user) return null;
    if (allowedRoles && !allowedRoles.includes((user.role as Role) || "user")) return null;

    // Avoid JSX to sidestep IntrinsicAttributes typing clash
    return React.createElement(Comp as React.ComponentType<any>, { ...(props as any) });
  }

  (Wrapped as any).displayName = `WithAuth(${(Comp as any).displayName || (Comp as any).name || "Component"})`;

  // Keep component props typing for consumers
  return Wrapped as unknown as React.ComponentType<P>;
}
