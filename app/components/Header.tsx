import { Bell, User, Search, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuItem } from "./ui/dropdown-menu";
import Link from "next/link";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

function Utensils({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>
  );
}

export function Header({ onSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 flex h-14 sm:h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="bg-green-600 text-white p-2 rounded-lg">
            <Utensils className="size-5 sm:size-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg sm:text-xl">sebarulang</h1>
            <p className="text-xs text-gray-600 hidden sm:block">Berbagi Makanan, Berbagi Kasih</p>
          </div>
        </Link>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Cari makanan..."
              className="pl-10"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
          </Button>

          {/* User Menu Dropdown - Desktop */}
          <DropdownMenu
            trigger={
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="size-5" />
              </Button>
            }
            align="right"
          >
            <Link href="/profile">
              <DropdownMenuItem>
                <User className="size-4 mr-2" />
                <span>Profil Saya</span>
              </DropdownMenuItem>
            </Link>
            <div className="border-t border-gray-200 my-1" />
            <DropdownMenuItem>
              <LogOut className="size-4 mr-2" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenu>

          {/* User Button - Mobile (link to profile) */}
          <Link href="/profile" className="md:hidden cursor-pointer">
            <Button variant="ghost" size="icon">
              <User className="size-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-1.5 sm:py-2 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Cari makanan..."
            className="pl-10"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}

