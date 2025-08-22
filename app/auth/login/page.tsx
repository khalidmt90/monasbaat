// app/auth/login/page.tsx
export const dynamic = "force-dynamic";

import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <section className="section">
      <div className="container max-w-md">
        <LoginForm />
      </div>
    </section>
  );
}
