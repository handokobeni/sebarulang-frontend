"use client";

import { ArrowLeft, MapPin, Clock, User, Package, MessageCircle, Heart, Share2 } from "lucide-react";
import { FoodPost } from "./FoodPostCard";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./ImageWithFallback";

interface PostDetailPageProps {
  post: FoodPost;
  onBack: () => void;
  onContact: (post: FoodPost) => void;
  onLike: (postId: string) => void;
  isLiked: boolean;
}

export function PostDetailPage({ post, onBack, onContact, onLike, isLiked }: PostDetailPageProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.foodName,
        text: post.description,
        url: window.location.href,
      }).catch(() => {
        // Fallback jika share gagal
        navigator.clipboard.writeText(window.location.href);
        alert("Link telah disalin!");
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link telah disalin!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Feed</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Image */}
            <div className="relative aspect-video bg-gray-100">
              <ImageWithFallback
                src={post.imageUrl}
                alt={post.foodName}
                className="w-full h-full object-cover"
              />
              <Badge
                className="absolute top-4 right-4"
                variant={post.status === "available" ? "default" : "secondary"}
              >
                {post.status === "available" ? "Tersedia" : "Sudah Diambil"}
              </Badge>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Title & Actions */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{post.foodName}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{post.postedTime}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onLike(post.id)}
                    className={isLiked ? "text-red-500 border-red-500" : ""}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Dibagikan oleh</p>
                      <p className="font-medium">{post.giverName}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Jumlah</p>
                      <p className="font-medium">{post.quantity}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Lokasi</p>
                      <p className="font-medium text-sm">{post.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">Deskripsi</h2>
                <p className="text-gray-700 leading-relaxed">{post.description}</p>
              </div>

              {/* Category */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">Kategori</h2>
                <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                  {post.category}
                </span>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="font-bold mb-2 text-blue-900">Tips Pengambilan Makanan</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Hubungi pemberi makanan terlebih dahulu sebelum datang</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Bawa wadah sendiri untuk menjaga kebersihan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Datang tepat waktu sesuai kesepakatan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Pastikan kondisi makanan masih layak sebelum dikonsumsi</span>
                  </li>
                </ul>
              </div>

              {/* Contact Button */}
              {post.status === "available" && (
                <Button
                  onClick={() => onContact(post)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Hubungi Pemberi Makanan
                </Button>
              )}

              {post.status === "claimed" && (
                <div className="text-center py-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-600 font-medium">Makanan ini sudah diambil</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Info */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-bold mb-2 text-green-900">Dampak Berbagi Makanan</h3>
            <p className="text-sm text-green-800">
              Dengan berbagi makanan ini, Anda membantu mengurangi food waste dan membantu sesama yang membutuhkan. 
              Setiap 1 kg makanan yang diselamatkan setara dengan mengurangi 2.5 kg emisi CO₂ yang merusak lingkungan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

