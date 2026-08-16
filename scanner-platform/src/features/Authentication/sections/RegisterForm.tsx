"use client";

import React from "react";
import Link from "next/link";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Scan, Mail, Lock, User, Building, UserPlus, ArrowLeft } from "lucide-react";

export const RegisterForm: React.FC = () => {
  const {
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
  } = useRegisterForm();

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
          Create Developer Account
        </h1>
        <p className="text-xs text-slate-400">
          Daftar untuk membuat dan mengelola Scanner Agent untuk perusahaan Anda
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200">
            {error}
          </div>
        )}

        <Input
          label="Full Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          leftIcon={<User className="w-4 h-4" />}
        />

        <Input
          label="Company / System Name *"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          leftIcon={<Building className="w-4 h-4" />}
        />

        <Input
          label="Work Email *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <Input
          label="Password *"
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
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Create Account & Start
        </Button>
      </form>

      <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
        Sudah memiliki akun?{" "}
        <Link
          href="/login"
          className="text-sky-400 hover:text-sky-300 font-semibold"
        >
          Masuk di sini
        </Link>
      </div>
    </Card>
  );
};
