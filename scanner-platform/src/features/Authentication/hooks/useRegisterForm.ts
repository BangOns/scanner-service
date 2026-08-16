"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/client/api";
import { useAuth, useToast } from "@/store";

export function useRegisterForm() {
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.auth.register({ name, email, companyName });
      setUser(res.user);
      showToast("Akun berhasil dibuat!", "success");
      const targetDestination = searchParams.get("from") || "/dashboard";
      window.location.replace(targetDestination);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Gagal membuat akun");
      showToast(msg || "Gagal registrasi", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    companyName,
    setCompanyName,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  };
}
