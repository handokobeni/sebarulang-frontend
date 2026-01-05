"use client";

import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { Footer } from "../components/Footer";
import { User, Mail, MapPin, Calendar } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <main className="container mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mb-4">
                  <User className="size-12 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Profil Saya</h1>
                <p className="text-gray-600">Pengguna Sebarulang</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Mail className="size-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">user@example.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <MapPin className="size-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Lokasi</p>
                    <p className="font-medium">Jakarta, Indonesia</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Calendar className="size-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Bergabung</p>
                    <p className="font-medium">Januari 2026</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h2 className="font-semibold mb-4">Statistik Saya</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-50">
                    <p className="text-2xl font-bold text-green-600">0</p>
                    <p className="text-sm text-gray-600">Post Dibagikan</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50">
                    <p className="text-2xl font-bold text-blue-600">0</p>
                    <p className="text-sm text-gray-600">Post Diambil</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-50">
                    <p className="text-2xl font-bold text-purple-600">0</p>
                    <p className="text-sm text-gray-600">Favorit</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

