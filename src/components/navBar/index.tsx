"use client";

import { useMemo } from "react";
import Link from "next/link";

interface AvatarProps {
  name: string;
}

function Avatar({ name }: AvatarProps) {
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
                className={`
                  transition-colors
                  ${
                    isLast
                      ? "text-[#7367f0] cursor-default"
                      : href === "/"
                      ? "text-gray-500 hover:underline"
                      : "text-[#5a54c6] hover:underline"
                  }
                `}
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
}

export default function Navbar({
  userName,
  breadcrumbCrumbs,
  currentPath,
}: NavbarProps) {
  return (
    <header className="flex justify-between items-center px-6 py-3 border-b border-[#c1bef7] bg-white h-16">
      <Breadcrumb crumbs={breadcrumbCrumbs} currentPath={currentPath} />

      <div className="flex items-center gap-6 text-[#7367f0]">
        <Avatar name={userName} />
      </div>
    </header>
  );
}
