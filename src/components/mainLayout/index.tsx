"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "../navBar";
import Sidebar from "../sideBar";
import { useMemo } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

interface Crumb {
  label: string;
  href?: string;
}

const pathNames: { [key: string]: string } = {
  corretores: "Corretores",
  clientes: "Clientes",
  imoveis: "Imóveis",
  visitas: "Visitas",
  profile: "Perfil",
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const breadcrumbCrumbs = useMemo(() => {
    const pathSegments = pathname.split("/").filter((segment) => segment);
    const crumbs: Crumb[] = [{ label: "Página Inicial", href: "/" }];
    let currentPath = "";

    for (const segment of pathSegments) {
      currentPath += `/${segment}`;
      const label = pathNames[segment];
      if (label) {
        crumbs.push({ label, href: currentPath });
      }
    }

    if (pathSegments.length > 1 && pathNames[pathSegments[0]]) {
      const parentLabel = pathNames[pathSegments[0]];

      const singularLabel =
        parentLabel === "Corretores " ? parentLabel.slice(0, -2) : parentLabel;

      crumbs.push({ label: `Visualização do ${singularLabel}` });
    }

    return crumbs;
  }, [pathname]);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar
          userName={user?.nome_completo || "Utilizador"}
          breadcrumbCrumbs={breadcrumbCrumbs}
          currentPath={pathname}
          perfil={user?.perfil || "Corretor"}
        />
        <main className="flex flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
