import { Suspense } from "react";
import { LoginForm } from "@/features/Authentication/sections/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#090d16] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-[#090d16] to-[#090d16]">
      <Suspense
        fallback={
          <div className="text-slate-400 text-xs">Memuat form login...</div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
