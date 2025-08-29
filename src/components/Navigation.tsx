"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { FiMoon, FiSun } from "react-icons/fi";

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <nav className="bg-[color:var(--card)] py-4 px-6 shadow-md mb-8 border-b border-[color:var(--border)]">
      <div className="container mx-auto max-w-5xl flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[color:var(--primary)]">
          PurpleNotes
        </Link>
        
        <div className="flex items-center space-x-4">
          <NavLink href="/" label="Home" active={pathname === "/"} />
          <NavLink href="/subjects" label="Subjects" active={pathname === "/subjects"} />
          <NavLink href="/add" label="Add Note" active={pathname === "/add"} />
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="p-2 rounded-full hover:bg-[color:var(--secondary)] transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <FiMoon className="w-5 h-5" />
            ) : (
              <FiSun className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  active: boolean;
}

function NavLink({ href, label, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`px-3 py-1 rounded-md ${
        active
          ? "bg-[color:var(--primary)] text-white"
          : "hover:bg-[color:var(--secondary)] transition-colors"
      }`}
    >
      {label}
    </Link>
  );
}
