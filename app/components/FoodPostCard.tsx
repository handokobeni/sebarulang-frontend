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
        <img 
          src={post.imageUrl} 
          alt={post.foodName}
          className="w-full h-64 object-cover"
        />
        <Badge 
          className="absolute top-3 right-3"
          variant={post.status === "available" ? "default" : "secondary"}
        >
          {post.status === "available" ? "Tersedia" : "Sudah Diambil"}
        </Badge>
        <Badge 
          className="absolute top-3 left-3 bg-white text-black hover:bg-white/90"
        >
          {post.category}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{post.foodName}</h3>
            <p className="text-sm text-gray-600 mb-2">{post.description}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />
            <span>{post.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>{post.postedTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Utensils className="size-4" />
            <span>Porsi: {post.quantity}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={post.giverAvatar} />
              <AvatarFallback>
                <User className="size-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{post.giverName}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
              className={isLiked ? "text-red-500" : ""}
            >
              <Heart className={`size-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            {post.status === "available" && (
              <Button
                size="sm"
                onClick={() => onContact(post)}
                className="gap-2"
              >
                <MessageCircle className="size-4" />
                Hubungi
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => onViewDetail?.(post)}
              className="gap-2"
            >
              Detail
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

