"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface AvatarProps {
  name: string;
  onClick?: () => void;
}

function Avatar({ name, onClick }: AvatarProps) {
  const initials = useMemo(() => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [name]);

  return (
    <div
      onClick={onClick}
      className="w-8 h-8 rounded-full bg-[#7367f0] text-white font-semibold flex items-center justify-center border-2 border-[#5a54c6] cursor-pointer select-none"
      title={name}
    >
      {initials}
    </div>
  );
}

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
  currentPath: string;
}

function Breadcrumb({ crumbs, currentPath }: BreadcrumbProps) {
  return (
    <nav className="font-semibold select-none">
      <ol className="flex items-center whitespace-nowrap text-sm">
        {crumbs.map(({ label, href }, idx) => {
          const isLast = idx === crumbs.length - 1;

          return (
            <li key={label} className="flex items-center">
              <Link
                href={href || "#"}
                className={`transition-colors ${
                  isLast
                    ? "text-[#7367f0] cursor-default"
                    : href === "/"
                    ? "text-gray-500 hover:underline"
                    : "text-[#5a54c6] hover:underline"
                }`}
                onClick={(e) => {
                  if (isLast) e.preventDefault();
                }}
              >
                {label}
              </Link>
              {!isLast && <span className="mx-2 text-gray-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface NavbarProps {
  userName: string;
  breadcrumbCrumbs: Crumb[];
  currentPath: string;
  perfil: string;
}

export default function Navbar({
  userName,
  breadcrumbCrumbs,
  currentPath,
  perfil,
}: NavbarProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout(); 
    router.push("/login"); // ou outro caminho, como "/entrar"
  };


  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-3 border-b border-[#c1bef7] bg-white h-16">
      <Breadcrumb crumbs={breadcrumbCrumbs} currentPath={currentPath} />

      <div className="relative" ref={dropdownRef}>
        <Avatar name={userName} onClick={() => setDropdownOpen((prev) => !prev)} />

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md border border-gray-200 z-50">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">
                {perfil.charAt(0).toUpperCase() + perfil.slice(1)}
              </p>
            </div>

            <div className="py-1">
              <Link
                href="/profile"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Profile
              </Link>
              <Link
                href="/change-password"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Change Password
              </Link>
            </div>

            <hr />

            <div className="py-1">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
              >
                Logout
              </button>

            </div>
          </div>
        )}
      </div>
    </header>
  );
}
