"use client";

import { useState, useMemo } from "react";
import { Header } from "./components/Header";
import { FilterTabs } from "./components/FilterTabs";
import { FoodPostCard, FoodPost } from "./components/FoodPostCard";
import { StatsBar } from "./components/StatsBar";
import { MissionBanner } from "./components/MissionBanner";
import { Footer } from "./components/Footer";
import { PostDetailPage } from "./components/PostDetailPage";
import { ContactDialog } from "./components/ContactDialog";
import { BottomNav } from "./components/BottomNav";
import { FloatingActionButton } from "./components/FloatingActionButton";
import { Toaster, toast } from "./components/ui/sonner";

// Force dynamic rendering untuk access nonce
export const dynamic = "force-dynamic";

// Mock data untuk demo
const initialMockPosts: FoodPost[] = [
  {
    id: "1",
    foodName: "Nasi Goreng Spesial",
    description: "Nasi goreng sisa acara kantor, masih fresh dan enak. Dibuat tadi pagi.",
    imageUrl: "https://images.unsplash.com/photo-1624957389019-0c814505746d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    images: [
      "https://images.unsplash.com/photo-1624957389019-0c814505746d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    location: "Jakarta Selatan, Kebayoran Baru",
    postedTime: "30 menit yang lalu",
    status: "available",
    quantity: "8-10 porsi",
    giverName: "Budi Santoso",
    category: "Makanan Berat",
    latitude: -6.2297,
    longitude: 106.7994,
  },
  {
    id: "2",
    foodName: "Buah-buahan Segar",
    description: "Jeruk, apel, dan pisang dari acara keluarga kemarin. Masih segar dan layak konsumsi.",
    imageUrl: "https://images.unsplash.com/photo-1636128774004-68374b26ed1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    images: [
      "https://images.unsplash.com/photo-1636128774004-68374b26ed1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
    ],
    location: "Jakarta Barat, Cengkareng",
    postedTime: "1 jam yang lalu",
    status: "available",
    quantity: "3-5 kg",
    giverName: "Siti Rahmawati",
    category: "Buah & Sayur",
    latitude: -6.1352,
    longitude: 106.7153,
  },
  {
    id: "3",
    foodName: "Roti Tawar & Kue",
    description: "Roti tawar dan berbagai kue dari toko roti. Dibuat hari ini, masih fresh.",
    imageUrl: "https://images.unsplash.com/photo-1674770067314-296af21ad811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    images: [
      "https://images.unsplash.com/photo-1674770067314-296af21ad811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    location: "Tangerang, BSD",
    postedTime: "2 jam yang lalu",
    status: "available",
    quantity: "15-20 potong",
    giverName: "Ahmad Hidayat",
    category: "Roti & Kue",
    latitude: -6.3015,
    longitude: 106.6527,
  },
  {
    id: "4",
    foodName: "Sayur Lodeh & Lauk",
    description: "Sayur lodeh dengan tempe goreng dan perkedel. Sisa masakan rumah yang masih banyak.",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    images: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    location: "Depok, Margonda",
    postedTime: "3 jam yang lalu",
    status: "claimed",
    quantity: "5-7 porsi",
    giverName: "Dewi Lestari",
    category: "Makanan Berat",
    latitude: -6.4025,
    longitude: 106.7942,
  },
  {
    id: "5",
    foodName: "Nasi Box Katering",
    description: "Nasi box sisa acara seminar. Isi nasi, ayam, sayur. Masih hangat dan higienis.",
    imageUrl: "https://images.unsplash.com/photo-1744957280662-af6472128abd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    images: [
      "https://images.unsplash.com/photo-1744957280662-af6472128abd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    location: "Jakarta Pusat, Menteng",
    postedTime: "4 jam yang lalu",
    status: "available",
    quantity: "20-25 box",
    giverName: "PT Maju Sejahtera",
    category: "Makanan Berat",
    latitude: -6.1944,
    longitude: 106.8229,
  },
  {
    id: "6",
    foodName: "Nasi Kuning Lengkap",
    description: "Nasi kuning dengan lauk lengkap dari acara pernikahan. Masih layak konsumsi.",
    imageUrl: "https://images.unsplash.com/photo-1761314025611-957a20e3e8a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    images: [
      "https://images.unsplash.com/photo-1761314025611-957a20e3e8a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    location: "Bekasi, Summarecon",
    postedTime: "5 jam yang lalu",
    status: "available",
    quantity: "30-35 porsi",
    giverName: "Keluarga Wijaya",
    category: "Makanan Berat",
    latitude: -6.2383,
    longitude: 107.0000,
  },
];

export default function Home() {
  const [posts] = useState<FoodPost[]>(initialMockPosts);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"feed" | "detail">("feed");
  const [detailPost, setDetailPost] = useState<FoodPost | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactPost, setContactPost] = useState<FoodPost | null>(null);

  const handleContactGiver = (post: FoodPost) => {
    setContactPost(post);
    setContactDialogOpen(true);
  };

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
        toast.success("Ditambahkan ke favorit! ❤️");
      }
      return newSet;
    });
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "Semua" || post.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        post.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const stats = useMemo(() => {
    return {
      totalPosts: posts.length,
      totalUsers: 1247,
      foodSaved: posts.length * 2.5, // Estimasi kg
    };
  }, [posts]);

  const handleViewDetail = (post: FoodPost) => {
    setDetailPost(post);
    setViewMode("detail");
  };

  const handleBackToFeed = () => {
    setViewMode("feed");
    setDetailPost(null);
  };

  // Show detail view if in detail mode
  if (viewMode === "detail" && detailPost) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <PostDetailPage
          post={detailPost}
          onBack={handleBackToFeed}
          onContact={handleContactGiver}
          onLike={handleLike}
          isLiked={likedPosts.has(detailPost.id)}
        />
        <Footer />
        <BottomNav />
        <FloatingActionButton />
        <Toaster />
        <ContactDialog
          post={contactPost}
          open={contactDialogOpen}
          onOpenChange={setContactDialogOpen}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header onSearch={setSearchQuery} />
      
      <StatsBar
        totalPosts={stats.totalPosts}
        totalUsers={stats.totalUsers}
        foodSaved={Math.round(stats.foodSaved)}
      />

      <MissionBanner />

      <FilterTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-gray-500">
              {searchQuery
                ? "Tidak ada makanan yang sesuai dengan pencarian"
                : "Belum ada postingan di kategori ini"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
            {filteredPosts.map((post) => (
              <FoodPostCard
                key={post.id}
                post={post}
                onContact={handleContactGiver}
                onLike={handleLike}
                isLiked={likedPosts.has(post.id)}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
      <FloatingActionButton />
      <Toaster />
      <ContactDialog
        post={contactPost}
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
      />
    </div>
  );
}
