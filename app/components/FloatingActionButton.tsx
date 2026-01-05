"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { memo } from "react";

function FloatingActionButtonComponent() {
  return (
    <Link href="/posts/new" className="fixed bottom-6 right-6 z-50 hidden md:block cursor-pointer">
      <Button className="gap-2 rounded-full shadow-lg h-14 px-6 bg-green-600 hover:bg-green-700">
        <Plus className="size-5" />
        Bagikan Makanan
      </Button>
    </Link>
  );
}

export const FloatingActionButton = memo(FloatingActionButtonComponent);

