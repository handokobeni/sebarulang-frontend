import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { ChevronDown } from "lucide-react";

interface FilterTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function FilterTabs({ selectedCategory, onCategoryChange }: FilterTabsProps) {
  const categories = [
    "Semua",
    "Makanan Berat",
    "Makanan Ringan",
    "Buah & Sayur",
    "Roti & Kue",
    "Minuman",
  ];

  return (
    <div className="border-b bg-white">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-2 sm:py-3">
        {/* Mobile: Dropdown Select */}
        <div className="block sm:hidden">
          <label htmlFor="category-select" className="sr-only">
            Pilih Kategori
          </label>
          <div className="relative">
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full appearance-none bg-input-background border border-input rounded-md px-3 py-2 pr-9 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 sm:size-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Desktop: Tabs */}
        <div className="hidden sm:block">
          <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
            <TabsList className="w-full justify-start h-auto flex-wrap">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="rounded-full px-4 py-2 min-h-[44px] whitespace-nowrap"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

