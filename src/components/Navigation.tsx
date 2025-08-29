"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-[color:var(--card)] py-4 px-6 shadow-md mb-8 border-b border-[color:var(--border)]">
      <div className="container mx-auto max-w-5xl flex items-center justify-between">        <Link href="/" className="text-2xl font-bold text-[color:var(--primary)]">
          PurpleNotes
        </Link>
        
        <div className="flex space-x-4">
          <NavLink href="/" label="Home" active={pathname === "/"} />
          <NavLink href="/subjects" label="Subjects" active={pathname === "/subjects"} />
          <NavLink href="/add" label="Add Note" active={pathname === "/add"} />
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
