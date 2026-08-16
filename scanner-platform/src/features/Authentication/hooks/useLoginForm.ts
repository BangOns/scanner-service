"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/client/api";
import { useAuth, useToast } from "@/store";

export function useLoginForm() {
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("syahroni@selaras.com");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.auth.login({ email, password });
      setUser(res.user);
      showToast(`Selamat datang, ${res.user.name}!`, "success");
      const targetDestination = searchParams.get("from") || "/dashboard";
      window.location.replace(targetDestination);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Gagal masuk");
      showToast(msg || "Gagal login", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  };
}
