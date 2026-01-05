import { TrendingUp, Users, Package } from "lucide-react";

interface StatsBarProps {
  totalPosts: number;
  totalUsers: number;
  foodSaved: number;
}

export function StatsBar({ totalPosts, totalUsers, foodSaved }: StatsBarProps) {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <h2 className="text-center mb-4 font-semibold">Dampak Kita Bersama</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <Package className="size-8 mx-auto mb-2" />
            <p className="text-2xl font-bold">{totalPosts}</p>
            <p className="text-sm text-green-100">Makanan Dibagikan</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <Users className="size-8 mx-auto mb-2" />
            <p className="text-2xl font-bold">{totalUsers}</p>
            <p className="text-sm text-green-100">Pengguna Aktif</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <TrendingUp className="size-8 mx-auto mb-2" />
            <p className="text-2xl font-bold">{foodSaved}kg</p>
            <p className="text-sm text-green-100">Makanan Terselamatkan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

