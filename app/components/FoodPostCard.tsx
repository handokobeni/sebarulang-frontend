import { Heart, MapPin, Clock, MessageCircle, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export interface FoodPost {
  id: string;
  foodName: string;
  description: string;
  imageUrl: string;
  location: string;
  postedTime: string;
  status: "available" | "claimed";
  quantity: string;
  giverName: string;
  giverAvatar?: string;
  category: string;
}

interface FoodPostCardProps {
  post: FoodPost;
  onContact: (post: FoodPost) => void;
  onLike: (postId: string) => void;
  isLiked?: boolean;
  onViewDetail?: (post: FoodPost) => void;
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

export function FoodPostCard({ post, onContact, onLike, isLiked = false, onViewDetail }: FoodPostCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={post.imageUrl} 
          alt={post.foodName}
          className="w-full h-48 sm:h-64 object-cover"
        />
        <Badge 
          className="absolute top-2 sm:top-3 right-2 sm:right-3 text-xs"
          variant={post.status === "available" ? "default" : "secondary"}
        >
          {post.status === "available" ? "Tersedia" : "Sudah Diambil"}
        </Badge>
        <Badge 
          className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white text-black hover:bg-white/90 text-xs"
        >
          {post.category}
        </Badge>
      </div>
      
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex-1">
            <h3 className="font-semibold mb-1 text-base sm:text-lg">{post.foodName}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{post.description}</p>
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="size-3.5 sm:size-4 flex-shrink-0" />
            <span className="truncate">{post.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-3.5 sm:size-4 flex-shrink-0" />
            <span>{post.postedTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Utensils className="size-3.5 sm:size-4 flex-shrink-0" />
            <span>Porsi: {post.quantity}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-3 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="size-7 sm:size-8">
              <AvatarImage src={post.giverAvatar} />
              <AvatarFallback>
                <User className="size-3.5 sm:size-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-xs sm:text-sm font-medium">{post.giverName}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
              className={`${isLiked ? "text-red-500" : ""} hidden sm:flex min-h-[44px] min-w-[44px] cursor-pointer`}
              aria-label="Like post"
            >
              <Heart className={`size-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            {post.status === "available" && (
              <Button
                size="sm"
                onClick={() => onContact(post)}
                className="gap-1.5 flex-1 sm:flex-initial h-9 sm:min-h-[44px] text-xs sm:text-sm px-3 sm:px-4 cursor-pointer"
              >
                <MessageCircle className="size-3.5 sm:size-4" />
                <span>Hubungi</span>
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => onViewDetail?.(post)}
              className="gap-1.5 flex-1 sm:flex-initial h-9 sm:min-h-[44px] text-xs sm:text-sm px-3 sm:px-4 cursor-pointer"
            >
              Detail
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

