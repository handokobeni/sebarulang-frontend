"use client";

import { useState } from "react";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { Footer } from "../components/Footer";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header onSearch={setSearchQuery} />
      
      <main className="container mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="size-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Cari Makanan</h1>
                <p className="text-gray-600">
                  Temukan makanan yang tersedia di sekitar Anda
                </p>
              </div>

              <div className="relative mb-6">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari makanan, lokasi, atau kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 min-h-[44px]"
                />
              </div>

              {searchQuery ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Mencari &quot;{searchQuery}&quot;...
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Fitur pencarian akan segera tersedia
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Mulai ketik untuk mencari makanan
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

