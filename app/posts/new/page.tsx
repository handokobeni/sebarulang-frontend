"use client";

import { Header } from "../../components/Header";
import { BottomNav } from "../../components/BottomNav";
import { Footer } from "../../components/Footer";
import { Plus, Image as ImageIcon, MapPin } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <main className="container mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="size-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Buat Post Baru</h1>
                <p className="text-gray-600">
                  Bagikan makanan sisa yang masih layak dimakan
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Foto Makanan
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ImageIcon className="size-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">
                      Klik untuk upload foto
                    </p>
                    <p className="text-xs text-gray-400">
                      Format: JPG, PNG (max 5MB)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nama Makanan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Nasi Goreng Spesial"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    placeholder="Jelaskan kondisi makanan, kapan dibuat, dll..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kategori
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 min-h-[44px]">
                    <option value="">Pilih Kategori</option>
                    <option value="Makanan Berat">Makanan Berat</option>
                    <option value="Makanan Ringan">Makanan Ringan</option>
                    <option value="Buah & Sayur">Buah & Sayur</option>
                    <option value="Roti & Kue">Roti & Kue</option>
                    <option value="Minuman">Minuman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Lokasi
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Contoh: Jakarta Selatan, Kebayoran Baru"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Jumlah Porsi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 8-10 porsi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 min-h-[44px]"
                  />
                </div>

                <Button className="w-full min-h-[44px] bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="size-5 mr-2" />
                  Publikasikan Post
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Dengan mempublikasikan, Anda menyetujui bahwa makanan yang dibagikan masih layak konsumsi
                </p>
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

