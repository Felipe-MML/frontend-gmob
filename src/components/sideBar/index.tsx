"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaUsers, FaHome, FaCalendarCheck, FaUserTie } from "react-icons/fa";
import Link from "next/link";

interface MenuItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarItemProps extends MenuItem {
  show: boolean;
  active?: boolean;
}

const menuItems: MenuItem[] = [
  { href: "/corretores", label: "Corretores", icon: <FaUserTie /> },
  { href: "/clientes", label: "Clientes", icon: <FaUsers /> },
  { href: "/imoveis", label: "Imóveis", icon: <FaHome /> },
  { href: "/visitas", label: "Visitas", icon: <FaCalendarCheck /> },
];

export default function Sidebar() {
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`bg-white text-gray-700 h-screen border-r border-[#c1bef7] shadow-sm transition-width duration-300 ease-in-out ${
        hovered ? "w-50" : "w-16"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Logo */}
      <div className="flex items-center justify-center py-4 border-b border-[#c1bef7] h-16">
        <img
          src={hovered ? "/logo.png" : "/logo_sm.png"}
          alt="Logo"
          className="h-[45px] object-contain transition-all duration-300"
        />
      </div>

      {/* Menu */}
      <nav className="mt-4 ms-2 flex flex-col gap-1">
        <SidebarMenu items={menuItems} show={hovered} activePath={pathname} />
      </nav>
    </aside>
  );
}

function SidebarMenu({
  items,
  show,
  activePath,
}: {
  items: MenuItem[];
  show: boolean;
  activePath: string | null;
}) {
  return (
    <>
      {items.map((item) => (
        <SidebarItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          show={show}
          active={activePath?.startsWith(item.href)}
        />
      ))}
    </>
  );
}

function SidebarItem({ icon, label, href, show, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 py-3 px-4 cursor-pointer rounded-md transition-colors duration-200
        ${
          active
            ? "bg-[#7367f0]/20 text-[#7367f0] font-semibold"
            : "text-gray-600 hover:bg-[#7367f0]/10 hover:text-[#7367f0]"
        }
      `}
    >
      <span
        className={`text-xl transition-colors duration-200 ${
          active ? "text-[#7367f0]" : "text-gray-500"
        }`}
      >
        {icon}
      </span>
      <span
        className={`text-sm whitespace-nowrap transition-opacity duration-200 ${
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
