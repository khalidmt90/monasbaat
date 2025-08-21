// app/auth/login/page.tsx
"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();

  const nextParam = search.get("next") || "/dashboard/admin";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const callbackUrl = origin ? `${origin}${nextParam}` : nextParam;

  const queryError = search.get("error");
  const [email, setEmail] = React.useState("admin@monasbaat.sa");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (queryError) {
      setError(
        queryError === "CredentialsSignin"
          ? "خطأ في البريد الإلكتروني أو كلمة المرور."
          : "تعذّر تسجيل الدخول. حاول مرة أخرى."
      );
    }
  }, [queryError]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl, // absolute to avoid falling back to "/"
    });

    setSubmitting(false);

    if (res?.ok) {
      router.push(res.url ?? callbackUrl);
    } else {
      setError("خطأ في البريد الإلكتروني أو كلمة المرور.");
    }
  };

  return (
    <section className="section">
      <div className="container max-w-md">
        <div className="card p-6">
          <h1 className="text-xl font-bold mb-4">تسجيل الدخول</h1>

          {error && (
            <div className="mb-3 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="grid gap-3">
            <label className="field">
              <span className="label">البريد الإلكتروني</span>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputMode="email"
                autoComplete="username"
                required
              />
            </label>

            <label className="field">
              <span className="label">كلمة المرور</span>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? "جارٍ الدخول..." : "دخول"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
