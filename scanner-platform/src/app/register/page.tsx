import { Suspense } from "react";
import { RegisterForm } from "@/features/Authentication/sections/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#090d16] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-[#090d16] to-[#090d16]">
      <Suspense
        fallback={
          <div className="text-slate-400 text-xs">
            Memuat form pendaftaran...
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
