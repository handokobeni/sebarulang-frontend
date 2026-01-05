import { TrendingUp, Users, Package } from "lucide-react";

interface StatsBarProps {
  totalPosts: number;
  totalUsers: number;
  foodSaved: number;
}

export function StatsBar({ totalPosts, totalUsers, foodSaved }: StatsBarProps) {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6">
        <h2 className="text-center mb-3 sm:mb-4 font-semibold text-base sm:text-lg">Dampak Kita Bersama</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 sm:p-4 text-center">
            <Package className="size-6 sm:size-8 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold">{totalPosts}</p>
            <p className="text-xs sm:text-sm text-green-100">Makanan Dibagikan</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 sm:p-4 text-center">
            <Users className="size-6 sm:size-8 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold">{totalUsers}</p>
            <p className="text-xs sm:text-sm text-green-100">Pengguna Aktif</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 sm:p-4 text-center">
            <TrendingUp className="size-6 sm:size-8 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold">{foodSaved}kg</p>
            <p className="text-xs sm:text-sm text-green-100">Makanan Terselamatkan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

