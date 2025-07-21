"use client";

import { useMemo } from "react";

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
}

function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <nav className="text-[#5a54c6] font-semibold select-none">
      <ol className="flex gap-1 items-center whitespace-nowrap text-sm">
        {crumbs.length === 0 && (
          <li className="text-[#9f9de9] cursor-default">/ Clientes</li>
        )}

        {crumbs.map(({ label, href }, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <li key={label} className="flex items-center gap-1">
              {!isLast && href ? (
                <>
                  <a
                    href={href}
                    className="hover:text-[#5a54c6] transition-colors"
                  >
                    {label}
                  </a>
                  <span className="mx-1 text-[#c1bef7]">/</span>
                </>
              ) : (
                <span className="text-[#9f9de9] cursor-default">/ {label}</span>
              )}
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
}

export default function Navbar({ userName, breadcrumbCrumbs }: NavbarProps) {
  return (
    <header className="flex justify-between items-center px-6 py-3 border-b border-[#c1bef7] bg-white h-16">
      <Breadcrumb crumbs={breadcrumbCrumbs} />

      <div className="flex items-center gap-6 text-[#7367f0]">
        <Avatar name={userName} />
      </div>
    </header>
  );
}