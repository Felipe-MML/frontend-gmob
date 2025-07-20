"use client";
// Components
import Table from "@/components/table";

// Hooks
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const HomePage = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, router]);

  return <></>;
};

export default HomePage;
