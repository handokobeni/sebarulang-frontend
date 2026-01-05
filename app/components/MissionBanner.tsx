import { Heart, Users, Leaf } from "lucide-react";

export function MissionBanner() {
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Mengapa sebarulang?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Indonesia adalah negara pembuang makanan terbesar #2 di dunia dengan 13 juta ton makanan 
            terbuang setiap tahun, sementara 19.4 juta penduduk mengalami kelaparan setiap harinya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-lg bg-green-50">
            <div className="bg-green-600 text-white p-3 rounded-full w-fit mx-auto mb-3">
              <Leaf className="size-6" />
            </div>
            <h3 className="font-semibold mb-2">Kurangi Food Waste</h3>
            <p className="text-sm text-gray-600">
              Setiap makanan yang dibagikan adalah sampah yang dikurangi dari TPA
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-blue-50">
            <div className="bg-blue-600 text-white p-3 rounded-full w-fit mx-auto mb-3">
              <Heart className="size-6" />
            </div>
            <h3 className="font-semibold mb-2">Bantu Sesama</h3>
            <p className="text-sm text-gray-600">
              Makanan berlebihmu bisa jadi harapan bagi mereka yang membutuhkan
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-purple-50">
            <div className="bg-purple-600 text-white p-3 rounded-full w-fit mx-auto mb-3">
              <Users className="size-6" />
            </div>
            <h3 className="font-semibold mb-2">Bangun Komunitas</h3>
            <p className="text-sm text-gray-600">
              Bergabung dengan ribuan orang yang peduli untuk berbagi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

