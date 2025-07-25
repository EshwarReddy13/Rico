"use client";
import React, { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 300); // 0.3s splash
    return () => clearTimeout(timeout);
  }, []);

  return loading ? <LoadingScreen /> : <>{children}</>;
} 