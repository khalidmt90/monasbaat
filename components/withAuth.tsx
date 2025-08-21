// components/withAuth.tsx
"use client";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withAuth<P>(Comp: React.ComponentType<P>) {
  return function Guard(props: P) {
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
      if (!user) router.replace("/auth/login");
    }, [user, router]);
    if (!user) return null;
    return <Comp {...props} />;
  };
}

export function withAdmin<P>(Comp: React.ComponentType<P>) {
  return function Guard(props: P) {
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
      if (!user) router.replace("/auth/login");
      else if (user.role !== "admin") router.replace("/");
    }, [user, router]);
    if (!user || user.role !== "admin") return null;
    return <Comp {...props} />;
  };
}
