"use client";

import { MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog-custom";
import { Button } from "./ui/button";
import { FoodPost } from "./FoodPostCard";

interface ContactDialogProps {
  post: FoodPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactDialog({ post, open, onOpenChange }: ContactDialogProps) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-full sm:max-w-md" 
        onClose={() => onOpenChange(false)}
      >
        <DialogHeader>
          <DialogTitle>Hubungi Giver</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Makanan:</p>
            <p className="font-semibold">{post.foodName}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Giver:</p>
            <p className="font-semibold">{post.giverName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Lokasi:</p>
            <p className="font-semibold">{post.location}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 Untuk menghubungi giver, kamu bisa mengirim pesan langsung melalui fitur chat 
              atau bertemu langsung di lokasi yang telah ditentukan. Pastikan untuk mengonfirmasi 
              ketersediaan makanan sebelum mengambilnya.
            </p>
          </div>

          <Button 
            className="w-full gap-2"
            onClick={() => {
              // In a real app, this would open a chat or show contact info
              alert(`Menghubungi ${post.giverName} untuk ${post.foodName}`);
              onOpenChange(false);
            }}
          >
            <MessageCircle className="size-4" />
            Kirim Pesan ke {post.giverName}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

