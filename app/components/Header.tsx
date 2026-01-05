import { Bell, User, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

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
      <div className="container mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 text-white p-2 rounded-lg">
            <Utensils className="size-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl">sebarulang</h1>
            <p className="text-xs text-gray-600">Berbagi Makanan, Berbagi Kasih</p>
          </div>
        </div>

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
          <Button variant="ghost" size="icon">
            <User className="size-5" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-2 md:hidden">
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

