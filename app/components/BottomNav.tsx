"use client";

/**
 * Bottom Navigation Bar Component
 * Mobile-only navigation bar dengan icon-based navigation
 * Follows .cursorrules: no inline styles, TypeScript interfaces, Tailwind CSS
 */

import { Home, Search, Plus, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { memo } from "react";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const navItems: NavItem[] = [
  {
    href: "/",
    icon: Home,
    label: "Beranda",
  },
  {
    href: "/search",
    icon: Search,
    label: "Cari",
  },
  {
    href: "/posts/new",
    icon: Plus,
    label: "Buat Post",
  },
  {
    href: "/profile",
    icon: User,
    label: "Profil",
  },
];

function BottomNavComponent() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg block md:hidden pb-safe"
    >
      <div className="grid grid-cols-4 h-16 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] transition-colors cursor-pointer"
              aria-label={item.label}
            >
              <Icon
                className={`size-5 transition-colors ${
                  isActive
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              />
              <span
                className={`text-xs transition-colors ${
                  isActive
                    ? "text-green-600 font-medium"
                    : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-green-600 rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export const BottomNav = memo(BottomNavComponent);

