/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "./component/DashboardLayout";
import "./style.css";
interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // only runs in browser
    if (!token) {
      router.replace("/signin"); // redirect if not logged in
    } else {
      setLoading(false); // allow rendering
    }
  }, [router]);

  if (loading) return null; // wait until auth check completes

  return <DashboardLayout>{children}</DashboardLayout>;
}
