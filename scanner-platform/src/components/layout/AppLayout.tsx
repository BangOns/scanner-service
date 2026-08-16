"use client";

import React, { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/store";
import { RefreshCw } from "lucide-react";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.replace("/login");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090d16] text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-sky-400 animate-spin" />
          <span className="text-xs font-medium">Memeriksa sesi pengguna...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
