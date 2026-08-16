"use client";

import React from "react";
import Link from "next/link";
import { useLoginForm } from "../hooks/useLoginForm";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Scan, Mail, Lock, LogIn, ArrowLeft } from "lucide-react";

export const LoginForm: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  } = useLoginForm();

  return (
    <Card className="max-w-md w-full border-slate-800 bg-slate-900/80 shadow-2xl p-8 space-y-6">
      {/* Back to Home button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-linear-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 mb-1">
          <Scan className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Scanner Platform
        </h1>
        <p className="text-xs text-slate-400">
          Masuk ke akun developer / admin untuk mengelola aplikasi scanner
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200">
            {error}
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          leftIcon={<Lock className="w-4 h-4" />}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          leftIcon={<LogIn className="w-4 h-4" />}
        >
          Sign In to Platform
        </Button>
      </form>

      <div className="text-center text-xs text-slate-400 space-y-2 border-t border-slate-800 pt-4">
        <p>
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-sky-400 hover:text-sky-300 font-semibold"
          >
            Daftar Sekarang
          </Link>
        </p>
        <p className="text-[11px] text-slate-500">
          Demo: <code>admin@scanner.local</code> atau{" "}
          <code>syahroni@selaras.com</code>
        </p>
      </div>
    </Card>
  );
};
