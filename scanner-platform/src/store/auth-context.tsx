"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  setUser: () => {},
  logout: () => {},
});

// function hook untuk mengakses state autentikasi pengguna saat ini
export const useAuth = () => useContext(AuthContext);

// function provider untuk membungkus komponen aplikasi dan mengelola sesi autentikasi
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // function effect untuk mengambil data sesi pengguna aktif saat aplikasi pertama kali dimuat
  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // function untuk melakukan proses logout, membersihkan cookie sesi, dan mengarahkan ke halaman login
  const logout = async () => {
    try {
      setUser(null);
      if (typeof document !== "undefined") {
        document.cookie = "scanner_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax";
      }
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
